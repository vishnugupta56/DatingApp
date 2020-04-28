using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTOS;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDating _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDating repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var MessageFromRepo = await _repo.GetMessage(id);
            if (MessageFromRepo == null)
                return NotFound();
            return Ok(MessageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(int UserId, [FromQuery] MessagesParam messagesParam)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messagesParam.UserID = UserId;

            var messages = await _repo.GetMessageForUser(messagesParam);
            var MessagesToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messages);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok(MessagesToReturn);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetUserThread(int UserId, int recipientId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var MessagesFromRepo = await _repo.GetMessageThread(UserId, recipientId);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(MessagesFromRepo);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var Sender = await _repo.GetUser(userId);
            if (Sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageForCreationDto.SenderId = userId;
            var Recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
            if (Recipient == null)
                return BadRequest("Could not find the user");

            var message = _mapper.Map<Message>(messageForCreationDto);
            
            _repo.Add(message);
            if (await _repo.SaveAll())
            {
                var MessageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage", new { userId, id = message.Id }, MessageToReturn);
            }
            throw new Exception("Creating the message failed");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId) {
            if(userId!=int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
             var messages= await _repo.GetMessage(id);

            if(messages.SenderId==userId)
                messages.SenderDeleted=true;
            if(messages.RecipientId==userId)
                messages.RecipientDeleted=true;    
            if(messages.SenderDeleted && messages.RecipientDeleted)
                _repo.Delete(messages);
            if(await _repo.SaveAll())
                return NoContent();
            throw new Exception("Error deleting Message");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message=await  _repo.GetMessage(id);
            if(message.RecipientId != userId)
              return Unauthorized();
              message.IsRead=true;
              message.DateRead=DateTime.Now;
              await _repo.SaveAll();
              return NoContent();    
        }

    }
}