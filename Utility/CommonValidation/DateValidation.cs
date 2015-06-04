using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UtilityPot.CommonValidation
{
    public static class DateValidation
    {
        public static bool CheckStringDate(string TestDate)
        {
            bool TestDateIsDate = false;
            try
            {
                DateTime ConvertedDate = Convert.ToDateTime(TestDate);
                TestDateIsDate = true;
            }
            catch (Exception Ex) { }
            return TestDateIsDate;
        }

        public static bool DateCompareToGivenDate(DateTime TestDate, DateTime FixedDate, string Operation)
        {
            bool RetVal = false;
            if (FixedDate == null) FixedDate = DateTime.Now;
            switch (Operation)
            {
                case "=":
                    if (TestDate.Date == FixedDate.Date) RetVal = true;
                    break;
                case ">":
                    if (TestDate.Date > FixedDate.Date) RetVal = true;
                    break;
                case "<":
                    if (TestDate.Date < FixedDate.Date) RetVal = true;
                    break;
                case "<=":
                    if (TestDate.Date <= FixedDate.Date) RetVal = true;
                    break;
                case ">=":
                    if (TestDate.Date >= FixedDate.Date) RetVal = true;
                    break;

            }
            return RetVal;
        }

        public static bool StringDateCompareToGivenDate(string TestDate, DateTime FixedDate, string Operation)
        {
            bool RetVal = false;
            if (CheckStringDate(TestDate))
            {
                try
                {
                    DateTime ConvertedDate = Convert.ToDateTime(TestDate);
                    RetVal = DateCompareToGivenDate(ConvertedDate, FixedDate, Operation);
                }
                catch (Exception Ex) { }
            }

            return RetVal;
        }
    }
}
