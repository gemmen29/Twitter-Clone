using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;
using Twitter.Repository.classes;
using Twitter.Repository.Interfaces;

namespace Twitter.Repository.Classes
{
    public class SearchUserRepository : Repository<ApplicationUser>, ISearch<ApplicationUser>
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<ApplicationUser> _dbSet;
        public SearchUserRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
            _dbSet = _context.Set<ApplicationUser>();
        }

        public int CountEntityByKeyword(string keyword)
        {
            return _dbSet.Count(e => e.UserName.Contains(keyword));
        }

        public IEnumerable<ApplicationUser> GetPageByKeywords(SearchModel searchModel)
        {
            searchModel.PageSize = (searchModel.PageSize <= 0) ? 10 : searchModel.PageSize;
            searchModel.PageNumber = (searchModel.PageNumber < 1) ? 0 : searchModel.PageNumber - 1;

            return _dbSet.Where(e => e.UserName.Contains(searchModel.Keyword)).Skip(searchModel.PageNumber * searchModel.PageSize).Take(searchModel.PageSize).ToList();
        }
    }
}
