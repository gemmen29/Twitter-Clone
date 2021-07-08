using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;

namespace Twitter.Service.Interfaces
{
    public interface ITweetService
    {
        IEnumerable<TweetDetails> GetTweets(int pageSize, int pageNumber);
        public int GetTweetsCount();
        IEnumerable<TweetDetails> GetMyTweets(string id, string currentUserID, int pageSize, int pageNumber);
        public IEnumerable<TweetDetails> GetMyRetweetsAndReplies(string id, string currentUserID, int pageSize, int pageNumber);
        public int GetMyTweetsCount(string id);
        IEnumerable<TweetDetails> GetHomePageTweets(string id, int pageSize, int pageNumber);
        TweetDetails GetTweet(string userId, int tweetId);
        TweetDetails PostTweet(AddTweetModel tweet);
        TweetDetails PostReplyToTweet(int id, AddTweetModel tweet);
        //IEnumerable<TweetDetails> GetTweetReplies(int tweetId, int pageSize, int pageNumber);
        void DeleteTweet(int id);
        bool TweetExists(int id);
    }
}
