﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.Common
{
    [DataContract]
    public class GetStoreListRequest
    {
        [DataMemberAttribute]
        public int StateId { get; set; }
    }
}
