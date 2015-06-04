using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasksData;

namespace Tasks.FlashCards
{
    public class FlashCardProcess
    {
        public string SaveFlashCard(string FlashCardQuestion, string FlashCardAnswer, int FlashCardCategory)
        {
            MemberTaskManager TM = new MemberTaskManager();
            return TM.SaveFlashCard(FlashCardQuestion, FlashCardAnswer, FlashCardCategory);
        }
    }
}
