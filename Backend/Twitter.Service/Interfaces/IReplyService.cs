using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;

namespace Twitter.Service.Interfaces
{
    public interface IReplyService
    {
        IEnumerable<TweetDetails> GetTweetReplies(string userId, int tweetId, int pageSize, int pageNumber);
    }
}
