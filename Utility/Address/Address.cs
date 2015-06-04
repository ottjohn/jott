using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml;
using System.Net;
using System.IO;
using System.Web;
using log4net;
using MaintenanceContracts.Contracts.Common;

namespace UtilityPot.Address
{
    public class AddressOperation
    {
        private static readonly log4net.ILog log =
            log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType); 

        public CityStateList GetCityStateList(int PostalCode)
        {
            CityStateList CityStateList = new CityStateList();
            string BaseURL = "http://production.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&XML=";
            string USPSXml = "<CityStateLookupRequest%20USERID='219WCRI05903'><ZipCode ID= '0'><Zip5>#ZIPCODE#</Zip5></ZipCode></CityStateLookupRequest>";
            USPSXml = USPSXml.Replace("#ZIPCODE#", Convert.ToString(PostalCode));
            string USPSRequest = BaseURL + USPSXml;

            WebClient uspsWC = new WebClient();

            try
            {
                byte[] ResponseData = uspsWC.DownloadData(USPSRequest);
                if (ResponseData != null) CityStateList = ExtractCityStates(ResponseData);
            }
            catch (Exception ex)
            {
                log.Error("Problem connecting with USPS.", ex);
            }

            return CityStateList;

        }

        private CityStateList ExtractCityStates(byte[] ResponseData)
        {
            CityStateList CityStateList = new CityStateList();
            CityStateList.Locations = new List<CityState>();
            string strResponse = "";

            foreach (byte oItem in ResponseData)
                strResponse += (char)oItem;

            XmlDocument XmlDoc = new XmlDocument();
            XmlDoc.LoadXml(strResponse);
            XmlNode RootNode = XmlDoc.SelectSingleNode("//CityStateLookupResponse");
            if (RootNode.HasChildNodes)
            {
                foreach (XmlNode ChildNode in RootNode.ChildNodes)
                {
                    CityState RetCityState = new CityState();
                    RetCityState.City = ChildNode.SelectSingleNode("City").InnerText;
                    RetCityState.State = ChildNode.SelectSingleNode("State").InnerText;
                    CityStateList.Locations.Add(RetCityState);
                }
            }
            return CityStateList;
        }
    }
}
