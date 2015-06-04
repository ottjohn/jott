using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Payday;

namespace MaintenanceContracts.Messages.Payday
{
    public class GetInitialPaydayContractListsResponse
    {
        public PaydayLoanContracts PaydayContracts { get; set; }
    }
}
