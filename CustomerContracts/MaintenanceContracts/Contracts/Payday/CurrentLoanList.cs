using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Payday
{
    public class CurrentLoanList
    {
        public List<CurrentDayLoansForUser> CurrentLoans { get; set; }
        public string Message { get; set; }
    }
}
