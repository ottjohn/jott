using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Xml;
using System.IO;
using System.Web;
using MaintenanceContracts.Contracts.Common;
using System.Configuration;
using System.Reflection;
using log4net;

namespace UtilityPot.Mail
{
    public class EmailProcess
    {
        private static readonly log4net.ILog log =
            log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType); 

        private string GetEmailMessage(Email MessageComponents)
        {
            string EmailTemplatePath = "";
            string EmailMessage = "";

            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string sPath = GetAppConfig().AppSettings.Settings["MgmtEmailTemplate"].Value;
            EmailTemplatePath = driveLetter + GetAppConfig().AppSettings.Settings["MgmtEmailTemplate"].Value;

            try
            {
                string EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailMessage = EmailBodyTemplate.Replace("#TITLE#", MessageComponents.Title);
                EmailMessage = EmailMessage.Replace("#MESSAGE#", MessageComponents.Message);
                EmailMessage = EmailMessage.Replace("#DEVICE#", MessageComponents.MessageFromDevice);

            }
            catch (Exception ex)
            {
                log.Error("Could not retrieve email template.", ex);
            }

            return EmailMessage;
        }

        private Configuration GetAppConfig()
        {
            string LocationApp = new Uri(Assembly.GetExecutingAssembly().CodeBase).AbsolutePath;
            LocationApp = LocationApp.Replace("%20", " ");
            Configuration AppConfig = ConfigurationManager.OpenExeConfiguration(LocationApp);
            return AppConfig;
        }

        private LinkedResource CreateLogoImageLink()
        {
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string LogoPath = GetAppConfig().AppSettings.Settings["LogoPath"].Value;
            LinkedResource imagelink = new LinkedResource(driveLetter + LogoPath, "image/png");
            imagelink.ContentId = "imageId";
            imagelink.TransferEncoding = System.Net.Mime.TransferEncoding.Base64;
            return imagelink;
        }

        private bool SendEmail(Email MessageComponents, bool IncludeLogo)
        {
            bool RetVal = true;
            
            MailMessage EmailMessage = new MailMessage();

            foreach (string EmailTo in MessageComponents.EmailTo) EmailMessage.To.Add(EmailTo);

            EmailMessage.Subject = MessageComponents.Subject;
            EmailMessage.Body = MessageComponents.Message;

            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(MessageComponents.Message, null, "text/html");
            if (IncludeLogo) htmlView.LinkedResources.Add(CreateLogoImageLink());
            EmailMessage.AlternateViews.Add(htmlView);

            if (MessageComponents.AttachmentPath != null && MessageComponents.AttachmentPath != "")
            {
                Attachment EmailAttachment = new Attachment(MessageComponents.AttachmentPath);
                EmailMessage.Attachments.Add(EmailAttachment);
            }

            EmailMessage.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient();
            smtp.Timeout = 20000;
            smtp.EnableSsl = true;
            try
            {
                smtp.Send(EmailMessage);
            }
            catch (Exception ex)
            {
                log.Error("Unable to send email.", ex);
                RetVal = false;
            }

            return RetVal;

        }

        public bool ComposeEmail(Email MessageComponents)
        {
            bool RetVal = false;
            MessageComponents.Message = GetEmailMessage(MessageComponents);
            if (MessageComponents.Message != "") RetVal = SendEmail(MessageComponents, true);
            return RetVal;
        }
    }
}
