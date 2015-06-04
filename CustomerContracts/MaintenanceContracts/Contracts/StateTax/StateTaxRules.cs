using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Contracts.StateTax
{
    public class StateLocalTaxRule 
    {
        public FieldTemplate<string> TaxRuleCode { get; set; }
        public FieldTemplate<string> Local1Code { get; set; }
        public FieldTemplate<decimal?> Local1Rate { get; set; }
        public FieldTemplate<string> Local2Code { get; set; }
        public FieldTemplate<decimal?> Local2Rate { get; set; }
        public FieldTemplate<decimal?> StateRate { get; set; }
        public FieldTemplate<bool> AppliesTangibleProducts { get; set; }
        public FieldTemplate<bool> AppliesServiceOnSaleOfTangilbe { get; set; }
        public FieldTemplate<bool> AppliesServicesNotOnTangilbe { get; set; }
        public FieldTemplate<bool> AppliesBeforeDiscount { get; set; }
        public FieldTemplate<string> EffectiveDate { get; set; }
    }

    public class TaxRuleList : BaseContract
    {
        public List<StateLocalTaxRule> TaxRules { get; set; }
    }
}
