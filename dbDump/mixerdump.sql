-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: matchadeploy
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `fbname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'John Doe','john@example.com','1234567890','123 Main St','johndoe_fb','password123','Manager'),(2,'Jane Smith','jane@example.com','0987654321','456 Oak St','janesmith_fb','securepass','Staff'),(3,'Alice Johnson','alice@example.com','1112223333','789 Pine St','alicejohnson_fb','alicepass','Technician'),(4,'AdminUser','admin@example.com','242152456252','AdminRoad','AdminTest','adminpassword','Admin');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipments`
--

DROP TABLE IF EXISTS `equipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipments` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `Econdition` varchar(255) DEFAULT NULL,
  `event` int DEFAULT NULL,
  `filepath` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_equipments_event` (`event`),
  CONSTRAINT `fk_equipments_event` FOREIGN KEY (`event`) REFERENCES `events` (`eventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipments`
--

LOCK TABLES `equipments` WRITE;
/*!40000 ALTER TABLE `equipments` DISABLE KEYS */;
INSERT INTO `equipments` VALUES ('EQ001','Speaker System','Available','Good',1,'images/speaker.jpg'),('EQ002','Wireless Microphone','In Use','Excellent',2,'images/mic.jpg');
/*!40000 ALTER TABLE `equipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventemployee`
--

DROP TABLE IF EXISTS `eventemployee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventemployee` (
  `eventID` int NOT NULL,
  `employeeID` int NOT NULL,
  PRIMARY KEY (`eventID`,`employeeID`),
  KEY `fk_eventemployee_employee` (`employeeID`),
  CONSTRAINT `fk_eventemployee_employee` FOREIGN KEY (`employeeID`) REFERENCES `employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_eventemployee_event` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventemployee`
--

LOCK TABLES `eventemployee` WRITE;
/*!40000 ALTER TABLE `eventemployee` DISABLE KEYS */;
INSERT INTO `eventemployee` VALUES (1,1),(2,2),(1,3);
/*!40000 ALTER TABLE `eventemployee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventequipment`
--

DROP TABLE IF EXISTS `eventequipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventequipment` (
  `eventID` int NOT NULL,
  `equipmentID` varchar(255) NOT NULL,
  PRIMARY KEY (`eventID`,`equipmentID`),
  KEY `fk_eventequipment_equipment` (`equipmentID`),
  CONSTRAINT `fk_eventequipment_equipment` FOREIGN KEY (`equipmentID`) REFERENCES `equipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_eventequipment_event` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventequipment`
--

LOCK TABLES `eventequipment` WRITE;
/*!40000 ALTER TABLE `eventequipment` DISABLE KEYS */;
INSERT INTO `eventequipment` VALUES (1,'EQ001'),(2,'EQ002');
/*!40000 ALTER TABLE `eventequipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventID` int NOT NULL AUTO_INCREMENT,
  `eventStart` datetime DEFAULT NULL,
  `eventEnd` datetime DEFAULT NULL,
  `eventName` varchar(255) DEFAULT NULL,
  `eventClientName` varchar(255) DEFAULT NULL,
  `eventClientContact` varchar(255) DEFAULT NULL,
  `eventVenue` varchar(255) DEFAULT NULL,
  `eventType` varchar(255) DEFAULT NULL,
  `equipmentNeeded` varchar(255) DEFAULT NULL,
  `paymentID` varchar(255) DEFAULT NULL,
  `additionalRequests` varchar(255) DEFAULT NULL,
  `service` int DEFAULT NULL,
  `employeeAssigned` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  KEY `fk_events_service` (`service`),
  KEY `fk_events_employee` (`employeeAssigned`),
  CONSTRAINT `fk_events_employee` FOREIGN KEY (`employeeAssigned`) REFERENCES `employee` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_events_service` FOREIGN KEY (`service`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2025-03-15 18:00:00','2025-03-15 23:00:00','Wedding Reception','Michael Lee','5551234567','Grand Hall','Wedding','Speakers, Lights','PAY123','Special Lighting Effects',1,1,5),(2,'2025-04-10 19:00:00','2025-04-10 23:30:00','Corporate Event','Anna Brown','5559876543','Downtown Conference Center','Corporate','Projector, Mic','PAY124','Extra Microphones',2,2,5);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finances`
--

DROP TABLE IF EXISTS `finances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finances` (
  `id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `cost` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finances`
--

LOCK TABLES `finances` WRITE;
/*!40000 ALTER TABLE `finances` DISABLE KEYS */;
INSERT INTO `finances` VALUES ('FIN001','Paid','1500','2025-03-10 12:00:00'),('FIN002','Pending','2500','2025-04-05 15:30:00'),('PAY123','Paid','1500','2025-03-10 12:00:00'),('PAY124','Pending','2500','2025-04-05 15:30:00');
/*!40000 ALTER TABLE `finances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financesemployees`
--

DROP TABLE IF EXISTS `financesemployees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financesemployees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventName` varchar(255) DEFAULT NULL,
  `employeeName` varchar(255) DEFAULT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financesemployees`
--

LOCK TABLES `financesemployees` WRITE;
/*!40000 ALTER TABLE `financesemployees` DISABLE KEYS */;
INSERT INTO `financesemployees` VALUES (1,'Wedding Reception','John Doe','500','Paid'),(2,'Corporate Event','Jane Smith','750','Unpaid'),(3,'Wedding Reception','Alice Johnson','1500','Paid');
/*!40000 ALTER TABLE `financesemployees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceequipment`
--

DROP TABLE IF EXISTS `serviceequipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviceequipment` (
  `serviceID` int DEFAULT NULL,
  `equipmentID` varchar(255) DEFAULT NULL,
  KEY `fk_serviceequipment_service` (`serviceID`),
  KEY `fk_serviceequipment_equipment` (`equipmentID`),
  CONSTRAINT `fk_serviceequipment_equipment` FOREIGN KEY (`equipmentID`) REFERENCES `equipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_serviceequipment_service` FOREIGN KEY (`serviceID`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceequipment`
--

LOCK TABLES `serviceequipment` WRITE;
/*!40000 ALTER TABLE `serviceequipment` DISABLE KEYS */;
INSERT INTO `serviceequipment` VALUES (1,'EQ001'),(2,'EQ002');
/*!40000 ALTER TABLE `serviceequipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceevent`
--

DROP TABLE IF EXISTS `serviceevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviceevent` (
  `serviceid` int DEFAULT NULL,
  `eventid` int DEFAULT NULL,
  KEY `fk_serviceevent_service` (`serviceid`),
  KEY `fk_serviceevent_event` (`eventid`),
  CONSTRAINT `fk_serviceevent_event` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_serviceevent_service` FOREIGN KEY (`serviceid`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceevent`
--

LOCK TABLES `serviceevent` WRITE;
/*!40000 ALTER TABLE `serviceevent` DISABLE KEYS */;
INSERT INTO `serviceevent` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `serviceevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `inclusion` varchar(255) DEFAULT NULL,
  `rate` varchar(255) DEFAULT NULL,
  `imagepath` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Basic Package',1000,'Sound System, Lights','4.5','images/basic.jpg'),(2,'Premium Package',2500,'Sound System, Lights, DJ','5.0','images/premium.jpg');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'matchadeploy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-08  1:45:03
