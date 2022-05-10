-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2022 at 12:22 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` varchar(20) NOT NULL,
  `users` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`users`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `users`) VALUES
('SPvCGe7wU', '[\"admin\", \"jjj\"]');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` varchar(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `file` longtext DEFAULT NULL,
  `text` longtext DEFAULT NULL,
  `data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `type`, `name`, `file`, `text`, `data`) VALUES
('4pEvci-2sx', 'text', 'undefined', '', 'a', 'undefined'),
('C_7Pc3oKf', 'text', 'undefined', '', 'a', 'undefined'),
('GCF9pdVHt', 'text', 'undefined', '', 'hi', 'undefined'),
('itg7elinG', 'text', 'undefined', '', 'z', 'undefined'),
('QXeQyu5TP', 'text', 'undefined', '', 'hey', 'undefined'),
('WdxvsXio2', 'text', 'undefined', '', 'a', 'undefined'),
('xeQKOcEPE', 'text', 'undefined', '', 'Database', 'undefined'),
('Ze99QNrhp', 'text', 'undefined', '', 'yassssssssssssssssssssssssssss', 'undefined');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(20) NOT NULL,
  `conversationId` varchar(20) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `message` varchar(20) NOT NULL,
  `time` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `conversationId`, `sender`, `receiver`, `message`, `time`) VALUES
('4pEvci-2sx', 'SPvCGe7wU', 'admin', 'jjj', '4pEvci-2sx', '5:53:24 PM'),
('C_7Pc3oKf', 'SPvCGe7wU', 'admin', 'jjj', 'C_7Pc3oKf', '5:53:35 PM'),
('GCF9pdVHt', 'SPvCGe7wU', 'jjj', 'admin', 'GCF9pdVHt', '5:53:10 PM'),
('itg7elinG', 'SPvCGe7wU', 'admin', 'jjj', 'itg7elinG', '5:53:35 PM'),
('QXeQyu5TP', 'SPvCGe7wU', 'admin', 'jjj', 'QXeQyu5TP', '5:53:06 PM'),
('WdxvsXio2', 'SPvCGe7wU', 'admin', 'jjj', 'WdxvsXio2', '5:53:24 PM'),
('xeQKOcEPE', 'SPvCGe7wU', 'jjj', 'admin', 'xeQKOcEPE', '5:54:45 PM'),
('Ze99QNrhp', 'SPvCGe7wU', 'admin', 'jjj', 'Ze99QNrhp', '5:54:53 PM');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userName`) VALUES
(1, 'pryceja'),
(2, 'pryce');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
