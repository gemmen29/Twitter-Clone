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
    public class UserLikesRepository : Repository<UserLikes>, IUserLikesRepository
    {
        private readonly ApplicationDbContext _context;

        public UserLikesRepository(ApplicationDbContext context) : base(context)
        {
            this._context = context;
        }
        public void DisLike(UserLikes userLikes)
        {
            Delete(userLikes);
            Commit();
        }

        public IEnumerable<ApplicationUser> GetTweetLikes(int pageSize, int pageNumber, int TweetID)
        {
            //return GetWhere(u => u.TweetId == TweetID).Select(u => u.ApplicationUser).ToList();
            return GetPageRecordsWhere(pageSize, pageNumber, u => u.TweetId == TweetID, "ApplicationUser").Select(u => u.ApplicationUser).ToList();
        }

        public IEnumerable<Tweet> GetUserLikedTweets(int pageSize, int pageNumber,  string userID)
        {
            //return GetWhere(u => u.UserId == userID).Include(u => u.Tweet.Author).Include(u => u.Tweet.Replies).Include(u => u.Tweet.RespondedTweet).Include(u => u.Tweet.QouteTweet).Select(u => u.Tweet).ToList();
            //return GetPageRecordsWhere(pageSize, pageNumber, u => u.UserId == userID, "Tweet.Author,Tweet.Images,Tweet.LikedTweets,Tweet.BookMarkedTweets,Tweet.Replies,Tweet.RespondedTweet,Tweet.QouteTweet").OrderByDescending(t => t.Tweet.CreationDate).Select(u => u.Tweet).ToList();
            return GetPageRecordsWhere(pageSize, pageNumber, u => u.UserId == userID, "Tweet.Author,Tweet.Images,Tweet.Video,Tweet.LikedTweets,Tweet.BookMarkedTweets,Tweet.Replies,Tweet.RespondedTweet,Tweet.QouteTweet", t => t.Tweet.CreationDate).Select(u => u.Tweet).ToList();
        }

        public void Like(UserLikes userLikes)
        {
            Insert(userLikes);
            Commit();
        }

        public bool LikeExists(string userId, int tweetId)
        {
           return GetFirstOrDefault(l => l.UserId == userId && l.TweetId == tweetId) != null ? true : false ;
        }
    }
}
