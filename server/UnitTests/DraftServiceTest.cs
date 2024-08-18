using NSubstitute;
using Service;
using Service.Draft;
using Service.Repositories;
using Dto = Service.Draft.Dto;
using Entities = DataAccess.Entities;

namespace UnitTests;

public class DraftServiceTest
{
    private IRepository<Entities.Post> postRepository = Substitute.For<
        IRepository<Entities.Post>
    >();
    private IRepository<Entities.User> userRepository = Substitute.For<
        IRepository<Entities.User>
    >();
    private DraftService sut;

    public DraftServiceTest()
    {
        sut = new DraftService(postRepository, userRepository, new Dto.DraftFormDataValidator());
    }

    [Fact]
    public void GetById_returns_draft_given_valid_id()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var post = new Entities.Post
        {
            Id = postId,
            Title = "Title",
            Content = "Content",
            AuthorId = authorId
        };
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        postRepository.Query().Returns(new[] { post }.AsQueryable());
        userRepository.Query().Returns(new[] { user }.AsQueryable());

        // Act
        var draft = sut.GetById(postId);

        // Assert
        Assert.Equal(draft.Id, postId);
        Assert.Equal(draft.Title, post.Title);
        Assert.Equal(draft.Content, post.Content);
        Assert.Equal(draft.Author.Id, user.Id);
        Assert.Equal(draft.Author.UserName, user.UserName);
    }

    [Fact]
    public void GetById_throws_NotFoundError_when_given_invalid_id()
    {
        // Arrange
        var postId = 1;
        var user = new Entities.User { Id = "1", UserName = "Author" };
        postRepository.Query().Returns(Array.Empty<Entities.Post>().AsQueryable());

        // Act, Assert
        Assert.Throws<NotFoundError>(() => sut.GetById(postId));
    }

    [Fact]
    public void List_returns_drafts_of_unpublished_posts()
    {
        // Arrange
        var authorId = "1";
        var posts = new List<Entities.Post>
        {
            new Entities.Post
            {
                Id = 1,
                Title = "Title1",
                Content = "Content1",
                AuthorId = authorId,
                PublishedAt = null
            },
            new Entities.Post
            {
                Id = 2,
                Title = "Title2",
                Content = "Content2",
                AuthorId = authorId,
                PublishedAt = DateTime.UtcNow
            },
            new Entities.Post
            {
                Id = 3,
                Title = "Title3",
                Content = "Content3",
                AuthorId = authorId,
                PublishedAt = null
            }
        };
        var users = new List<Entities.User>
        {
            new Entities.User
            {
                Id = authorId,
                UserName = "Author",
                Role = Role.Admin
            }
        };
        postRepository.Query().Returns(posts.AsQueryable());
        userRepository.Query().Returns(users.AsQueryable());

        // Act
        var drafts = sut.List();

        // Assert
        Assert.Equal(2, drafts.Count());
        Assert.All(drafts, d => Assert.Equal(authorId, d.Author.Id));
        Assert.All(drafts, d => Assert.Equal("Author", d.Author.UserName));
    }

    [Fact]
    public async Task Create()
    {
        // Arrange
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        var data = new Dto.DraftFormData(
            Title: "Title",
            Content: "Content",
            Publish: false,
            AuthorId: authorId
        );
        postRepository.Add(Arg.Any<Entities.Post>()).Returns(Task.CompletedTask);

        // Act
        var postId = await sut.Create(data);

        // Assert
        await postRepository
            .Received()
            .Add(
                Arg.Is<Entities.Post>(p =>
                    p.Title == data.Title
                    && p.Content == data.Content
                    && p.AuthorId == authorId
                    && p.PublishedAt == null
                    && p.CreatedAt != default
                    && p.UpdatedAt != default
                )
            );
    }

    [Fact]
    public async Task Update()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        var data = new Dto.DraftFormData(
            Title: "Updated Title",
            Content: "Updated Content",
            Publish: true,
            AuthorId: authorId
        );
        var post = new Entities.Post
        {
            Id = postId,
            Title = "Title",
            Content = "Content",
            AuthorId = authorId,
            PublishedAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        postRepository.Query().Returns(new[] { post }.AsQueryable());
        postRepository.Update(Arg.Any<Entities.Post>()).Returns(Task.CompletedTask);

        // Act
        await sut.Update(postId, data);

        // Assert
        await postRepository
            .Received()
            .Update(
                Arg.Is<Entities.Post>(p =>
                    p.Id == postId
                    && p.Title == data.Title
                    && p.Content == data.Content
                    && p.AuthorId == authorId
                    && p.PublishedAt != null
                    && p.UpdatedAt != default
                )
            );
    }

    [Fact]
    public void Update_throws_NotFoundError_when_given_invalid_id()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        postRepository.Query().Returns(Array.Empty<Entities.Post>().AsQueryable());
        var data = new Dto.DraftFormData(
            Title: "Updated Title",
            Content: "Updated Content",
            Publish: true,
            AuthorId: authorId
        );

        // Act, Assert
        Assert.ThrowsAsync<NotFoundError>(async () => await sut.Update(postId, data));
    }

    [Fact]
    public void Update_throws_UnauthorizedError_when_given_different_author_id()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        var post = new Entities.Post
        {
            Id = postId,
            Title = "Title",
            Content = "Content",
            AuthorId = "2",
            PublishedAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        postRepository.Query().Returns(new[] { post }.AsQueryable());
        var data = new Dto.DraftFormData(
            Title: "Updated Title",
            Content: "Updated Content",
            Publish: true,
            AuthorId: authorId
        );

        // Act, Assert
        Assert.ThrowsAsync<ForbiddenError>(async () => await sut.Update(postId, data));
    }

    [Fact]
    public async Task Delete()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        var post = new Entities.Post
        {
            Id = postId,
            Title = "Title",
            Content = "Content",
            AuthorId = authorId,
            PublishedAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        postRepository.Query().Returns(new[] { post }.AsQueryable());
        postRepository.Delete(Arg.Any<Entities.Post>()).Returns(Task.CompletedTask);

        // Act
        await sut.Delete(postId);

        // Assert
        await postRepository
            .Received()
            .Delete(
                Arg.Is<Entities.Post>(p =>
                    p.Id == postId
                    && p.Title == post.Title
                    && p.Content == post.Content
                    && p.AuthorId == authorId
                    && p.PublishedAt == null
                    && p.CreatedAt == post.CreatedAt
                    && p.UpdatedAt == post.UpdatedAt
                )
            );
    }

    [Fact]
    public void Delete_throws_NotFoundError_when_given_invalid_id()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        postRepository.Query().Returns(Array.Empty<Entities.Post>().AsQueryable());

        // Act, Assert
        Assert.ThrowsAsync<NotFoundError>(async () => await sut.Delete(postId));
    }

    [Fact]
    public void Delete_throws_UnauthorizedError_when_given_different_author_id()
    {
        // Arrange
        var postId = 1;
        var authorId = "1";
        var user = new Entities.User { Id = authorId, UserName = "Author" };
        var post = new Entities.Post
        {
            Id = postId,
            Title = "Title",
            Content = "Content",
            AuthorId = "2",
            PublishedAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        postRepository.Query().Returns(new[] { post }.AsQueryable());

        // Act, Assert
        Assert.ThrowsAsync<ForbiddenError>(async () => await sut.Delete(postId));
    }
}
