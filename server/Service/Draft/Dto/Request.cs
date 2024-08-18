using FluentValidation;

namespace Service.Draft.Dto;

public record DraftFormData(string Title, string Content, bool? Publish, string AuthorId);

public class DraftFormDataValidator : AbstractValidator<DraftFormData>
{
    public DraftFormDataValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Content).NotEmpty();
        RuleFor(x => x.AuthorId).NotEmpty();
    }
}
