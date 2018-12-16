-- exported databased incase i move to a cloud database 
--
-- Database: `stackoverflow`
--
CREATE DATABASE IF NOT EXISTS `stackoverflow` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `stackoverflow`;

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE IF NOT EXISTS `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `upvotes` int(11) DEFAULT '0',
  `date_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `user_id`, `description`, `upvotes`, `date_posted`) VALUES
(1, 9, 2, 'How to connect angularjs to java EE application with spring frameworkHow to connect angularjs to java EE application with spring frameworkvvvHow to connect angularjs to java EE application with spring frameworkHow to connect angularjs to java EE application with spring framework', 1, '2018-12-15 03:06:26'),
(2, 9, 2, 'This is an api for StackOverflow-lite platform where people can ask questions and provide answers.', 2, '2018-12-15 10:41:06'),
(3, 9, 1, 'This is an api for StackOverflow-lite platform where people can ask questions and provide answers.', 4, '2018-12-15 11:59:59'),
(4, 13, 2, 'the is an answer on deployment', 0, '2018-12-15 13:13:59');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `date_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `likes` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `answer_id` (`answer_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `question_id`, `answer_id`, `text`, `date_posted`, `likes`) VALUES
(1, 2, 9, 2, 'this is a sample comment for this post', '0000-00-00 00:00:00', 0),
(2, 2, 2, 2, 'this is another comments', '2018-12-15 12:44:19', 0),
(3, 1, 2, 2, 'this is the third comment', '2018-12-15 12:47:53', 0),
(5, 1, 13, 4, 'this is a comment on sarah`s answer', '2018-12-15 13:31:13', 0);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `votes` int(255) NOT NULL DEFAULT '0',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `user_id`, `title`, `description`, `votes`, `date_created`) VALUES
(1, 2, 'How do i connect my oracle database to with my node js api', 'How do i connect my oracle database to with my node js api. How do i connect my oracle database to with my node js api .How do i connect my oracle database to with my node js api How do i connect my oracle database to with my node js api How do i connect my oracle database to with my node js api.', 0, '2018-12-15 01:24:17'),
(2, 1, 'how to setup free ssl certificate for nodej app', 'How do i connect my oracle database to with my node js api. How do i connect my oracle database to with my node js api .How do i connect my oracle database to with my node js api How do i connect my oracle database to with my node js api How do i connect my oracle database to with my node js api.', 0, '2018-12-15 01:28:11'),
(9, 3, 'How to connect angularjs to java EE application with spring framework', 'How to connect angularjs to java EE application with spring frameworkHow to connect angularjs to java EE application with spring frameworkHow to connect angularjs to java EE application with spring frameworkHow to connect angularjs to java EE application with spring frameworkHow to connect angularjs to java EE application with spring framework', 0, '2018-12-15 03:04:02'),
(13, 1, 'How do i deploy my nodejs app on heroku server', 'How do i deploy my nodejs app on heroku serverHow do i deploy my nodejs app on heroku serverHow do i deploy my nodejs app on heroku serverHow do i deploy my nodejs app on heroku server', 0, '2018-12-15 13:03:27'),
(14, 1, 'how to troubleshoot windows7', 'how to troubleshoot windows7how to troubleshoot windows7vhow to troubleshoot windows7how to troubleshoot windows7', 0, '2018-12-15 15:58:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `datecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `datecreated`) VALUES
(1, 'Joseph Godwin', 'expertboy', 'expertboy', '2018-12-15 01:12:18'),
(2, 'sarah lee', 'sarahlee', 'sarahlee', '2018-12-15 01:13:23'),
(3, 'John Doe', 'johndoe', 'johndoe', '2018-12-15 01:16:44'),
(6, 'Stack Dev', 'stackdev', '$2a$08$YCVY.m6fzcs9eNe4r2nknu2NoXOtBUAYLdBPOxy8d.gFYUBSkM9Fe', '2018-12-15 17:33:38');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`),
  ADD CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
