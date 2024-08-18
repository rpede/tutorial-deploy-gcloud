using FluentValidation;
using Service.Repositories;
using Entities = DataAccess.Entities;

namespace Service.Draft;

public class DraftService(
    IRepository<Entities.Post> _postRepository,
    IRepository<Entities.User> _userRepository,
    IValidator<Dto.DraftFormData> _draftValidator
) : IDraftService
{
    public static string[] AllowedRoles => [Role.Admin, Role.Editor];

    public Dto.DraftDetail GetById(long id)
    {
        var post =
            _postRepository.Query().SingleOrDefault(x => x.Id == id)
            ?? throw new NotFoundError(nameof(Entities.User), new { Id = id });
        var user = _userRepository.Query().SingleOrDefault(x => x.Id == post.AuthorId)!;
        return new Dto.DraftDetail(
            Id: post.Id,
            Title: post.Title,
            Content: post.Content,
            Author: new Dto.Writer(user.Id, user.UserName!)
        );
    }

    public IEnumerable<Dto.Draft> List()
    {
        return _postRepository
            .Query()
            .Where(post => post.PublishedAt == null)
            .Join(
                _userRepository.Query(),
                post => post.AuthorId,
                user => user.Id,
                (post, user) => new { post, user }
            )
            .Select(x => new Dto.Draft(
                x.post.Id,
                x.post.Title,
                new Dto.Writer(x.user.Id, x.user!.UserName!)
            ));
    }

    public async Task<long> Create(Dto.DraftFormData data)
    {
        _draftValidator.ValidateAndThrow(data);
        var post = new Entities.Post
        {
            Title = data.Title,
            Content = data.Content,
            AuthorId = data.AuthorId,
            PublishedAt = data.Publish ?? false ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await _postRepository.Add(post);
        return post.Id;
    }

    public async Task Update(long id, Dto.DraftFormData data)
    {
        _draftValidator.ValidateAndThrow(data);
        var post =
            _postRepository.Query().SingleOrDefault(x => x.Id == id)
            ?? throw new NotFoundError(nameof(Entities.User), new { id });
        post.Title = data.Title;
        post.Content = data.Content;
        post.UpdatedAt = DateTime.UtcNow;
        if (data.Publish ?? false)
        {
            post.PublishedAt = DateTime.UtcNow;
        }
        await _postRepository.Update(post);
    }

    public async Task Delete(long id)
    {
        var post =
            _postRepository.Query().SingleOrDefault(x => x.Id == id)
            ?? throw new NotFoundError(nameof(Entities.Post), new { id });
        await _postRepository.Delete(post);
    }
}
