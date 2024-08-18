namespace Service.Blog.Dto;

public record Author(string Id, string UserName);

public record CommentForPost(long Id, string Content, DateTime CreatedAt, Author Author);

public record PostDetail(
    long Id,
    string Title,
    string Content,
    Author Author,
    IEnumerable<CommentForPost> Comments,
    DateTime PublishedAt,
    DateTime? EditedAt
);

public record Post(
    long Id,
    string Title,
    string Content,
    Author Author,
    DateTime PublishedAt,
    DateTime? EditedAt
);
