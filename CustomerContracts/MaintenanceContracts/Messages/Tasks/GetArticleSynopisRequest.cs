using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.Tasks
{
    [DataContract]
    public class GetArticleSynopisRequest
    {
        [DataMemberAttribute]
        public int CurrentPage { get; set; }
        [DataMemberAttribute]
        public int PageSize { get; set; }
        [DataMemberAttribute]
        public int PageCount { get; set; }
        [DataMemberAttribute]
        public string SortField { get; set; }
        [DataMemberAttribute]
        public string SortDirection { get; set; }
        [DataMemberAttribute]
        public string CategoryFilter { get; set; }
        [DataMemberAttribute]
        public int ResetRecordCount { get; set; }
    }
}
