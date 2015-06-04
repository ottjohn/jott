using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomerUtility;

namespace Tasks.Validate
{
    public class TaskValidate
    {
        public string ValidateUser(Guid UserId, string Password)
        {
            CustomerProcess CP = new CustomerProcess();
            return CP.ValidateUser(UserId, Password);
        }
    }
}
