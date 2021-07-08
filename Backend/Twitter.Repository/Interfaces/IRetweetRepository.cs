using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface IRetweetRepository
    {
        public List<Retweet> GetMyRetweets(int pageSize, int pageNumber, string userId);
        public Retweet GetRetweet(int id);
        public Retweet PostRetweet(Retweet retweet);
        public void DeleteRetweet(int id);


    }
}
