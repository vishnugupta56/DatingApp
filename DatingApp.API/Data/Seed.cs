using System;
using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.User.Any())
            {
                var UserData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var Users = JsonConvert.DeserializeObject<List<User>>(UserData);
                foreach (var user in Users)
                {
                    byte[] PasswordHash, PasswordSalt;
                    CreatePasswordHash("password", out PasswordHash, out PasswordSalt);
                    user.PasswordHash=PasswordHash;
                    user.PasswordSalt=PasswordSalt;
                    user.Username=user.Username.ToLower();  
                    context.User.Add(user);
                }
                context.SaveChanges();
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}