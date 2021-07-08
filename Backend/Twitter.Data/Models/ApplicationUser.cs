using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        public string UserPic { get; set; }

        [JsonIgnore , InverseProperty("FollowingUser")]
        public List<Following> Followers { get; set; }

        [JsonIgnore, InverseProperty("FollowerUser")]
        public List<Following> Following { get; set; }

        [JsonIgnore]
        public List<UserLikes> Likes { get; set; }

        [JsonIgnore]
        public List<UserBookmarks> BookMarks { get; set; }

        [JsonIgnore]
        public List<Tweet> Tweets { get; set; }
        //[JsonIgnore]
        //public List<Retweet> ReTweets { get; set; }
    }
}
