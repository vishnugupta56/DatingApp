namespace DatingApp.API.Helpers
{
    public class MessagesParam
    {
        public int MaxPageSize { get; set; } = 50;
        public int PageNumber { get; set; } = 1;

        private int PageSize = 10;
        public int pageSize
        {
            get { return PageSize; }
            set { PageSize = (value > MaxPageSize ? MaxPageSize : value); }
        }

        public int UserID { get; set; }

        public string MessageContainer { get; set; } ="Unread";
    }
}