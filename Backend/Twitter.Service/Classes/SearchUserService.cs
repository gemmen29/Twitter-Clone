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
    public class SearchUserService : BaseService
    {
        private IRepository<ApplicationUser> _repository;
        private ISearch<ApplicationUser> _searchRepository;
        private readonly IUserFollowingService _userFollowingService;

        public SearchUserService(
            IRepository<ApplicationUser> repository,
            ISearch<ApplicationUser> searchRepository,
            IUserFollowingService userFollowingService,
            IMapper mapper) : base(mapper)
        {
            _repository = repository;
            _searchRepository = searchRepository;
            _userFollowingService = userFollowingService;
        }

        public int CountEntity()
        {
            return _repository.CountEntity();
        }
        public int CountEntityByKeyword(string keyword)
        {
            return _searchRepository.CountEntityByKeyword(keyword);
        }
        public IEnumerable<UserDetails> GetPageRecords(int pageSize, int pageNumber)
        {
            var users = _repository.GetPageRecords(pageSize, pageNumber).ToList();
            var userDetails = Mapper.Map<List<UserDetails>>(users);
            //for (int i = 0; i < userDetails.Count(); i++)
            //{
            //    userDetails[i].IsFollowedByCurrentUser = _userFollowingService.FollowingExists(userId, users[i].Id);
            //}
            return userDetails;
        }

        public IEnumerable<UserDetails> GetPageByKeywords(string userId, SearchModel searchModel)
        {
            // trival solution
            var users = _searchRepository.GetPageByKeywords(searchModel).ToList();
            var userDetails = Mapper.Map<List<UserDetails>>(users);
            for (int i = 0; i < userDetails.Count(); i++)
            {
                userDetails[i].IsFollowedByCurrentUser = _userFollowingService.FollowingExists(userId,users[i].Id);
            }
            return userDetails;
        }
    }
}
