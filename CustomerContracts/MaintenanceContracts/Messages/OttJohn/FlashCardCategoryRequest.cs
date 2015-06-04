using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.OttJohn
{
    [DataContract]
    public class FlashCardCategoryRequest
    {
        [DataMemberAttribute]
        public List<int> CatIdList { get; set; }
    }
}
