using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;

namespace Twitter.Service.Interfaces
{
    public interface IUserBookmarksService
    {
        public void BookMark(UserBookmarks userBookmarks);
        public void RemoveBookMark(UserBookmarks userBookmarks);
        public List<UserDetails> GetTweetBookmarks(int pageSize, int pageNumber, int tweetID, string currentUserId);
        public IEnumerable<TweetDetails> GetUserBookmarkedTweets(int pageSize, int pageNumber, string userID, string currentUserID);
        public bool BookmarkExists(string userId, int tweetId);
    }
}
