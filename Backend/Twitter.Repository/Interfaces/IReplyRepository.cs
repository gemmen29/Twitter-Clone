using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface IReplyRepository
    {
        public IEnumerable<Tweet> GetTweetReplies(int tweetId, int pageSize, int pageNumber);
    }
}
