
DROP TABLE IF EXISTS `html`;

CREATE TABLE `html` (
  `id` mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
  `userid` mediumint(9),
  `html` LONGTEXT NOT NULL DEFAULT '',
  `html_uuid` varchar(50) NOT NULL DEFAULT '',
  `timeupdated` TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user` (`userid` ASC),
  UNIQUE INDEX `html_uuid` (`html_uuid` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
