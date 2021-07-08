using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Twitter.Data.DTOs;

namespace Twitter.API.HubConfig
{
    public class TweetHub : Hub
    {
        public async Task BroadcastTweet(TweetDetails tweetDetails, string userName)
        {
            await Clients.All.SendAsync("BroadcastTweet", tweetDetails , userName);
        }
    }
}
