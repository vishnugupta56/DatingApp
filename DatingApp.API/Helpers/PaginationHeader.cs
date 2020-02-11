namespace DatingApp.API.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public PaginationHeader(int currentPage,int ItemsPerPage,int TotalItems,int TotalPages)
        {
            this.CurrentPage=currentPage;
            this.ItemPerPage=ItemsPerPage;
            this.TotalItems=TotalItems;
            this.TotalPages=TotalPages;
        }
    }
}