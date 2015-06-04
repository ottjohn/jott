using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Threading.Tasks;
using UtilityPot.Mail;
using MaintenanceContracts.Contracts.Common;

namespace Tasks.Messages
{
    public class ExternalMessage
    {
        public string CheckForMessages()
        {
            EmailAccountDetails Details = GetAccountDetails();
            ReadMail RM = new ReadMail();
            string RetVal = RM.GetEmailMessageFromJohn(Details);
            if (RetVal == "")
            {
                if (HttpContext.Current.Application["Message"] == null)
                    HttpContext.Current.Application["Message"] = "No status available";

                RetVal = (string)HttpContext.Current.Application["Message"];
            }
            else
            {
                HttpContext.Current.Application["Message"] = RetVal;
            }
            return RetVal;
        }

        /// <summary>
        /// This needs to be moved into a config file
        /// </summary>
        /// <returns></returns>
        private EmailAccountDetails GetAccountDetails()
        {
            EmailAccountDetails Details = new EmailAccountDetails();
            Details.HostName = "pop.gmail.com";
            Details.Port = 995;
            Details.UseSsl = true;
            Details.EmailUserName = "messagefromjott@gmail.com";
            Details.EmailPassword = "1pitters@1";
            return Details;
        }
    }
}
