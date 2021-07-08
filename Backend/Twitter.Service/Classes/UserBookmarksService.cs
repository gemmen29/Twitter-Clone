using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;
using Twitter.Repository.Interfaces;
using Twitter.Service.Interfaces;

namespace Twitter.Service.Classes
{
    public class UserBookmarksService : BaseService, IUserBookmarksService
    {
        private readonly IUserBookmarksRepository _userBookmarksRepository;
        private readonly IUserLikesRepository _userLikesRepository;
        private readonly IUserFollowingRepository _userFollowingRepository;
        private ITweetRepository _tweetRepository { get; }

        public UserBookmarksService(
            IUserBookmarksRepository userBookmarksRepository,
            IUserLikesRepository userLikesRepository,
            IUserFollowingRepository userFollowingRepository,
            ITweetRepository tweetRepository,
            IMapper mapper) : base(mapper)
        {
            _userBookmarksRepository = userBookmarksRepository;
            _userLikesRepository = userLikesRepository;
            _userFollowingRepository = userFollowingRepository;
            _tweetRepository = tweetRepository;
        }

        public void BookMark(UserBookmarks userBookmarks)
        {
            _userBookmarksRepository.BookMark(userBookmarks);
        }

        public void RemoveBookMark(UserBookmarks userBookmarks)
        {
            _userBookmarksRepository.RemoveBookMark(userBookmarks);
        }

        public List<UserDetails> GetTweetBookmarks(int pageSize, int pageNumber, int tweetID, string currentUserId)
        {
            //return Mapper.Map<UserInteractionDetails[]>(_userBookmarksRepository.GetTweetBookmarks(pageSize, pageNumber, tweetID)).ToList();
            var users = _userBookmarksRepository.GetTweetBookmarks(pageSize, pageNumber, tweetID).ToList();
            var userDetails = Mapper.Map<List<UserDetails>>(users);
            for (int i = 0; i < userDetails.Count(); i++)
            {
                userDetails[i].IsFollowedByCurrentUser = (currentUserId == userDetails[i].Id) || _userFollowingRepository.FollowingExists(currentUserId, userDetails[i].Id);
            }
            return userDetails;
        }

        public IEnumerable<TweetDetails> GetUserBookmarkedTweets(int pageSize, int pageNumber, string userID, string currentUserID)
        {
            var tweets = _userBookmarksRepository.GetUserBookmarkedTweets(pageSize, pageNumber, userID);
            // trival solution
            var tweetsDetails = Mapper.Map<TweetDetails[]>(tweets);
            for (int i = 0; i < tweetsDetails.Count(); i++)
            {
                tweetsDetails[i].IsLiked = _userLikesRepository.LikeExists(currentUserID, tweetsDetails[i].Id);
                tweetsDetails[i].IsBookmarked = _userBookmarksRepository.BookmarkExists(currentUserID, tweetsDetails[i].Id);
                tweetsDetails[i].Author.IsFollowedByCurrentUser = (currentUserID == tweetsDetails[i].Author.Id) || _userFollowingRepository.FollowingExists(currentUserID, tweetsDetails[i].Author.Id);
                tweetsDetails[i].IsRetweet = _tweetRepository.isRetweet(tweetsDetails[i].Id);
                tweetsDetails[i].IsReply = _tweetRepository.isReply(tweetsDetails[i].Id);
                if (tweets.ElementAt(i).QouteTweet != null)
                {
                    var tweetId = tweets.ElementAt(i).QouteTweet.ReTweetId;
                    tweetsDetails[i].Tweet = Mapper.Map<TweetDetails>(_tweetRepository.GetTweet(tweetId));
                }
                if (tweets.ElementAt(i).RespondedTweet != null)
                {
                    var tweetId = tweets.ElementAt(i).RespondedTweet.TweetId;
                    tweetsDetails[i].Tweet = Mapper.Map<TweetDetails>(_tweetRepository.GetTweet(tweetId));
                }
            }
            return tweetsDetails;
        }

        public bool BookmarkExists(string userId, int tweetId)
        {
            return _userBookmarksRepository.BookmarkExists(userId, tweetId);
        }
    }
}
