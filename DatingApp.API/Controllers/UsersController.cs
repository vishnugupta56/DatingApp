using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTOS;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
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
        public async Task<IActionResult> GetUsers()
        {
            var Users = await _dating.GetAllUsers();
            var UsersToReturn = _mapper.Map<IEnumerable<UsersforListDto>>(Users);
            return Ok(UsersToReturn);
        }
        [HttpGet("{id}")]
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
            var UserFromRepo=await this._dating.GetUser(id);

            _mapper.Map(user,UserFromRepo);    
             if(await _dating.SaveAll())
                return NoContent();
           throw new Exception($"Update User {id} failed on save");     
        }
    }
}