-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: mixertest
-- ------------------------------------------------------
-- Server version	8.0.33

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
) ENGINE=InnoDB AUTO_INCREMENT=72426 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'John Doe','john.doe@example.com','9876543210','1234 Main St','johnfb','pass123','Manager'),(2,'Jane Doe','jane.doe@example.com','0123456789','5678 Second St','janefb','pass456','Coordinator'),(3,'Jim Beam','jim.beam@example.com','2345678901','9101 Third St','jimfb','pass789','Planner'),(4,'Julia Styles','julia.styles@example.com','3456789012','1234 Fourth St','juliafb','pass012','Staff'),(72425,'Admin User','admin@example.com','1234567890','1234 Admin St','adminfb','adminpassword','Admin');
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
  PRIMARY KEY (`id`),
  KEY `equipments_ibfk_1` (`event`),
  CONSTRAINT `equipments_ibfk_1` FOREIGN KEY (`event`) REFERENCES `events` (`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipments`
--

LOCK TABLES `equipments` WRITE;
/*!40000 ALTER TABLE `equipments` DISABLE KEYS */;
INSERT INTO `equipments` VALUES ('CAM5','asdvae','awevaea','svdad',5),('equip50429','aevaea','evaeva','e23evw',NULL),('LIG4','Stage Lighting','In repair','Poor',4),('MIC2','Microphones','In use','Fair',2),('new40765829e2f12','blah','blah','blah',NULL),('new8fcf04fb84b65','aweavea','evaeaea','eavae',NULL),('PRJ3','Projector','Available','Excellent',3),('SPK1','Speakers','Available','Good',1);
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
  KEY `employeeID` (`employeeID`),
  CONSTRAINT `eventemployee_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `eventemployee_ibfk_2` FOREIGN KEY (`employeeID`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventemployee`
--

LOCK TABLES `eventemployee` WRITE;
/*!40000 ALTER TABLE `eventemployee` DISABLE KEYS */;
INSERT INTO `eventemployee` VALUES (1,1),(2,1),(1,2),(2,2),(1,3);
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
  KEY `equipmentID` (`equipmentID`),
  CONSTRAINT `eventequipment_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `eventequipment_ibfk_2` FOREIGN KEY (`equipmentID`) REFERENCES `equipments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventequipment`
--

LOCK TABLES `eventequipment` WRITE;
/*!40000 ALTER TABLE `eventequipment` DISABLE KEYS */;
INSERT INTO `eventequipment` VALUES (1,'CAM5'),(5,'CAM5'),(1,'equip50429'),(1,'LIG4'),(5,'LIG4'),(1,'MIC2'),(2,'MIC2'),(1,'PRJ3'),(5,'PRJ3'),(1,'SPK1'),(2,'SPK1'),(5,'SPK1');
/*!40000 ALTER TABLE `eventequipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventID` int NOT NULL,
  `eventDate` date DEFAULT NULL,
  `eventTime` time DEFAULT NULL,
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
  PRIMARY KEY (`eventID`),
  KEY `paymentID` (`paymentID`),
  KEY `service` (`service`),
  KEY `employeeAssigned` (`employeeAssigned`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`paymentID`) REFERENCES `payments` (`id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`service`) REFERENCES `services` (`id`),
  CONSTRAINT `events_ibfk_3` FOREIGN KEY (`employeeAssigned`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2024-08-23','14:00:00','Alice and Bob Wedding','Alice Johnson','1234567890','Venue A','Wedding','SPK1','PMT1','Need extra chairs',1,1),(2,'2024-07-12','16:00:00','Corporate Gala','Bob Smith','0987654321','Venue B','Corporate Event','MIC2','PMT2','',2,2),(3,'2024-07-14','18:00:00','Charlie’s Birthday Bash','Charlie Brown','5556667777','Venue C','Birthday Party','PRJ3','PMT3','Special cake order',3,3),(4,'2024-07-16','20:00:00','Concert for Diana','Diana Prince','9998887777','Venue D','Concert','LIG4','PMT4','Extra stage setup',4,4),(5,'2024-07-18','17:00:00','Evan and Emma Anniversary','Evan Rogers','1112223333','Venue E','Anniversary','CAM5','PMT5','Include fireworks',5,1);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `cost` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('PMT1','Paid','2000'),('PMT2','Due','1500'),('PMT3','Paid','1800'),('PMT4','Due','2200'),('PMT5','Paid','2500');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
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
  `type` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `inclusion` varchar(255) DEFAULT NULL,
  `rate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Catering',1,500,'Full meal service','5'),(2,'Security',2,300,'Event security personnel','4'),(3,'Photography',3,700,'Full event photography','5'),(4,'Music DJ',4,450,'Includes DJ equipment','4'),(5,'Decorations',5,350,'Venue decorations','3');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-07  6:14:17
