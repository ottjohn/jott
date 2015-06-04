using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class UserInformation
    {
        [DataMemberAttribute]
        public RegistrationInformation RegInfo { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> FirstName { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> LastName { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> Email { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> UserName { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> Password { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> Password1 { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> Question { get; set; }
        //[DataMemberAttribute]
        //public FieldTemplate<string> Answer { get; set; }
        [DataMemberAttribute]
        public int UserCreateSuccess { get; set; }
        [DataMemberAttribute]
        public string ErrorMessage { get; set; }
    }
}