using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Twitter.Service.Interfaces
{
    public interface IMailService
    {
        void SendEmail(string toEmail, string subject, string content);
    }
}
