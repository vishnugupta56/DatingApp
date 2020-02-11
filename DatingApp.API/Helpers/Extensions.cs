using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string ErrorMessage)
        {
            response.Headers.Add("Application-Error", ErrorMessage);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPaginationHeader(this HttpResponse response, int currentpage, int itemperpage, int totalitem, int totalpages)
        {
            var paginationHeader=new PaginationHeader(currentpage, itemperpage,totalitem,totalpages);
            var camelCaseFormatter= new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver= new CamelCasePropertyNamesContractResolver();
             response.Headers.Add("Pagination",JsonConvert.SerializeObject(paginationHeader,camelCaseFormatter));
             response.Headers.Add("Access-Control-Expose-Headers","Pagination");
        }
        public static int CalculateAge(this DateTime DateofBirth)
        {
            int Age = DateTime.Today.Year - DateofBirth.Year;
            if (DateofBirth.AddYears(Age) > DateTime.Today)
                Age--;
            return Age;
        }
    }
}