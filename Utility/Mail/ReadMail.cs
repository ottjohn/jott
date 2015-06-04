using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenPop.Pop3;
using OpenPop.Common;
using OpenPop.Mime;
using System.Text.RegularExpressions;
using MaintenanceContracts.Contracts.Common;

namespace UtilityPot.Mail
{
    public class ReadMail
    {
        public string GetEmailMessageFromJohn(EmailAccountDetails Details)
        {
            string RetVal = "";
            EmailMessageItems MessageItems = GetEmailMessages(Details);
            if (MessageItems.Messages.Count > 0)
            {
                RetVal = MessageItems.Messages[0].HtmlMessage;
            }

            return RetVal;
        }

        /// <summary>
        /// Example showing:
        ///  - how to use UID's (unique ID's) of messages from the POP3 server
        ///  - how to download messages not seen before
        ///    (notice that the POP3 protocol cannot see if a message has been read on the server
        ///     before. Therefore the client need to maintain this state for itself)
        /// </summary>
        /// <param name="hostname">Hostname of the server. For example: pop3.live.com</param>
        /// <param name="port">Host port to connect to. Normally: 110 for plain POP3, 995 for SSL POP3</param>
        /// <param name="useSsl">Whether or not to use SSL to connect to server</param>
        /// <param name="username">Username of the user on the server</param>
        /// <param name="password">Password of the user on the server</param>
        /// <param name="seenUids">
        /// List of UID's of all messages seen before.
        /// New message UID's will be added to the list.
        /// Consider using a HashSet if you are using >= 3.5 .NET
        /// </param>
        /// <returns>A List of new Messages on the server</returns>
        public EmailMessageItems  GetEmailMessages(EmailAccountDetails Details)
        {
            // The client disconnects from the server when being disposed
            EmailMessageItems MessageItems = new EmailMessageItems { Messages = new List<EmailMessageItem>() };
            MessageItems.Message = "";

            List<EmailMessageItem> MailItems = new List<EmailMessageItem>();

            try
            {
                using (Pop3Client client = new Pop3Client())
                {
                    // Connect to the server
                    client.Connect(Details.HostName, Details.Port, Details.UseSsl);

                    // Authenticate ourselves towards the server
                    client.Authenticate(Details.EmailUserName, Details.EmailPassword);

                    // Fetch all the current uids seen
                    List<string> uids = client.GetMessageUids();

                    // Create a list we can return with all new messages
                    //List<Message> newMessages = new List<Message>();
                    List<string> MailMessages = new List<string>();

                    // All the new messages not seen by the POP3 client
                    for (int i = 0; i < uids.Count; i++)
                    {
                        string currentUidOnServer = uids[i];

                        // the uids list is in messageNumber order - meaning that the first
                        // uid in the list has messageNumber of 1, and the second has 
                        // messageNumber 2. Therefore we can fetch the message using
                        // i + 1 since messageNumber should be in range [1, messageCount]

                        Message unseenMessage = client.GetMessage(i + 1);
                        string MailFrom = unseenMessage.Headers.From.DisplayName;
                        string MyText = MailFrom + ": " + unseenMessage.Headers.Subject;
                        // Add the message to the new messages
                        //newMessages.Add(unseenMessage);
                        //MessagePart HtmlMessage = unseenMessage.FindFirstHtmlVersion();
                        //string MyText = HtmlMessage.GetBodyAsText();
                        
                        EmailMessageItem MailItem = new EmailMessageItem();
                        MailItem.HtmlMessage = MyText;
                        MailItem.HtmlMessageId = currentUidOnServer;
                        MailItem.HtmlMessageProcessed = false;
                        MessageItems.Messages.Add(MailItem);
                        client.DeleteMessage(i + 1);

                    }

                    client.Disconnect();
                    client.Dispose();

                }
            }
            catch (Exception ex)
            {
                MessageItems.Message = "Problem retrieving mail messgages.";
            }

            return MessageItems;

        }
    }
}
