using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UtilityPot;
using MaintenanceContracts.Contracts.Common;

namespace CustomerUtility
{
    public class ContactUtility
    {
        public CityStateList GetCityStateList(int PostalCode)
        {
            Utility Util = new Utility();
            return Util.GetCityStateList(PostalCode);
        }
    }
}
