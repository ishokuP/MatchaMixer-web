-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: matchamixer
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Alice Johnson','alice.j@example.com','1234567890','123 Maple Street','AliceJ','password123','Manager'),(2,'Bob Smith','bob.smith@example.com','9876543210','456 Oak Avenue','BobS','securepass','Technician'),(3,'Charlie Brown','charlie.b@example.com','4567891230','789 Pine Road','CharlieB','mypassword','Assistant');
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
INSERT INTO `equipments` VALUES ('21559','woooo','Deployed','Requires Cleaning',NULL),('384922','aa','Deployed','Good-to-Go',NULL),('571477','aa','Deployed','Requires Cleaning',NULL),('943091','asd','Deployed','Requires Cleaning',NULL);
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
  KEY `eventemployee_ibfk_2` (`employeeID`),
  CONSTRAINT `eventemployee_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `eventemployee_ibfk_2` FOREIGN KEY (`employeeID`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventemployee`
--

LOCK TABLES `eventemployee` WRITE;
/*!40000 ALTER TABLE `eventemployee` DISABLE KEYS */;
INSERT INTO `eventemployee` VALUES (1,1),(1,2);
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
  KEY `eventequipment_ibfk_2` (`equipmentID`),
  CONSTRAINT `eventequipment_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `eventequipment_ibfk_2` FOREIGN KEY (`equipmentID`) REFERENCES `equipments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventequipment`
--

LOCK TABLES `eventequipment` WRITE;
/*!40000 ALTER TABLE `eventequipment` DISABLE KEYS */;
INSERT INTO `eventequipment` VALUES (1,'943091');
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
  `eventStart` datetime DEFAULT NULL,
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
  `eventEnd` datetime DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  UNIQUE KEY `eventType` (`eventType`),
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
INSERT INTO `events` VALUES (1,'2025-01-15 00:00:00','Annual Conference','John Doe','1234567890','Grand Hall','Conference','Sound System, Lighting Rig','PAY001','VIP setup',1,1,120,'2025-01-15 00:00:00');
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
INSERT INTO `payments` VALUES ('PAY001','Paid','5000');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Audio Setup',1,3000,'Microphones, Speakers','Hourly'),(2,'Lighting Setup',2,2000,'LED Lights, Stage Effects','Daily');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'matchamixer'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-14 14:51:22
