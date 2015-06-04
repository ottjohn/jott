using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Contracts.Payday
{
    //public class PaydayLoanContractOld
    //{
    //    public int StateId { get; set; }
    //    public decimal Amount { get; set; }
    //    public decimal Fee { get; set; }
    //    public decimal Cash { get; set; }
    //    public decimal CashReceived { get; set; }
    //    public string CheckNumber { get; set; }
    //    public DateTime LoanDate { get; set; }
    //    public DateTime DueDate { get; set; }
    //    public int LoanTerm { get; set; }
    //    public string Pickup { get; set; }
    //    public string CustomerName { get; set; }
    //    public string FirstName { get; set; }
    //    public string LastName { get; set; }
    //    public string CustomerAddress { get; set; }
    //    public string CustomerCityState { get; set; }
    //    public string StoreAddress { get; set; }
    //    public string StoreCityState { get; set; }
    //    public string StoreName { get; set; }
    //    public string StorePhone { get; set; }
    //    public string Employer { get; set; }
    //    public string Employee { get; set; }
    //    public int OriginalTransaction { get; set; }
    //    public DateTime OriginalLoanDate { get; set; }
    //    public decimal OriginalLoanAmount { get; set; }
    //    public string OriginalCheckNumber { get; set; }
    //    public int Refinance { get; set; }
    //}

    public class PaydayLoanContract
    {
        public FieldTemplate<int> StateId { get; set; }
        public FieldTemplate<decimal> Amount { get; set; }
        public FieldTemplate<decimal> Fee { get; set; }
        public FieldTemplate<decimal> Cash { get; set; }
        public FieldTemplate<decimal> CashReceived { get; set; }
        public FieldTemplate<string> CheckNumber { get; set; }
        public FieldTemplate<DateTime> LoanDate { get; set; }
        public FieldTemplate<DateTime> DueDate { get; set; }
        public FieldTemplate<int> LoanTerm { get; set; }
        public FieldTemplate<string> Pickup { get; set; }
        public FieldTemplate<string> FirstName { get; set; }
        public FieldTemplate<string> LastName { get; set; }
        public FieldTemplate<string> CustomerAddress { get; set; }
        public FieldTemplate<string> CustomerCity { get; set; }
        public FieldTemplate<string> CustomerState { get; set; }
        public FieldTemplate<string> CustomerZip { get; set; }
        public FieldTemplate<string> StoreAddress { get; set; }
        public FieldTemplate<string> StoreCity { get; set; }
        public FieldTemplate<string> StoreState { get; set; }
        public FieldTemplate<string> StoreZip { get; set; }
        public FieldTemplate<string> StoreName { get; set; }
        public FieldTemplate<string> StorePhone { get; set; }
        public FieldTemplate<string> Employer { get; set; }
        public FieldTemplate<string> Employee { get; set; }
        public FieldTemplate<int> OriginalTransaction { get; set; }
        public FieldTemplate<DateTime> OriginalLoanDate { get; set; }
        public FieldTemplate<decimal> OriginalLoanAmount { get; set; }
        public FieldTemplate<string> OriginalCheckNumber { get; set; }
        public FieldTemplate<int> Refinance { get; set; }
        public FieldTemplate<int> TransactionId { get; set; }
    }
}
