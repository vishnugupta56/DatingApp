using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PagedList(List<T> items, int Count, int PageNumber, int PageSize)
        {
            this.TotalCount = Count;
            this.CurrentPage = PageNumber;
            this.PageSize = PageSize;
            TotalPages = (int)Math.Ceiling(Count / (decimal)PageSize);
            this.AddRange(items);
        } 
        
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source,int Pagenumber,int Pagsize)
        {
            var totalcount= await source.CountAsync();
            var items=await source.Skip((Pagenumber-1)*Pagsize).Take(Pagsize).ToListAsync();
            return new PagedList<T>(items,totalcount,Pagenumber,Pagsize);
        }
    }
}