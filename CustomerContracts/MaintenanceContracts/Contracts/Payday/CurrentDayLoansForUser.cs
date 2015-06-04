using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Payday
{
    public class CurrentDayLoansForUser
    {
        public string EmployeeName { get; set; }
        public string CustomerName { get; set; }
        public string Amount { get; set; }
        public string Time { get; set; }
        public int TransactionId { get; set; }
    }
}
