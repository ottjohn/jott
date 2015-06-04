using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.Common
{
    [DataContract]
    public class Email
    {
        [DataMemberAttribute]
        public string Subject { get; set; }

        [DataMemberAttribute]
        public string Title { get; set; }

        [DataMemberAttribute]
        public string Message { get; set; }

        [DataMemberAttribute]
        public int Type { get; set; }

        [DataMemberAttribute]
        public List<string> EmailTo { get; set; }

        [DataMemberAttribute]
        public string AttachmentPath { get; set; }

        [DataMemberAttribute]
        public string MessageFromDevice { get; set; }
    }
}