using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface ISearch<T> where T : class
    {
        public IEnumerable<ApplicationUser> GetPageByKeywords(SearchModel searchModel);
        public int CountEntityByKeyword(string keyword);
    }
}
