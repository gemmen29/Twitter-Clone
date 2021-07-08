using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Twitter.Data.DTOs
{
    public class AddRetweetDTO
    {
        public AddTweetModel QouteTweet { get; set; }
        public int ReTweetId { get; set; }
    }
}
