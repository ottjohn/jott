using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class FlashCardMeta
    {
        public int CategoryId { get; set; }
        public int CategoryCount { get; set; }
        public string CategoryBackColor { get; set; }
        public string CategoryForeColor { get; set; }
    }
}
