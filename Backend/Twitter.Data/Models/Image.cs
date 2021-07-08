using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Twitter.Data.Models
{
    public class Image
    {
        public int Id { get; set; }
        public int TweetId { get; set; }
        public string ImageName { get; set; }
        [JsonIgnore]
        public Tweet Tweet { get; set; }
    }
}
