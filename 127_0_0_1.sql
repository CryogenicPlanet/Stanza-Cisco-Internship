-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2018 at 06:12 PM
-- Server version: 5.5.57-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `c9`
--
CREATE DATABASE IF NOT EXISTS `heroku_6d8e9115d45b810` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `heroku_6d8e9115d45b810`;

-- --------------------------------------------------------

--
-- Table structure for table `Authors`
--

CREATE TABLE IF NOT EXISTS `Authors` (
  `UAID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(512) NOT NULL,
  PRIMARY KEY (`UAID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `Authors`
--

INSERT INTO `Authors` (`UAID`, `Name`) VALUES
(1, 'William Golding'),
(2, 'Dan Brown'),
(3, 'Sir Arthur Conan Doyle'),
(4, 'J.R.R. Tolkien'),
(5, 'Suzanne Collins'),
(6, 'Stephen King'),
(7, 'Cassandra Clare'),
(8, 'George Orwell'),
(9, 'Tom Clancy'),
(13, 'Steve McHugh');

-- --------------------------------------------------------

--
-- Table structure for table `Books`
--

CREATE TABLE IF NOT EXISTS `Books` (
  `UBID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(512) NOT NULL,
  `Author` int(11) NOT NULL,
  `Genre` int(11) NOT NULL,
  `Year` int(11) NOT NULL,
  PRIMARY KEY (`UBID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `Books`
--

INSERT INTO `Books` (`UBID`, `Name`, `Author`, `Genre`, `Year`) VALUES
(1, 'Lord of the Flies', 1, 8, 1954),
(2, 'Inferno', 2, 2, 2013),
(3, 'The Da Vinci Code', 2, 2, 2003),
(4, 'Angels & Demons', 2, 2, 2000),
(5, 'The Lost Symbol', 2, 2, 2009),
(6, 'Sherlock Holmes', 3, 3, 1914),
(7, 'The Lord of the Rings', 4, 1, 1954),
(8, 'The Hobbit', 4, 1, 1937),
(9, 'The Hunger Games', 5, 8, 2008),
(10, '1984', 8, 9, 1949),
(11, 'The Hunt for Red October', 9, 10, 1984),
(14, 'Crimes Against Magic', 13, 14, 2012),
(15, 'Born of Hatred', 13, 14, 2012),
(16, 'With Silent Screams', 13, 14, 2014),
(19, 'It', 6, 7, 1986);

-- --------------------------------------------------------

--
-- Table structure for table `Borrowed`
--

CREATE TABLE IF NOT EXISTS `Borrowed` (
  `UBOID` int(11) NOT NULL AUTO_INCREMENT,
  `Lender` int(11) NOT NULL,
  `Borrower` int(11) NOT NULL,
  `Book` int(11) NOT NULL,
  `Outstanding` int(11) NOT NULL,
  `ReturnRequest` int(11) NOT NULL,
  `Date of Response` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UBOID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `Borrowed`
--

INSERT INTO `Borrowed` (`UBOID`, `Lender`, `Borrower`, `Book`, `Outstanding`, `ReturnRequest`, `Date of Response`) VALUES
(1, 2, 1, 10, 0, 1, '2018-01-01 13:00:00'),
(2, 2, 1, 10, 1, 1, '2018-01-05 08:44:32'),
(3, 1, 2, 19, 1, 0, '2018-01-24 18:43:45'),
(4, 1, 5, 15, 1, 0, '2018-01-30 15:47:56');

-- --------------------------------------------------------

--
-- Table structure for table `Extended User Data`
--

CREATE TABLE IF NOT EXISTS `Extended User Data` (
  `User` int(11) NOT NULL,
  `Author` int(11) NOT NULL,
  `Genre` int(11) NOT NULL,
  UNIQUE KEY `Author` (`Author`),
  UNIQUE KEY `User` (`User`),
  UNIQUE KEY `Genre` (`Genre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Featured Books`
--

CREATE TABLE IF NOT EXISTS `Featured Books` (
  `UFBID` int(11) NOT NULL AUTO_INCREMENT,
  `User` int(11) NOT NULL,
  `User_Book` int(11) NOT NULL,
  PRIMARY KEY (`UFBID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=53 ;

--
-- Dumping data for table `Featured Books`
--

INSERT INTO `Featured Books` (`UFBID`, `User`, `User_Book`) VALUES
(39, 5, 6),
(46, 1, 3),
(47, 1, 10),
(48, 1, 11),
(49, 1, 15),
(50, 1, 19),
(51, 1, 7),
(52, 9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Following`
--

CREATE TABLE IF NOT EXISTS `Following` (
  `UFID` int(11) NOT NULL AUTO_INCREMENT,
  `User` int(11) NOT NULL,
  `Following` int(11) NOT NULL,
  PRIMARY KEY (`UFID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `Following`
--

INSERT INTO `Following` (`UFID`, `User`, `Following`) VALUES
(2, 2, 1),
(5, 5, 1),
(6, 5, 2),
(7, 1, 2),
(9, 1, 5),
(10, 1, 6),
(11, 1, 3),
(13, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Genres`
--

CREATE TABLE IF NOT EXISTS `Genres` (
  `UGID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(512) NOT NULL,
  PRIMARY KEY (`UGID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=47 ;

--
-- Dumping data for table `Genres`
--

INSERT INTO `Genres` (`UGID`, `Name`) VALUES
(1, 'Fantasy'),
(2, 'Thriller'),
(3, 'Mystery'),
(4, 'Non-Fiction'),
(5, 'Romance'),
(6, 'Science Fiction'),
(7, 'Horror'),
(8, 'Fiction'),
(9, 'Dystopian fiction'),
(10, 'Techno-thriller'),
(14, 'Dark Fiction');

-- --------------------------------------------------------

--
-- Table structure for table `Requested Book`
--

CREATE TABLE IF NOT EXISTS `Requested Book` (
  `URID` int(11) NOT NULL AUTO_INCREMENT,
  `Borrower` int(11) NOT NULL,
  `Lender` int(11) NOT NULL,
  `Book` int(11) NOT NULL,
  `Status` int(1) NOT NULL,
  `Date of Request` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`URID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `Requested Book`
--

INSERT INTO `Requested Book` (`URID`, `Borrower`, `Lender`, `Book`, `Status`, `Date of Request`) VALUES
(1, 1, 2, 10, 1, '2018-01-04 17:47:56'),
(2, 1, 2, 10, 1, '2018-01-24 11:58:36'),
(3, 2, 1, 19, 1, '2018-01-24 18:43:45'),
(4, 1, 2, 4, 0, '2018-01-24 17:07:21'),
(5, 1, 2, 10, 0, '2018-01-27 16:40:04'),
(6, 1, 2, 2, 0, '2018-01-28 16:42:17'),
(7, 1, 5, 6, 2, '2018-01-28 17:33:44'),
(10, 1, 5, 16, 0, '2018-01-29 14:26:02'),
(11, 1, 2, 4, 0, '2018-01-29 14:31:32'),
(12, 5, 1, 7, 0, '2018-01-29 16:44:56'),
(13, 5, 1, 15, 1, '2018-01-30 15:47:56'),
(14, 1, 9, 1, 0, '2018-01-29 17:48:36');

-- --------------------------------------------------------

--
-- Table structure for table `User's Book`
--

CREATE TABLE IF NOT EXISTS `User's Book` (
  `UTID` int(11) NOT NULL AUTO_INCREMENT,
  `User` int(11) NOT NULL,
  `Book` int(11) NOT NULL,
  `Description` varchar(512) NOT NULL,
  `Image` varchar(512) NOT NULL COMMENT 'From S3',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UTID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=47 ;

--
-- Dumping data for table `User's Book`
--

INSERT INTO `User's Book` (`UTID`, `User`, `Book`, `Description`, `Image`, `Timestamp`) VALUES
(1, 2, 2, 'In the heart of Italy, Harvard professor of symbology Robert Langdon is drawn into a harrowing world centered on one of history’s most enduring and mysterious literary masterpieces . . . Dante’s Inferno.\r\n\r\nAgainst this backdrop, Langdon battles a chilling adversary and grapples with an ingenious riddle that pulls him into a landscape of classic art, secret passageways, and futuristic science. Drawing from Dante’s dark epic poem, Langdon races to find answers and decide whom to trust . . . before the world ', 'http://t2.gstatic.com/images?q=tbn:ANd9GcQbTc3cpFGFnSu7jeINX4L1g58t1L1LGXus8CTScpmu1g2FIX48', '2018-01-27 16:51:33'),
(2, 2, 4, 'A fantastic start for the amazing series. It''s a perfect blend of history and adventure and brilliant plot twists. And the way how Brown incorporated religion and science is just mind-blowing. It took me on this *cheesy* roller-coaster ride and left me in a daze. Ugh...gut-wrenching indeed.', 'https://images.gr-assets.com/books/1303390735l/960.jpg', '2018-01-27 16:30:14'),
(3, 1, 3, 'Let me guess? You probably saw the movie and then decided to read the book? And figured out how controversially wrong it is? It''s okay...calm down. It''s just fiction. The book is better. It has startling plot twists and almost every chapter is a *drum-roll please* a cliff-hanger. I love the agonising wait that Brown puts us through in every book and the plot-development is pretty good.', 'http://covers2.booksamillion.com/covers/bam/0/38/550/420/0385504209.jpg', '2018-01-27 16:40:11'),
(4, 1, 10, 'Warning: Not for the faint-hearted.\r\nWAR IS PEACE.\r\nFREEDOM IS SLAVERY.\r\nIGNORANCE IS STRENGTH.\r\n\r\nAmong the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell''s nightmare vision of a totalitarian, bureaucratic world and one poor stiff''s attempt to find individuality. The brilliance of the novel is Orwell''s prescience of modern life--the ubiquity of ', 'https://goozernation.com/wp-content/uploads/2017/02/1984-by-opallynn-d4lnuoh.jpg', '2018-01-27 16:46:17'),
(5, 1, 11, 'A military thriller so gripping in its action and so convincing in its accuracy that the author was rumored to have been debriefed by the White House. Its theme: the greatest espionage coup in history. Its story: the chase for a top secret Russian missile sub. Lauded by the Washington Post as "breathlessly exciting." The Hunt for Red October remains a masterpiece of military fiction by one of the world''s most popular authors, a man whose shockingly realistic scenarios continue to hold us in thrall.\r\nSomewhe', 'https://images-na.ssl-images-amazon.com/images/I/51W7T64EC8L._SX295_BO1,204,203,200_.jpg', '2018-01-27 16:50:03'),
(11, 2, 10, 'This book is the thin line of difference between love and hate. Legit. If you thought Hitler was bad...read this. But do not by all means adopt the wickedly awesome techniques mentioned in it. I do not wish to see more death. Thank you very much. Haha sorry...I loved the book.', 'https://goozernation.com/wp-content/uploads/2017/02/1984-by-opallynn-d4lnuoh.jpg', '2018-01-27 17:39:34'),
(14, 5, 11, 'The depth of the character combined so intricately with the suspense of an underwater submarine chase makes this book so memorable that it''s worth a second read. The plot-development is awesome, but it''s definitely the way Clancy creeps into the mind of a troubled Soviet sub-captain that makes this story so magnificent for me.', 'https://s-usih.org/wp-content/uploads/2015/09/red-october.jpg', '2018-01-27 17:00:28'),
(15, 5, 14, 'Fantastic book that combines magic, Greeks, mythical creatures, and amazing writing into one amazing universe', 'https://stevejmchugh.files.wordpress.com/2013/08/mchugh_crimes_against_magic_cvr_final.jpg', '2017-10-28 06:46:46'),
(16, 5, 15, 'Second one in the series that combines magic, Greeks, mythical creatures, and amazing writing into one amazing universe', 'https://stevejmchugh.files.wordpress.com/2013/08/mchugh_born_of_hatred_cvr_final.jpg', '2017-10-28 06:51:54'),
(17, 5, 16, 'Third one in the series that combines magic, Greeks, mythical creatures, and amazing writing into one amazing universe', 'https://stevejmchugh.files.wordpress.com/2013/12/with-silent-screams.jpg', '2017-10-28 06:58:36'),
(18, 1, 15, 'I''m digging this book. Literally...while I upload this. The brutally horrific, sick, twisted and gruesome murders described in quite some detail is definitely not for the faint of heart. But for others this is an amazing read. I''m sure my heart skipped a beat or two(in other words stopped for a second). And it''s far from being lovey gooey. Thank gods for that.', 'https://images.gr-assets.com/books/1354753643l/16250940.jpg', '2018-01-27 17:08:12'),
(19, 5, 5, 'WHAT IS LOST...\nWILL BE FOUND\n\nOr will it? Read to find out.\n\nThe Lost Symbol is a masterstroke of storytelling - a deadly race through a real-world labyrinth of codes, secrets, and unseen truths...all under the watchful eye of Brown''s most terrifying villain to date. Set within the hidden chambers, tunnels, and temples of Washington, DC., The Lost Symbol accelerates through a startling landscape toward an unthinkable finale.', 'https://images.gr-assets.com/books/1358274396l/6411961.jpg', '2018-01-28 15:38:40'),
(22, 1, 19, 'Welcome to Derry, Maine…\r\n\r\nIt’s a small city, a place as hauntingly familiar as your own hometown. Only in Derry the haunting is real…\r\n\r\n"IT" is a story of a group of children who are not among the stereotypical popular, strongest or smartest; a tale about the group of seven friends living in Derry, Maine in 1958. They form the self-called "losers" club and encounter a horrible, awesome force lurking in their hometown...a force feeding on fear and devouring young children. A force that adults do not seem ', 'https://images-na.ssl-images-amazon.com/images/I/51%2B9YaiWbLL.jpg', '2018-01-27 17:16:00'),
(23, 7, 9, 'Plot Overview. Katniss Everdeen wakes up on the day of the reaping, when the tributes are chosen who will take part in the Hunger Games. Her mother and little sister, Prim, sleep nearby. Her father died in a mine explosion years earlier.\n', 'http://t2.gstatic.com/images?q=tbn:ANd9GcTyHdyTUR40PQC7GV8hci8H6hb9DDAL1_5qUyUR9Ti3IcMJrdbv', '2018-01-29 16:29:26'),
(28, 5, 6, 'Sherlock Holmes is one of the most popular series in crime fiction.\n\nAll the stories and novels in this book are centered around the famous sleuth Sherlock Holmes and how he solved even the most difficult cases with his remarkable observation techniques, reasoning abilities, towering intellect and knowledge of forensic science.', 'https://images-na.ssl-images-amazon.com/images/I/51dffso4JfL._SX357_BO1,204,203,200_.jpg', '2018-01-29 16:32:06'),
(29, 1, 7, 'The Hobbit and The Lord of The Rings Trilogy are the bestselling fantasy novel series written by, J. R. R. Tolkien. Readers from all around the world have been enchanted by the sheer magnitude of the stories written by Tolkien and are mesmerized by the magic in his words. These books have been widely successful, having sold more than 150 million copies worldwide and been translated into over 50 languages.', 'https://bookzone.boyslife.org/files/2011/03/lordrings.gif', '2018-01-29 16:33:53'),
(31, 9, 1, 'Lord of the Flies explores the dark side of humanity, the savagery that underlies even the most civilized human beings. William Golding intended this novel as a tragic parody of children''s adventure tales, illustrating humankind''s intrinsic evil nature. He presents the reader with a chronology of events leading a group of young boys from hope to disaster as they attempt to survive their uncivilized, unsupervised, isolated environment until rescued.', 'http://t0.gstatic.com/images?q=tbn:ANd9GcQREJanhIz58BSm-57WGEkBYsekjkWSEzyxNZaxJnQ3epNPfYay', '2018-01-29 17:49:42'),
(44, 9, 8, 'After the battle, Bilbo is taken to see Thorin, who is dying. He is buried with Orcrist and the Arkenstone; his inheritance, the hoard, is divided. Bilbo leaves with Gandalf, Elvenking, and Beorn to go back to the hobbit-lands. They stay with Beorn over Yule-tide and return to Elrond in the spring.', 'http://t0.gstatic.com/images?q=tbn:ANd9GcQcgexXax33OEf1VNRdg9yuEbiT4EZstX1RnOIUlpBj4rlFBryc', '2018-01-29 18:23:53');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `UUID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(1024) NOT NULL,
  `Email` varchar(512) NOT NULL,
  `Password` varchar(2048) NOT NULL,
  `Salt` varchar(256) NOT NULL,
  `Picture` varchar(2048) NOT NULL DEFAULT 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg',
  `Verified` int(11) NOT NULL,
  PRIMARY KEY (`UUID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UUID`, `Name`, `Email`, `Password`, `Salt`, `Picture`, `Verified`) VALUES
(1, 'Rahul', 'rahultarak12345@gmail.com', 'ed16ceca31a1cf79d9144e98b18a2bd9945127497221b8336bc10b0127b2a9d40dcca8b8d5a34bb520e6f3ad0ad04d4090e3ce6d87329476fc24f45988621485', 'pAgkh9n8', 'https://avatars0.githubusercontent.com/u/10355479?s=400&u=5dabb81d0e4fd318af7c6e88edee72757aadbdfc&v=4', 1),
(2, 'Rithvik', 'rithvikm14@gmail.com', '7e740a525d577c52dc8a73f72f783fee0669a7fd7356d8ef527a73813ba5c6647a3fa6b4a2234a136dadd5b747f82ffc8ebde5fd254c1c717f348c3523e18041', 'MGVbbBoO', 'https://yt3.ggpht.com/-0yvQTxOQRBM/AAAAAAAAAAI/AAAAAAAAAAA/sneZ7EhBKLc/s900-c-k-no-mo-rj-c0xffffff/photo.jpg', 1),
(3, 'Sanjana', 'sanjanakanstiya@gmail.com', '953d39c4f3cf3b919cc902f237201ea77ac72a0693a85235977b33f06c7d90dc4747dd8b23e6b74e19120281a44f3fbfa4c34439b8049a236821815eda1eb983', 'dXJAOir5', 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg', 1),
(5, 'Baalateja', 'kavesbteja@gmail.com', 'e864c75670487ae284959805e75daa03d020daec394cca0d00f98e99822b1b5dcb0616f22cfb8f66f0c1bf70b8e8163318f98aa7be5d4b932db9609c47315ddd', 'GQYtrjDA', 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/22539881_1087492361387685_6818352431950905173_n.jpg?oh=ac8bb695f67e1aa872a817ca25c4530e&oe=5B1C8A23', 1),
(6, 'YeshY', 'ykethineni@gmail.com', 'a6e313f479d500d4b3645b51efbc453c71c2c6f5968f8822e242f6a4058c2e1e3c2b6129e56557d8c0f86a572d9ae642e9adc9cc958aa39b93c983a7a0b0aaee', 'EPvnTPJ3', 'https://lh3.googleusercontent.com/-0-pm6YUyF9g/AAAAAAAAAAI/AAAAAAAAFro/swZ5VRqGNfE/s640/photo.jpg', 1),
(7, 'Rahul Tarak', 'rahultarak12345@live.com', '8ebf2e50dcecb67c207e44f48249b271cc04232c69cb0add337e29ce2acbd36d6b6961909b7f9124c359018b7402e8098ac937ad3228b3cc7971a7313c0db3a0', 'CqPCz9Ad', 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg', 1),
(8, 'Prafulla Herondale', 'prafullanagesh16@gmail.com', '71a597648d16aa852ee37995a704836f35737c7ec563f23a506864aa4d53280eb592ff6ad9a85b4efab5541cef9470adb68190b6b884dd526b0b0b5b2469bc17', '0YRazVpL', 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg', 1),
(9, 'HarikaB', 'harika.bhogaraju@gmail.com', '30283bfceed285015bb2b95406ff9f2090f58156c0d66839ccc95a462ed05e6981b1cc48d92a16cc2337114ea49a78019e7ba274629fd1e2bd104717fc00e8b0', 'm64aHpwk', 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
