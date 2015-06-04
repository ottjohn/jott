using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.OttJohn
{
    [DataContract]
    public class SaveFlashCardRequest
    {
        [DataMemberAttribute]
        public string FlashCardQuestion { get; set; }
        [DataMemberAttribute]
        public string FlashCardAnswer { get; set; }
        [DataMemberAttribute]
        public int FlashCardCategory { get; set; }
    }
}
