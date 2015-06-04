using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Common;
using UtilityPot.Address;
using UtilityPot.Mail;

namespace UtilityPot
{
    public class Utility: IUtility
    {
        public CityStateList GetCityStateList(int PostalCode)
        {
            AddressOperation AO = new AddressOperation();
            return AO.GetCityStateList(PostalCode);
        }

        public bool ComposeEmail(Email MessageComponents)
        {
            EmailProcess EP = new EmailProcess();
            return EP.ComposeEmail(MessageComponents);
        }
    }
}
