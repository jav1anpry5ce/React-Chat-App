-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2022 at 12:22 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

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
  `id` varchar(50) NOT NULL,
  `users` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`users`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `users`) VALUES
('2SPaKNKRq', '[\"pryceja\", \"undefined\"]'),
('5CmKMwoqQ', '[\"admin\", \"pryceja\"]'),
('agvdJtiK5', '[\"javan\", \"admin\"]'),
('aTlN1BCOj', '[\"localhost\", \"admin\"]'),
('EsUokMBLy', '[\"pryceja\", \"javan\"]'),
('hwh8ON0GL', '[\"javan\", \"undefined\"]'),
('iXtu7O8EL', '[\"localhost\", \"javan\"]'),
('qz-HaCGO_', '[\"pryceja\", \"michaela\"]'),
('yYsqyj9Lu', '[\"localhost\", \"pryceja\"]');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `file` longtext DEFAULT NULL,
  `text` longtext DEFAULT NULL,
  `data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `type`, `name`, `file`, `text`, `data`) VALUES
('0-5WxOVyp', 'text', NULL, NULL, 'yass', NULL),
('0AX5a9FHB', 'text', NULL, NULL, 'hello', NULL),
('0eSZ2IlA1', 'text', NULL, NULL, 'hi', NULL),
('0xHgfeno3', 'text', NULL, NULL, 'hi', NULL),
('0XkNWeItT', 'text', NULL, NULL, 'HELLO', NULL),
('0Xu57D4fy', 'text', NULL, NULL, 'hey', NULL),
('1vC1_xwSf', 'text', NULL, NULL, 'hi', NULL),
('2MSP9XiXD', 'text', NULL, NULL, 'hey', NULL),
('3CibYqFb5', 'text', NULL, NULL, 'hi', NULL),
('3r-3SUSiU', 'text', NULL, NULL, 'hello', NULL),
('3tRfdByxO', 'text', NULL, NULL, 'hey', NULL),
('4LIki6PnO', 'text', NULL, NULL, 'no', NULL),
('4v2LODVXL', 'text', NULL, NULL, 'hi', NULL),
('5xEJsYoOG', 'text', NULL, NULL, 'hey', NULL),
('5XStwiF-B', 'text', NULL, NULL, 'ok', NULL),
('6LffQhuJj', 'text', NULL, NULL, 'wow', NULL),
('6rT_lyVxi', 'video', 'out.mp4', 'http://localhost:5000/1652283003074-out.mp4', 'HEY HEY HEY', NULL),
('6WFioLl5r', 'text', NULL, NULL, 'hey', NULL),
('7dz30N828', 'text', NULL, NULL, 'hi', NULL),
('7q3OEnTz2', 'text', NULL, NULL, 'ok', NULL),
('84yfokrIr', 'text', NULL, NULL, 'hi', NULL),
('8CID3gaoa', 'text', NULL, NULL, 'hey', NULL),
('9CgEkCkcZ', 'text', NULL, NULL, 'hi', NULL),
('9ExB6v1-Z', 'text', NULL, NULL, 'yaaaaaaa', NULL),
('9o2963tnU', 'text', NULL, NULL, 'dafkjbdskj', NULL),
('a5a0xS0K8', 'text', NULL, NULL, 'hola', NULL),
('AbkoOpAua', 'text', NULL, NULL, 'hello', NULL),
('ae1hDEw1W', 'text', NULL, NULL, 'a', NULL),
('aEhMA5WAP', 'text', NULL, NULL, 'oh', NULL),
('AHuxhD18V', 'text', NULL, NULL, '😶‍🌫️', NULL),
('anRAnq-n7', 'text', NULL, NULL, 'hi', NULL),
('as9llHzn1', 'text', NULL, NULL, 'HI', NULL),
('AVApUojY2', 'text', NULL, NULL, 'hi', NULL),
('awxxqNbPk', 'text', NULL, NULL, 'hey', NULL),
('axDDU9f6j', 'text', NULL, NULL, 'NASSSSSSSSSS!!!!!!!!!!!!!!!!!!!!!!!!!', NULL),
('bb-_n7N0R', 'text', NULL, NULL, 'x2', NULL),
('BDJg5UfJ6', 'text', NULL, NULL, 'hey', NULL),
('bf1T3Au21', 'text', NULL, NULL, 'noooo', NULL),
('BFQ4fMvZC', 'text', NULL, NULL, 'HOLA', NULL),
('BHI9AmE0q', 'text', NULL, NULL, 'hi', NULL),
('bk9WljqTH', 'text', NULL, NULL, 'yassss', NULL),
('bs-ltGwPz', 'text', NULL, NULL, 'YASSSS!!!', NULL),
('bTEso5gJs', 'text', NULL, NULL, '\"HEY\"', NULL),
('BvQSoX3-F', 'text', NULL, NULL, 'HIII', NULL),
('bwzuORr6m', 'text', NULL, NULL, 'a', NULL),
('cDbht-ffA', 'text', NULL, NULL, 'hey', NULL),
('cDVTnJP2M', 'text', NULL, NULL, 'Im ok...', NULL),
('CF-5Aflgr', 'text', NULL, NULL, 'What\'s up????', NULL),
('CfMATCIrY', 'text', NULL, NULL, 'annoying', NULL),
('cLw0iQF4b', 'text', NULL, NULL, 'hey', NULL),
('cSm4oGu7j', 'text', NULL, NULL, 'hi', NULL),
('CwI0vdeyc', 'text', NULL, NULL, 'hi', NULL),
('CxST-pcuf', 'text', NULL, NULL, 'Hey', NULL),
('cZqblhprB', 'text', NULL, NULL, 'hey', NULL),
('czqQVRgN_', 'text', NULL, NULL, '\"HEY\"', NULL),
('D8zD7iIbI', 'text', NULL, NULL, 'hello', NULL),
('Dc746C_jY', 'text', NULL, NULL, 'hello', NULL),
('dCdyxIj8K', 'text', NULL, NULL, 'yass', NULL),
('Dka1Oiqvn', 'text', NULL, NULL, 'aa', NULL),
('dnzA3FfS4', 'text', NULL, NULL, 'ntn much you?', NULL),
('duxSd2O7r', 'text', NULL, NULL, 'hey', NULL),
('e6oquaoMA', 'text', NULL, NULL, 'hwy', NULL),
('EFvl6Yp-g', 'text', NULL, NULL, 'ok', NULL),
('eGsfOODxO', 'text', NULL, NULL, 'up', NULL),
('eGzti23dd', 'text', NULL, NULL, 'ok', NULL),
('eNK6BCz6G', 'text', NULL, NULL, 'hey', NULL),
('eNwUJK23U', 'text', NULL, NULL, 'hey', NULL),
('Eog1l0sf-', 'text', NULL, NULL, 'hi', NULL),
('EoNd_MMnf', 'text', NULL, NULL, 'hello', NULL),
('EPjp2VlmQ', 'text', NULL, NULL, 'ntn much you??', NULL),
('ETE-T6HXM', 'audio', NULL, NULL, NULL, 'http://localhost:5000/1652282350184.wav'),
('EvX1pz4jl', 'text', NULL, NULL, 'aa', NULL),
('EWzHJGATU', 'text', NULL, NULL, 'hi', NULL),
('exMMHBHH_', 'text', NULL, NULL, 'ntn much you??', NULL),
('FbOArBXMe', 'text', NULL, NULL, 'hey', NULL),
('fCumJcu6s', 'text', NULL, NULL, 'I know', NULL),
('FfwWkmL7L', 'text', NULL, NULL, 'a', NULL),
('FfZEBApXH', 'text', NULL, NULL, 'HEY', NULL),
('FGp3OJDzt', 'text', NULL, NULL, 'hi', NULL),
('FIktUrbSE', 'text', NULL, NULL, 'heyyyyyyyyyy', NULL),
('fKEGh5wGU', 'text', NULL, NULL, 'uppp', NULL),
('FMV-2pvHM', 'text', NULL, NULL, 'HEY YA!', NULL),
('FTd0J4zsI', 'text', NULL, NULL, 'a', NULL),
('g0dwtTv8X', 'text', NULL, NULL, 'Hey', NULL),
('GApmKT3Mp', 'text', NULL, NULL, 'hi', NULL),
('gDhRDHbb8', 'text', NULL, NULL, 'whatttttttttt', NULL),
('gK0PTPIWK', 'text', NULL, NULL, 'it does', NULL),
('GONpmKoha', 'text', NULL, NULL, 'hello', NULL),
('GsJ4v8tHz', 'text', NULL, NULL, 'hi', NULL),
('Gx6RC_oHQ', 'text', NULL, NULL, 'HI', NULL),
('gXsEL0vdb', 'text', NULL, NULL, 'HI', NULL),
('H-N9r0m2N', 'text', NULL, NULL, 'yes', NULL),
('H6a3gp-A6', 'text', NULL, NULL, 'hi', NULL),
('hbv4FEDVz', 'text', NULL, NULL, 'Hi', NULL),
('HfW-2yR-m', 'text', NULL, NULL, 'hi', NULL),
('HHMsJWXbP', 'text', NULL, NULL, 'HELLO', NULL),
('HOry7FO9V', 'text', NULL, NULL, 'yes', NULL),
('hv2EVLEts', 'text', NULL, NULL, '🥱', NULL),
('hWkvcUS0N', 'text', NULL, NULL, 'Its crazy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', NULL),
('I0J8d7dj4', 'text', NULL, NULL, 'hi', NULL),
('IBS0D4OKy', 'text', NULL, NULL, 'wow', NULL),
('IiQ1TlC35', 'text', NULL, NULL, 'hi', NULL),
('IJniAgtKZ', 'text', NULL, NULL, 'hi', NULL),
('iLFJ2F0fM', 'text', NULL, NULL, 'no', NULL),
('ILXMtIpA6', 'text', NULL, NULL, '👀', NULL),
('iN5R1qH6x', 'text', NULL, NULL, 'HEY', NULL),
('incJl4Fls', 'text', NULL, NULL, 'what\'s ip>', NULL),
('iom75nUe4', 'text', NULL, NULL, 'What\'s up?', NULL),
('IZmoBxwx9', 'text', NULL, NULL, 'ok', NULL),
('JgTHmVKQm', 'text', NULL, NULL, 'nah', NULL),
('jmPm0YTn9', 'text', NULL, NULL, 'HI', NULL),
('jMtjIwH88', 'text', NULL, NULL, 'hey', NULL),
('JRsrRV2Ec', 'text', NULL, NULL, 'a', NULL),
('JSg8n-CTF', 'text', NULL, NULL, 'hey', NULL),
('JTPzTZ7u6', 'text', NULL, NULL, 'hello', NULL),
('JTRyx3NES', 'text', NULL, NULL, 'oh', NULL),
('JuEdqCmRd', 'text', NULL, NULL, 'hey', NULL),
('jWHS-WDiP', 'text', NULL, NULL, 'yep', NULL),
('K0CeriNvP', 'text', NULL, NULL, 'you too nuff', NULL),
('k2LN9iaAK', 'text', NULL, NULL, 'a', NULL),
('k4CacfCyV', 'text', NULL, NULL, 'hi', NULL),
('KiPwxwoYy', 'text', NULL, NULL, 'hi', NULL),
('KMOsAOyDK', 'text', NULL, NULL, 'hey', NULL),
('krnwIUAfJ', 'text', NULL, NULL, 'hey', NULL),
('L0PiJSND6', 'text', NULL, NULL, 'hey', NULL),
('LBBKq4vaV', 'text', NULL, NULL, 'HEY YALL', NULL),
('LDLKrqEHE', 'text', NULL, NULL, 'hi', NULL),
('lhs2NTFf1', 'text', NULL, NULL, 'IT IS', NULL),
('lm5OaAR6T', 'text', NULL, NULL, 'HI', NULL),
('lNz4OFQxc', 'text', NULL, NULL, 'a', NULL),
('lSP_x2ULp', 'text', NULL, NULL, 'hey', NULL),
('lX331p7Lu', 'text', NULL, NULL, 'up?', NULL),
('m-0-dZYyc', 'text', NULL, NULL, 'hi', NULL),
('m11jf5yDP', 'text', NULL, NULL, 'so what;s up?', NULL),
('MEN5x3yfb', 'text', NULL, NULL, 'yes', NULL),
('MQuUT1ECh', 'image', '624111.jpg', 'http://192.168.1.122:5000/1652630137668-624111.jpg', '', NULL),
('mVcVwBlMF', 'text', NULL, NULL, 'a', NULL),
('MxR7efyDJ', 'text', NULL, NULL, 'hey', NULL),
('MZGaclZrP', 'text', NULL, NULL, 'hi', NULL),
('n17JwNGHs', 'text', NULL, NULL, 'hi', NULL),
('NgSa1W_uV', 'text', NULL, NULL, 'hi', NULL),
('nXxNdiDOy', 'text', NULL, NULL, 'LOL!!!!', NULL),
('Nz9ECOhib', 'text', NULL, NULL, '😨💀', NULL),
('NZSk9XM_q', 'image', 'passport_size.jpg', 'http://localhost:5000/1652219221953-passport_size.jpg', '', NULL),
('O9zQep6oa', 'text', NULL, NULL, 'u there?', NULL),
('OB0UVF6hT', 'text', NULL, NULL, 'HELLO', NULL),
('ODhl-b9Rf', 'text', NULL, NULL, '\"HEY\"', NULL),
('OH5UkCiEs', 'video', 'pryce.javaughn.HCI.mp4', 'http://localhost:5000/1652219407539-pryce.javaughn.HCI.mp4', 'Watch this', NULL),
('oJzvw6_hh', 'text', NULL, NULL, 'cool', NULL),
('opqG4SYPi', 'text', NULL, NULL, 'hey', NULL),
('oV4yyfo3d', 'text', NULL, NULL, 'hi', NULL),
('OwkoZ568G', 'text', NULL, NULL, 'hello', NULL),
('P39bUu3VC', 'text', NULL, NULL, 'hola', NULL),
('pAmQnZvOW', 'text', NULL, NULL, 'hello?', NULL),
('pC2GiuRUr', 'text', NULL, NULL, 'hello', NULL),
('PUQgc3tGm', 'text', NULL, NULL, 'hi', NULL),
('PUzngDOeF', 'text', NULL, NULL, 'hi', NULL),
('PXI5jp4pb', 'video', '2021-10-13 16-22-18.mkv', 'http://localhost:5000/1652219299180-2021-10-13 16-22-18.mkv', '', NULL),
('qA1bk-3Xm', 'text', NULL, NULL, 'hi', NULL),
('qjAH5WOf94', 'text', NULL, NULL, '😨', NULL),
('qOoQqgasS', 'text', NULL, NULL, 'NTN MUCH YOU!!!!!!!!!!!', NULL),
('qT2FiyNbJ', 'text', NULL, NULL, 'hola', NULL),
('RAUrh1iZv', 'text', NULL, NULL, 'hola', NULL),
('rE-yDTwy4', 'text', NULL, NULL, 'het454', NULL),
('rlCrrG-bF', 'text', NULL, NULL, 'hey', NULL),
('rrBrhszeB', 'text', NULL, NULL, 'ok', NULL),
('RxoyKXneK', 'text', NULL, NULL, 'yesssssssssssssss', NULL),
('R_Wf8x0Lq', 'text', NULL, NULL, 'Hey', NULL),
('sawMWF8Dl', 'text', NULL, NULL, 'u there', NULL),
('soyPibGuH', 'text', NULL, NULL, 'yep', NULL),
('spyv5dqTn', 'text', NULL, NULL, 'yes', NULL),
('svZdfviC-', 'text', NULL, NULL, 'What\'s up?', NULL),
('SV_smuj3-', 'text', NULL, NULL, 'hi', NULL),
('sWpx5oAKT', 'text', NULL, NULL, 'Hey', NULL),
('SWqkIyxPv', 'text', NULL, NULL, 'hola', NULL),
('t4m6UyV34', 'text', NULL, NULL, 'hola', NULL),
('T7rrDJKP-', 'text', NULL, NULL, 'hey', NULL),
('TMYsXaHf_', 'text', NULL, NULL, 'hello', NULL),
('tTzFK98WU', 'text', NULL, NULL, '...', NULL),
('u356GhehX', 'text', NULL, NULL, 'll', NULL),
('UCOECYOOD', 'text', NULL, NULL, 'what\'s up??', NULL),
('uFSD7FzPa', 'text', NULL, NULL, 'hello', NULL),
('uj5xjZIlO', 'text', NULL, NULL, 'ya', NULL),
('uQB4OtevR', 'text', NULL, NULL, 'ya', NULL),
('uWn2It9hF', 'text', NULL, NULL, 'hey', NULL),
('uwzwdltAO', 'text', NULL, NULL, 'hola', NULL),
('V0XeHucQ3', 'text', NULL, NULL, 'a', NULL),
('ve0nhudF3', 'audio', NULL, NULL, NULL, 'http://192.168.1.122:5000/1652631114448.wav'),
('VfgqsK6OM', 'text', NULL, NULL, 'hi', NULL),
('VixoOsZ-I', 'text', NULL, NULL, 'hey', NULL),
('VNOthuF_v', 'text', NULL, NULL, 'hello', NULL),
('vRL04cRot', 'text', NULL, NULL, 'hi', NULL),
('vS-zrbaMp', 'text', NULL, NULL, 'hola', NULL),
('vtfNI9lri', 'text', NULL, NULL, 'hi', NULL),
('w-Jw7TSpa', 'text', NULL, NULL, 'hey', NULL),
('w-WYhAfyw', 'text', NULL, NULL, 'hi', NULL),
('W0bYRCoxU', 'text', NULL, NULL, 'What\'s up?', NULL),
('W73mhzrb0', 'text', NULL, NULL, 'it', NULL),
('wAI_LuY8N', 'text', NULL, NULL, 'Hello', NULL),
('wAVAmDOj_', 'text', NULL, NULL, 'up?', NULL),
('wG321KGbW', 'text', NULL, NULL, 'hi', NULL),
('WpIDTw2bX', 'text', NULL, NULL, 'hi', NULL),
('WPUMWlYZU', 'text', NULL, NULL, 'yes', NULL),
('wq1OoC4LY', 'text', NULL, NULL, 'h', NULL),
('WT0SG-5sh', 'text', NULL, NULL, 'yes', NULL),
('WvkMNFC1g', 'text', NULL, NULL, 'hi', NULL),
('XH2cutC-G', 'text', NULL, NULL, 'hi', NULL),
('XM0Vh4Tcc', 'text', NULL, NULL, 'hey', NULL),
('Xol1iodQu', 'text', NULL, NULL, '👀', NULL),
('XQXlZRKTt', 'text', NULL, NULL, 'Hey', NULL),
('xszHAxLlt', 'text', NULL, NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', NULL),
('xw72DGdOs', 'text', NULL, NULL, '\"HEY\"', NULL),
('XweSUw0mI', 'text', NULL, NULL, 'ok', NULL),
('YA54jryrU', 'text', NULL, NULL, 'hello', NULL),
('YbHWOGhF7', 'text', NULL, NULL, 'yes', NULL),
('YEHj9UcR6', 'text', NULL, NULL, 'aa', NULL),
('yEoiIZ59w', 'text', NULL, NULL, 'hey', NULL),
('YL8EwMhg9', 'text', NULL, NULL, 'hey', NULL),
('yLiW-Ch0N', 'text', NULL, NULL, 'wow', NULL),
('yqEDS4ghi', 'text', NULL, NULL, 'ok', NULL),
('Yrm6TMqtI', 'text', NULL, NULL, 'hey', NULL),
('YwD-hgkUK', 'text', NULL, NULL, 'hi', NULL),
('YxxpOTiyY', 'text', NULL, NULL, 'hi', NULL),
('z5pxwNb07', 'text', NULL, NULL, 'hi', NULL),
('zaDF9lYtH', 'text', NULL, NULL, 'boo you suck', NULL),
('ZbrQU9jJA', 'text', NULL, NULL, 'ok', NULL),
('zpBWDtv14', 'text', NULL, NULL, 'it works', NULL),
('ZwdnrEYNe', 'text', NULL, NULL, 'hi', NULL),
('_3IJ-Sqza', 'text', NULL, NULL, 'hey', NULL),
('_7uVfmH53', 'text', NULL, NULL, 'wow', NULL),
('_8XZG5mDQ', 'text', NULL, NULL, 'hello', NULL),
('_aF93fpIT', 'text', NULL, NULL, 'wow', NULL),
('_chaiNjH2', 'text', NULL, NULL, 'yasssssssssssssssssssssss', NULL),
('_Lt_G5fBY', 'text', NULL, NULL, 'hi', NULL),
('_zQnZtDgv', 'image', '2018-01-21 (1).png', 'http://localhost:5000/1652630027672-2018-01-21 (1).png', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(50) NOT NULL,
  `conversationId` varchar(50) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `message` varchar(50) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `conversationId`, `sender`, `receiver`, `message`, `time`) VALUES
('0-5WxOVyp', '5CmKMwoqQ', 'pryceja', 'admin', '0-5WxOVyp', '2022-05-10 22:39:58'),
('0AX5a9FHB', '5CmKMwoqQ', 'pryceja', 'admin', '0AX5a9FHB', '2022-05-10 22:23:48'),
('0eSZ2IlA1', 'EsUokMBLy', 'javan', 'pryceja', '0eSZ2IlA1', '2022-05-12 00:38:30'),
('0xHgfeno3', 'EsUokMBLy', 'javan', 'pryceja', '0xHgfeno3', '2022-05-11 14:32:37'),
('0XkNWeItT', 'yYsqyj9Lu', 'pryceja', 'localhost', '0XkNWeItT', '2022-05-10 23:04:50'),
('0Xu57D4fy', 'EsUokMBLy', 'javan', 'pryceja', '0Xu57D4fy', '2022-05-11 14:35:19'),
('1vC1_xwSf', 'EsUokMBLy', 'pryceja', 'javan', '1vC1_xwSf', '2022-05-11 14:37:35'),
('2MSP9XiXD', 'EsUokMBLy', 'javan', 'pryceja', '2MSP9XiXD', '2022-05-11 23:39:09'),
('3CibYqFb5', '5CmKMwoqQ', 'pryceja', 'admin', '3CibYqFb5', '2022-05-10 22:38:30'),
('3r-3SUSiU', 'EsUokMBLy', 'pryceja', 'javan', '3r-3SUSiU', '2022-05-11 14:33:43'),
('3tRfdByxO', 'EsUokMBLy', 'javan', 'pryceja', '3tRfdByxO', '2022-05-11 14:22:35'),
('4LIki6PnO', '5CmKMwoqQ', 'admin', 'pryceja', '4LIki6PnO', '2022-05-10 23:00:20'),
('4v2LODVXL', 'EsUokMBLy', 'javan', 'pryceja', '4v2LODVXL', '2022-05-11 14:24:01'),
('5xEJsYoOG', 'iXtu7O8EL', 'javan', 'localhost', '5xEJsYoOG', '2022-05-11 15:09:14'),
('5XStwiF-B', 'EsUokMBLy', 'pryceja', 'javan', '5XStwiF-B', '2022-05-11 19:25:34'),
('6LffQhuJj', 'qz-HaCGO_', 'pryceja', 'michaela', '6LffQhuJj', '2022-05-15 15:42:57'),
('6rT_lyVxi', 'EsUokMBLy', 'javan', 'pryceja', '6rT_lyVxi', '2022-05-11 15:30:03'),
('6WFioLl5r', 'EsUokMBLy', 'javan', 'pryceja', '6WFioLl5r', '2022-05-11 14:37:19'),
('7dz30N828', '5CmKMwoqQ', 'pryceja', 'admin', '7dz30N828', '2022-05-10 22:49:26'),
('7q3OEnTz2', 'EsUokMBLy', 'javan', 'pryceja', '7q3OEnTz2', '2022-05-10 22:40:04'),
('84yfokrIr', 'EsUokMBLy', 'javan', 'pryceja', '84yfokrIr', '2022-05-11 14:41:52'),
('8CID3gaoa', 'EsUokMBLy', 'pryceja', 'javan', '8CID3gaoa', '2022-05-11 13:58:32'),
('9CgEkCkcZ', 'agvdJtiK5', 'javan', 'admin', '9CgEkCkcZ', '2022-05-10 23:00:30'),
('9ExB6v1-Z', 'EsUokMBLy', 'javan', 'pryceja', '9ExB6v1-Z', '2022-05-11 14:27:40'),
('9o2963tnU', 'EsUokMBLy', 'pryceja', 'javan', '9o2963tnU', '2022-05-15 15:56:45'),
('a5a0xS0K8', 'EsUokMBLy', 'javan', 'pryceja', 'a5a0xS0K8', '2022-05-11 14:01:41'),
('AbkoOpAua', 'qz-HaCGO_', 'michaela', 'pryceja', 'AbkoOpAua', '2022-05-15 15:36:20'),
('ae1hDEw1W', 'EsUokMBLy', 'pryceja', 'javan', 'ae1hDEw1W', '2022-05-10 22:24:18'),
('aEhMA5WAP', 'qz-HaCGO_', 'michaela', 'pryceja', 'aEhMA5WAP', '2022-05-15 15:56:50'),
('AHuxhD18V', 'qz-HaCGO_', 'michaela', 'pryceja', 'AHuxhD18V', '2022-05-15 16:11:24'),
('anRAnq-n7', 'EsUokMBLy', 'javan', 'pryceja', 'anRAnq-n7', '2022-05-11 14:29:12'),
('as9llHzn1', 'EsUokMBLy', 'javan', 'pryceja', 'as9llHzn1', '2022-05-10 22:54:34'),
('AVApUojY2', 'yYsqyj9Lu', 'pryceja', 'localhost', 'AVApUojY2', '2022-05-11 13:59:39'),
('awxxqNbPk', 'yYsqyj9Lu', 'pryceja', 'localhost', 'awxxqNbPk', '2022-05-11 14:24:18'),
('axDDU9f6j', 'EsUokMBLy', 'javan', 'pryceja', 'axDDU9f6j', '2022-05-10 21:46:38'),
('bb-_n7N0R', 'qz-HaCGO_', 'michaela', 'pryceja', 'bb-_n7N0R', '2022-05-15 15:56:56'),
('BDJg5UfJ6', 'agvdJtiK5', 'admin', 'javan', 'BDJg5UfJ6', '2022-05-10 23:04:06'),
('bf1T3Au21', 'EsUokMBLy', 'javan', 'pryceja', 'bf1T3Au21', '2022-05-11 14:28:03'),
('BFQ4fMvZC', 'EsUokMBLy', 'pryceja', 'javan', 'BFQ4fMvZC', '2022-05-10 21:30:02'),
('BHI9AmE0q', 'agvdJtiK5', 'javan', 'admin', 'BHI9AmE0q', '2022-05-10 23:01:50'),
('bk9WljqTH', 'EsUokMBLy', 'javan', 'pryceja', 'bk9WljqTH', '2022-05-10 23:32:02'),
('bs-ltGwPz', 'EsUokMBLy', 'pryceja', 'javan', 'bs-ltGwPz', '2022-05-10 21:46:30'),
('bTEso5gJs', 'EsUokMBLy', 'javan', 'pryceja', 'bTEso5gJs', '2022-05-11 15:11:32'),
('BvQSoX3-F', 'EsUokMBLy', 'pryceja', 'javan', 'BvQSoX3-F', '2022-05-11 01:10:07'),
('bwzuORr6m', 'EsUokMBLy', 'pryceja', 'javan', 'bwzuORr6m', '2022-05-10 22:27:02'),
('cDbht-ffA', 'EsUokMBLy', 'javan', 'pryceja', 'cDbht-ffA', '2022-05-11 15:11:09'),
('cDVTnJP2M', 'EsUokMBLy', 'javan', 'pryceja', 'cDVTnJP2M', '2022-05-11 00:30:03'),
('CF-5Aflgr', 'EsUokMBLy', 'pryceja', 'javan', 'CF-5Aflgr', '2022-05-11 15:11:20'),
('CfMATCIrY', 'yYsqyj9Lu', 'pryceja', 'localhost', 'CfMATCIrY', '2022-05-10 23:07:41'),
('cLw0iQF4b', '5CmKMwoqQ', 'pryceja', 'admin', 'cLw0iQF4b', '2022-05-10 22:55:43'),
('cSm4oGu7j', 'EsUokMBLy', 'javan', 'pryceja', 'cSm4oGu7j', '2022-05-11 14:29:17'),
('CwI0vdeyc', 'EsUokMBLy', 'javan', 'pryceja', 'CwI0vdeyc', '2022-05-11 14:37:27'),
('CxST-pcuf', 'EsUokMBLy', 'pryceja', 'javan', 'CxST-pcuf', '2022-05-11 00:33:49'),
('cZqblhprB', 'EsUokMBLy', 'pryceja', 'javan', 'cZqblhprB', '2022-05-11 00:43:01'),
('czqQVRgN_', 'EsUokMBLy', 'javan', 'pryceja', 'czqQVRgN_', '2022-05-11 15:12:18'),
('D8zD7iIbI', 'EsUokMBLy', 'javan', 'pryceja', 'D8zD7iIbI', '2022-05-11 14:31:51'),
('Dc746C_jY', '5CmKMwoqQ', 'pryceja', 'admin', 'Dc746C_jY', '2022-05-10 22:39:30'),
('dCdyxIj8K', 'EsUokMBLy', 'pryceja', 'javan', 'dCdyxIj8K', '2022-05-11 00:00:58'),
('Dka1Oiqvn', 'EsUokMBLy', 'javan', 'pryceja', 'Dka1Oiqvn', '2022-05-10 22:54:46'),
('dnzA3FfS4', 'EsUokMBLy', 'pryceja', 'javan', 'dnzA3FfS4', '2022-05-11 00:29:53'),
('duxSd2O7r', 'EsUokMBLy', 'pryceja', 'javan', 'duxSd2O7r', '2022-05-11 14:37:45'),
('e6oquaoMA', 'EsUokMBLy', 'javan', 'pryceja', 'e6oquaoMA', '2022-05-11 14:24:29'),
('EFvl6Yp-g', 'EsUokMBLy', 'javan', 'pryceja', 'EFvl6Yp-g', '2022-05-11 14:25:05'),
('eGsfOODxO', 'aTlN1BCOj', 'localhost', 'admin', 'eGsfOODxO', '2022-05-10 23:03:55'),
('eGzti23dd', 'EsUokMBLy', 'pryceja', 'javan', 'eGzti23dd', '2022-05-11 19:13:48'),
('eNK6BCz6G', 'EsUokMBLy', 'pryceja', 'javan', 'eNK6BCz6G', '2022-05-12 00:39:40'),
('eNwUJK23U', '5CmKMwoqQ', 'pryceja', 'admin', 'eNwUJK23U', '2022-05-11 13:57:39'),
('Eog1l0sf-', 'EsUokMBLy', 'javan', 'pryceja', 'Eog1l0sf-', '2022-05-10 22:56:24'),
('EoNd_MMnf', 'EsUokMBLy', 'javan', 'pryceja', 'EoNd_MMnf', '2022-05-11 14:34:48'),
('EPjp2VlmQ', 'EsUokMBLy', 'javan', 'pryceja', 'EPjp2VlmQ', '2022-05-12 00:40:09'),
('ETE-T6HXM', 'EsUokMBLy', 'javan', 'pryceja', 'ETE-T6HXM', '2022-05-11 15:19:10'),
('EvX1pz4jl', 'EsUokMBLy', 'javan', 'pryceja', 'EvX1pz4jl', '2022-05-10 22:54:53'),
('EWzHJGATU', 'yYsqyj9Lu', 'pryceja', 'localhost', 'EWzHJGATU', '2022-05-10 23:07:25'),
('exMMHBHH_', 'EsUokMBLy', 'javan', 'pryceja', 'exMMHBHH_', '2022-05-11 19:25:30'),
('FbOArBXMe', 'yYsqyj9Lu', 'pryceja', 'localhost', 'FbOArBXMe', '2022-05-10 23:05:32'),
('fCumJcu6s', 'EsUokMBLy', 'pryceja', 'javan', 'fCumJcu6s', '2022-05-10 22:45:20'),
('FfwWkmL7L', 'EsUokMBLy', 'pryceja', 'javan', 'FfwWkmL7L', '2022-05-10 22:39:21'),
('FfZEBApXH', 'EsUokMBLy', 'javan', 'pryceja', 'FfZEBApXH', '2022-05-11 01:32:56'),
('FGp3OJDzt', 'aTlN1BCOj', 'localhost', 'admin', 'FGp3OJDzt', '2022-05-10 23:03:38'),
('FIktUrbSE', 'EsUokMBLy', 'javan', 'pryceja', 'FIktUrbSE', '2022-05-11 14:32:55'),
('fKEGh5wGU', 'EsUokMBLy', 'javan', 'pryceja', 'fKEGh5wGU', '2022-05-11 14:33:01'),
('FMV-2pvHM', 'EsUokMBLy', 'javan', 'pryceja', 'FMV-2pvHM', '2022-05-10 21:30:07'),
('FTd0J4zsI', 'EsUokMBLy', 'pryceja', 'javan', 'FTd0J4zsI', '2022-05-10 22:34:49'),
('g0dwtTv8X', 'aTlN1BCOj', 'localhost', 'admin', 'g0dwtTv8X', '2022-05-10 23:03:25'),
('GApmKT3Mp', 'yYsqyj9Lu', 'pryceja', 'localhost', 'GApmKT3Mp', '2022-05-12 00:40:03'),
('gDhRDHbb8', 'EsUokMBLy', 'javan', 'pryceja', 'gDhRDHbb8', '2022-05-11 14:35:29'),
('gK0PTPIWK', 'EsUokMBLy', 'javan', 'pryceja', 'gK0PTPIWK', '2022-05-10 22:41:22'),
('GONpmKoha', 'EsUokMBLy', 'javan', 'pryceja', 'GONpmKoha', '2022-05-11 14:31:30'),
('GsJ4v8tHz', 'EsUokMBLy', 'javan', 'pryceja', 'GsJ4v8tHz', '2022-05-11 14:33:51'),
('Gx6RC_oHQ', 'agvdJtiK5', 'admin', 'javan', 'Gx6RC_oHQ', '2022-05-10 21:57:41'),
('gXsEL0vdb', '5CmKMwoqQ', 'pryceja', 'admin', 'gXsEL0vdb', '2022-05-11 21:21:27'),
('H-N9r0m2N', 'EsUokMBLy', 'javan', 'pryceja', 'H-N9r0m2N', '2022-05-10 22:46:59'),
('H6a3gp-A6', 'iXtu7O8EL', 'javan', 'localhost', 'H6a3gp-A6', '2022-05-11 15:09:28'),
('hbv4FEDVz', 'EsUokMBLy', 'pryceja', 'javan', 'hbv4FEDVz', '2022-05-11 00:29:36'),
('HfW-2yR-m', '5CmKMwoqQ', 'pryceja', 'admin', 'HfW-2yR-m', '2022-05-10 22:53:01'),
('HHMsJWXbP', 'iXtu7O8EL', 'javan', 'localhost', 'HHMsJWXbP', '2022-05-11 13:58:49'),
('HOry7FO9V', 'EsUokMBLy', 'pryceja', 'javan', 'HOry7FO9V', '2022-05-11 14:35:39'),
('hv2EVLEts', 'qz-HaCGO_', 'michaela', 'pryceja', 'hv2EVLEts', '2022-05-15 16:11:44'),
('hWkvcUS0N', 'EsUokMBLy', 'pryceja', 'javan', 'hWkvcUS0N', '2022-05-10 22:45:30'),
('I0J8d7dj4', 'EsUokMBLy', 'pryceja', 'javan', 'I0J8d7dj4', '2022-05-10 22:43:50'),
('IBS0D4OKy', 'EsUokMBLy', 'javan', 'pryceja', 'IBS0D4OKy', '2022-05-10 22:44:03'),
('IiQ1TlC35', '5CmKMwoqQ', 'pryceja', 'admin', 'IiQ1TlC35', '2022-05-11 14:01:28'),
('IJniAgtKZ', 'EsUokMBLy', 'javan', 'pryceja', 'IJniAgtKZ', '2022-05-10 22:40:58'),
('iLFJ2F0fM', 'EsUokMBLy', 'pryceja', 'javan', 'iLFJ2F0fM', '2022-05-11 21:13:06'),
('ILXMtIpA6', 'qz-HaCGO_', 'pryceja', 'michaela', 'ILXMtIpA6', '2022-05-15 16:10:38'),
('iN5R1qH6x', 'EsUokMBLy', 'javan', 'pryceja', 'iN5R1qH6x', '2022-05-11 01:10:04'),
('incJl4Fls', 'agvdJtiK5', 'admin', 'javan', 'incJl4Fls', '2022-05-10 23:00:15'),
('iom75nUe4', 'EsUokMBLy', 'javan', 'pryceja', 'iom75nUe4', '2022-05-11 00:29:42'),
('IZmoBxwx9', 'EsUokMBLy', 'pryceja', 'javan', 'IZmoBxwx9', '2022-05-11 19:13:57'),
('JgTHmVKQm', '5CmKMwoqQ', 'pryceja', 'admin', 'JgTHmVKQm', '2022-05-10 22:45:36'),
('jmPm0YTn9', 'EsUokMBLy', 'javan', 'pryceja', 'jmPm0YTn9', '2022-05-11 01:01:43'),
('jMtjIwH88', 'EsUokMBLy', 'pryceja', 'javan', 'jMtjIwH88', '2022-05-10 22:55:56'),
('JRsrRV2Ec', '5CmKMwoqQ', 'pryceja', 'admin', 'JRsrRV2Ec', '2022-05-10 22:31:37'),
('JSg8n-CTF', '5CmKMwoqQ', 'admin', 'pryceja', 'JSg8n-CTF', '2022-05-10 22:59:44'),
('JTPzTZ7u6', 'qz-HaCGO_', 'pryceja', 'michaela', 'JTPzTZ7u6', '2022-05-15 15:58:51'),
('JTRyx3NES', 'qz-HaCGO_', 'michaela', 'pryceja', 'JTRyx3NES', '2022-05-15 15:56:32'),
('JuEdqCmRd', 'aTlN1BCOj', 'admin', 'localhost', 'JuEdqCmRd', '2022-05-10 23:04:37'),
('jWHS-WDiP', 'EsUokMBLy', 'javan', 'pryceja', 'jWHS-WDiP', '2022-05-10 22:47:24'),
('K0CeriNvP', 'qz-HaCGO_', 'michaela', 'pryceja', 'K0CeriNvP', '2022-05-15 16:10:39'),
('k2LN9iaAK', '5CmKMwoqQ', 'pryceja', 'admin', 'k2LN9iaAK', '2022-05-10 22:26:51'),
('k4CacfCyV', 'yYsqyj9Lu', 'pryceja', 'localhost', 'k4CacfCyV', '2022-05-11 14:41:47'),
('KiPwxwoYy', 'EsUokMBLy', 'pryceja', 'javan', 'KiPwxwoYy', '2022-05-11 14:37:53'),
('KMOsAOyDK', 'aTlN1BCOj', 'localhost', 'admin', 'KMOsAOyDK', '2022-05-10 23:03:41'),
('krnwIUAfJ', 'EsUokMBLy', 'javan', 'pryceja', 'krnwIUAfJ', '2022-05-10 22:58:41'),
('L0PiJSND6', '5CmKMwoqQ', 'pryceja', 'admin', 'L0PiJSND6', '2022-05-10 22:34:11'),
('LBBKq4vaV', '5CmKMwoqQ', 'admin', 'pryceja', 'LBBKq4vaV', '2022-05-10 21:57:26'),
('LDLKrqEHE', 'qz-HaCGO_', 'michaela', 'pryceja', 'LDLKrqEHE', '2022-05-15 15:36:02'),
('lhs2NTFf1', 'EsUokMBLy', 'javan', 'pryceja', 'lhs2NTFf1', '2022-05-10 22:45:42'),
('lm5OaAR6T', 'EsUokMBLy', 'javan', 'pryceja', 'lm5OaAR6T', '2022-05-11 00:34:03'),
('lNz4OFQxc', 'EsUokMBLy', 'pryceja', 'javan', 'lNz4OFQxc', '2022-05-10 22:27:50'),
('lSP_x2ULp', 'yYsqyj9Lu', 'localhost', 'pryceja', 'lSP_x2ULp', '2022-05-10 23:05:49'),
('lX331p7Lu', 'EsUokMBLy', 'javan', 'pryceja', 'lX331p7Lu', '2022-05-10 23:01:20'),
('m-0-dZYyc', 'EsUokMBLy', 'pryceja', 'javan', 'm-0-dZYyc', '2022-05-10 22:22:51'),
('m11jf5yDP', 'EsUokMBLy', 'javan', 'pryceja', 'm11jf5yDP', '2022-05-10 23:06:59'),
('MEN5x3yfb', 'EsUokMBLy', 'javan', 'pryceja', 'MEN5x3yfb', '2022-05-11 14:26:43'),
('MQuUT1ECh', 'qz-HaCGO_', 'pryceja', 'michaela', 'MQuUT1ECh', '2022-05-15 15:55:37'),
('mVcVwBlMF', 'EsUokMBLy', 'pryceja', 'admin', 'mVcVwBlMF', '2022-05-10 22:31:23'),
('MxR7efyDJ', 'EsUokMBLy', 'javan', 'pryceja', 'MxR7efyDJ', '2022-05-10 23:01:12'),
('MZGaclZrP', 'agvdJtiK5', 'javan', 'admin', 'MZGaclZrP', '2022-05-10 23:00:40'),
('n17JwNGHs', '5CmKMwoqQ', 'pryceja', 'admin', 'n17JwNGHs', '2022-05-10 23:05:38'),
('NgSa1W_uV', 'iXtu7O8EL', 'javan', 'localhost', 'NgSa1W_uV', '2022-05-11 14:22:28'),
('nXxNdiDOy', 'EsUokMBLy', 'pryceja', 'javan', 'nXxNdiDOy', '2022-05-10 21:33:52'),
('Nz9ECOhib', 'qz-HaCGO_', 'pryceja', 'michaela', 'Nz9ECOhib', '2022-05-15 16:10:45'),
('NZSk9XM_q', 'EsUokMBLy', 'pryceja', 'javan', 'NZSk9XM_q', '2022-05-10 21:47:01'),
('O9zQep6oa', 'yYsqyj9Lu', 'pryceja', 'localhost', 'O9zQep6oa', '2022-05-11 21:21:21'),
('OB0UVF6hT', 'agvdJtiK5', 'javan', 'admin', 'OB0UVF6hT', '2022-05-10 21:57:35'),
('ODhl-b9Rf', 'EsUokMBLy', 'pryceja', 'javan', 'ODhl-b9Rf', '2022-05-11 15:12:24'),
('OH5UkCiEs', 'EsUokMBLy', 'pryceja', 'javan', 'OH5UkCiEs', '2022-05-10 21:50:07'),
('oJzvw6_hh', 'qz-HaCGO_', 'michaela', 'pryceja', 'oJzvw6_hh', '2022-05-15 15:55:49'),
('opqG4SYPi', 'yYsqyj9Lu', 'pryceja', 'localhost', 'opqG4SYPi', '2022-05-11 14:02:12'),
('oV4yyfo3d', 'EsUokMBLy', 'javan', 'pryceja', 'oV4yyfo3d', '2022-05-11 14:32:45'),
('OwkoZ568G', '5CmKMwoqQ', 'pryceja', 'admin', 'OwkoZ568G', '2022-05-11 14:27:57'),
('P39bUu3VC', '5CmKMwoqQ', 'admin', 'pryceja', 'P39bUu3VC', '2022-05-10 22:59:58'),
('pAmQnZvOW', 'EsUokMBLy', 'javan', 'pryceja', 'pAmQnZvOW', '2022-05-10 23:07:30'),
('pC2GiuRUr', 'EsUokMBLy', 'javan', 'pryceja', 'pC2GiuRUr', '2022-05-11 14:41:40'),
('PUQgc3tGm', 'agvdJtiK5', 'javan', 'admin', 'PUQgc3tGm', '2022-05-10 22:45:14'),
('PUzngDOeF', 'EsUokMBLy', 'javan', 'pryceja', 'PUzngDOeF', '2022-05-11 15:02:21'),
('PXI5jp4pb', 'EsUokMBLy', 'javan', 'pryceja', 'PXI5jp4pb', '2022-05-10 21:48:19'),
('qA1bk-3Xm', '5CmKMwoqQ', 'pryceja', 'admin', 'qA1bk-3Xm', '2022-05-10 22:21:24'),
('qjAH5WOf94', 'qz-HaCGO_', 'pryceja', 'michaela', 'qjAH5WOf94', '2022-05-15 16:10:38'),
('qOoQqgasS', 'EsUokMBLy', 'javan', 'pryceja', 'qOoQqgasS', '2022-05-10 21:32:07'),
('qT2FiyNbJ', 'EsUokMBLy', 'javan', 'pryceja', 'qT2FiyNbJ', '2022-05-11 14:54:51'),
('RAUrh1iZv', 'yYsqyj9Lu', 'pryceja', 'localhost', 'RAUrh1iZv', '2022-05-10 23:31:49'),
('rE-yDTwy4', '5CmKMwoqQ', 'pryceja', 'admin', 'rE-yDTwy4', '2022-05-15 15:56:39'),
('rlCrrG-bF', 'EsUokMBLy', 'pryceja', 'javan', 'rlCrrG-bF', '2022-05-11 14:54:58'),
('rrBrhszeB', 'EsUokMBLy', 'pryceja', 'javan', 'rrBrhszeB', '2022-05-11 14:35:42'),
('RxoyKXneK', 'EsUokMBLy', 'javan', 'pryceja', 'RxoyKXneK', '2022-05-10 22:41:03'),
('R_Wf8x0Lq', 'EsUokMBLy', 'pryceja', 'javan', 'R_Wf8x0Lq', '2022-05-11 01:01:40'),
('sawMWF8Dl', 'EsUokMBLy', 'javan', 'pryceja', 'sawMWF8Dl', '2022-05-10 23:07:35'),
('soyPibGuH', 'yYsqyj9Lu', 'pryceja', 'localhost', 'soyPibGuH', '2022-05-11 00:01:05'),
('spyv5dqTn', '5CmKMwoqQ', 'pryceja', 'admin', 'spyv5dqTn', '2022-05-10 22:43:57'),
('svZdfviC-', 'EsUokMBLy', 'pryceja', 'javan', 'svZdfviC-', '2022-05-11 19:25:24'),
('SV_smuj3-', '5CmKMwoqQ', 'admin', 'pryceja', 'SV_smuj3-', '2022-05-10 23:04:00'),
('sWpx5oAKT', 'EsUokMBLy', 'javan', 'pryceja', 'sWpx5oAKT', '2022-05-11 19:25:17'),
('SWqkIyxPv', 'aTlN1BCOj', 'localhost', 'admin', 'SWqkIyxPv', '2022-05-10 23:04:09'),
('t4m6UyV34', 'EsUokMBLy', 'javan', 'pryceja', 't4m6UyV34', '2022-05-11 21:12:58'),
('T7rrDJKP-', 'EsUokMBLy', 'javan', 'pryceja', 'T7rrDJKP-', '2022-05-11 15:03:04'),
('TMYsXaHf_', 'EsUokMBLy', 'javan', 'pryceja', 'TMYsXaHf_', '2022-05-11 13:56:57'),
('tTzFK98WU', 'qz-HaCGO_', 'pryceja', 'michaela', 'tTzFK98WU', '2022-05-15 15:45:49'),
('u356GhehX', 'EsUokMBLy', 'javan', 'pryceja', 'u356GhehX', '2022-05-11 14:30:03'),
('UCOECYOOD', 'EsUokMBLy', 'pryceja', 'javan', 'UCOECYOOD', '2022-05-12 00:39:46'),
('uFSD7FzPa', 'qz-HaCGO_', 'pryceja', 'michaela', 'uFSD7FzPa', '2022-05-15 15:35:39'),
('uj5xjZIlO', 'EsUokMBLy', 'javan', 'pryceja', 'uj5xjZIlO', '2022-05-10 22:48:08'),
('uQB4OtevR', 'EsUokMBLy', 'pryceja', 'javan', 'uQB4OtevR', '2022-05-10 22:46:04'),
('uWn2It9hF', 'EsUokMBLy', 'javan', 'pryceja', 'uWn2It9hF', '2022-05-11 13:56:47'),
('uwzwdltAO', '5CmKMwoqQ', 'admin', 'pryceja', 'uwzwdltAO', '2022-05-10 23:00:53'),
('V0XeHucQ3', '5CmKMwoqQ', 'pryceja', 'admin', 'V0XeHucQ3', '2022-05-10 22:54:17'),
('ve0nhudF3', 'qz-HaCGO_', 'pryceja', 'michaela', 've0nhudF3', '2022-05-15 16:11:54'),
('VfgqsK6OM', 'EsUokMBLy', 'javan', 'pryceja', 'VfgqsK6OM', '2022-05-11 13:51:43'),
('VixoOsZ-I', 'EsUokMBLy', 'javan', 'pryceja', 'VixoOsZ-I', '2022-05-10 22:49:37'),
('VNOthuF_v', 'EsUokMBLy', 'javan', 'pryceja', 'VNOthuF_v', '2022-05-11 14:11:59'),
('vRL04cRot', '5CmKMwoqQ', 'pryceja', 'admin', 'vRL04cRot', '2022-05-10 22:56:08'),
('vS-zrbaMp', 'EsUokMBLy', 'pryceja', 'javan', 'vS-zrbaMp', '2022-05-11 15:09:42'),
('vtfNI9lri', 'yYsqyj9Lu', 'pryceja', 'localhost', 'vtfNI9lri', '2022-05-11 14:00:51'),
('w-Jw7TSpa', 'EsUokMBLy', 'javan', 'pryceja', 'w-Jw7TSpa', '2022-05-11 14:28:56'),
('w-WYhAfyw', 'EsUokMBLy', 'pryceja', 'javan', 'w-WYhAfyw', '2022-05-10 23:05:27'),
('W0bYRCoxU', 'EsUokMBLy', 'pryceja', 'javan', 'W0bYRCoxU', '2022-05-10 21:31:55'),
('W73mhzrb0', '5CmKMwoqQ', 'pryceja', 'admin', 'W73mhzrb0', '2022-05-10 22:46:51'),
('wAI_LuY8N', 'EsUokMBLy', 'javan', 'pryceja', 'wAI_LuY8N', '2022-05-11 00:29:24'),
('wAVAmDOj_', 'agvdJtiK5', 'javan', 'admin', 'wAVAmDOj_', '2022-05-10 23:01:55'),
('wG321KGbW', 'EsUokMBLy', 'pryceja', 'javan', 'wG321KGbW', '2022-05-11 14:03:57'),
('WpIDTw2bX', 'EsUokMBLy', 'javan', 'pryceja', 'WpIDTw2bX', '2022-05-11 13:56:53'),
('WPUMWlYZU', 'yYsqyj9Lu', 'pryceja', 'localhost', 'WPUMWlYZU', '2022-05-11 00:00:45'),
('wq1OoC4LY', 'EsUokMBLy', 'javan', 'pryceja', 'wq1OoC4LY', '2022-05-11 14:35:22'),
('WT0SG-5sh', 'agvdJtiK5', 'javan', 'admin', 'WT0SG-5sh', '2022-05-11 14:27:34'),
('WvkMNFC1g', 'aTlN1BCOj', 'localhost', 'admin', 'WvkMNFC1g', '2022-05-10 23:03:48'),
('XH2cutC-G', 'EsUokMBLy', 'javan', 'pryceja', 'XH2cutC-G', '2022-05-11 14:31:36'),
('XM0Vh4Tcc', 'EsUokMBLy', 'javan', 'pryceja', 'XM0Vh4Tcc', '2022-05-11 14:29:50'),
('Xol1iodQu', 'qz-HaCGO_', 'pryceja', 'michaela', 'Xol1iodQu', '2022-05-15 16:10:27'),
('XQXlZRKTt', 'EsUokMBLy', 'javan', 'pryceja', 'XQXlZRKTt', '2022-05-11 00:59:39'),
('xszHAxLlt', 'EsUokMBLy', 'javan', 'pryceja', 'xszHAxLlt', '2022-05-11 15:17:57'),
('xw72DGdOs', 'EsUokMBLy', 'pryceja', 'javan', 'xw72DGdOs', '2022-05-11 15:11:25'),
('XweSUw0mI', 'EsUokMBLy', 'javan', 'pryceja', 'XweSUw0mI', '2022-05-11 14:30:06'),
('YA54jryrU', 'qz-HaCGO_', 'michaela', 'pryceja', 'YA54jryrU', '2022-05-15 15:52:58'),
('YbHWOGhF7', 'EsUokMBLy', 'pryceja', 'javan', 'YbHWOGhF7', '2022-05-10 22:45:07'),
('YEHj9UcR6', 'EsUokMBLy', 'javan', 'pryceja', 'YEHj9UcR6', '2022-05-10 22:57:18'),
('yEoiIZ59w', 'EsUokMBLy', 'javan', 'pryceja', 'yEoiIZ59w', '2022-05-11 14:29:38'),
('YL8EwMhg9', '5CmKMwoqQ', 'pryceja', 'admin', 'YL8EwMhg9', '2022-05-10 22:58:34'),
('yLiW-Ch0N', 'EsUokMBLy', 'pryceja', 'javan', 'yLiW-Ch0N', '2022-05-10 22:39:36'),
('yqEDS4ghi', 'EsUokMBLy', 'javan', 'pryceja', 'yqEDS4ghi', '2022-05-11 14:26:59'),
('Yrm6TMqtI', 'yYsqyj9Lu', 'pryceja', 'localhost', 'Yrm6TMqtI', '2022-05-12 00:12:32'),
('YwD-hgkUK', 'EsUokMBLy', 'javan', 'pryceja', 'YwD-hgkUK', '2022-05-11 13:51:52'),
('YxxpOTiyY', 'EsUokMBLy', 'javan', 'pryceja', 'YxxpOTiyY', '2022-05-11 14:31:41'),
('z5pxwNb07', '5CmKMwoqQ', 'pryceja', 'admin', 'z5pxwNb07', '2022-05-12 00:12:41'),
('zaDF9lYtH', 'qz-HaCGO_', 'michaela', 'pryceja', 'zaDF9lYtH', '2022-05-15 15:53:20'),
('ZbrQU9jJA', 'EsUokMBLy', 'pryceja', 'javan', 'ZbrQU9jJA', '2022-05-11 19:14:16'),
('zpBWDtv14', '5CmKMwoqQ', 'pryceja', 'admin', 'zpBWDtv14', '2022-05-10 22:41:17'),
('ZwdnrEYNe', 'EsUokMBLy', 'pryceja', 'javan', 'ZwdnrEYNe', '2022-05-11 15:03:09'),
('_3IJ-Sqza', 'yYsqyj9Lu', 'pryceja', 'localhost', '_3IJ-Sqza', '2022-05-15 15:32:32'),
('_7uVfmH53', '5CmKMwoqQ', 'pryceja', 'admin', '_7uVfmH53', '2022-05-10 22:41:11'),
('_8XZG5mDQ', 'qz-HaCGO_', 'pryceja', 'michaela', '_8XZG5mDQ', '2022-05-15 15:42:54'),
('_aF93fpIT', 'EsUokMBLy', 'pryceja', 'javan', '_aF93fpIT', '2022-05-10 22:45:57'),
('_chaiNjH2', 'EsUokMBLy', 'pryceja', 'javan', '_chaiNjH2', '2022-05-11 14:35:46'),
('_Lt_G5fBY', 'agvdJtiK5', 'admin', 'javan', '_Lt_G5fBY', '2022-05-10 23:00:06'),
('_zQnZtDgv', 'qz-HaCGO_', 'michaela', 'pryceja', '_zQnZtDgv', '2022-05-15 15:53:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userName` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userName`, `name`, `image`) VALUES
('admin', 'Admin', 'https://i1.sndcdn.com/avatars-000196113278-93p2dw-t500x500.jpg'),
('javan', 'Javaughn', 'https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png'),
('localhost', 'Localhost', 'https://i1.sndcdn.com/avatars-000196113278-93p2dw-t500x500.jpg'),
('michaela', 'mimi', 'https://welovecatsandkittens.com/wp-content/uploads/2017/01/angry-5.jpg'),
('pryceja', 'Javaughn Pryce', 'https://www.thoughtco.com/thmb/YkksU0Xy_2kfdDolJLPja7NM8jI=/2121x1193/smart/filters:no_upscale()/swallowGE-57a109323df78c3276f5b8a0.jpg');

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
  ADD PRIMARY KEY (`userName`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
