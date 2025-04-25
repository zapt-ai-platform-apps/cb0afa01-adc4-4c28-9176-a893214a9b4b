-- Organizations Table
CREATE TABLE IF NOT EXISTS "org" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "plan" TEXT NOT NULL DEFAULT 'free' CHECK ("plan" IN ('free', 'starter', 'growth', 'enterprise')),
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Users Table
CREATE TABLE IF NOT EXISTS "user" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" UUID NOT NULL REFERENCES "org"("id"),
  "role" TEXT NOT NULL DEFAULT 'Member' CHECK ("role" IN ('Member', 'ProjectManager', 'ResourcePlanner', 'ClientGuest', 'Admin')),
  "email" TEXT NOT NULL,
  "pwd_hash" TEXT,
  "avatar_url" TEXT,
  "last_seen_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "unique_email_per_org" UNIQUE ("org_id", "email")
);

-- Projects Table
CREATE TABLE IF NOT EXISTS "project" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" UUID NOT NULL REFERENCES "org"("id"),
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'archived')),
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "colour" TEXT,
  "deleted_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Project Members Table
CREATE TABLE IF NOT EXISTS "project_member" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "project"("id"),
  "user_id" UUID NOT NULL REFERENCES "user"("id"),
  "access_role" TEXT NOT NULL DEFAULT 'member' CHECK ("access_role" IN ('member', 'guest')),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "unique_project_user" UNIQUE ("project_id", "user_id")
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS "task" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "project"("id"),
  "creator_id" UUID NOT NULL REFERENCES "user"("id"),
  "assignee_id" UUID REFERENCES "user"("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'todo' CHECK ("status" IN ('todo', 'doing', 'review', 'done')),
  "estimate_hours" NUMERIC,
  "due_date" TIMESTAMP,
  "priority" TEXT NOT NULL DEFAULT 'med' CHECK ("priority" IN ('low', 'med', 'high')),
  "order_index" INTEGER,
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create index on task table for project_id and status
CREATE INDEX IF NOT EXISTS "idx_task_project_status" ON "task"("project_id", "status");

-- Subtasks Table
CREATE TABLE IF NOT EXISTS "subtask" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL REFERENCES "task"("id"),
  "name" TEXT NOT NULL,
  "done" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Comments Table
CREATE TABLE IF NOT EXISTS "comment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL REFERENCES "task"("id"),
  "user_id" UUID NOT NULL REFERENCES "user"("id"),
  "body" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Files Table
CREATE TABLE IF NOT EXISTS "file" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL REFERENCES "task"("id"),
  "file_url" TEXT NOT NULL,
  "mime" TEXT NOT NULL,
  "size_kb" INTEGER NOT NULL,
  "bucket" TEXT NOT NULL DEFAULT 'eu-filestore',
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Time Entries Table
CREATE TABLE IF NOT EXISTS "time_entry" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL REFERENCES "task"("id"),
  "user_id" UUID NOT NULL REFERENCES "user"("id"),
  "minutes" INTEGER NOT NULL,
  "started_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Capacity Table
CREATE TABLE IF NOT EXISTS "capacity" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "user"("id"),
  "date" DATE NOT NULL,
  "available_hours" NUMERIC NOT NULL DEFAULT 8,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "unique_user_date" UNIQUE ("user_id", "date")
);

-- Absence Table
CREATE TABLE IF NOT EXISTS "absence" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "user"("id"),
  "date_from" DATE NOT NULL,
  "date_to" DATE NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'holiday' CHECK ("type" IN ('holiday', 'sick', 'other')),
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Booking Table
CREATE TABLE IF NOT EXISTS "booking" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL REFERENCES "task"("id"),
  "user_id" UUID NOT NULL REFERENCES "user"("id"),
  "allocated_hours" NUMERIC NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- OKR Table
CREATE TABLE IF NOT EXISTS "okr" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" UUID NOT NULL REFERENCES "org"("id"),
  "title" TEXT NOT NULL,
  "period" TEXT NOT NULL CHECK ("period" IN ('q1', 'q2', 'q3', 'q4')),
  "progress_pct" NUMERIC DEFAULT 0,
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Key Results Table
CREATE TABLE IF NOT EXISTS "key_result" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "okr_id" UUID NOT NULL REFERENCES "okr"("id"),
  "title" TEXT NOT NULL,
  "target" NUMERIC NOT NULL,
  "current" NUMERIC NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Automation Table
CREATE TABLE IF NOT EXISTS "automation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" UUID NOT NULL REFERENCES "org"("id"),
  "trigger" JSONB NOT NULL,
  "action" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Audit Table
CREATE TABLE IF NOT EXISTS "audit" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID REFERENCES "user"("id"),
  "table_name" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "ts" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create summary view for projects
CREATE OR REPLACE VIEW "v_project_summary" AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.status as project_status,
  p.start_date,
  p.end_date,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT pm.user_id) as team_members,
  SUM(t.estimate_hours) as total_estimated_hours,
  SUM(te.minutes) / 60.0 as total_logged_hours
FROM "project" p
LEFT JOIN "task" t ON p.id = t.project_id AND t.deleted_at IS NULL
LEFT JOIN "project_member" pm ON p.id = pm.project_id
LEFT JOIN "time_entry" te ON t.id = te.task_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.status, p.start_date, p.end_date;