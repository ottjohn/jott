using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Common
{
    public class EmailMessageItem
    {
        public string HtmlMessage { get; set; }
        public string HtmlMessageId { get; set; }
        public bool HtmlMessageProcessed { get; set; }
    }
}
