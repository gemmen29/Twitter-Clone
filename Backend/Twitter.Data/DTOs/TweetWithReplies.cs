using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Data.DTOs
{
    public class TweetWithReplies
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public List<Image> Images { get; set; }
        public Video Video { get; set; }
        public DateTime CreationDate { get; set; }
        public int LikeCount { get; set; }
        public int ReplyCount { get; set; }
        public int BookmarkCount { get; set; }
        public bool IsLiked { get; set; }
        public bool IsBookmarked { get; set; }
        public List<TweetDetails> Replies { get; set; }
        public UserDetails Author { get; set; }
    }
}
