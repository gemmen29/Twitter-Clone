using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class Retweet
    {
        public int Id { get; set; }
        //public string UserId { get; set; }
        //[JsonIgnore]
        //public ApplicationUser User { get; set; }


        //that you write above the tweet that you shared
        public int QouteTweetId { get; set; }
        [JsonIgnore, ForeignKey("QouteTweetId")]
        public Tweet QouteTweet { get; set; }

        //the tweet that you shared
        public int ReTweetId { get; set; }
        [JsonIgnore, ForeignKey("ReTweetId")]
        public Tweet ReTweet { get; set; }
    }
}
