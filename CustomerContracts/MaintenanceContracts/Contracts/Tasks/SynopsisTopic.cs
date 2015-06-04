using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class SynopsisTopic
    {
        public int CategoryId { get; set; }
        public string Category { get; set; }
        public string BackColor { get; set; }
        public string ForeColor { get; set; }
        public int CategoryCount { get; set; }
        public int CategorySelected { get; set; }
        public string CategoryItemsChosen { get; set; }
    }
}
