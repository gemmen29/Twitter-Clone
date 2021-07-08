using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface IUserLikesRepository
    {
        #region Like
        public void Like(UserLikes userLikes);
        public void DisLike(UserLikes userLikes);
        public IEnumerable<ApplicationUser> GetTweetLikes(int pageSize, int pageNumber, int TweetID);
        public IEnumerable<Tweet> GetUserLikedTweets(int pageSize, int pageNumber, string userID);
        public bool LikeExists(string userId, int tweetId);
        #endregion
    }
}
