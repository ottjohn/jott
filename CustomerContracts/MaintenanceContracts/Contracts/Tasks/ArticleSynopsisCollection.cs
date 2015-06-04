using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class ArticleSynopsisCollection
    {
        public List<ArticleSynopsisItem> SynopsisList { get; set; }
        public ArticleSearch SearchObject { get; set; }
        public int RecordCount { get; set; }
        public int PageCount { get; set; }
        public string Message { get; set; }
    }
}
