-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/prgi5R
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE `User` (
    `user_id` int AUTO_INCREMENT NOT NULL ,
    `user_name` nvarchar(255)  NOT NULL ,
    `user_dob` Datetime  NOT NULL ,
    `user_gender` boolean  NOT NULL ,
    `user_status` int  NOT NULL ,
    `user_phone` nvarchar(255)  NOT NULL ,
    `user_avatar` nvarchar(max)  NOT NULL ,
    `privacy` nvarchar(255)  NOT NULL ,
    `created_at` Datetime  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    `local_id` int  NOT NULL ,
    PRIMARY KEY (
        `user_id`
    )
);

CREATE TABLE `Location` (
    `location_id` int AUTO_INCREMENT NOT NULL ,
    `local_status` int  NOT NULL ,
    `local_name` nvarchar(255)  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `location_id`
    )
);

CREATE TABLE `Account` (
    `account_id` int AUTO_INCREMENT NOT NULL ,
    `role` int  NOT NULL ,
    `account_status` int  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `account_id`
    )
);

CREATE TABLE `Conversation` (
    `con_id` int AUTO_INCREMENT NOT NULL ,
    `user_one` int  NOT NULL ,
    `user_two` int  NOT NULL ,
    `create_at` Datetime  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `con_id`
    )
);

CREATE TABLE `Multimedia_Storage` (
    `multi_id` int AUTO_INCREMENT NOT NULL ,
    `user_id` int  NOT NULL ,
    `url` nvarchar(max)  NOT NULL ,
    `upload_at` Datetime  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `multi_id`
    )
);

CREATE TABLE `Pet` (
    `pet_id` int AUTO_INCREMENT NOT NULL ,
    `user_id` int  NOT NULL ,
    `pd_id` int  NOT NULL ,
    `pet_dob` Datetime  NOT NULL ,
    `pet_name` nvarchar(255)  NOT NULL ,
    `pet_gender` nvarchar(255)  NOT NULL ,
    `pet_avatar` nvarchar(max)  NOT NULL ,
    `pet_status` int  NOT NULL ,
    `introduction` nvarchar(max)  NOT NULL ,
    `create_at` Datetime  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `pet_id`
    )
);

CREATE TABLE `Pet_Breed` (
    `pet_breed_id` int AUTO_INCREMENT NOT NULL ,
    `pet_breed_name` nvarchar(255)  NOT NULL ,
    `pet_breed_status` int  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    `characteristic` nvarchar(max)  NOT NULL ,
    PRIMARY KEY (
        `pet_breed_id`
    )
);

CREATE TABLE `Pet_Feature` (
    `pet_id` int  NOT NULL ,
    `img_URL` nvarchar(max)  NOT NULL ,
    `uploaded_at` Datetime  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `pet_id`
    )
);

CREATE TABLE `Pet_match` (
    `match_id` int AUTO_INCREMENT NOT NULL ,
    `pet_id1` int  NOT NULL ,
    `pet_id2` int  NOT NULL ,
    `next_generation_id` int  NOT NULL ,
    `last_update` Datetime  NOT NULL ,
    PRIMARY KEY (
        `match_id`
    )
);

CREATE TABLE `Pet_next_generation` (
    `next_gene_id` int AUTO_INCREMENT NOT NULL ,
    `img_URL` nvarchar(max)  NOT NULL ,
    `upload_at` Datetime  NOT NULL ,
    `attribute` nvarchar(max)  NOT NULL ,
    PRIMARY KEY (
        `next_gene_id`
    )
);

ALTER TABLE `User` ADD CONSTRAINT `fk_User_local_id` FOREIGN KEY(`local_id`)
REFERENCES `Location` (`location_id`);

ALTER TABLE `Conversation` ADD CONSTRAINT `fk_Conversation_user_one` FOREIGN KEY(`user_one`)
REFERENCES `User` (`user_id`);

ALTER TABLE `Conversation` ADD CONSTRAINT `fk_Conversation_user_two` FOREIGN KEY(`user_two`)
REFERENCES `User` (`user_id`);

ALTER TABLE `Multimedia_Storage` ADD CONSTRAINT `fk_Multimedia_Storage_user_id` FOREIGN KEY(`user_id`)
REFERENCES `User` (`user_id`);

ALTER TABLE `Pet` ADD CONSTRAINT `fk_Pet_user_id` FOREIGN KEY(`user_id`)
REFERENCES `User` (`user_id`);

ALTER TABLE `Pet` ADD CONSTRAINT `fk_Pet_pd_id` FOREIGN KEY(`pd_id`)
REFERENCES `Pet_Breed` (`pet_breed_id`);

ALTER TABLE `Pet_Feature` ADD CONSTRAINT `fk_Pet_Feature_pet_id` FOREIGN KEY(`pet_id`)
REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD CONSTRAINT `fk_Pet_match_pet_id1` FOREIGN KEY(`pet_id1`)
REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD CONSTRAINT `fk_Pet_match_pet_id2` FOREIGN KEY(`pet_id2`)
REFERENCES `Pet` (`pet_id`);

ALTER TABLE `Pet_match` ADD CONSTRAINT `fk_Pet_match_next_generation_id` FOREIGN KEY(`next_generation_id`)
REFERENCES `Pet_next_generation` (`next_gene_id`);

