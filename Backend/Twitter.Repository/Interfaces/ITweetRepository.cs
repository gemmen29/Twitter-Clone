using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface ITweetRepository
    {

        public Tweet GetTweet(int id);
        public void DeleteTweet(int id);
        //public IEnumerable<Tweet> GetTweetReplies(int tweetId, int pageSize, int pageNumber);

        public IEnumerable<Tweet> GetTweets(int pageSize, int pageNumber);

        public int GetTweetsCount();

        public IEnumerable<Tweet> GetMyTweets(string id, int pageSize, int pageNumber);
        public IEnumerable<Tweet> GetMyRetweetsAndReplies(string id, int pageSize, int pageNumber);
        public int GetMyTweetsCount(string id);

        public IEnumerable<Tweet> GetHomePageTweets(string id, int pageSize, int pageNumber);

        public Task<Tweet> PostReplyToTweet(int id, Tweet tweet);

        public Task<Tweet> PostTweet(Tweet tweet);

        public bool TweetExists(int id);

        public bool isRetweet(int id);
        public bool isReply(int id);
    }
}
