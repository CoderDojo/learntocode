
DROP TABLE IF EXISTS `html`;

CREATE TABLE `html` (
  `id` mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
  `userid` mediumint(9),
  `html` varchar(500) NOT NULL DEFAULT '',
  `timeupdated` TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user` (`userid` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
