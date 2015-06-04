using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class ArticleSynopsisItem
    {
        public int ArticleId { get; set; }
        public int ArticleNumber { get; set; }
        public string Title { get; set; }
        public string Categories { get; set; }
        public string Synopsis { get; set; }
        public DateTime DateStamp { get; set; }
    }
}
