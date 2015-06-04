using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using CustomerUtility;
using UtilityPot.Visits;

namespace OttJohn
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            System.Web.ApplicationServices.AuthenticationService.CreatingCookie
                += new EventHandler<System.Web.ApplicationServices.CreatingCookieEventArgs>
                (AuthenticationService_CreatingCookie);
        }

        //void Application_BeginRequest(object sender, EventArgs e)
        //{
        //    string IpAddress = HttpContext.Current.Request.UserHostAddress;
        //    UtilityPot.Visits.VisitorProcesser.LogVisitor(IpAddress);
        //}

        //public void Session_Start(object sender, EventArgs e)
        //{
        //    string IpAddress = HttpContext.Current.Request.UserHostAddress;
        //    UtilityPot.Visits.VisitorProcesser.LogVisitor(IpAddress);
            
        //}

        void AuthenticationService_CreatingCookie(object sender, System.Web.ApplicationServices.CreatingCookieEventArgs e)
        {
            //This needs to be added now
            CustomerProcess CP = new CustomerProcess();
            string RolesString = CP.GetRolesOnLogin(e.UserName);

            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, e.UserName, DateTime.Now, DateTime.Now.AddMinutes(30), false, RolesString, FormsAuthentication.FormsCookiePath);
            string encryptedCookie = FormsAuthentication.Encrypt(ticket);
            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedCookie);
            HttpContext.Current.Response.Cookies.Add(cookie);
            e.CookieIsSet = true;
        }
    }
}