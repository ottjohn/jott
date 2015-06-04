using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using TasksData;

namespace Tasks.Visitors
{
    public class VisitorProcess
    {
        public VisitorData RetrieveVisitorData()
        {
            MemberTaskManager MTM = new MemberTaskManager();
            return MTM.RetrieveVisitorData();
        }
    }
}
