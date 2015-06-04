using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.OttJohn;
using UtilityPot.Logger;


namespace TasksData.FlashCards
{
    public class FlashCardManager
    {
        public string SaveFlashCard(ILogger Logger, string FlashCardQuestion, string FlashCardAnswer, int FlashCardCategory)
        {
            string RetVal = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    Context.AddFlashCard(FlashCardQuestion, FlashCardAnswer, FlashCardCategory);
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to save flashcard. Please try again.";
                Logger.LogEvent("TasksData.FlashCards.SaveFlashCard", ex);
            }

            return RetVal;
        }
    }
}
