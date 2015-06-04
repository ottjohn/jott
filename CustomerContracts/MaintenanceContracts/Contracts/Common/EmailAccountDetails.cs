using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Common
{
    public class EmailAccountDetails
    {
        public string HostName { get; set; }
        public int Port { get; set; }
        public bool UseSsl { get; set; }
        public string EmailAddress { get; set; }
        public string EmailUserName { get; set; }
        public string EmailPassword { get; set; }
    }
}
