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

    }
}