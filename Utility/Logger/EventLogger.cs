using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Threading;
using System.Xml;

namespace UtilityPot.Logger
{
    public class EventLogger : ILogger
    {
        private string Source;
        private string Log;

        public void LogEvent(string Caller, Exception Ex)
        {
            Source = "MaintenanceAppSource";
            Log = "MaintenanceAppLog";

            try
            {
                if (!EventLog.SourceExists(Source))
                    EventLog.CreateEventSource(Source, Log);

                string Message = Caller + ": " + Ex.Message;

                EventLog.WriteEntry(Source, Message);

            }
            catch (Exception ex)
            {
            }
        }

        public void LogEvent(string Caller, string Message, XmlDocument Component)
        {
            throw new Exception("Method not implemented");
        }

        public void LogEvent(string Message)
        {
            throw new Exception("Method not implemented");
        }
    }
}
