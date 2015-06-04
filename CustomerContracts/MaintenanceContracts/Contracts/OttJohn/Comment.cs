using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.OttJohn
{
    public class Comment
    {
        public string UserComment { get; set; }
        public Guid UserId { get; set; }
        public int ArticleNumber { get; set; }
        public string UserName { get; set; }
        public DateTime DateStamp { get; set; }
    }
}
