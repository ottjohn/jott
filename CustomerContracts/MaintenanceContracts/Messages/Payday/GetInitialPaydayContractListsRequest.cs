using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.Payday
{
    [DataContract]
    public class GetInitialPaydayContractListsRequest
    {
        [DataMemberAttribute]
        public Guid UserId { get; set; }
        [DataMemberAttribute]
        public int TransactionId { get; set; }
    }
}
