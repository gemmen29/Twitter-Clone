using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Repository.Interfaces;
using Twitter.Service.Interfaces;

namespace Twitter.Service.Classes
{
    public class ReplyService : BaseService, IReplyService
    {
        private readonly IUserLikesService _userLikesService;
        private readonly IUserBookmarksService _userBookmarksService;
        private readonly IUserFollowingService _userFollowingService;

        private IReplyRepository _replyRepository { get; }

        public ReplyService(
            IReplyRepository replyRepository,
            IUserLikesService userLikesService,
            IUserBookmarksService userBookmarksService,
            IUserFollowingService userFollowingService,
            IMapper mapper
            ) : base(mapper)
        {
            _replyRepository = replyRepository;
            _userLikesService = userLikesService;
            _userBookmarksService = userBookmarksService;
            _userFollowingService = userFollowingService;
        }

        public IEnumerable<TweetDetails> GetTweetReplies(string userId, int tweetId, int pageSize, int pageNumber)
        {
            //var tweets = _replyRepository.GetTweetReplies(tweetId, pageSize, pageNumber);
            var tweets = _replyRepository.GetTweetReplies(tweetId, pageSize, pageNumber);
            // trival solution
            var tweetsDetails = Mapper.Map<TweetDetails[]>(tweets).ToList();
            for (int i = 0; i < tweetsDetails.Count(); i++)
            {
                tweetsDetails[i].IsLiked = _userLikesService.LikeExists(userId, tweetsDetails[i].Id);
                tweetsDetails[i].IsBookmarked = _userBookmarksService.BookmarkExists(userId, tweetsDetails[i].Id);
                tweetsDetails[i].Author.IsFollowedByCurrentUser = (userId == tweetsDetails[i].Author.Id) || _userFollowingService.FollowingExists(userId, tweetsDetails[i].Author.Id);
            }
            return tweetsDetails;
        }
    }
}
