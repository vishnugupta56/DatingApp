namespace DatingApp.API.Helpers
{
    public class UserParams
    {
        public int MaxPageSize { get; set; }=50;
        public int PageNumber { get; set; }=1;

        private int PageSize=10;
        public int pageSize
        {
            get { return PageSize; }
            set { PageSize =(value>MaxPageSize?MaxPageSize:value); }
        }
        
        public int UserID { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; }=18;
        public int MaxAge { get; set; }=99;
        public string OrderBy { get; set; }
        public bool liker { get; set; } = false;
        public bool likee { get; set; } = false;

        

    }
}