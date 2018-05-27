-- MySQL dump 10.13  Distrib 5.7.22, for Linux (i686)
--
-- Host: 127.0.0.1    Database: Letoh
-- ------------------------------------------------------
-- Server version	5.7.22-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `Letoh`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Letoh` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `Letoh`;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `ref_num` int(10) NOT NULL AUTO_INCREMENT,
  `room_id` int(5) DEFAULT NULL,
  `user_id` int(4) DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`ref_num`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'2028-08-26','2028-08-29',NULL),(2,1,1,'2018-04-22','2018-04-23','Will check out early'),(3,2,4,'2018-04-22','2018-04-23','Will check out early'),(4,3,5,'2018-04-22','2018-04-23','Will check out early'),(5,4,6,'2018-04-22','2018-04-23','Will check out early'),(6,5,7,'2018-04-22','2018-04-23','Will check out early'),(7,6,8,'2018-04-22','2018-04-23','Will check out early'),(8,7,9,'2018-04-22','2018-04-23','Will check out early'),(9,8,10,'2018-04-22','2018-04-23','Will check out early'),(10,2,11,'2018-04-22','2018-04-23','Will check out early');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotels` (
  `hotel_id` int(4) NOT NULL AUTO_INCREMENT,
  `user_id` int(4) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` text,
  `pos_lat` decimal(10,8) DEFAULT NULL,
  `pos_lng` decimal(11,8) DEFAULT NULL,
  `description` text,
  `main_image` int(5) DEFAULT NULL,
  PRIMARY KEY (`hotel_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `hotels_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,2,'Hilton Adelaide','233 Victoria Square, Adelaide SA 5000',-34.92849890,138.60074560,'Overlooking Victoria Square, Hilton Adelaide is set in the heart of the city’s entertainment, shopping and dining precincts. The Central Market, Chinatown and Gouger Street - Adelaide’s most vibrant dining destinations – are also minutes away. Host a business or social event in our flexible meeting spaces. After a busy day unwind in the recreational area featuring a gym and a heated outdoor pool. Retreat to a stylish room with all you need for a relaxing stay.',1),(2,2,'Mantra Hindmarsh Square','55-67 Hindmarsh Square, Adelaide SA 5000',-34.92659880,138.58615290,'Whether you\'re in town for the Adelaide Festival or V8 Supercars, a footy trip, romantic escape or a foodie tour with friends, Mantra Hindmarsh Square is the top pick in Adelaide accommodation. We offer all the creature comforts you need for an affordable, relaxing holiday including Foxtel, high speed internet access, air conditioning and your own kitchen facilities. We\'re also home to one of Adelaide\'s favourite restaurants where you can enjoy coffee in the morning sun, a light lunch, cocktail or dinner. Take a short stroll to Rundle Mall; the heart of shopping in Adelaide with more than 600 retail stores, three department stories and 15 arcades. Cross the road and you\'re in Rundle Street, home to fabulous alfresco cafes, award-winning restaurants, iconic pubs and cutting-edge fashions. Other star attractions within walking distance include Adelaide Festival Centre, Adelaide Oval, Art Gallery of South Australia and Sky City Casino. Hop on the city loop bus and jump off at Adelaide\'s colorful central market for South Australia\'s best local produce. If you\'re traveling with kids, there\'s plenty to see and do without leaving the CBD. Take a cruise on the River Torrens, visit Adelaide Zoo or enjoy a picnic in the Botanic Gardens.',2),(3,2,'Ibis Adelaide','122 Grenfell St, Adelaide SA 5000',-34.93504300,138.69583710,'Vibrant. Affordable. Hi-Tech. A fresh, new destination among CBD hotels, ibis Adelaide is the best value in the heart of the city. Boasting 311 modern guest room accommodation outfitted with the latest technology, fast, free Wi-Fi (when booking direct) and views of Adelaide Hills, we’re the perfect hotel for the budget minded business or leisure traveller.',3),(4,3,'Paradise Interchange Hotel','700 Lower North East Rd, Paradise SA 5075',-34.86850460,138.65970320,'Paradise Interchange Hotel is home to some very eclectic furnishings and even more eclectic employees. Visiters are first greeted by the unmistakable musk that still remains undescribable to this day. Immediate departure is facilitated by the 24/7 bus timetable.',4),(5,3,'Letoh Hotel','TEMP ADDRESS',-34.93504300,138.68083710,'The Letoh Hotel is home to many rooms, but there is always more room for you to make your home in our rooms. ',5),(6,2,'Specials hotel','Flinders Street, Adelaide SA, Australia',-37.81812570,144.96494940,'This hotel only appears when the database is implemented',53),(9,2,'Untitled Hotel','Hotel Address Goes Here',0.00000000,0.00000000,'Your Description Here',NULL),(10,2,'Untitled Hotel','Hotel Address Goes Here',0.00000000,0.00000000,'Your Description Here',NULL),(11,2,'Untitled Hotel','Hotel Address Goes Here',0.00000000,0.00000000,'Your Description Here',NULL),(12,3,'Manager Made This','89 Thistlethwaite St',-37.83238650,144.95077520,'Manager Descriptiony Thing',43);
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `image_id` int(5) NOT NULL AUTO_INCREMENT,
  `hotel_id` int(4) DEFAULT NULL,
  `room_id` int(5) DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `hotel_id` (`hotel_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`),
  CONSTRAINT `images_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,1,NULL),(3,2,NULL),(4,2,NULL),(5,2,NULL),(6,2,NULL),(7,2,NULL),(8,2,NULL),(9,2,NULL),(10,4,1),(11,4,1),(12,4,1),(13,4,1),(14,2,NULL),(15,4,1),(16,4,1),(17,4,1),(18,4,1),(19,4,1),(20,4,1),(21,4,1),(22,4,1),(23,4,1),(24,4,1),(25,4,1),(26,4,1),(27,4,1),(28,4,1),(29,4,1),(30,10,NULL),(31,4,NULL),(32,6,NULL),(33,6,NULL),(34,6,NULL),(35,6,NULL),(36,6,NULL),(37,6,NULL),(38,6,NULL),(39,6,NULL),(40,6,NULL),(41,6,NULL),(42,6,NULL),(43,12,NULL),(44,9,NULL),(45,9,NULL),(46,9,NULL),(47,9,NULL),(48,9,NULL),(49,9,NULL),(50,6,NULL),(51,6,NULL),(52,6,NULL),(53,6,NULL);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `room_id` int(5) DEFAULT NULL,
  `ref_num` int(10) DEFAULT NULL,
  `user_id` int(4) DEFAULT NULL,
  `stars` int(1) DEFAULT NULL,
  `review` text,
  KEY `ref_num` (`ref_num`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`ref_num`) REFERENCES `bookings` (`ref_num`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,1,'I found it quite quaint.'),(2,3,4,5,'The only thing I can say is INCREDIBLE! Just incredible. I don\'t know how they got the pool there but it was amazing. 5/5 stars.'),(3,4,5,3,'Having never been in a room before, it was alright.'),(4,5,6,1,'Although it seems fine, this room is not fine, I\'d get into the details but I don\'t want to bore you with the details. 1 star.'),(5,6,7,4,'If I had known it\'d be this good, I never would\'ve used a fake credit card!'),(6,7,8,2,'Poor room service. Bad food. Bad rececption. I can\'t believe it\'s not better.'),(7,8,9,4,'I mean I\'ve seen better, but for its price, I\'d be lying if I told you it was a bad stay.'),(8,9,10,1,'Small Room? SMALL. ROOM? Who came up with this!? They weren\'t lying, I\'ll give them that. I was intrigued I must admit, I\'d never heard of a \'Small Room\' before. Then I checked the price, $9! It was such a low price that I couldn\'t help but plan my honeymoon immediately at this hotel. Little did I know that that it was only for 1 person (that\'s my bad, I should have checked), but the room is Tiny! They should\'ve said something about the fact that the toilet IS the only available seating. Unbelievable. Un. Believable.'),(2,10,11,1,'I found it quite quaint.');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `room_id` int(5) NOT NULL AUTO_INCREMENT,
  `hotel_id` int(4) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `occupants` int(1) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`room_id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,'Standard Guest Room',160,1,'Enjoy your stay in this room with a view. Opening windows, comfortable Hilton Serenity bed, work station with WiFi (fees apply), mini bar, 24-hour room service and on-demand movies. Access to the 24-hour gym, swimming pool and full size tennis court with jogging track is included.'),(2,1,'Deluxe Room',220,2,'This bright and airy room features modern décor with all the 5-star amenities. Work is a pleasure at the work station with an ergonomic chair, WiFi (fees apply) and an opening window with views of city and hills. Enjoy an in-room movie on the lounge chair or unwind in the modern bathroom with separate walk-in shower, before retreating to the comfort of the Hilton Serenity bed.'),(3,1,'Suite',360,3,'Spacious, executive benefits, complimentary breakfast, work station. Treat yourself whether travelling for business or leisure in this comfortable, light, airy and spacious suite. The suite is complete with all the thoughtful amenities plus a spacious bathroom, walk in robe, large work station, WiFi (fee applies), lounge/dining area, 24-hour room service and a king size Hilton Serenity bed to ensure a restful night’s sleep. Enjoy access to the Executive Lounge, including complimentary continental breakfast, all day refreshments and evening drinks and canapes.'),(4,2,'Standard Guest Room',1200,4,'Enjoy your stay in this room with a view. Opening windows, comfortable Hilton Serenity bed, work station with WiFi (fees apply), mini bar, 24-hour room service and on-demand movies. Access to the 24-hour gym, swimming pool and full size tennis court with jogging track is included.'),(5,2,'Deluxe Room',2200,1,'This bright and airy room features modern décor with all the 5-star amenities. Work is a pleasure at the work station with an ergonomic chair, WiFi (fees apply) and an opening window with views of city and hills. Enjoy an in-room movie on the lounge chair or unwind in the modern bathroom with separate walk-in shower, before retreating to the comfort of the Hilton Serenity bed.'),(6,3,'Suite',420,2,'Spacious, executive benefits, complimentary breakfast, work station. Treat yourself whether travelling for business or leisure in this comfortable, light, airy and spacious suite. The suite is complete with all the thoughtful amenities plus a spacious bathroom, walk in robe, large work station, WiFi (fee applies), lounge/dining area, 24-hour room service and a king size Hilton Serenity bed to ensure a restful night’s sleep. Enjoy access to the Executive Lounge, including complimentary continental breakfast, all day refreshments and evening drinks and canapes.'),(7,4,'Suite',20,3,'Have you ever wanted to treat yourself to a holiday, free from all of life\'s stresses. No people, no bad food, no bad smells. Well, here at Paraidse Interchange Hotel, our suites will provide you with an unforgettable experience, that should rejuvinate your every day life.'),(8,5,'Small Room',9,1,'While there may be some issues with this room, it\'s still presentable in our eyes. From the people that brought you the Letoh website, comes the latest venture in Letoh\'s business plan. Small Rooms. You\'ve heard of Suites, or Deluxe Rooms, but have you ever heard of a Small Room? Didn\'t think so.  ');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(4) NOT NULL AUTO_INCREMENT,
  `email` varchar(80) DEFAULT NULL,
  `name_first` varchar(20) DEFAULT NULL,
  `name_last` varchar(20) DEFAULT NULL,
  `address` text,
  `account_type` char(1) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `user_password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','Test','test','6 St Gelnunga, Adelaide','U','18004321','password'),(2,'admin','Admin','Manager','6 St Gelnunga, Adelaide','M','18004321','admin'),(3,'manager','Admin','manager','6 St Gelnunga, Adelaide','M','18004321','manager'),(4,'jimmy@gfail.com','Jimmy','Altex','6 St Gelnunga, Adelaide','U','18004321','password'),(5,'jackie@gfail.com','Jackie','Gifrun','6 St Gelnunga, Adelaide','U','18004321','password'),(6,'johnny@gfail.com','Johnny','Taste','6 St Gelnunga, Adelaide','U','18004321','password'),(7,'jelly@gfail.com','Jelly','Populit','6 St Gelnunga, Adelaide','U','18004321','password'),(8,'tirath@gfail.com','Tirath','Bigg','6 St Gelnunga, Adelaide','U','18004321','password'),(9,'jeffery@gfail.com','Jeffery','Vent','6 St Gelnunga, Adelaide','U','18004321','password'),(10,'jacob@gfail.com','Jacob','Uls','6 St Gelnunga, Adelaide','U','18004321','password'),(11,'teremy@gfail.com','Teremy','Adde','6 St Gelnunga, Adelaide','U','18004321','password'),(12,'tammy@dmail.com','Tammy','Little','this is an address','U','0487646987','something2'),(13,'inserted1@gmail.com','asdf','asdf','undefined','M','undefined','something5'),(14,'inserted12@gmail.com','asdf','asdf','undefined','M','undefined','something5'),(15,'jsmithy@gmail.com','Johnny','Smithson','undefined','M','undefined','something4'),(16,'tsmithy@gmail.com','Tammy','Smithson','undefined','U','undefined','password1'),(17,'tsmi2thy@gmail.com','Tammy','Smithson','undefined','U','undefined','password1'),(18,'tsmi23thy@gmail.com','Tammy','Smithson','undefined','U','undefined','password1'),(19,'tsmi123thy@gmail.com','Tammy','Smithson','undefined','U','undefined','asdfasafd2'),(21,'davidhin1b@gmail.com','David','undefined','undefined','U','undefined','y4w33vdS'),(26,'hello@davidhin.com','David','Hin','undefined','U','undefined','SDozRAiy'),(27,'davidhin1a@gmail.com','David','Hin','undefined','U','undefined','VFtUQ4Az');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-27 13:17:56
