using System.Linq;
using AutoMapper;
using DatingApp.API.DTOS;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles: Profile
    {
     public AutoMapperProfiles()
     {
         CreateMap<User,UsersforListDto>()
         .ForMember(dest=> dest.PhotoUrl,src=> src.MapFrom(q=>q.Photos.FirstOrDefault(p=>p.IsMain).Url))
         .ForMember(dest=> dest.Age,src=>src.MapFrom(q=>q.DateOfBirth.CalculateAge()));
         CreateMap<User,UserForDetailsDto>()
         .ForMember(dest=> dest.PhotoUrl,src=> src.MapFrom(q=>q.Photos.FirstOrDefault(p=>p.IsMain).Url))
         .ForMember(dest=> dest.Age,src=>src.MapFrom(q=>q.DateOfBirth.CalculateAge()));;
         CreateMap<Photo,PhotosForDetailDto>();
         CreateMap<UserForUpdate,User>();
         CreateMap<Photo,PhotoForReturnDto>();
         CreateMap<PhotosForCreationDto,Photo>();
         CreateMap<UserToRegister,User>();
         CreateMap<MessageForCreationDto,Message>();
         CreateMap<Message,MessageForCreationDto>();
         CreateMap<Message,MessageToReturnDto>()
         .ForMember(m=>m.SenderPhotoUrl, opt => opt.MapFrom(q=>q.Sender.Photos.FirstOrDefault(p=>p.IsMain).Url))
         .ForMember(m=>m.RecipientPhotoUrl, opt => opt.MapFrom(q=>q.Recipient.Photos.FirstOrDefault(p=>p.IsMain).Url));
     }   
    }
}