using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Repository.Interfaces
{
    public interface IUserFollowingRepository
    {
        #region Following
        public void Follow(Following following);
        public void UnFollow(Following following);
        public IEnumerable<ApplicationUser> GetFollowers(int pageSize, int pageNumber, string userId);
        public IEnumerable<ApplicationUser> GetFollowings(int pageSize, int pageNumber, string userId);
        public bool FollowingExists(string userId, string followingId);
        public IEnumerable<ApplicationUser> SuggestedFollowers(string userId);
        #endregion
    }
}
