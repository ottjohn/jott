using System;
using System.Xml;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using log4net;

namespace UtilityPot.Logger
{
    public class Log4NetLogger : ILogger
    {
        private static readonly log4net.ILog log =
            log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public Log4NetLogger()
        {
            log4net.Config.XmlConfigurator.Configure();
        }

        public void LogEvent(string Caller, Exception Ex)
        {
            try
            {
                log.Error(Caller, Ex);
            }
            catch (Exception LogEx)
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
