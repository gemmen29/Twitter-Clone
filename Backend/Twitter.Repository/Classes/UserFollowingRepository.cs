using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;
using Twitter.Repository.classes;
using Twitter.Repository.Interfaces;

namespace Twitter.Repository.Classes
{
    public class UserFollowingRepository : Repository<Following>, IUserFollowingRepository
    {
        private readonly ApplicationDbContext _context;

        public UserFollowingRepository(ApplicationDbContext context) : base(context)
        {
            this._context = context;
        }
        public void Follow(Following following)
        {
            Insert(following);
            Commit();
            //_context.Following.Add(following);
            //await _context.SaveChangesAsync(); 
        }

        public void UnFollow(Following following)
        {
            //_context.Following.Remove(following);
            //await _context.SaveChangesAsync();
            Delete(following);
            Commit();
        }

        public IEnumerable<ApplicationUser> GetFollowers(int pageSize, int pageNumber, string userId)
        {
            //return _context.Following.Where(u => u.FollowingId == userId).Select(u => u.FollowerUser).ToList();
            return GetPageRecordsWhere(pageSize, pageNumber, u => u.FollowingId == userId, "FollowerUser").Select(u => u.FollowerUser).ToList();
        }

        public bool FollowingExists(string userId, string followingId)
        {
            return GetFirstOrDefault(f => f.FollowerId == userId && f.FollowingId == followingId) != null ? true : false;
        }

        public IEnumerable<ApplicationUser> GetFollowings(int pageSize, int pageNumber, string userId)
        {
            //return _context.Following.Where(u => u.FollowerId == userId).Select(u => u.FollowingUser).ToList(); 
            return GetPageRecordsWhere(pageSize, pageNumber, u => u.FollowerId == userId, "FollowingUser").Select(u => u.FollowingUser).ToList();
        }

        public IEnumerable<ApplicationUser> SuggestedFollowers(string userId)
        {
            var usersThatIFollow = _context.Following.Where(f2 => f2.FollowerId == userId).Where(f2 => f2.FollowingId != userId).Select(f3 => f3.FollowingId).ToList();

            var result = _context.Following.Where(f => f.FollowerId != userId).Where(f => f.FollowingId != userId)
                .Where(f => usersThatIFollow.Contains(f.FollowerId))
                .Where(f => !usersThatIFollow.Contains(f.FollowingId)).AsEnumerable()
                .GroupBy(f => f.FollowingId).OrderByDescending(f => f.Count()).Take(3).ToList();

            List<ApplicationUser> suggestedFollowings = new List<ApplicationUser>();
            foreach(var group in result)
            {
                suggestedFollowings.Add(_context.Users.Find(group.Key));
            }

            if (suggestedFollowings.Count() < 3)
            {
                int numberOfExtraSuggestedFollowings = 3 - suggestedFollowings.Count();
                var result2 = _context.Following.Where(f => f.FollowerId != userId).Where(f => f.FollowingId != userId)
                    .Where(f => !suggestedFollowings.Contains(f.FollowingUser))
                    .Where(f => !usersThatIFollow.Contains(f.FollowingId)).AsEnumerable()
                .GroupBy(f => f.FollowingId).OrderByDescending(f => f.Count()).Take(numberOfExtraSuggestedFollowings).ToList();
                foreach (var group in result2)
                {
                    suggestedFollowings.Add(_context.Users.Find(group.Key));
                }
            }

            if (suggestedFollowings.Count() < 3)
            {
                int numberOfExtraSuggestedFollowings = 3 - suggestedFollowings.Count();
                var result3 = _context.Users.Where(u => u.Id != userId)
                    .Where(u => !usersThatIFollow.Contains(u.Id))
                    .Where(u => !suggestedFollowings.Contains(u))
                    .Take(numberOfExtraSuggestedFollowings).ToList();
                suggestedFollowings.AddRange(result3);
            }

            return suggestedFollowings;
        }
    }
}