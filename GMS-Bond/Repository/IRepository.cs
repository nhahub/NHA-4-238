namespace GMS_Bond.Repository
{
    public interface IRepository<T , K>
    {
        IQueryable<T> GetAll();
        Task<T?> GetByIdAsync(K id);
        Task<bool> AddAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        Task<bool> DeleteAsync(K id);
        public Task<int> SaveAsync();
    }
}
