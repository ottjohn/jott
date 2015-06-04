using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.OttJohn
{
    [DataContract]
    public class GetArticleResponse
    {
        [DataMemberAttribute]
        public Article Topic { get; set; }
    }
}
