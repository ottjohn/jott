using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.Tasks
{
    [DataContract]
    public class GetArticleSynopsisResponse
    {
        [DataMemberAttribute]
        public ArticleSynopsisCollection ArticleList { get; set; }
    }
}
