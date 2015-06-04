﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.OttJohn;

namespace MaintenanceContracts.Messages.OttJohn
{
    [DataContract]
    public class AddCommentRequest
    {
        [DataMemberAttribute]
        public Comment UserComment { get; set; }
    }
}
