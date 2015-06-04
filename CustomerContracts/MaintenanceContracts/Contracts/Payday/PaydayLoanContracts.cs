using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Payday
{
    public class PaydayLoanContracts
    {
        public CurrentLoanList DayLoanList { get; set; }
        public List<PaydayLoanContract> Contracts { get; set; }
        public string CurrentLoanContract { get; set; }
        public int CurrentLoanTranId { get; set; }
        public string Message { get; set; }
    }
}
