﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.Tasks
{
    [DataContract]
    public class GetEmployeeHandbookRequest
    {
        [DataMemberAttribute]
        public string Password { get; set; }
    }
}
