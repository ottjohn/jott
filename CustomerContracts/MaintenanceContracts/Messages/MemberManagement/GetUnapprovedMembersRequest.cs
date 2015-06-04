using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.MemberManagement
{
    [DataContract]
    public class GetUnapprovedMembersRequest
    {
        [DataMemberAttribute]
        public int CurrentPage { get; set; }
        [DataMemberAttribute]
        public int PageSize { get; set; }
        [DataMemberAttribute]
        public string SortField { get; set; }
        [DataMemberAttribute]
        public string SortDirection { get; set; }
    }
}
