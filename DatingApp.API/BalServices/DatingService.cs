using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
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

        public async Task<PagedList<User>> GetAllUsers(UserParams param)
        {
            var Users = _context.User.Include(p => p.Photos).OrderByDescending(q => q.LastActive).AsQueryable();
            Users = Users.Where(q => q.Id != param.UserID);
            Users = Users.Where(q => q.Gender == param.Gender);
            if (param.likee)
            {
                var UserIds = await GetLikedUserId(param.UserID, param.likee);
                Users = Users.Where(q => UserIds.Contains(q.Id));
            }
            if (param.liker)
            {
                var UserIds = await GetLikedUserId(param.UserID, param.likee);
                Users = Users.Where(q => UserIds.Contains(q.Id));
            }
            if (param.MinAge != 18 || param.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-param.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-param.MinAge);
                Users = Users.Where(q => q.DateOfBirth >= minDob && q.DateOfBirth <= maxDob);

            }
            if (!string.IsNullOrEmpty(param.OrderBy))
            {
                switch (param.OrderBy)
                {
                    case "created":
                        Users = Users.OrderByDescending(q => q.Created);
                        break;
                    default:
                        Users = Users.OrderByDescending(q => q.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(Users, param.PageNumber, param.pageSize);
        }

        public async Task<IEnumerable<int>> GetLikedUserId(int UserID, bool IsLikee)
        {
            var users = await _context.User.Include(p => p.Likers).Include(p => p.Likees).FirstOrDefaultAsync(u => u.Id == UserID);
            if (IsLikee)
            {
                // return all user who liked by logged in user
                return users.Likees.Where(u => u.LikerId == UserID).Select(q => q.LikeeId);
            }
            else
            {
                // return all user who liked Logged in user
                return users.Likers.Where(u => u.LikeeId == UserID).Select(q => q.LikerId);
            }
        }
        public async Task<Like> GetLikes(int userId, int ReceipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(q => q.LikerId == userId && q.LikeeId == ReceipientId);
        }

        public async Task<Photo> GetPhoto(int Id)
        {
            var photo = await _context.Photo.FirstOrDefaultAsync(q => q.Id == Id);
            return photo;
        }

        public async Task<User> GetUser(int Id)
        {
            var User = await _context.User.Include(p => p.Photos).FirstOrDefaultAsync(q => q.Id == Id);
            return User;
        }

        public async Task<Photo> GetUserCurrentPhoto(int id)
        {
            return await _context.Photo.Where(u => u.UserID == id).FirstOrDefaultAsync(i => i.IsMain);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}