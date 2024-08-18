namespace Service.Draft;

public interface IDraftService
{
    Dto.DraftDetail GetById(long id);
    IEnumerable<Dto.Draft> List();
    Task<long> Create(Dto.DraftFormData data);
    Task Update(long id, Dto.DraftFormData data);
    Task Delete(long id);
}
