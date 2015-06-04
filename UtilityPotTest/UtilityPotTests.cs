using System;
using System.Data;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using UtilityPot.CommonValidation;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UtilityPotTest
{
    /// <summary>
    /// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// DATE TESTING
    /// THIS IS COMMON STUFF SO SHOULD BE PUT INTO UTILITY SO ALL ASSEMBLIES CAN ACCESS IT
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// </summary>
    [TestClass]
    public class ValidateDateTests
    {
        private TestContext testContextInstance;
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringDates.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\Dates\\StringDates.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void EffectiveDateForValid_Test()
        {
            //Arrange
            string TestDate = testContextInstance.DataRow["EffectiveDate"].ToString();
            bool ExpectedValue = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool ActualValue = DateValidation.CheckStringDate(TestDate);

            //Assert
            Assert.AreEqual(ExpectedValue, ActualValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\CompareDates.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\Dates\\CompareDates.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void CompareDates_Test()
        {
            //Arrange
            string TestDate = testContextInstance.DataRow["EffectiveDate"].ToString();
            DateTime CompareDate = Convert.ToDateTime(testContextInstance.DataRow["CompareDate"]);
            string Operation = testContextInstance.DataRow["Operation"].ToString();
            bool ExpectedValue = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool ActualValue = DateValidation.StringDateCompareToGivenDate(TestDate, CompareDate, Operation);

            //Assert
            Assert.AreEqual(ExpectedValue, ActualValue, "No value required");
        }
    }

    /// <summary>
    /// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// NUMBER TESTING
    /// THIS IS COMMON STUFF SO SHOULD BE PUT INTO UTILITY SO ALL ASSEMBLIES CAN ACCESS IT
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// </summary>
    [TestClass]
    public class ValidateNumberTests
    {
        private TestContext testContextInstance;
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }

        [TestMethod]
        public void CheckForDbInt_TestFailNull()
        {
            //Arrange
            int? TestInt = null;

            //Act
            bool TestIntIsDbInt = TypeValidation.CheckDBInt(TestInt);

            //Asssert
            Assert.AreEqual(false, TestIntIsDbInt, "Not a valid db integer.");
        }

        [TestMethod]
        public void CheckForDbInt_TestFailLessThanZero()
        {
            //Arrange
            int? TestInt = -4;

            //Act
            bool TestIntIsDbInt = TypeValidation.CheckDBInt(TestInt);

            //Asssert
            Assert.AreEqual(false, TestIntIsDbInt, "Not a valid db integer.");
        }

        [TestMethod]
        public void CheckForDbInt_TestPass()
        {
            //Arrange
            int? TestInt = 4;

            //Act
            bool TestIntIsDbInt = TypeValidation.CheckDBInt(TestInt);

            //Asssert
            Assert.AreEqual(true, TestIntIsDbInt, "Is a valid db integer.");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\RateValue.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\Numbers\\RateValue.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void CheckRateValue_Test()
        {
            //Arrange
            double? TestRate = ToNullableDouble(testContextInstance.DataRow["TestRate"].ToString());
            double? LowerBound = ToNullableDouble(testContextInstance.DataRow["LowerBound"].ToString());
            double? UpperBound = ToNullableDouble(testContextInstance.DataRow["UpperBound"].ToString());
            bool ExpectedValue = Convert.ToBoolean(testContextInstance.DataRow["ReturnValue"]);

            //Act
            bool ActualValue = TypeValidation.CheckRateValue(TestRate, LowerBound, UpperBound);

            //Assert
            Assert.AreEqual(ExpectedValue, ActualValue, "No value required");
        }

        public static double? ToNullableDouble(string s)
        {
            double? RetVal = null;
            if (s != "null")
            {
                double i;
                if (Double.TryParse(s, out i)) RetVal = i;
            }

            return RetVal;
        }
    }

    /// <summary>
    /// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// STRING TESTING AGAINST REGULAR EXPRESSIOINS
    /// THIS IS COMMON STUFF SO SHOULD BE PUT INTO UTILITY SO ALL ASSEMBLIES CAN ACCESS IT
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// </summary>
    [TestClass]
    public class ValidateStringTests
    {
        private TestContext testContextInstance;
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataLocalTaxCode.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataLocalTaxCode.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsLocalTaxCode()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);

            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataFirstName.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataFirstName.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsFirstName()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataLastName.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataLastName.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsLastName()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataAddress.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataAddress.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsAddress()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataCity.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataCity.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsCity()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataStateLong.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataStateLong.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsStateLong()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataEmail.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataEmail.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsEmail()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataUserName.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataUserName.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsUserName()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataPassword.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataPassword.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsPassword()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataSecurityQuestion.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataSecurityQuestion.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsSecurityQuestion()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataDateDash422.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataDateDash422.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsDateDash422()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }

        [TestMethod()]
        [DeploymentItem("MaintenanceDataTests\\StringTestDataNewGroupName.xml")]
        [DataSource("Microsoft.VisualStudio.TestTools.DataSource.XML",
                           "D:\\StoreMaintenanceRepository\\UtilityPotTest\\StringExpressions\\StringTestDataNewGroupName.xml",
                           "row",
                            DataAccessMethod.Sequential)]
        public void TestStringPatternsGroupName()
        {
            //Arrange
            string TestValue = testContextInstance.DataRow["TestString"].ToString();
            string TestKey = testContextInstance.DataRow["TestKey"].ToString();
            string TestReturnValue = testContextInstance.DataRow["TestReturnValue"].ToString();

            //Act
            string ReturnValue = StringExpressionDictionary.ValidateStringExpression(TestValue, TestKey);


            //Assert
            Assert.AreEqual(TestReturnValue, ReturnValue, "No value required");
        }
    }
}
