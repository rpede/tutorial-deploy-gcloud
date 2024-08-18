namespace Service.Repositories;

public interface IRepository<T>
{
    IQueryable<T> Query();
    Task Add(T blog);
    Task Update(T blog);
    Task Delete(T blog);
}