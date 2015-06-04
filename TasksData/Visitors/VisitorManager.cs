using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using UtilityPot.Logger;

namespace TasksData.Visitors
{
    public class VisitorManager
    {
        public VisitorData RetrieveVisitorData(ILogger Logger)
        {
            VisitorData Visitors = new VisitorData { Data = new List<VisitorDatum>() };
            Visitors.Message = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedData = Context.GetVisitCounts();
                    Visitors.Data.AddRange(ReturnedData.Select(x => new VisitorDatum
                    {
                        NumberOfHits = x.VisitCount.Value,
                        VisitorDate = x.ActivityDate
                    }));
                }
            }
            catch (Exception Ex)
            {
                Visitors.Message = "Failed to add comment";
                Logger.LogEvent("TasksData.Visitors.RetrieveVisitorData", Ex);
            }

            return Visitors;
        }
    }
}
