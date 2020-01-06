using System;
using Microsoft.AspNetCore.Http;

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

        public static int CalculateAge(this DateTime DateofBirth)
        {
            int Age = DateTime.Today.Year - DateofBirth.Year;
            if (DateofBirth.AddYears(Age) > DateTime.Today)
                Age--;
            return Age;
        }
    }
}