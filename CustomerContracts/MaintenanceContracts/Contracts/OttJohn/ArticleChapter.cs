using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.OttJohn
{
    public class ArticleChapter
    {
        public int ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public string ChapterURL { get; set; }
        public DateTime DateStamp { get; set; }
        public int ArticleNumber { get; set; }
    }
}
