using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Interfaces
{
    public interface IDating
    {
        void Add<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveAll();

        Task<User> GetUser(int Id);

        Task<PagedList<User>> GetAllUsers(UserParams param);

        Task<Photo> GetPhoto(int Id);

        Task<Photo> GetUserCurrentPhoto(int id);

        Task<Like> GetLikes(int userId, int ReceipientId);

        Task<Message> GetMessage(int messageId);

        Task<PagedList<Message>> GetMessageForUser(MessagesParam messagesParam);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}