using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace UtilityPot.Logger
{
    public static class LoggerFactory
    {
        public static ILogger GetLogger(string LoggerType)
        {
            string LoggerClass;
            if (LoggerType == null)
            {
                LoggerClass = ConfigurationManager.AppSettings.Get("Logger");
            }
            else
            {
                LoggerClass = ConfigurationManager.AppSettings.Get(LoggerType);
            }
            return (ILogger)System.Reflection.Assembly.GetExecutingAssembly().CreateInstance(LoggerClass);
        }
    }
}
