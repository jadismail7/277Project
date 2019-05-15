DROP TABLE IF EXISTS `department`;
CREATE TABLE IF NOT EXISTS `department` (
  `DepID` int(20) AUTO_INCREMENT NOT NULL,
  `HeadOfDepartmentScienticsID` int(20) NOT NULL,
  `Name` varchar(250) NOT NULL,
  `Location` varchar(250) NOT NULL,
  PRIMARY KEY (`DepID`)
);


DROP TABLE IF EXISTS `executive_board`;
CREATE TABLE IF NOT EXISTS `executive_board` (
  `ID` int(20) AUTO_INCREMENT NOT NULL,
  `FirstName` varchar(250) NOT NULL,
  `LastName` varchar(250) NOT NULL,
  PRIMARY KEY (`ID`)
);


DROP TABLE IF EXISTS `scientist`;
CREATE TABLE IF NOT EXISTS `scientist` (
  `ID` int(20) AUTO_INCREMENT NOT NULL,
  `FirstName` varchar(250) NOT NULL,
  `LastName` varchar(250) NOT NULL,
  `Salary` Double(255,2) NOT NULL,
  `ManagerID` int(20) ,
  `DepID` int(20) NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`DepID`) REFERENCES department(`DepID`) ON DELETE CASCADE,
  FOREIGN KEY (`ManagerID`) REFERENCES scientist(`ID`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `project`;
CREATE TABLE IF NOT EXISTS `project` (
  `ProjID` int(20) AUTO_INCREMENT NOT NULL,
  `Name` varchar(250) NOT NULL,
  `Department` int(20) NOT NULL,
  `ProjectManager` int(20) NOT NULL,
  PRIMARY KEY (`ProjID`),
  FOREIGN KEY (`Department`) REFERENCES department(`DepID`) ON DELETE CASCADE,
  FOREIGN KEY (`ProjectManager`) REFERENCES scientist(`ID`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `resources`;
CREATE TABLE IF NOT EXISTS `resources` (
  `ResourceID` int(20) AUTO_INCREMENT NOT NULL,
  `Cost` Double(255,2) NOT NULL,
  PRIMARY KEY (`ResourceID`)
);

DROP TABLE IF EXISTS `project_resources`;
CREATE TABLE IF NOT EXISTS `project_resources` (
  `ResourceID` int(20) NOT NULL,
  `ProjID` int(20) NOT NULL,
  `amount` int(100) NOT NULL,
  PRIMARY KEY (`ResourceID`, `ProjID`),
  FOREIGN KEY (`ResourceID`) REFERENCES resources(`ResourceID`) ON DELETE CASCADE,
  FOREIGN KEY (`ProjID`) REFERENCES project(`ProjID`) ON DELETE CASCADE 
);

DROP TABLE IF EXISTS `results_yielded`;
CREATE TABLE IF NOT EXISTS `results_yielded` (
  `ProjID` int(20) NOT NULL,
  `ResultDataID` int(20) AUTO_INCREMENT  NOT NULL,
  `Data` int(20) NOT NULL,
  PRIMARY KEY (`ProjID`,`ResultDataID`),
  FOREIGN KEY (`ProjID`) references project(`ProjID`) ON DELETE CASCADE
)ENGINE=MyISAM;



DROP TABLE IF EXISTS `scientist_project_participation`;
CREATE TABLE IF NOT EXISTS `scientist_project_participation` (
  `ProjectID` int(20) NOT NULL,
  `ScientistID` int(20) NOT NULL,
  PRIMARY KEY (`ProjectID`,`ScientistID`),
  FOREIGN KEY (`ProjectID`) REFERENCES project(`ProjID`) ON DELETE CASCADE,
  FOREIGN KEY (`ScientistID`) REFERENCES scientist(`ID`) ON DELETE CASCADE
);
