using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Common;

namespace UtilityPot
{
    interface IUtility
    {
        CityStateList GetCityStateList(int PostalCode);
        bool ComposeEmail(Email MessageComponents);
    }
}
