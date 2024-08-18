using DataAccess;
using DataAccess.Entities;
using Microsoft.Extensions.Logging;

namespace Service;

public class DbSeeder
{
    private readonly ILogger<DbSeeder> logger;
    private readonly AppDbContext context;

    public DbSeeder(ILogger<DbSeeder> logger, AppDbContext context)
    {
        this.logger = logger;
        this.context = context;
    }

    public async Task SeedAsync()
    {
        // context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        if (!context.Users.Any())
        {
            context.Users.Add(
                new User
                {
                    UserName = "admin@example.com",
                    Email = "admin@example.com",
                    Role = Role.Admin
                }
            );
            context.Users.Add(
                new User
                {
                    UserName = "editor@example.com",
                    Email = "editor@example.com",
                    Role = Role.Editor
                }
            );
            context.Users.Add(
                new User
                {
                    UserName = "reader@example.com",
                    Email = "reader@example.com",
                    Role = Role.Reader
                }
            );
            await context.SaveChangesAsync();
        }

        if (!context.Posts.Where(p => p.Title == "First post").Any())
        {
            var admin = context.Users.Single((user) => user.Email == "admin@example.com");
            context.Posts.Add(
                new Post
                {
                    Title = "First post",
                    Content =
                        @"## Hello Python
Have you ever wondered how to make a hello-world application in Python?

The answer is simply:
```py
print('Hello World!')
```
                    ",
                    AuthorId = admin!.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    PublishedAt = DateTime.UtcNow
                }
            );
        }
        if (!context.Posts.Where(p => p.Title == "Draft").Any())
        {
            var editor = context.Users.Single((user) => user.Email == "editor@example.com");
            context.Posts.Add(
                new Post
                {
                    Title = "Draft",
                    Content = "This is a draft post",
                    AuthorId = editor!.Id,
                    CreatedAt = DateTime.UtcNow,
                    PublishedAt = null
                }
            );
        }
        await context.SaveChangesAsync();

        if (!context.Comments.Any())
        {
            var reader = context.Users.Single((user) => user.Email == "reader@example.com");
            context.Comments.Add(
                new Comment
                {
                    Content = "First one to comment",
                    AuthorId = reader.Id,
                    PostId = context.Posts.First().Id
                }
            );
            await context.SaveChangesAsync();
        }
    }

    void CreateUser(string username, string password, string role)
    {
        var user = new User
        {
            UserName = username,
            Email = username,
            EmailConfirmed = true,
            Role = role
        };
        context.Users.Add(user);
    }
}
