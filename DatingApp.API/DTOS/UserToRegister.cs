using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOS
{
    public class UserToRegister
    {
        [Required(ErrorMessage="Please Enter Username")]
        public string username { get; set; }
        
        [Required(ErrorMessage="Please Enter Password")]
        [StringLength(8,MinimumLength=4,ErrorMessage="Password must be between 4 to 8 charcter long")]
        public string password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public DateTime Created { get; set; }
        [Required]
        public DateTime LastActive { get; set; }

        public UserToRegister()
        {
            this.Created=DateTime.Now;
            this.LastActive=DateTime.Now;
        }

    }
}