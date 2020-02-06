using System;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.BalServices
{
    public class UserService : IUser
    {
        private readonly DataContext _context;
        public UserService(DataContext context)
        {
           _context = context;

        }
        public async Task<User> Login(string username, string Password)
        {
            var details= await _context.User.Include(p=> p.Photos).FirstOrDefaultAsync(x=>x.Username==username);
            if(details==null)
            return null;            
            if(!VerifyPasswordHash(Password,details.PasswordHash,details.PasswordSalt))
             return null;
            return details; 
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac=new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var ComputedHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i=0;i<ComputedHash.Length;i++)
                {
                    if(ComputedHash[i]!=passwordHash[i]) 
                    return false;
                }
                
            }
            return true;
        }

        public async Task<User> Register(User user, string Password)
        {
            byte[] PasswordHash, PasswordSalt;
            CreatePasswordHash(Password, out PasswordHash, out PasswordSalt);
            user.PasswordHash=PasswordHash;
            user.PasswordSalt=PasswordSalt;
            await _context.User.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;    
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.User.AnyAsync(x=>x.Username==username);
        }
    }
}