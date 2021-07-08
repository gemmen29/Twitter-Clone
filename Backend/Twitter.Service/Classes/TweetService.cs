using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;
using Twitter.Repository;
using Twitter.Repository.classes;
using Twitter.Repository.Interfaces;
using Twitter.Service.Interfaces;

namespace Twitter.Service.Classes
{
    public class TweetService : BaseService, ITweetService
    {
        private readonly IUserLikesService _userLikesService;
        private readonly IUserBookmarksService _userBookmarksService;
        private readonly IUserFollowingService _userFollowingService;

        private ITweetRepository _tweetRepository { get; }

        public TweetService(
            ITweetRepository tweetRepository,
            IUserLikesService userLikesService, 
            IUserBookmarksService userBookmarksService,
            IUserFollowingService userFollowingService,
            IMapper mapper
            ): base(mapper)
        {
            _tweetRepository = tweetRepository;
            _userLikesService = userLikesService;
            _userBookmarksService = userBookmarksService;
            _userFollowingService = userFollowingService;
        }
        public void DeleteTweet(int id)
        {
            _tweetRepository.DeleteTweet(id);
        }

        public TweetDetails GetTweet(string userId, int tweetId)
        {
            var tweet = _tweetRepository.GetTweet(tweetId);
            // trival solution
            var tweetDetails = Mapper.Map<TweetDetails>(tweet);
            tweetDetails.IsLiked = _userLikesService.LikeExists(userId, tweetId);
            tweetDetails.IsBookmarked = _userBookmarksService.BookmarkExists(userId, tweetId);
            tweetDetails.Author.IsFollowedByCurrentUser = (userId == tweetDetails.Author.Id) || _userFollowingService.FollowingExists(userId, tweetDetails.Author.Id);
            return tweetDetails;
        }

        //public IEnumerable<TweetDetails> GetTweetReplies(int tweetId, int pageSize, int pageNumbe)
        //{
        //    var tweets = _tweetRepository.GetTweetReplies(tweetId);
        //    return Mapper.Map<TweetDetails[]>(tweets);
        //}

        public IEnumerable<TweetDetails> GetTweets(int pageSize, int pageNumber)
        {
            var tweets= _tweetRepository.GetTweets(pageSize, pageNumber);
            return Mapper.Map<TweetDetails[]>(tweets);
        }

        public int GetTweetsCount()
        {
            return _tweetRepository.GetTweetsCount();
        }

        public IEnumerable<TweetDetails> GetMyTweets(string id, string currentUserID, int pageSize, int pageNumber)
        {
            var tweets = _tweetRepository.GetMyTweets(id, pageSize, pageNumber);
            var tweetsDetails = Mapper.Map<TweetDetails[]>(tweets);
            for (int i = 0; i < tweetsDetails.Count(); i++)
            {
                tweetsDetails[i].IsLiked = _userLikesService.LikeExists(currentUserID, tweetsDetails[i].Id);
                tweetsDetails[i].IsBookmarked = _userBookmarksService.BookmarkExists(currentUserID, tweetsDetails[i].Id);
                tweetsDetails[i].Author.IsFollowedByCurrentUser = (currentUserID == tweetsDetails[i].Author.Id) || _userFollowingService.FollowingExists(currentUserID, tweetsDetails[i].Author.Id);
            }
            return tweetsDetails;
        }

        public IEnumerable<TweetDetails> GetHomePageTweets(string userId, int pageSize, int pageNumber)
        {
            var tweets = _tweetRepository.GetHomePageTweets(userId, pageSize, pageNumber);
            // trival solution
            var tweetsDetails = Mapper.Map<TweetDetails[]>(tweets).ToList();
            for (int i = 0; i < tweetsDetails.Count(); i++)
            {
                tweetsDetails[i].IsLiked = _userLikesService.LikeExists(userId, tweetsDetails[i].Id);
                tweetsDetails[i].IsBookmarked = _userBookmarksService.BookmarkExists(userId, tweetsDetails[i].Id);
                tweetsDetails[i].Author.IsFollowedByCurrentUser = (userId == tweetsDetails[i].Author.Id) || _userFollowingService.FollowingExists(userId, tweetsDetails[i].Author.Id);
                tweetsDetails[i].IsRetweet = _tweetRepository.isRetweet(tweetsDetails[i].Id);
                if (tweets.ElementAt(i).QouteTweet != null)
                {
                    var tweetId = tweets.ElementAt(i).QouteTweet.ReTweetId;
                    tweetsDetails[i].Tweet = Mapper.Map<TweetDetails>(_tweetRepository.GetTweet(tweetId));
                }
            }
            return tweetsDetails;
        }

        public TweetDetails PostReplyToTweet(int id, AddTweetModel addTweetModel)
        {
            var tweetModel = Mapper.Map<Tweet>(addTweetModel);
            Tweet tweet = _tweetRepository.PostReplyToTweet(id, tweetModel).Result;
            return Mapper.Map<TweetDetails>(tweet);
        }

        public TweetDetails PostTweet(AddTweetModel addTweetModel)
        {
            var tweetModel = Mapper.Map<Tweet>(addTweetModel);
            Tweet tweet =  _tweetRepository.PostTweet(tweetModel).Result;
            return Mapper.Map<TweetDetails>(tweet);
        }

        public bool TweetExists(int id)
        {
            return _tweetRepository.TweetExists(id);
        }

        public int GetMyTweetsCount(string id)
        {
            return _tweetRepository.GetMyTweetsCount(id);
        }

        public IEnumerable<TweetDetails> GetMyRetweetsAndReplies(string id, string currentUserID, int pageSize, int pageNumber)
        {
            var tweets = _tweetRepository.GetMyRetweetsAndReplies(id, pageSize, pageNumber);
            var tweetsDetails = Mapper.Map<TweetDetails[]>(tweets);
            for (int i = 0; i < tweetsDetails.Count(); i++)
            {
                tweetsDetails[i].IsLiked = _userLikesService.LikeExists(currentUserID, tweetsDetails[i].Id);
                tweetsDetails[i].IsBookmarked = _userBookmarksService.BookmarkExists(currentUserID, tweetsDetails[i].Id);
                tweetsDetails[i].Author.IsFollowedByCurrentUser = (currentUserID == tweetsDetails[i].Author.Id) || _userFollowingService.FollowingExists(currentUserID, tweetsDetails[i].Author.Id);
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
    }
}
