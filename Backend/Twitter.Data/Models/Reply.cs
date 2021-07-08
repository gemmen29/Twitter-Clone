using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class Reply
    {
        public int TweetId { get; set; }

        [JsonIgnore, ForeignKey("ReplyId")]
        public Tweet Tweet { get; set; }

        public int ReplyId { get; set; }

        [JsonIgnore, ForeignKey("TweetId")]
        public Tweet ReplyTweet { get; set; }


    }
}
