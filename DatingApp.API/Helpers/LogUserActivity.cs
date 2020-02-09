using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public  async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext= await next();
            var userid= int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var repo= resultContext.HttpContext.RequestServices.GetService<IDating>();
            var user= await repo.GetUser(userid);
            user.LastActive= DateTime.Now;
            await repo.SaveAll();
        }
    }
}