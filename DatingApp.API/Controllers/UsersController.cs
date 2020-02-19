using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTOS;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Models;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDating _dating;
        private readonly IMapper _mapper;
        public UsersController(IDating dating, IMapper mapper)
        {
            _mapper = mapper;
            _dating = dating;

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {

            var userID = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userfromRepo = await _dating.GetUser(userID);
            userParams.UserID = userID;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userfromRepo.Gender == "male" ? "female" : "male";
            }
            var Users = await _dating.GetAllUsers(userParams);
            var UsersToReturn = _mapper.Map<IEnumerable<UsersforListDto>>(Users);
            Response.AddPaginationHeader(Users.CurrentPage, userParams.pageSize, Users.TotalCount, Users.TotalPages);
            return Ok(UsersToReturn);
        }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var User = await _dating.GetUser(id);
            var UserToReturn = _mapper.Map<UserForDetailsDto>(User);
            return Ok(UserToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdate user)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var UserFromRepo = await this._dating.GetUser(id);

            _mapper.Map(user, UserFromRepo);
            if (await _dating.SaveAll())
                return NoContent();
            throw new Exception($"Update User {id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var Like = await _dating.GetLikes(id, recipientId);

            if (await _dating.GetUser(recipientId) == null)
                return NotFound();

            if (Like != null)
                return BadRequest("You already like this user.");

             var like = new Like {
                 LikerId=id,
                 LikeeId=recipientId
             };
             _dating.Add<Like>(like);
             if(await _dating.SaveAll())
               return Ok();
         return BadRequest("Failed to like User");        
        }
    }
}