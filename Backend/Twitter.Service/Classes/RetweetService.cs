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
    public class RetweetService : BaseService, IRetweetService
    {
        private IRetweetRepository _iRetweetRepository { get; }
        public RetweetService(IMapper mapper, IRetweetRepository iRetweetRepository) : base(mapper)
        {
            _iRetweetRepository = iRetweetRepository;
        }

        public void DeleteRetweet(int id)
        {
            _iRetweetRepository.DeleteRetweet(id);
        }

        public List<RetweetDetails> GetMyRetweets(int pageSize, int pageNumber, string userId)
        {
            return Mapper.Map<List<RetweetDetails>>(_iRetweetRepository.GetMyRetweets(pageSize, pageNumber, userId));
        }

        public RetweetDetails GetRetweet(int id)
        {
            return Mapper.Map<RetweetDetails>(_iRetweetRepository.GetRetweet(id));
        }

        public AddRetweetDTO PostRetweet(AddRetweetDTO retweetDTO, string userId)
        {
            var retweetModel = Mapper.Map<Retweet>(retweetDTO);
            retweetModel.QouteTweet.AuthorId = userId;

            return Mapper.Map<AddRetweetDTO>(_iRetweetRepository.PostRetweet(retweetModel));
        }
    }
}
