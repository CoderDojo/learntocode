
DROP TABLE IF EXISTS `css`;

CREATE TABLE `css` (
  `id` mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
  `userid` mediumint(9),
  `css` LONGTEXT NOT NULL DEFAULT '',
  `json` LONGTEXT NOT NULL DEFAULT '',
  `timeupdated` TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user` (`userid` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
