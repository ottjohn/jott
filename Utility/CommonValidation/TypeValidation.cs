using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace UtilityPot.CommonValidation
{
    public static class TypeValidation
    {
        public static void ValidateGUID(Guid TestGUID)
        {
            //Guid DummyVal;
            //Guid.TryParse(TestGUID, out DummyVal);
            ////if (TestGUID == null || Guid.TryParse(TestGUID, out DummyVal)) RetVal = false;
            //return DummyVal;
        }

        public static bool CheckDBInt(int? TestInt)
        {
            bool RetVal = true;
            if (TestInt == null || TestInt <= 0) RetVal = false;
            return RetVal;
        }

        public static string ValidateGUIDId(Guid GUIDValue, string GUIDType)
        {
            string RetVal = "";
            if (GUIDValue == Guid.Empty) RetVal = "Process requires a valid " + GUIDType + ".";
            return RetVal;
        }

        public static bool CheckRateValue(double? TestRate, double? LowerBound, double? UpperBound)
        {
            bool RetVal = true;
            if (TestRate == null)
                RetVal = false;
            else if (LowerBound != null && UpperBound != null && (TestRate > UpperBound || TestRate < LowerBound))
                RetVal = false;
            else if (LowerBound != null && TestRate < LowerBound)
                RetVal = false;
            else if (UpperBound != null && TestRate > UpperBound)
                RetVal = false;
            return RetVal;
        }
    }
}
