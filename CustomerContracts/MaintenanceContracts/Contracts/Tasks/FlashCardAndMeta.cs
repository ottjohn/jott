using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class FlashCardAndMeta
    {
        public string FlashCardQuestion { get; set; }
        public string FlashCardAnswer { get; set; }
        public List<FlashCardMeta> CardMetaData { get; set; }
        public string Message { get; set; }
    }
}
