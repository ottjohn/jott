using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.OttJohn
{
    public class Article
    {
        public string Synopsis { get; set; }
        public string Title { get; set; }
        public int ArticleId { get; set; }
        public int ArticleNumber { get; set; }
        public DateTime DateStamp { get; set; }
        public string Message { get; set; }
        public int CurrentArticleIndex { get; set; }
        public List<ArticleChapter> Chapters { get; set; }
        public Comments ArticleComments { get; set; }
    }
}
