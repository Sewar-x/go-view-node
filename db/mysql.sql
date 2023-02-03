SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Led_Projectdatas
-- ----------------------------
DROP TABLE IF EXISTS `Led_Projectdatas`;
CREATE TABLE `Led_Projectdatas` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProjectId` int NOT NULL,
  `CreateTime` datetime(6) DEFAULT NULL,
  `CreateUserId` int DEFAULT NULL,
  `ContentData` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


-- ----------------------------
-- Table structure for Led_Projects
-- ----------------------------
DROP TABLE IF EXISTS `Led_Projects`;
CREATE TABLE `Led_Projects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProjectName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `State` int NOT NULL,
  `CreateTime` datetime(6) DEFAULT NULL,
  `CreateUserId` int DEFAULT NULL,
  `IsDelete` int NOT NULL,
  `IndexImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `Remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for pf_user
-- ----------------------------
DROP TABLE IF EXISTS `pf_user`;
CREATE TABLE `pf_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
  `nick` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
  `salt` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '盐',
  `birthday` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '生日',
  `gender` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '性别',
  `email` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机',
  `state` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '状态',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '简介',
  `login_count` int DEFAULT NULL COMMENT '登录次数',
  `previous_visit` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '上次登录时间',
  `last_visit` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后登录时间',
  `del_flag` int DEFAULT NULL COMMENT '删除标记',
  `last_visit_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '最后登陆IP',
  `depart_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '部门编号',
  `avatar_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `source` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inviteman` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邀请人',
  `company_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '-1' COMMENT '公司id',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `created_by` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创建人',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `updated_by` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_User_id` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of pf_user
-- ----------------------------
BEGIN;
INSERT INTO `pf_user` (`id`, `username`, `nick`, `password`, `salt`, `birthday`, `gender`, `email`, `phone`, `state`, `description`, `login_count`, `previous_visit`, `last_visit`, `del_flag`, `last_visit_ip`, `depart_no`, `avatar_url`, `source`, `inviteman`, `company_id`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES (1, 'admin', '管理员', '$2a$10$qZA9J6wMpUw2s9BHl0sv9eHHTe2rw2lv5kQ2uq.eJbVR1OKFKEfy.', '$2a$10$qZA9J6wMpUw2s9BHl0sv9e', '', '1', '285861181@qq.com', '15571981868', NULL, '', NULL, NULL, NULL, 0, '', NULL, NULL, NULL, NULL, 'dc3c7050-5486-11ea-b47c-6d1213299572', '2017-10-04 19:22:05', NULL, '2020-01-03 17:26:44', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
