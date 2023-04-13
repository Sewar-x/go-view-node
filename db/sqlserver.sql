
-- ----------------------------
-- Table structure for api
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[api]') AND type IN ('U'))
	DROP TABLE [dbo].[api]
GO

CREATE TABLE [dbo].[api] (
  [id] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [description] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [script] nvarchar(2000) COLLATE Chinese_PRC_CI_AS  NULL,
  [use] int DEFAULT 0 NULL,
  [script_type] nvarchar(1) COLLATE Chinese_PRC_CI_AS  NULL,
  [remark] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [created_by] nvarchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [updated_by] nvarchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [realm] varchar(12) COLLATE Chinese_PRC_CI_AS  NULL,
  [name] varchar(128) COLLATE Chinese_PRC_CI_AS  NULL,
  [created_at] datetime  NULL,
  [updated_at] datetime  NULL,
  [exec_type] varchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [exec_count] bigint  NULL
)
GO

ALTER TABLE [dbo].[api] SET (LOCK_ESCALATION = TABLE)
GO

EXEC sp_addextendedproperty
'MS_Description', N'sqlserver-配合spc进行配置',
'SCHEMA', N'dbo',
'TABLE', N'api',
'COLUMN', N'script'
GO

EXEC sp_addextendedproperty
'MS_Description', N'0未启用，1启用',
'SCHEMA', N'dbo',
'TABLE', N'api',
'COLUMN', N'use'
GO

EXEC sp_addextendedproperty
'MS_Description', N'0普通sql，1无返回值存储过程，2带返回值存储过程，3执行存储过程返回多个SELECT',
'SCHEMA', N'dbo',
'TABLE', N'api',
'COLUMN', N'script_type'
GO

EXEC sp_addextendedproperty
'MS_Description', N'领域',
'SCHEMA', N'dbo',
'TABLE', N'api',
'COLUMN', N'realm'
GO

EXEC sp_addextendedproperty
'MS_Description', N'名称',
'SCHEMA', N'dbo',
'TABLE', N'api',
'COLUMN', N'name'
GO


-- ----------------------------
-- Table structure for Projectdatas
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Projectdatas]') AND type IN ('U'))
	DROP TABLE [dbo].[Projectdatas]
GO

CREATE TABLE [dbo].[Projectdatas] (
  [Id] int  NOT NULL,
  [ProjectId] int  NOT NULL,
  [CreateTime] datetime2(7)  NULL,
  [CreateUserId] int  NULL,
  [ContentData] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [created_at] datetime2(7)  NULL,
  [updated_at] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Projectdatas] SET (LOCK_ESCALATION = TABLE)
GO

EXEC sp_addextendedproperty
'MS_Description', N'创建时间',
'SCHEMA', N'dbo',
'TABLE', N'Projectdatas',
'COLUMN', N'created_at'
GO

EXEC sp_addextendedproperty
'MS_Description', N'更新时间',
'SCHEMA', N'dbo',
'TABLE', N'Projectdatas',
'COLUMN', N'updated_at'
GO


-- ----------------------------
-- Table structure for Projects
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Projects]') AND type IN ('U'))
	DROP TABLE [dbo].[Projects]
GO

CREATE TABLE [dbo].[Projects] (
  [Id] int  NOT NULL,
  [ProjectName] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [State] int  NOT NULL,
  [CreateTime] datetime2(7)  NULL,
  [CreateUserId] int  NULL,
  [IsDelete] int  NOT NULL,
  [IndexImage] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [Remarks] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [created_at] datetime2(7)  NULL,
  [updated_at] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[Projects] SET (LOCK_ESCALATION = TABLE)
GO

EXEC sp_addextendedproperty
'MS_Description', N'创建时间',
'SCHEMA', N'dbo',
'TABLE', N'Projects',
'COLUMN', N'created_at'
GO

EXEC sp_addextendedproperty
'MS_Description', N'更新时间',
'SCHEMA', N'dbo',
'TABLE', N'Projects',
'COLUMN', N'updated_at'
GO


-- ----------------------------
-- Table structure for users
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type IN ('U'))
	DROP TABLE [dbo].[users]
GO

CREATE TABLE [dbo].[users] (
  [id] int  NOT NULL,
  [username] nvarchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [nick] nvarchar(64) COLLATE Chinese_PRC_CI_AS  NULL,
  [password] nvarchar(64) COLLATE Chinese_PRC_CI_AS  NULL,
  [salt] nvarchar(64) COLLATE Chinese_PRC_CI_AS  NULL,
  [birthday] nvarchar(12) COLLATE Chinese_PRC_CI_AS  NULL,
  [gender] nvarchar(12) COLLATE Chinese_PRC_CI_AS  NULL,
  [email] nvarchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [phone] nvarchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [state] nvarchar(12) COLLATE Chinese_PRC_CI_AS  NULL,
  [description] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [login_count] int  NULL,
  [previous_visit] nvarchar(12) COLLATE Chinese_PRC_CI_AS  NULL,
  [last_visit] nvarchar(12) COLLATE Chinese_PRC_CI_AS  NULL,
  [del_flag] int  NULL,
  [last_visit_ip] nvarchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [depart_no] nvarchar(32) COLLATE Chinese_PRC_CI_AS  NULL,
  [avatar_url] nvarchar(128) COLLATE Chinese_PRC_CI_AS  NULL,
  [source] nvarchar(64) COLLATE Chinese_PRC_CI_AS  NULL,
  [inviteman] nvarchar(64) COLLATE Chinese_PRC_CI_AS  NULL,
  [company_id] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [created_at] datetime2(7)  NULL,
  [created_by] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NULL,
  [updated_at] datetime2(7)  NULL,
  [updated_by] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NULL
)
GO

