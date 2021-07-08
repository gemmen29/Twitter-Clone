using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class Video
    {
        public int Id { get; set; }
        public int TweetId { get; set; }
        public string VideoName { get; set; }
        [JsonIgnore]
        public Tweet Tweet { get; set; }
    }
}
