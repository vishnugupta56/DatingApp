using System.Text;
using System.Net;
using DatingApp.API.BalServices;
using DatingApp.API.Data;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using DatingApp.API.Helpers;
using AutoMapper;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
namespace DatingApp.API

{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers().AddNewtonsoftJson(
                opt => {
                //This line will ignore the error that will occoure in Photos class we define user.
                opt.SerializerSettings.ReferenceLoopHandling=Newtonsoft.Json.ReferenceLoopHandling.Ignore; 
                            }
                            );
            services.AddCors();
            services.Configure<CloudinaryCred>(Configuration.GetSection("CloudinarySettings"));
            services.AddAutoMapper(typeof(DatingService).Assembly);
            services.AddScoped<IDating,DatingService>();
            services.AddScoped<IUser, UserService>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:TokenSecret").Value)),
                    ValidateAudience = false,
                    ValidateIssuer = false
                };

            });
            services.AddScoped<LogUserActivity>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder => {
                    builder.Run(async conte => {
                    conte.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    var error = conte.Features.Get<IExceptionHandlerFeature>();
                    if(error!=null)
                    {
                        conte.Response.AddApplicationError(error.Error.Message);
                       await conte.Response.WriteAsync(error.Error.Message);
                    }
                    });

                });
            }
            //   app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
