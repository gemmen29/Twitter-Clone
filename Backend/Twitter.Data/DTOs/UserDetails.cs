using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Twitter.Data.DTOs
{
    public class UserDetails
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string UserPic { get; set; }
        public bool IsFollowedByCurrentUser { get; set; }
        public int FollowingCount { get; set; }
        public int FollowersCount { get; set; }
    }
}
