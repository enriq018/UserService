USE userService;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  userId int(12)NOT NULL AUTO_INCREMENT,
  hostStatus varchar(20)NOT NULL,
  PRIMARY KEY(userId)
);

DROP TABLE IF EXISTS userInfo;

CREATE TABLE userInfo (
  id int(12) NOT NULL AUTO_INCREMENT,
  userId int(12) NOT NULL,
  firstName varchar(50) NOT NULL,
  lastName varchar(50) NOT NULL,
  gender varchar(50) NOT NULL,
  -- birthDate DATE NOT NULL,
  email varchar(50) NOT NULL,
  phoneNumber varchar(50) NOT NULL,
  preferredLanguage varchar(50) NOT NULL,
  preferredCurrency varchar(50) NOT NULL,
  homeCity varchar(50) NOT NULL,
  photo varchar(50) NOT NULL,

  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS savedLocations;

CREATE TABLE savedLocations (
  id int(12) NOT NULL AUTO_INCREMENT,
  userId int(12) NOT NULL,
  locationId int(15) NOT NULL,
  locationCity varchar(50) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS recentLocations;

CREATE TABLE recentLocations (
  id int(12) NOT NULL AUTO_INCREMENT,
  userId int(12) NOT NULL,
  recent varchar(85) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS userReviews;

CREATE TABLE userReviews (
  id int(12) NOT NULL AUTO_INCREMENT,
  userId int(12) NOT NULL,
  reviewId int(15) NOT NULL,
  PRIMARY KEY (id)
);
