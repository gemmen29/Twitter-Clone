using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Twitter.Data.DTOs;
using Twitter.Service.Interfaces;

namespace Twitter.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetweetController : ControllerBase
    {
        private readonly IRetweetService _retweetService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public RetweetController(IRetweetService retweetService, IHttpContextAccessor httpContextAccessor)
        {
            _retweetService = retweetService;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpPost]
        public IActionResult PostRetweet(AddRetweetDTO retweet)
        {
            var userID = _httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == "uid").Value;
            _retweetService.PostRetweet(retweet, userID);
            return NoContent();
        }


        [HttpDelete("{id:int}")]
        public IActionResult DeleteRetweet(int id)
        {
            _retweetService.DeleteRetweet(id);
            return NoContent();
        }

        [HttpGet]
        public ActionResult<List<RetweetDetails>> GetMyRetweets(int? pageSize, int? pageNumber)
        {
            var userID = _httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == "uid").Value;
            return _retweetService.GetMyRetweets(pageSize ?? 10, pageNumber ?? 1, userID).ToList();
        }

        [HttpGet("{id:int}")]
        public ActionResult<RetweetDetails> GetRetweet(int id)
        {
            return _retweetService.GetRetweet(id);
        }

    }
}
