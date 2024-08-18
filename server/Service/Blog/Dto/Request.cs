using FluentValidation;

namespace Service.Blog.Dto;

public record PostsQuery(int Page = 0);

public record CommentFormData(string Content, string AuthorId);

public class CommentFormDataValidator : AbstractValidator<CommentFormData>
{
    public CommentFormDataValidator()
    {
        RuleFor(x => x.Content).NotEmpty();
        RuleFor(x => x.AuthorId).NotEmpty();
    }
}
