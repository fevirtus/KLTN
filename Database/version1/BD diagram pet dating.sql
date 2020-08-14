CREATE TABLE `User` (
  `user_id` int AUTO_INCREMENT,
  `user_name` nvarchar(255),
  `uid_login` nvarchar(max),
  `user_dob` Datetime,
  `user_gender` boolean,
  `user_email` nvarchar(max),
  `user_address` nvarchar(255),
  `user_phone` nvarchar(255),
  `user_avatar` nvarchar(max),
  `privacy` int,
  `is_block` int,
  `date_block` Datetime,
  `created_at` Datetime,
  `last_update` Datetime,
  `local_id` int,
  PRIMARY KEY (`user_id`, `uid_login`)
);

CREATE TABLE `User_Vip` (
  `user_id` int,
  `status` int,
  `confirm_img` nvarchar(max),
  `upload_at` Datetime,
  `date_start` Datetime
);

CREATE TABLE `Location` (
  `location_id` int PRIMARY KEY AUTO_INCREMENT,
  `local_latitude` double,
  `local_longitude` double,
  `last_update` Datetime
);

CREATE TABLE `Account` (
  `account_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_name` nvarchar(255),
  `password` nvarchar(255),
  `last_update` Datetime
);

CREATE TABLE `Conversation` (
  `con_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_one` int,
  `user_two` int,
  `create_at` Datetime,
  `last_update` Datetime
);

CREATE TABLE `Feedback` (
  `feedback_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_feedback` int,
  `content` vachar(max)
);

CREATE TABLE `Multimedia_Storage` (
  `multi_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `url` nvarchar(max),
  `upload_at` Datetime,
  `last_update` Datetime
);

CREATE TABLE `Pet` (
  `pet_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `pb_id` int,
  `pet_dob` Datetime,
  `pet_name` nvarchar(255),
  `pet_gender` nvarchar(255),
  `pet_avatar` nvarchar(max),
  `weight` double,
  `is_active` boolean,
  `pet_status` int,
  `introduction` nvarchar(max),
  `create_at` Datetime,
  `last_update` Datetime
);

CREATE TABLE `Pet_Breed` (
  `pet_breed_id` int PRIMARY KEY AUTO_INCREMENT,
  `pet_breed_name` nvarchar(255),
  `pet_breed_status` int,
  `last_update` Datetime,
  `characteristic` nvarchar(max)
);

CREATE TABLE `Pet_Feature` (
  `pet_id` int PRIMARY KEY,
  `img_URL` nvarchar(max),
  `uploaded_at` Datetime,
  `last_update` Datetime
);

CREATE TABLE `Pet_match` (
  `match_id` int PRIMARY KEY AUTO_INCREMENT,
  `pet_id1` int,
  `pet_id2` int,
  `last_update` Datetime,
  `p_next_generation` int
);

CREATE TABLE `Pet_next_generation` (
  `next_gene_id` int PRIMARY KEY AUTO_INCREMENT,
  `img_URL` nvarchar(max),
  `upload_at` Datetime,
  `attribute` nvarchar(max)
);

CREATE TABLE `Pet_reaction` (
  `reaction_id` int PRIMARY KEY AUTO_INCREMENT,
  `pet_id` int,
  `user_id` int,
  `reaction_time` Datetime,
  `reaction_status` int
);

ALTER TABLE `User` ADD FOREIGN KEY (`local_id`) REFERENCES `Location` (`location_id`);

ALTER TABLE `User_Vip` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Conversation` ADD FOREIGN KEY (`user_one`) REFERENCES `User` (`user_id`);

ALTER TABLE `Conversation` ADD FOREIGN KEY (`user_two`) REFERENCES `User` (`user_id`);

ALTER TABLE `Feedback` ADD FOREIGN KEY (`user_feedback`) REFERENCES `User` (`user_id`);

ALTER TABLE `Multimedia_Storage` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Pet` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Pet` ADD FOREIGN KEY (`pb_id`) REFERENCES `Pet_Breed` (`pet_breed_id`);

ALTER TABLE `Pet_Feature` ADD FOREIGN KEY (`pet_id`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD FOREIGN KEY (`pet_id1`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD FOREIGN KEY (`pet_id2`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD FOREIGN KEY (`p_next_generation`) REFERENCES `Pet_next_generation` (`next_gene_id`);

ALTER TABLE `Pet_reaction` ADD FOREIGN KEY (`pet_id`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_reaction` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

