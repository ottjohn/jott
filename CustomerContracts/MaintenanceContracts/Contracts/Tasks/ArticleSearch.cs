using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class ArticleSearch
    {
        public string SearchString { get; set; }
        public string CategoryString { get; set; }
        public SynopsisTopics Categories { get; set; }
        public string Message { get; set; }
    }
}
