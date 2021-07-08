using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Twitter.Data.DTOs
{
    public class RetweetDetails
    {
        public TweetDetails QouteTweet { get; set; }
        public TweetDetails ReTweet { get; set; }

    }
}
