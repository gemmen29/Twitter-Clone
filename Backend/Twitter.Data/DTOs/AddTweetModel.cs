using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Twitter.Data.Models;

namespace Twitter.Data.DTOs
{
    public class AddTweetModel
    {
        public string Body { get; set; }
        public List<AddImageModel> Images { get; set; }
        public AddVideoModel Video { get; set; }
        public DateTime CreationDate { get; set; }
        [JsonIgnore]
        public string AuthorId { get; set; }
    }
}
