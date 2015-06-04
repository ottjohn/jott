using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class ExtendedMemberInfo
    {
        [DataMemberAttribute]
        public string UserName { get; set; }
        [DataMemberAttribute]
        public string FirstName { get; set; }
        [DataMemberAttribute]
        public string LastName { get; set; }
        //[DataMemberAttribute]
        //public string Street { get; set; }
        //[DataMemberAttribute]
        //public string City { get; set; }
        //[DataMemberAttribute]
        //public string StateCode { get; set; }
        //[DataMemberAttribute]
        //public string PostalCode { get; set; }
        //[DataMemberAttribute]
        //public string Phone { get; set; }
        [DataMemberAttribute]
        public string Email { get; set; }
        [DataMemberAttribute]
        public Guid UserId { get; set; }
        [DataMemberAttribute]
        public int Id { get; set; }
    }
}
