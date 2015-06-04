using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Common
{
    public class EmailMessageItems
    {
        public List<EmailMessageItem> Messages { get; set; }
        public string Message { get; set; }
    }
}
