
using backend.Data;
using backend.Hubs;
using backend.Models;
using backend.Services.JwtServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddSignalR();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:5500") // Add your frontend URLs
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

            builder.Services.AddDbContext<UserDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")+password));

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<UserDbContext>().AddDefaultTokenProviders();

            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(option=> {
                option.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
                option.Events = new JwtBearerEvents {

                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                        if (!string.IsNullOrEmpty(authHeader) &&
                            authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                        {
                            context.Token = authHeader["Bearer ".Length..].Trim();
                        }
                        else
                        {
                            context.Token = context.Request.Cookies["access_token"];

                            if (string.IsNullOrEmpty(context.Token))
                            {
                                context.Token = context.Request.Query["access_token"];
                            }
                        }

                        return Task.CompletedTask;
                    }
                };
            });


            builder.Services.AddAuthorization();

            builder.Services.AddScoped<JwtGenerator>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();

                // Automatically redirect to Scalar documentation
                app.MapGet("/", () => Results.Redirect("/scalar"));

                var scope = app.Services.CreateScope();

                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                if (!await roleManager.RoleExistsAsync(Roles.Admin)) {
                    await roleManager.CreateAsync(new IdentityRole(Roles.Admin));
                }
                if (!await roleManager.RoleExistsAsync(Roles.Teacher))
                {
                    await roleManager.CreateAsync(new IdentityRole(Roles.Teacher));
                }
                if (!await roleManager.RoleExistsAsync(Roles.Student))
                {
                    await roleManager.CreateAsync(new IdentityRole(Roles.Student));
                }
                if (!await roleManager.RoleExistsAsync(Roles.Parent))
                {
                    await roleManager.CreateAsync(new IdentityRole(Roles.Parent));
                }
            }
            app.UseCors("AllowFrontend");

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.MapHub<Chathub>("/api/chathub");

            app.Run();
        }
    }
}
