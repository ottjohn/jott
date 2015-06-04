﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.18444
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OttJohn.OttjohnAuthentication {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(Namespace="http://asp.net/ApplicationServices/v200", ConfigurationName="OttjohnAuthentication.AuthenticationService")]
    public interface AuthenticationService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/ValidateUser", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/ValidateUserRespons" +
            "e")]
        bool ValidateUser(string username, string password, string customCredential);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/ValidateUser", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/ValidateUserRespons" +
            "e")]
        System.Threading.Tasks.Task<bool> ValidateUserAsync(string username, string password, string customCredential);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/Login", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/LoginResponse")]
        bool Login(string username, string password, string customCredential, bool isPersistent);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/Login", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/LoginResponse")]
        System.Threading.Tasks.Task<bool> LoginAsync(string username, string password, string customCredential, bool isPersistent);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/IsLoggedIn", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/IsLoggedInResponse")]
        bool IsLoggedIn();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/IsLoggedIn", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/IsLoggedInResponse")]
        System.Threading.Tasks.Task<bool> IsLoggedInAsync();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/Logout", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/LogoutResponse")]
        void Logout();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://asp.net/ApplicationServices/v200/AuthenticationService/Logout", ReplyAction="http://asp.net/ApplicationServices/v200/AuthenticationService/LogoutResponse")]
        System.Threading.Tasks.Task LogoutAsync();
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface AuthenticationServiceChannel : OttJohn.OttjohnAuthentication.AuthenticationService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class AuthenticationServiceClient : System.ServiceModel.ClientBase<OttJohn.OttjohnAuthentication.AuthenticationService>, OttJohn.OttjohnAuthentication.AuthenticationService {
        
        public AuthenticationServiceClient() {
        }
        
        public AuthenticationServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public AuthenticationServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public AuthenticationServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public AuthenticationServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public bool ValidateUser(string username, string password, string customCredential) {
            return base.Channel.ValidateUser(username, password, customCredential);
        }
        
        public System.Threading.Tasks.Task<bool> ValidateUserAsync(string username, string password, string customCredential) {
            return base.Channel.ValidateUserAsync(username, password, customCredential);
        }
        
        public bool Login(string username, string password, string customCredential, bool isPersistent) {
            return base.Channel.Login(username, password, customCredential, isPersistent);
        }
        
        public System.Threading.Tasks.Task<bool> LoginAsync(string username, string password, string customCredential, bool isPersistent) {
            return base.Channel.LoginAsync(username, password, customCredential, isPersistent);
        }
        
        public bool IsLoggedIn() {
            return base.Channel.IsLoggedIn();
        }
        
        public System.Threading.Tasks.Task<bool> IsLoggedInAsync() {
            return base.Channel.IsLoggedInAsync();
        }
        
        public void Logout() {
            base.Channel.Logout();
        }
        
        public System.Threading.Tasks.Task LogoutAsync() {
            return base.Channel.LogoutAsync();
        }
    }
}
