using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.StateTax;

namespace MaintenanceContracts.Messages.StateTax
{
    [DataContract]
    public class RetrieveTaxRulesResponse
    {
        [DataMemberAttribute]
        public TaxRuleList TaxRules { get; set; }
    }
}
