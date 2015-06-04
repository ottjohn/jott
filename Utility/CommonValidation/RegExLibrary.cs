using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace UtilityPot.CommonValidation
{
    public static class StringExpressionDictionary
    {

        private static Dictionary<string, string> _ValidationRules;
        private static Dictionary<string, string> _ValidationMessages;

        public static string ValidateStringExpression(string TestString, string TestKey)
        {
            string RetVal = "";
            Regex RE = new Regex(StringExpressionDictionary.ValidationRules[TestKey]);
            if (TestKey != "Password") TestString = TestString.ToLower();
            Match match = RE.Match(TestString);
            if (!RE.IsMatch(TestString)) RetVal = StringExpressionDictionary.ValidationMessages[TestKey];
            return RetVal;
        }

        static StringExpressionDictionary()
        {
            _ValidationRules = new Dictionary<string, string>();
            _ValidationRules.Add("Phone", "^([2-9]{1}[0-9]{2})?[0-9]{7}$");
            _ValidationRules.Add("FirstName", "^([a-z]{2,})$|^([a-z]+([ |-]{1}[a-z]+)+)$");
            _ValidationRules.Add("LastName", "^([a-z]+)$|^([a-z]+([ |-]{1}[a-z]+)?)$");
            _ValidationRules.Add("Addy1", "^([\\w]{3,})(( ){1}([\\w]{1,}))?$");
            _ValidationRules.Add("City", "^([a-z]{1,}( ){1})?([a-z]{3,})+(( ){1}[a-z]{1,})?$");
            _ValidationRules.Add("State", "^([a-z]{1,}( ){1})?([a-z]{2,})+(( ){1}[a-z]{1,})?$");
            _ValidationRules.Add("StateCode", "^[a-z]{2}$");
            _ValidationRules.Add("Zip", "^[0-9]{5}$");
            _ValidationRules.Add("Email", "^[\\w]+([\\.]{1}[\\w]+)*[@]{1}[\\w]+([\\.]{1}[\\w]+)*[\\.]{1}[a-z]{2,3}$");
            _ValidationRules.Add("UserName", "^(?=.{6,30}$)(?=.*?[\\d])?(?=.*?[@!#$%])?.*");
            _ValidationRules.Add("Password", "^(?=.{4,15}$)(?=.*?[\\d])(?=.*?[@!#$%]).*");
            //_ValidationRules.Add("Password", "^[\\w]{4,}$");
            _ValidationRules.Add("SecurityQuestion", "^([\\w]{1,}( )?)+$");
            _ValidationRules.Add("SecurityAnswer", "^([\\w]{1,}( )?)+$");
            _ValidationRules.Add("LocalTaxRateCode", "^[\\w]{2,6}$");
            _ValidationRules.Add("DateDash422", "^[\\d]{4}-[\\d]{1,2}-[\\d]{1,2}$");
            _ValidationRules.Add("NewGroupName", "^[\\w]{4,50}$");
            _ValidationRules.Add("PaydayCheckNumber", "^[\\w]{1,15}$");
            _ValidationRules.Add("NonEmpty", "^[\\w]{1,30}$");

            _ValidationMessages = new Dictionary<string, string>();
            _ValidationMessages.Add("Phone", "Phone number must be ten digits long.");
            _ValidationMessages.Add("FirstName", "First name must be alphanumeric and at least two characters in length.");
            _ValidationMessages.Add("LastName", "Last name must be alphanumeric and at least two characters in length.");
            _ValidationMessages.Add("Addy1", "Address line one must be at least three characters in length.");
            _ValidationMessages.Add("City", "City must be at least two characters in length.");
            _ValidationMessages.Add("State", "State must be at least two characters in length.");
            _ValidationMessages.Add("StateCode", "State must be exactly two characters in length.");
            _ValidationMessages.Add("Zip", "Zip should be a string of five numerical digits.");
            _ValidationMessages.Add("Email", "Email addresses must be expressed in the format somone@somedomain.com.");
            _ValidationMessages.Add("UserName", "User Name must be at least six characters long.");
            _ValidationMessages.Add("Password", "Password must be at least 8 characters, have at least on upper case letter, one number, and one of the symbols @, !, #, $, %.");
            _ValidationMessages.Add("SecurityQuestion", "Security Question must be at least two characters in length.");
            _ValidationMessages.Add("SecurityAnswer", "Security Answer must be at least two characters in length.");
            _ValidationMessages.Add("LocalTaxRateCode", "Tax codes must be between two and six characters.");
            _ValidationMessages.Add("DateDash422", "Date must be in YYYY-MM-DD format.");
            _ValidationMessages.Add("NewGroupName", "Group names must be between 4 and 50 characters in length.");
            _ValidationMessages.Add("InvalidDate", "Please check your date. It appears to be invalid.");
            _ValidationMessages.Add("PaydayCheckNumber", "The check number associated with the payday loan is not valid.");
            _ValidationMessages.Add("NonEmpty", "This field requires a value.");
        }

        public static Dictionary<string, string> ValidationRules
        {
            get
            {
                return _ValidationRules;
            }
        }

        public static Dictionary<string, string> ValidationMessages
        {
            get
            {
                return _ValidationMessages;
            }
        }
    }
}
