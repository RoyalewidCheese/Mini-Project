-- MySQL dump 10.13  Distrib 8.0.33, for macos13.3 (arm64)
--
-- Host: localhost    Database: Project
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
-- Current Database: `Project`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `Project`;

--
-- Table structure for table `Audit_Log`
--

DROP TABLE IF EXISTS `Audit_Log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Audit_Log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` longtext,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Audit_Log`
--

LOCK TABLES `Audit_Log` WRITE;
/*!40000 ALTER TABLE `Audit_Log` DISABLE KEYS */;
INSERT INTO `Audit_Log` VALUES (1,20,'Updated stock details','2023-06-13 11:20:12'),(2,1,'Updated profile information','2023-06-13 11:20:12'),(3,2,'Deleted item with ID 123','2023-06-13 11:20:12'),(4,1,'Added borrower Kavya','2023-06-13 17:37:48'),(5,2,'Added borrower Anakha Bose','2023-06-13 17:50:39'),(7,1,'Added borrower Arun Ganesh from Computer Science 6','2023-06-13 18:18:16'),(8,1,'Added Item LAP-005 of Laptop and Model Blade 19','2023-06-13 20:00:22'),(9,1,'Added Item LAP-009 of Laptop and Model Blade 19','2023-06-13 20:00:39'),(10,1,'Added Item LAP-008 of Laptop and Model Pavillion 16','2023-06-13 20:16:28'),(11,1,'Added Item LAP-111 of Laptop and Model Inspiron 16','2023-06-14 05:55:14'),(12,1,'Added Item LAP-101 of Laptop and Model Surface Pro','2023-06-14 05:58:57'),(13,1,'Added Item LAP-900 of Laptop and Model  MacBook Pro','2023-06-14 06:15:15'),(14,1,'Deleted Item LAP-101','2023-06-14 06:24:13'),(15,1,'Deleted Item LAP-012','2023-06-14 06:26:50'),(16,1,'Updated Item LAP-008 of Laptop and Model Pavillion 16','2023-06-14 06:34:46'),(17,1,'Deleted Item LAP-008','2023-06-14 06:35:08'),(18,1,'Deleted Item AIR-002','2023-06-14 13:17:23'),(19,1,'Added Item LAP-004 of Laptop and Model TUF GAMING','2023-06-14 14:23:45'),(20,1,'Deleted Item LAP-004','2023-06-14 14:23:53'),(21,1,'Added Item LAP-004 of Laptop and Model sdaa','2023-06-14 14:26:44'),(22,2,'Added borrower Shibin from Computer Science Semester 6','2023-06-14 22:14:22'),(23,1,'Logged in','2023-06-15 13:35:32'),(24,1,'Logged in','2023-06-15 13:35:55'),(25,1,'Logged in','2023-06-15 18:30:38'),(26,2,'Logged in','2023-06-15 18:30:52'),(27,1,'Logged in','2023-06-15 18:42:16'),(28,1,'Added Item KEY-005 of Keyboard and Model MasterKeys Pro L','2023-06-15 18:46:15'),(29,2,'Logged in','2023-06-15 18:46:32'),(30,1,'Logged in','2023-06-15 18:49:42'),(31,1,'Stock details updated','2023-06-15 18:49:56'),(32,1,'Logged in','2023-06-15 18:50:50'),(33,20,'Logged in','2023-06-15 18:56:43'),(34,20,'Stock details updated for item ID: BAT-001, indent no: Lab-Stock-2','2023-06-15 18:57:01'),(35,1,'Logged in','2023-06-15 19:01:48'),(36,1,'Logged in','2023-06-15 19:03:39'),(37,1,'Logged in','2023-06-15 19:08:07'),(38,1,'Stock details updated for item ID: BAT-001, indent no: Lab-Stock-5, invoice ID: INV-004','2023-06-15 19:08:16'),(39,1,'Logged in','2023-06-15 19:12:07');
/*!40000 ALTER TABLE `Audit_Log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Borrow_List`
--

DROP TABLE IF EXISTS `Borrow_List`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Borrow_List` (
  `borrower_id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) DEFAULT NULL,
  `admission_no` int DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`borrower_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Borrow_List`
--

LOCK TABLES `Borrow_List` WRITE;
/*!40000 ALTER TABLE `Borrow_List` DISABLE KEYS */;
INSERT INTO `Borrow_List` VALUES (23,'Adithya ',123,6,'Electronics Engineering','7867789109'),(27,'Jithu Johan',8292,3,'Computer Science','860657865'),(32,'Kavya',4562,6,'Computer Science','8765678765'),(33,'Anakha Bose',7667,6,'Computer Science','875685994'),(34,'Arun Ganesh',8349,6,'Computer Science','8747839483'),(35,'Shibin',4567,6,'Computer Science','8606578765');
/*!40000 ALTER TABLE `Borrow_List` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Brands`
--

DROP TABLE IF EXISTS `Brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brands`
--

LOCK TABLES `Brands` WRITE;
/*!40000 ALTER TABLE `Brands` DISABLE KEYS */;
INSERT INTO `Brands` VALUES (45,'Sony'),(51,'Volterion Pro'),(53,'Denon'),(54,'Dell'),(55,'LG '),(56,'HP'),(57,'Voltas'),(58,'APC'),(59,'Belkin'),(60,'Razer'),(61,'Microsoft'),(62,'Lenovo'),(63,'Panasonic'),(64,'Apple'),(65,'ASUS'),(66,'sdfkl'),(67,'CoolerMaster');
/*!40000 ALTER TABLE `Brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(255) DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cat_id`),
  KEY `brand_id` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (54,'Remote',45,'RM-ADP090'),(60,'Batteries',51,'AAA'),(63,'AVR',45,'STR-DH790'),(64,'AVR',53,'AVR-S750H'),(65,'Monitor',54,'P2419H'),(66,'Monitor',55,'27GL850'),(67,'Laptop',56,'Pavillion 16'),(69,'Air Conditioner',57,'1.5 Ton 3 Star Split'),(70,'UPS',58,'Back-UPS BX600C-IN'),(71,'Extension',59,'Power Strip'),(72,'Laptop',54,'Inspiron 15'),(73,'Laptop',60,'Blade 19'),(74,'Laptop',56,'Pavillion 16'),(75,'Laptop',54,'Inspiron 16'),(76,'Laptop',61,'Surface Pro'),(77,'Laptop',62,'ThinkPad'),(78,'Air Conditioner',63,'EasyBreeze'),(79,'Laptop',64,' MacBook Pro'),(80,'Laptop',65,'TUF GAMING'),(81,'Laptop',66,'sdaa'),(82,'Keyboard',67,'MasterKeys Pro L');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoice`
--

DROP TABLE IF EXISTS `Invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invoice` (
  `invoice_id` varchar(255) NOT NULL,
  `invoice_date` date DEFAULT NULL,
  PRIMARY KEY (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
INSERT INTO `Invoice` VALUES ('1','2023-05-25'),('INV-001','2023-06-08'),('INV-002','2023-05-24'),('INV-002398','2023-06-07'),('INV-003','2023-06-16'),('INV-004','2022-04-03'),('INV-005','2023-06-21'),('INV-02','2023-06-15'),('INV-8900','2023-06-03'),('INV-8901','2023-06-06');
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item_Borrower`
--

DROP TABLE IF EXISTS `Item_Borrower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Item_Borrower` (
  `item_id` varchar(255) NOT NULL,
  `borrower_id` int NOT NULL,
  `borrower_date` date DEFAULT NULL,
  PRIMARY KEY (`item_id`,`borrower_id`),
  KEY `borrower_id` (`borrower_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item_Borrower`
--

LOCK TABLES `Item_Borrower` WRITE;
/*!40000 ALTER TABLE `Item_Borrower` DISABLE KEYS */;
INSERT INTO `Item_Borrower` VALUES ('AIR-001',33,'2023-06-06'),('BAT-001',23,'2023-06-10'),('EXT-003',32,'2023-06-29'),('LAP-002',27,'2023-06-23'),('MON-001',34,'2023-06-13'),('MON-002',35,'2023-06-08');
/*!40000 ALTER TABLE `Item_Borrower` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Items` (
  `item_id` varchar(255) NOT NULL,
  `item_warranty` date NOT NULL,
  `item_status` varchar(255) NOT NULL,
  `lab_location` varchar(255) DEFAULT NULL,
  `rate` float NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` float NOT NULL,
  `cat_id` int NOT NULL,
  `description` longtext,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `cat_id` (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Items`
--

LOCK TABLES `Items` WRITE;
/*!40000 ALTER TABLE `Items` DISABLE KEYS */;
INSERT INTO `Items` VALUES ('AIR-001','2023-09-06','Damaged','Software Lab 1',35000,2,70000,69,'This Voltas air conditioner is a 1.5-ton split inverter AC.','Non-Consumable'),('AVR-001','2023-06-30','Damaged','Not Assigned',7000000,5,14000000,63,'7.2 Channel Dolby Atmos AV Receiver','Non-Consumable'),('BAT-001','2023-06-09','New','Software Lab 1',7000,11,77000,60,'AAA Battery','Consumable'),('EXT-003','2023-06-22','Borrowed','Software Lab 1',800,10,8000,71,'The Belkin Power Strip is a extension with 6 outlets.','Non-Consumable'),('KEY-005','2023-06-29','Old','Software Lab 1',6900,12,82800,82,'Cherry MX Brown, Full Size, RGB','Non-Consumable'),('LAP-001','2024-05-29','Borrowed','Software Lab 2',45000,1,45000,72,' 8GB, 1TB HDD','Non-Consumable'),('LAP-002','2023-08-31','Old','Software Lab 2',55000,2,1100000,67,'AMD Ryzen 5, 16GB, 512GB SSD','Non-Consumable'),('LAP-003','2023-06-15','Borrowed','Software Lab 3',45500,1,45500,72,'14 Inch, IPS LCD, 16 Hr Battery Backup.','Non-Consumable'),('MON-001','2023-06-24','Lost','Software Lab 2',12999,5,65000,65,'24-inch Full HD IPS Monitor','Non-Consumable'),('MON-002','2023-08-30','Borrowed','Software Lab 2',29999,2,60000,66,'27-inch QHD Nano IPS Gaming Monitor','Non-Consumable'),('UPS-001','2023-08-11','Old','Software Lab 2',3500,3,10500,70,'The APC Back-UPS BX600C-IN is a compact and reliable UPS unit.','Non-Consumable');
/*!40000 ALTER TABLE `Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OTP`
--

DROP TABLE IF EXISTS `OTP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OTP` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OTP`
--

LOCK TABLES `OTP` WRITE;
/*!40000 ALTER TABLE `OTP` DISABLE KEYS */;
INSERT INTO `OTP` VALUES (1,'jithu1johan@gmail.com','964602','2023-06-11 18:51:36'),(2,'jithu1johan@gmail.com','587901','2023-06-11 18:51:37'),(3,'jithu1johan@gmail.com','065398','2023-06-11 18:51:37'),(4,'jithu1johan@gmail.com','023452','2023-06-11 18:51:37'),(5,'jithu1johan@gmail.com','365855','2023-06-11 18:52:28'),(6,'jithu1johan@gmail.com','754133','2023-06-11 19:03:54'),(7,'jithu1johan@gmail.com','257526','2023-06-11 19:08:53'),(8,'jithu1johan@gmail.com','225062','2023-06-11 19:12:21'),(9,'jithu1johan@gmail.com','978164','2023-06-11 19:20:46'),(10,'jithu1johan@gmail.com','686226','2023-06-11 19:23:08'),(11,'jithu1johan@gmail.com','673381','2023-06-11 19:24:41'),(12,'jithu1johan@gmail.com','992882','2023-06-11 19:26:07'),(13,'jithu1johan@gmail.com','542399','2023-06-11 19:37:25'),(14,'jithu1johan@gmail.com','052287','2023-06-11 19:40:18'),(15,'jithu1johan@gmail.com','104896','2023-06-11 19:52:14'),(16,'jithu1johan@gmail.com','657783','2023-06-11 19:53:05'),(17,'jithu1johan@gmail.com','156290','2023-06-11 19:57:33'),(18,'jithu1johan@gmail.com','184516','2023-06-12 03:41:25'),(19,'jithu1johan@gmail.com','541241','2023-06-12 07:27:07'),(20,'jithu1johan@gmail.com','884529','2023-06-12 07:28:19'),(21,'jithu1johan@gmail.com','979072','2023-06-12 07:32:01'),(22,'jithu1johan@gmail.com','223635','2023-06-12 07:59:40'),(23,'jithu1johan@gmail.com','598761','2023-06-12 07:59:41'),(24,'jithu1johan@gmail.com','844346','2023-06-12 13:42:36'),(25,'jithu1johan@gmail.com','983426','2023-06-12 13:43:47'),(26,'jithu1johan@gmail.com','883282','2023-06-12 13:45:38'),(27,'jithu1johan@gmail.com','254109','2023-06-12 13:46:56'),(28,'jithu1johan@gmail.com','949702','2023-06-12 13:47:57'),(29,'jithu1johan@gmail.com','856597','2023-06-12 13:49:29'),(30,'jithu1johan@gmail.com','981506','2023-06-12 14:13:49'),(31,'Mails4Johan@gmail.com','786696','2023-06-12 14:18:49'),(32,'jithu1johan@gmail.com','010167','2023-06-12 15:04:58'),(33,'jithu1johan@gmail.com','071200','2023-06-12 15:17:48'),(34,'jithu1johan@gmail.com','312913','2023-06-12 15:26:22'),(35,'jithu1johan@gmail.com','068688','2023-06-12 15:28:33'),(36,'jithu1johan@gmail.com','183583','2023-06-12 15:36:30'),(37,'jithu1johan@gmail.com','799663','2023-06-14 01:43:22'),(38,'anakhabose2001@gmail.com','477367','2023-06-14 08:07:05'),(39,'jithu1johan@gmail.com','437805','2023-06-14 08:09:44');
/*!40000 ALTER TABLE `OTP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'Admin'),(2,'User');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Stock`
--

DROP TABLE IF EXISTS `Stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Stock` (
  `indent_no` varchar(255) NOT NULL,
  `sub_indent_no` int DEFAULT NULL,
  `stock_no` int DEFAULT NULL,
  `item_id` varchar(255) NOT NULL,
  `invoice_id` varchar(255) DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `cat_id` int DEFAULT NULL,
  `reference_page` int DEFAULT NULL,
  `stock_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`indent_no`,`item_id`),
  KEY `item_id` (`item_id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `cat_id` (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Stock`
--

LOCK TABLES `Stock` WRITE;
/*!40000 ALTER TABLE `Stock` DISABLE KEYS */;
INSERT INTO `Stock` VALUES ('Lab-Stock-1',12,3,'LAP-001','INV-001',40,67,12,'TEQIP'),('Lab-Stock-1',3,4,'LAP-002','INV-001',37,67,13,'TEQIP'),('Lab-Stock-1',4,5,'MON-001','INV-004',38,65,21,'TEQIP'),('Lab-Stock-1',12,11,'UPS-001','INV-002',37,70,32,'Mainstock'),('Lab-Stock-2',4,4,'AIR-001','INV-002',37,69,54,'Mainstock'),('Lab-Stock-2',2,1,'EXT-003','INV-02',37,71,9,'TEQIP'),('Lab-Stock-2',3,5,'LAP-003','INV-003',37,72,21,'TEQIP'),('Lab-Stock-3',34,23,'AVR-001','INV-8900',37,63,32,'Mainstock'),('Lab-Stock-3',12,5,'KEY-005','INV-005',32,82,12,'TEQIP'),('Lab-Stock-4',12,32,'MON-002','INV-8901',39,66,12,'TEQIP'),('Lab-Stock-5',3,3,'BAT-001','INV-004',28,60,2,'TEQIP');
/*!40000 ALTER TABLE `Stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Supplier`
--

DROP TABLE IF EXISTS `Supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Supplier` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Supplier`
--

LOCK TABLES `Supplier` WRITE;
/*!40000 ALTER TABLE `Supplier` DISABLE KEYS */;
INSERT INTO `Supplier` VALUES (28,'XYZ Corp'),(32,'XYZ Corps'),(37,'Zoltech'),(38,'Cipro'),(39,'Apsara Traders'),(40,'Jerico Co.');
/*!40000 ALTER TABLE `Supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  `phone_number` bigint NOT NULL,
  `profile` blob,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Jithu','Password','Jithu1Johan@gmail.com','Admin',8606578765,NULL,'Jithu Johan'),(2,'Anakha','GECI','anakhabose2001@gmail.com','Lab Manager',9654838493,NULL,'Anakha Bose'),(20,'Jithin','Password','Jithin@gmail.com','Lab Assistant',9832883947,NULL,'Jithin Shaji');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-15 19:33:15
