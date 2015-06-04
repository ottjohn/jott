using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace UtilityPot.Logger
{
    public interface ILogger
    {
        void LogEvent(string Message);
        void LogEvent(string Caller, Exception Ex);
        void LogEvent(string Caller, string Message, XmlDocument Component);
    }
}
