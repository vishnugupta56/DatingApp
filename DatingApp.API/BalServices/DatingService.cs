using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.BalServices
{
    public class DatingService : IDating
    {
        private readonly DataContext _context;
        public DatingService(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var Users = await _context.User.Include(p => p.Photos).ToListAsync();
            return Users;
        }

        public async Task<Photo> GetPhoto(int Id)
        {
            var photo = await _context.Photo.FirstOrDefaultAsync(q=>q.Id==Id);
            return photo;
        }

        public async Task<User> GetUser(int Id)
        {
            var User =await _context.User.Include(p=>p.Photos).FirstOrDefaultAsync(q=>q.Id==Id);
            return User;
        }

        public async Task<Photo> GetUserCurrentPhoto(int id)
        {
           return await _context.Photo.Where(u=>u.UserID==id).FirstOrDefaultAsync(i=>i.IsMain);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}