namespace DatingApp.API.Models
{
    public class Like
    {
        public int LikerId { get; set; }
        public int LikeeId { get; set; }
        public virtual User Liker { get; set; }  // We have to add Virtual keyword to navigation Properties if we are implementing Lazy loading
        public virtual User Likee { get; set; }
    }
}