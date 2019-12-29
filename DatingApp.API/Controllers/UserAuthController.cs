using System.Threading.Tasks;
using DatingApp.API.DTOS;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]  //this class auto check model state and we didn't need to specify [FromBody]
    public class UserAuthController : ControllerBase
    {
        private readonly IUser _user;
        private readonly IConfiguration _config;
        public UserAuthController(IUser user, IConfiguration config)
        {
            _config = config;
            _user = user;

        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserToRegister userToRegister)
        {
            // if(!ModelState.IsValid)
            //     return BadRequest(ModelState);
            userToRegister.username = userToRegister.username.ToLower();
            if (await _user.UserExists(userToRegister.username))
                return BadRequest("User Already exists");
            var usertoReg = new User
            {
                Username = userToRegister.username
            };
            var RegisteredUser = _user.Register(usertoReg, userToRegister.password);
            return StatusCode(201,RegisteredUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(UserforLogin userforLogin)
        {
            var userDetail=await _user.Login(userforLogin.username,userforLogin.password);
            if(userDetail==null)
            return Unauthorized("Invalid username/password");
            var claims=new[]{
                new Claim(ClaimTypes.NameIdentifier,userDetail.Id.ToString()),
                new Claim(ClaimTypes.Name,userDetail.Username), 
                new Claim("Anonymns","hii")   
            };

            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:TokenSecret").Value));
            
            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor=new SecurityTokenDescriptor{
            Subject=new ClaimsIdentity(claims),
            Expires=DateTime.Now.AddDays(1),
            SigningCredentials=creds

            };

            var tokenHandler=new JwtSecurityTokenHandler();
            var token=tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new {
                token=tokenHandler.WriteToken(token)
            });   

        }
    }
}