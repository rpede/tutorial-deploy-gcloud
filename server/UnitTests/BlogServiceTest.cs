using NSubstitute;
using Service;
using Service.Blog;
using Service.Repositories;
using Dto = Service.Blog.Dto;
using Entities = DataAccess.Entities;

namespace UnitTests;

public class BlogServiceTests
{
    private IRepository<Entities.Post> postRepository = Substitute.For<
        IRepository<Entities.Post>
    >();
    private IRepository<Entities.User> userRepository = Substitute.For<
        IRepository<Entities.User>
    >();
    private IRepository<Entities.Comment> commentRepository = Substitute.For<
        IRepository<Entities.Comment>
    >();
    private BlogService sut;

    public BlogServiceTests()
    {
        sut = new BlogService(
            postRepository,
            userRepository,
            commentRepository,
            new Dto.CommentFormDataValidator()
        );
    }

    [Fact]
    public void GetById_returns_post_given_id()
    {
        // Arrange
        postRepository.Query().Returns(FakePosts().AsQueryable());
        userRepository.Query().Returns(FakeUsers().AsQueryable());
        commentRepository.Query().Returns(FakeComments().AsQueryable());

        // Act
        var post = sut.GetById(1);

        // Assert
        Assert.Equal(1, post.Id);
        Assert.Equal("1", post.Author.Id);
        Assert.Equal("Author", post.Author.UserName);
        Assert.Single(post.Comments);
    }

    [Fact]
    public void GetById_throws_NotFoundError_when_given_invalid_id()
    {
        // Arrange
        postRepository.Query().ReturnsForAnyArgs(Array.Empty<Entities.Post>().AsQueryable());

        // Act, Assert
        Assert.Throws<NotFoundError>(() => sut.GetById(1));
    }

    [Fact]
    public void GetById_throws_NotFoundError_when_given_post_is_unpublished()
    {
        // Arrange
        postRepository.Query().Returns(FakePosts().AsQueryable());
        userRepository.Query().Returns(FakeUsers().AsQueryable());
        commentRepository.Query().Returns(Array.Empty<Entities.Comment>().AsQueryable());

        // Act, Assert
        Assert.Throws<NotFoundError>(() => sut.GetById(2));
    }

    [Fact]
    public void Newest_returns_posts_ordered_by_published_at_descending()
    {
        // Arrange
        postRepository.Query().Returns(FakePosts().AsQueryable());
        userRepository.Query().Returns(FakeUsers().AsQueryable());

        // Act
        var result = sut.Newest(new Dto.PostsQuery { Page = 0 });

        // Assert
        Assert.Equal(2, result.Count());
        Assert.Equal("Newest", result.First().Content);
    }

    static Entities.Post[] FakePosts()
    {
        return new[]
        {
            new Entities.Post
            {
                Id = 1,
                Title = "Title1",
                Content = "Published",
                PublishedAt = DateTime.Parse("2024-08-01"),
                UpdatedAt = DateTime.Parse("2024-08-01"),
                AuthorId = "1"
            },
            new Entities.Post
            {
                Id = 2,
                Title = "Title2",
                Content = "Unpublished",
                PublishedAt = null,
                UpdatedAt = DateTime.Parse("2024-08-01"),
                AuthorId = "1"
            },
            new Entities.Post
            {
                Id = 3,
                Title = "Title3",
                Content = "Newest",
                PublishedAt = DateTime.Parse("2024-08-03"),
                UpdatedAt = DateTime.Parse("2024-08-03"),
                AuthorId = "1"
            },
        };
    }

    static Entities.User[] FakeUsers()
    {
        return new[]
        {
            new Entities.User
            {
                Id = "1",
                UserName = "Author",
                Email = "Email"
            },
            new Entities.User
            {
                Id = "2",
                UserName = "Commenter",
                Email = "Email"
            },
        };
    }

    static Entities.Comment[] FakeComments()
    {
        return new[]
        {
            new Entities.Comment
            {
                Id = 1,
                Content = "Comment",
                PostId = 1,
                AuthorId = "2",
            }
        };
    }
}
