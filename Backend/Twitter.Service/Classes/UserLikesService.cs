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
    public class UserLikesService : BaseService, IUserLikesService
    {
        private readonly IUserLikesRepository _userLikesRepository;
        private readonly IUserBookmarksRepository _userBookmarksRepository;
        private readonly IUserFollowingRepository _userFollowingRepository;
        private ITweetRepository _tweetRepository { get; }

        public UserLikesService(
            IUserLikesRepository userLikesRepository,
            IUserBookmarksRepository userBookmarksRepository, 
            IUserFollowingRepository userFollowingRepository,
            ITweetRepository tweetRepository,
            IMapper mapper) : base(mapper)
        {
            _userLikesRepository = userLikesRepository;
            _userBookmarksRepository = userBookmarksRepository;
            _userFollowingRepository = userFollowingRepository;
            _tweetRepository = tweetRepository;
        }

        public void Like(UserLikes userLikes)
        {
            _userLikesRepository.Like(userLikes);
        }

        public void DisLike(UserLikes userLikes)
        {
            _userLikesRepository.DisLike(userLikes);
        }

        public List<UserDetails> GetTweetLikes(int pageSize, int pageNumber, int tweetID, string currentUserId)
        {
            var users = _userLikesRepository.GetTweetLikes(pageSize, pageNumber, tweetID).ToList();
            var userDetails = Mapper.Map<List<UserDetails>>(users);
            for (int i = 0; i < userDetails.Count(); i++)
            {
                userDetails[i].IsFollowedByCurrentUser = (currentUserId == userDetails[i].Id) || _userFollowingRepository.FollowingExists(currentUserId, userDetails[i].Id);
            }
            return userDetails;
            //return Mapper.Map<UserInteractionDetails[]>(_userLikesRepository.GetTweetLikes(pageSize, pageNumber, tweetID)).ToList();
        }

        public IEnumerable<TweetDetails> GetUserLikedTweets(int pageSize, int pageNumber, string userID, string currentUserID)
        {
            var tweets = _userLikesRepository.GetUserLikedTweets(pageSize, pageNumber, userID);
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

        public bool LikeExists(string userId, int tweetId)
        {
            return _userLikesRepository.LikeExists(userId, tweetId);
        }
    }
}
