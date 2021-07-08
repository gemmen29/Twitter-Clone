using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class Following
    {
        [JsonIgnore , ForeignKey("FollowerId")]
        public ApplicationUser FollowerUser { get; set; }
        public string FollowerId { get; set; }

        [JsonIgnore, ForeignKey("FollowingId")]
        public ApplicationUser FollowingUser { get; set; }
        public string FollowingId { get; set; }
    }
}
