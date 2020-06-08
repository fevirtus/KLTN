CREATE TABLE `User` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_name` nvarchar(255),
  `user_dob` Datetime,
  `user_gender` boolean,
  `user_status` int,
  `user_phone` nvarchar(255),
  `user_avatar` nvarchar(max),
  `privacy` nvarchar(255),
  `created_at` Datetime,
  `last_update` Datetime,
  `local_id` int
);

CREATE TABLE `Location` (
  `location_id` int PRIMARY KEY AUTO_INCREMENT,
  `local_status` int,
  `local_name` nvarchar(255),
  `last_update` Datetime
);

CREATE TABLE `Account` (
  `account_id` int PRIMARY KEY AUTO_INCREMENT,
  `role` int,
  `account_status` int,
  `last_update` Datetime
);

CREATE TABLE `Conversation` (
  `con_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_one` int,
  `user_two` int,
  `create_at` Datetime,
  `last_update` Datetime
);

CREATE TABLE `Followed` (
  `follow_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_follow` int,
  `user_taget` int
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
  `pd_id` int,
  `pet_dob` Datetime,
  `pet_name` nvarchar(255),
  `pet_gender` nvarchar(255),
  `pet_avatar` nvarchar(max),
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
  `user_id` int
);

ALTER TABLE `User` ADD FOREIGN KEY (`local_id`) REFERENCES `Location` (`location_id`);

ALTER TABLE `Conversation` ADD FOREIGN KEY (`user_one`) REFERENCES `User` (`user_id`);

ALTER TABLE `Conversation` ADD FOREIGN KEY (`user_two`) REFERENCES `User` (`user_id`);

ALTER TABLE `Followed` ADD FOREIGN KEY (`user_follow`) REFERENCES `User` (`user_id`);

ALTER TABLE `Followed` ADD FOREIGN KEY (`user_taget`) REFERENCES `User` (`user_id`);

ALTER TABLE `Multimedia_Storage` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Pet` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Pet` ADD FOREIGN KEY (`pd_id`) REFERENCES `Pet_Breed` (`pet_breed_id`);

ALTER TABLE `Pet_Feature` ADD FOREIGN KEY (`pet_id`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD FOREIGN KEY (`pet_id1`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD FOREIGN KEY (`pet_id2`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD FOREIGN KEY (`p_next_generation`) REFERENCES `Pet_next_generation` (`next_gene_id`);

ALTER TABLE `Pet_reaction` ADD FOREIGN KEY (`pet_id`) REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_reaction` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);
