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
    public class ReplyRepository : Repository<Reply>, IReplyRepository
    {
        public ReplyRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<Tweet> GetTweetReplies(int tweetId, int pageSize, int pageNumber)
        {
            //var replies = _context.Reply.Where(r => r.TweetId == id).ToList();
            //List<Tweet> tweets = new List<Tweet>();

            //foreach (var reply in replies)
            //{
            //    var tweet = _context.Tweet.Where(t => t.Id == reply.ReplyId).Include(t => t.Author).Include(t => t.Images).Include(t => t.Video).FirstOrDefault();
            //    tweets.Add(tweet);
            //}
            //var replies = _context.Reply.Where(r => r.TweetId == id).Include(r => r.Tweet.Images).Include(r => r.Tweet.Video).Select(u => u.Tweet).ToList();

            //return replies;
            return GetPageRecordsWhere(pageSize, pageNumber,
            r => r.TweetId == tweetId,
            "Tweet,Tweet.Author,Tweet.Images,Tweet.Video,Tweet.LikedTweets,Tweet.BookMarkedTweets,Tweet.Replies,Tweet.RespondedTweet,Tweet.QouteTweet"
            , t => t.Tweet.CreationDate).Select(u => u.Tweet).ToList();
        }
    }
}
