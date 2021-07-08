using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class UserLikes
    {
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }

        [JsonIgnore]
        public ApplicationUser ApplicationUser { get; set; }

        public int TweetId { get; set; }

        [JsonIgnore]
        public Tweet Tweet { get; set; }
    }
}
