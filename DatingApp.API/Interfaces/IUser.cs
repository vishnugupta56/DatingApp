using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Interfaces
{
    public interface IUser
    {
         Task<User> Register(User user,string Password);

         Task<User> Login(string username,string Password);

         Task<bool> UserExists(string username);
    }
}