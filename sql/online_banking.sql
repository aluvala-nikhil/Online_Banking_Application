-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2021 at 08:08 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online banking`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `accountno` int(15) NOT NULL,
  `branch` varchar(10) NOT NULL,
  `category` varchar(10) NOT NULL,
  `balance` int(25) DEFAULT NULL,
  `userid` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `userid` int(10) NOT NULL,
  `name` char(20) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` bigint(30) DEFAULT NULL,
  `emailid` varchar(30) DEFAULT NULL CHECK (`emailid` like '%_@__%.__%'),
  `address` varchar(50) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL CHECK (`dob` like '____-__-__'),
  `securityquestion` varchar(30) DEFAULT NULL,
  `securityanswer` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`userid`, `name`, `username`, `password`, `phone_number`, `emailid`, `address`, `dob`, `securityquestion`, `securityanswer`) VALUES
(4, '', 'Ajay', '$2a$08$nBSc3rH5rmxC8AsEeWe9GOSbuQuhnvtb6oU7auo0Ry3GqgYUrRu2q', 8309124022, 'Venkatajay903@gmail.com', NULL, NULL, NULL, 'kudipudi'),
(5, '', 'AA', '$2a$08$CTnd6lIvASTtQW2kmw3ziu3l4VayfNQ3pfz4EfAbH2mLsNC0J97iq', 8309124022, 'venkatajay@gmail.com', NULL, NULL, NULL, 'AA');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` varchar(15) NOT NULL,
  `query` varchar(50) DEFAULT NULL,
  `accountno` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payees`
--

CREATE TABLE `payees` (
  `userid` int(10) NOT NULL,
  `accountnumber` int(15) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `bankname` varchar(20) DEFAULT NULL,
  `branchname` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `accountno` int(15) NOT NULL,
  `amount` int(6) DEFAULT NULL,
  `startdate` varchar(10) DEFAULT NULL CHECK (`startdate` like '--/--/----'),
  `periodicty` int(3) DEFAULT NULL,
  `no_of_instances` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `queries`
--

CREATE TABLE `queries` (
  `Query_id` varchar(10) NOT NULL,
  `Query` varchar(50) DEFAULT NULL,
  `accountno` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `standing_instruction`
--

CREATE TABLE `standing_instruction` (
  `userid` int(10) NOT NULL,
  `accountnumber` int(15) NOT NULL,
  `accountno` int(15) NOT NULL,
  `startdate` varchar(10) DEFAULT NULL CHECK (`startdate` like '--/--/----'),
  `periodicty` int(3) DEFAULT NULL,
  `no_of_instances` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transid` int(10) NOT NULL,
  `transtype` varchar(10) DEFAULT NULL,
  `amount` int(10) DEFAULT NULL,
  `date` varchar(10) DEFAULT NULL CHECK (`date` like '--/--/----'),
  `description` varchar(50) DEFAULT NULL,
  `payment_type` varchar(10) DEFAULT NULL,
  `accountno` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`accountno`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `payees`
--
ALTER TABLE `payees`
  ADD PRIMARY KEY (`userid`,`accountnumber`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`accountno`);

--
-- Indexes for table `queries`
--
ALTER TABLE `queries`
  ADD PRIMARY KEY (`Query_id`);

--
-- Indexes for table `standing_instruction`
--
ALTER TABLE `standing_instruction`
  ADD PRIMARY KEY (`userid`,`accountnumber`,`accountno`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `userid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transid` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
