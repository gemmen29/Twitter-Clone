using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;

namespace Twitter.Service.Interfaces
{
    public interface IUserLikesService
    {
        public void Like(UserLikes userLikes);
        public void DisLike(UserLikes userLikes);
        public List<UserDetails> GetTweetLikes(int pageSize, int pageNumber, int tweetID, string currentUserId);
        public IEnumerable<TweetDetails> GetUserLikedTweets(int pageSize, int pageNumber, string userID, string currentUserID);
        public bool LikeExists(string userId, int tweetId);
    }
}
