using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Common
{
    public class Store
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }
    }

    public class StoreList : BaseContract
    {
        public List<Store> Stores { get; set; }
    }
}
