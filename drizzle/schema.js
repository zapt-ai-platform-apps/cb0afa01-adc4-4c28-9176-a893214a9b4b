import { pgTable, uuid, text, timestamp, numeric, boolean, integer, jsonb, date, foreignKey, uniqueIndex, index } from 'drizzle-orm/pg-core';

// Organizations Table
export const orgs = pgTable('org', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  plan: text('plan').notNull().default('free').$check(
    pgEnum => pgEnum.in(['free', 'starter', 'growth', 'enterprise'])
  ),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Users Table
export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => orgs.id),
  role: text('role').notNull().default('Member').$check(
    pgEnum => pgEnum.in(['Member', 'ProjectManager', 'ResourcePlanner', 'ClientGuest', 'Admin'])
  ),
  email: text('email').notNull(),
  pwdHash: text('pwd_hash'),
  avatarUrl: text('avatar_url'),
  lastSeenAt: timestamp('last_seen_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    emailOrgUnique: uniqueIndex('unique_email_per_org').on(table.orgId, table.email),
  };
});

// Projects Table
export const projects = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => orgs.id),
  name: text('name').notNull(),
  status: text('status').notNull().default('active').$check(
    pgEnum => pgEnum.in(['active', 'archived'])
  ),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  colour: text('colour'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Project Members Table
export const projectMembers = pgTable('project_member', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  accessRole: text('access_role').notNull().default('member').$check(
    pgEnum => pgEnum.in(['member', 'guest'])
  ),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    projectUserUnique: uniqueIndex('unique_project_user').on(table.projectId, table.userId),
  };
});

// Tasks Table
export const tasks = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  creatorId: uuid('creator_id').notNull().references(() => users.id),
  assigneeId: uuid('assignee_id').references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo').$check(
    pgEnum => pgEnum.in(['todo', 'doing', 'review', 'done'])
  ),
  estimateHours: numeric('estimate_hours'),
  dueDate: timestamp('due_date'),
  priority: text('priority').notNull().default('med').$check(
    pgEnum => pgEnum.in(['low', 'med', 'high'])
  ),
  orderIndex: integer('order_index'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    projectStatusIdx: index('idx_task_project_status').on(table.projectId, table.status),
  };
});

// Subtasks Table
export const subtasks = pgTable('subtask', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id),
  name: text('name').notNull(),
  done: boolean('done').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Comments Table
export const comments = pgTable('comment', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Files Table
export const files = pgTable('file', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id),
  fileUrl: text('file_url').notNull(),
  mime: text('mime').notNull(),
  sizeKb: integer('size_kb').notNull(),
  bucket: text('bucket').notNull().default('eu-filestore'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Time Entries Table
export const timeEntries = pgTable('time_entry', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  minutes: integer('minutes').notNull(),
  startedAt: timestamp('started_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Capacity Table
export const capacities = pgTable('capacity', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  date: date('date').notNull(),
  availableHours: numeric('available_hours').notNull().default('8'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    userDateUnique: uniqueIndex('unique_user_date').on(table.userId, table.date),
  };
});

// Absence Table
export const absences = pgTable('absence', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  dateFrom: date('date_from').notNull(),
  dateTo: date('date_to').notNull(),
  type: text('type').notNull().default('holiday').$check(
    pgEnum => pgEnum.in(['holiday', 'sick', 'other'])
  ),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Booking Table
export const bookings = pgTable('booking', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  allocatedHours: numeric('allocated_hours').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// OKR Table
export const okrs = pgTable('okr', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => orgs.id),
  title: text('title').notNull(),
  period: text('period').notNull().$check(
    pgEnum => pgEnum.in(['q1', 'q2', 'q3', 'q4'])
  ),
  progressPct: numeric('progress_pct').default('0'),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Key Results Table
export const keyResults = pgTable('key_result', {
  id: uuid('id').primaryKey().defaultRandom(),
  okrId: uuid('okr_id').notNull().references(() => okrs.id),
  title: text('title').notNull(),
  target: numeric('target').notNull(),
  current: numeric('current').notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Automation Table
export const automations = pgTable('automation', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => orgs.id),
  trigger: jsonb('trigger').notNull(),
  action: jsonb('action').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Audit Table
export const audits = pgTable('audit', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  tableName: text('table_name').notNull(),
  action: text('action').notNull(),
  before: jsonb('before'),
  after: jsonb('after'),
  ts: timestamp('ts').notNull().defaultNow(),
});