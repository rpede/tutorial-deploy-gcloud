namespace Service.Blog;

public interface IBlogService
{
    Dto.PostDetail GetById(long id);
    IEnumerable<Dto.Post> Newest(Dto.PostsQuery query);
    Task<long> CreateComment(long postId, Dto.CommentFormData data);
}
