using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Common
{
    public class FieldTemplate<T>
    {
        public T Value { get; set; }
        public string MapToKey { get; set; }
        public bool Required { get; set; }
    }
}
