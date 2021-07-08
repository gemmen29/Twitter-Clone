using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.DTOs;
using Twitter.Data.Models;

namespace Twitter.Service.Interfaces
{
    public interface IRetweetService
    {
        public List<RetweetDetails> GetMyRetweets(int pageSize, int pageNumber, string userId);
        public RetweetDetails GetRetweet(int id);
        public AddRetweetDTO PostRetweet(AddRetweetDTO retweet, string userId);
        public void DeleteRetweet(int id);
    }
}
