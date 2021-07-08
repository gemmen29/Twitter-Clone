using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface IUserBookmarksRepository
    {
        #region BookMark
        public void BookMark(UserBookmarks userBookmarks);
        public void RemoveBookMark(UserBookmarks userBookmarks);
        public IEnumerable<ApplicationUser> GetTweetBookmarks(int pageSize, int pageNumber, int TweetID);
        public IEnumerable<Tweet> GetUserBookmarkedTweets(int pageSize, int pageNumber, string userID);
        public bool BookmarkExists(string userId, int tweetId);
        #endregion
    }
}
