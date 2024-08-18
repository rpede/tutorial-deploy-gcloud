using System.Security.Claims;
using FluentValidation;
using Service.Repositories;
using Entities = DataAccess.Entities;

namespace Service.Blog;

public class BlogService(
    IRepository<DataAccess.Entities.Post> _postRepository,
    IRepository<Entities.User> _userRepository,
    IRepository<Entities.Comment> _commentRepository,
    IValidator<Dto.CommentFormData> _commentValidator
) : IBlogService
{
    public Dto.PostDetail GetById(long id)
    {
        var comments = _commentRepository
            .Query()
            .Join(
                _userRepository.Query(),
                comment => comment.AuthorId,
                user => user.Id,
                (comment, user) => new { comment, user }
            )
            .Where(x => x.comment.PostId == id);
        var post = _postRepository
            .Query()
            .Join(
                _userRepository.Query(),
                post => post.AuthorId,
                user => user.Id,
                (post, user) => new { post, user }
            )
            .GroupJoin(
                comments,
                x => x.post.Id,
                comment => comment.comment.PostId,
                (x, comments) =>
                    new
                    {
                        x.post,
                        x.user,
                        comments
                    }
            )
            .Where(post => post.post.Id == id && post.post.PublishedAt != null)
            .Select(post => new Dto.PostDetail(
                post.post.Id,
                post.post.Title,
                post.post.Content,
                new Dto.Author(post.user.Id, post.user.UserName!),
                post.comments.Select(comment => new Dto.CommentForPost(
                    comment.comment.Id,
                    comment.comment.Content,
                    comment.comment.CreatedAt,
                    new Dto.Author(comment.user.Id, comment.user.UserName!)
                )),
                (DateTime)post.post.PublishedAt!,
                post.post.UpdatedAt > post.post.PublishedAt ? post.post.UpdatedAt : null
            ))
            .FirstOrDefault();
        if (post == null)
        {
            throw new NotFoundError(nameof(Dto.PostDetail), new { Id = id });
        }
        return post;
    }

    public IEnumerable<Dto.Post> Newest(Dto.PostsQuery query)
    {
        const int pageSize = 10;
        return _postRepository
            .Query()
            .Where(post => post.PublishedAt != null)
            .OrderByDescending(post => post.PublishedAt)
            .Skip(query.Page * pageSize)
            .Take(pageSize)
            .Join(
                _userRepository.Query(),
                post => post.AuthorId,
                user => user.Id,
                (post, user) => new { post, user }
            )
            .Select(x => new Dto.Post(
                x.post.Id,
                x.post.Title,
                x.post.Content,
                new Dto.Author(x.user.Id, x.user!.UserName!),
                (DateTime)x.post.PublishedAt!,
                x.post.UpdatedAt > x.post.PublishedAt ? x.post.UpdatedAt : null
            ));
    }

    public async Task<long> CreateComment(long postId, Dto.CommentFormData data)
    {
        _commentValidator.ValidateAndThrow(data);
        var comment = new Entities.Comment
        {
            Content = data.Content,
            AuthorId = data.AuthorId,
            PostId = postId,
            CreatedAt = DateTime.UtcNow,
        };
        await _commentRepository.Add(comment);
        return comment.Id;
    }
}