ALTER TABLE [dbo].[users] SET (LOCK_ESCALATION = TABLE)
GO

EXEC sp_addextendedproperty
'MS_Description', N'用户名',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'username'
GO

EXEC sp_addextendedproperty
'MS_Description', N'昵称',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'nick'
GO

EXEC sp_addextendedproperty
'MS_Description', N'密码',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'password'
GO

EXEC sp_addextendedproperty
'MS_Description', N'盐',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'salt'
GO

EXEC sp_addextendedproperty
'MS_Description', N'生日',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'birthday'
GO

EXEC sp_addextendedproperty
'MS_Description', N'性别',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'gender'
GO

EXEC sp_addextendedproperty
'MS_Description', N'邮箱',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'email'
GO

EXEC sp_addextendedproperty
'MS_Description', N'手机',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'phone'
GO

EXEC sp_addextendedproperty
'MS_Description', N'状态',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'state'
GO

EXEC sp_addextendedproperty
'MS_Description', N'简介',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'description'
GO

EXEC sp_addextendedproperty
'MS_Description', N'登录次数',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'login_count'
GO

EXEC sp_addextendedproperty
'MS_Description', N'上次登录时间',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'previous_visit'
GO

EXEC sp_addextendedproperty
'MS_Description', N'最后登录时间',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'last_visit'
GO

EXEC sp_addextendedproperty
'MS_Description', N'删除标记',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'del_flag'
GO

EXEC sp_addextendedproperty
'MS_Description', N'最后登陆IP',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'last_visit_ip'
GO

EXEC sp_addextendedproperty
'MS_Description', N'部门编号',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'depart_no'
GO

EXEC sp_addextendedproperty
'MS_Description', N'头像地址',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'avatar_url'
GO

EXEC sp_addextendedproperty
'MS_Description', N'邀请人',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'inviteman'
GO

EXEC sp_addextendedproperty
'MS_Description', N'公司id',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'company_id'
GO

EXEC sp_addextendedproperty
'MS_Description', N'创建时间',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'created_at'
GO

EXEC sp_addextendedproperty
'MS_Description', N'创建人',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'created_by'
GO

EXEC sp_addextendedproperty
'MS_Description', N'更新时间',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'updated_at'
GO

EXEC sp_addextendedproperty
'MS_Description', N'更新人',
'SCHEMA', N'dbo',
'TABLE', N'users',
'COLUMN', N'updated_by'
GO


-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN TRANSACTION
GO

INSERT INTO [dbo].[users] ([id], [username], [nick], [password], [salt], [birthday], [gender], [email], [phone], [state], [description], [login_count], [previous_visit], [last_visit], [del_flag], [last_visit_ip], [depart_no], [avatar_url], [source], [inviteman], [company_id], [created_at], [created_by], [updated_at], [updated_by]) VALUES (N'1', N'admin', N'管理员', N'$2a$10$qZA9J6wMpUw2s9BHl0sv9eHHTe2rw2lv5kQ2uq.eJbVR1OKFKEfy.', N'$2a$10$qZA9J6wMpUw2s9BHl0sv9e', N'', N'1', N'285861181@qq.com', N'15571981868', NULL, N'', NULL, NULL, NULL, N'0', N'', NULL, NULL, NULL, NULL, N'dc3c7050-5486-11ea-b47c-6d1213299572', N'2017-10-04 19:22:05.0000000', NULL, N'2020-01-03 17:26:44.0000000', NULL)
GO

COMMIT
GO

-- ----------------------------
-- Primary Key structure for table api
-- ----------------------------
ALTER TABLE [dbo].[api] ADD CONSTRAINT [PK__api__3213E83F21A47CD4] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Projectdatas
-- ----------------------------
ALTER TABLE [dbo].[Projectdatas] ADD CONSTRAINT [PK__Led_Proj__3214EC07394CA0D4] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Projects
-- ----------------------------
ALTER TABLE [dbo].[Projects] ADD CONSTRAINT [PK__Led_Proj__3214EC07A9BC41B5] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
ON [PRIMARY]
GO




INSERT INTO [dbo].[api] ([id], [description], [script], [use], [script_type], [remark], [created_by], [updated_by], [realm], [name], [created_at], [updated_at], [exec_type], [exec_count]) VALUES (N'021ea7a0-d878-11ea-a6ca-35634091a02b', N'查询-分页', N'SELECT
	COUNT(*) AS total
FROM
	bm_ipinfo
WHERE
	plineno = ''@line@''
	AND station=''@station@'';
SELECT
	w2.n,
	w1.*
FROM
	(
	SELECT
		*
	FROM
		bm_ipinfo
	WHERE
	plineno = ''@line@''
	AND station=''@station@''
	) w1,
	( SELECT TOP ( @offset@ + @rows@) row_number ( ) OVER ( ORDER BY ID DESC ) n, ID FROM bm_ipinfo WHERE
	plineno = ''@line@''
	AND station=''@station@'' ) w2
WHERE
	w1.ID = w2.ID
	AND w2.n > @offset@
ORDER BY
	w2.n ASC', 1, N'0', NULL, NULL, NULL, NULL, NULL, '2023-03-20 10:53:10.000', '2023-03-20 10:53:10.000', NULL, 59);
INSERT INTO [dbo].[api] ([id], [description], [script], [use], [script_type], [remark], [created_by], [updated_by], [realm], [name], [created_at], [updated_at], [exec_type], [exec_count]) VALUES (N'd318279e-c6c0-11ed-a3da-e86a64995474', N'查询-不分页', N'SELECT
	*
FROM
	bm_ipinfo
WHERE
	plineno = ''@line@''
	AND station=''@station@'';', 1, N'0', NULL, NULL, NULL, NULL, NULL, '2023-03-20 10:55:12.000', '2023-03-20 10:55:12.000', NULL, 62);