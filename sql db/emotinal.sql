-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 10, 2024 at 10:20 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `emotinal`
--

-- --------------------------------------------------------

--
-- Table structure for table `emotion`
--

CREATE TABLE `emotion` (
  `emotion_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `enjoyment` int(2) NOT NULL,
  `sadness` int(2) NOT NULL,
  `anger` int(2) NOT NULL,
  `contempt` int(2) NOT NULL,
  `disgust` int(2) NOT NULL,
  `fear` int(2) NOT NULL,
  `surprise` int(2) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `triggers` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emotion`
--

INSERT INTO `emotion` (`emotion_id`, `user_id`, `enjoyment`, `sadness`, `anger`, `contempt`, `disgust`, `fear`, `surprise`, `timestamp`, `triggers`) VALUES
(35, 53, 7, 3, 8, 3, 7, 4, 8, '2024-02-15 21:18:22', 'nicer'),
(36, 53, 8, 4, 9, 3, 8, 4, 8, '2024-03-10 09:12:19', 'happening'),
(38, 53, 6, 3, 8, 3, 6, 6, 6, '2024-02-22 19:38:47', 'careful now');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `salt` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `hashed_password`, `salt`) VALUES
(19, 'jimjones', '$2b$10$nte0.NhoyLLMhpDaTsLVcu95f/MAHollqVlcWbLSVTpjvGlHZvqIK', ''),
(53, 'bob@bob.com', '$2b$10$agSIOAF0DM2htJgk7CNQ/.GD624XD/q4npOUv6qAvzel2/hH0IZhK', ''),
(59, 'egertonjoel@gmail.com', '$2b$10$Dl.DbyibBd8lOSubRNa3i.2lvJCPoubK/9CjCMgOql7S2uS6.OxJu', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emotion`
--
ALTER TABLE `emotion`
  ADD PRIMARY KEY (`emotion_id`),
  ADD KEY `FK_userID` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emotion`
--
ALTER TABLE `emotion`
  MODIFY `emotion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emotion`
--
ALTER TABLE `emotion`
  ADD CONSTRAINT `FK_userID` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
