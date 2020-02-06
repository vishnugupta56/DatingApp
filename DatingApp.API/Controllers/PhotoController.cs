using AutoMapper;
using CloudinaryDotNet;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using DatingApp.API.DTOS;
using System.Security.Claims;
using CloudinaryDotNet.Actions;
using DatingApp.API.Models;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/Users/{UserId}/photos")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IDating _dating;
        private readonly IMapper _autoMapper;
        private readonly IOptions<CloudinaryCred> _CloudinaryConfig;

        private readonly Cloudinary _cloudinary;
        public PhotoController(IDating dating, IMapper autoMapper, IOptions<CloudinaryCred> CloudinaryConfig)
        {
            _CloudinaryConfig = CloudinaryConfig;
            _autoMapper = autoMapper;
            _dating = dating;

            Account account = new Account(
                _CloudinaryConfig.Value.CloudName,
                _CloudinaryConfig.Value.ApiKey,
                _CloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoForReturn = await _dating.GetPhoto(id);
            var Photo = _autoMapper.Map<PhotoForReturnDto>(photoForReturn);
            return Ok(Photo);
        }
        [HttpPost]
        public async Task<IActionResult> AddPhotosforUser(int userId, [FromForm] PhotosForCreationDto PhotoCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var UserFromRepo = await _dating.GetUser(userId);
            var file = PhotoCreationDto.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length >= 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var UploadParam = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(UploadParam);
                }
                PhotoCreationDto.Url = uploadResult.Uri.ToString();
                PhotoCreationDto.PublicId = uploadResult.PublicId;
                var Photo = _autoMapper.Map<Photo>(PhotoCreationDto);
                if (!UserFromRepo.Photos.Any(q => q.IsMain))
                    Photo.IsMain = true;
                UserFromRepo.Photos.Add(Photo);
                if (await _dating.SaveAll())
                {
                    var photoToReturn = _autoMapper.Map<PhotoForReturnDto>(Photo);
                    return CreatedAtRoute("GetPhoto", new { UserId = userId, id = Photo.Id }, photoToReturn);
                }

            }
            return BadRequest("could not add the photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _dating.GetUser(userId);
            if (!user.Photos.Any(u => u.Id == id))
                return Unauthorized();
            var PhotoFromRepo = await _dating.GetPhoto(id);

            if (PhotoFromRepo.IsMain)
                return BadRequest("this is already main photo");

            var CurrentMainPhoto = await _dating.GetUserCurrentPhoto(userId);
            CurrentMainPhoto.IsMain = false;
            PhotoFromRepo.IsMain = true;
            if (await _dating.SaveAll())
                return NoContent();
            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _dating.GetUser(userId);
            if (!user.Photos.Any(u => u.Id == id))
                return Unauthorized();

            var PhotoFromRepo = await _dating.GetPhoto(id);

            if (PhotoFromRepo.IsMain)
                return BadRequest("you can not delete the main photo");

            if (PhotoFromRepo.PublicID != null)
            {
                var deletionparam = new DeletionParams(PhotoFromRepo.PublicID);
                var result = _cloudinary.Destroy(deletionparam);
                if (result.Result == "ok")
                {
                    _dating.Delete(PhotoFromRepo);
                }
            }
            if (PhotoFromRepo.PublicID == null)
            {
                _dating.Delete(PhotoFromRepo);
            }

            if (await _dating.SaveAll())
                return Ok();
            return BadRequest();
        }

    }

}