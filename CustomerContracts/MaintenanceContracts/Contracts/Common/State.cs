using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Common
{
    public class State
    {
        public int StateId { get; set; }
        public string StateName { get; set; }
        public string StateCode { get; set; }
        public decimal StateTaxRate { get; set; }
    }

    public class StateList : BaseContract
    {
        public List<State> States { get; set; }
    }
}
