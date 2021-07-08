using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;
using Twitter.Repository.classes;
using Twitter.Repository.Interfaces;

namespace Twitter.Repository.Classes
{
    public class RetweetRepository : Repository<Retweet>, IRetweetRepository
    {
        private readonly ApplicationDbContext _context;

        public RetweetRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public void DeleteRetweet(int id)
        {
            Delete(id);
            Commit();
        }

        public List<Retweet> GetMyRetweets(int pageSize, int pageNumber, string userId)
        {
            return GetPageRecordsWhere(pageSize, pageNumber, u => u.QouteTweet.AuthorId == userId,
                "ReTweet,QouteTweet,QouteTweet.Images,QouteTweet.Author,QouteTweet.Video,ReTweet.Images,ReTweet.Video,ReTweet.Author").ToList();
        }

        public Retweet GetRetweet(int id)
        {
            return GetWhere(x => x.Id == id)
                .Include(x => x.QouteTweet).ThenInclude(x => x.Images)
                .Include(x => x.QouteTweet).ThenInclude(x => x.Video)
                .Include(x => x.QouteTweet).ThenInclude(x => x.Author)
                .Include(x => x.ReTweet).ThenInclude(x => x.Images)
                .Include(x => x.ReTweet).ThenInclude(x => x.Video)
                .Include(x => x.ReTweet).ThenInclude(x => x.Author)
                .FirstOrDefault();
        }

        public Retweet PostRetweet(Retweet retweet)
        {
            var res = Insert(retweet);
            if(res)
            {
                Commit();
                return retweet;
            }
            return null;
            
        }
    }
}
