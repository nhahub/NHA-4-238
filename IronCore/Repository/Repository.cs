
using Microsoft.EntityFrameworkCore;

namespace IronCore.Repository
{
    public class Repository<T,K> : IRepository<T,K> where T : class
    {
        protected readonly AcadamyContext _context;
        protected DbSet<T> _dbSet { get; set; }

        public Repository(AcadamyContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IQueryable<T> GetAll()
        {
            return _dbSet.AsQueryable();
        }
        public async Task<T?> GetByIdAsync(K id)
        {
            T? entity = await _dbSet.FindAsync(id);
            return entity; 
        }
        public async Task<bool> AddAsync(T entity)
        {
            if (entity == null) return false;

            await _dbSet.AddAsync(entity);
            return true;
        }
        public async Task<bool> UpdateAsync( T entity)
        {
            if (entity == null) return false;
            _dbSet.Update(entity);
            return true;
        }
        public async Task<bool> DeleteAsync(K id)
        {
            T? entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                return true;
            }
            return false;
        }
        public async Task<int> SaveAsync()
        {
            int rows =  await _context.SaveChangesAsync();
            return rows;
        }

    }
}
