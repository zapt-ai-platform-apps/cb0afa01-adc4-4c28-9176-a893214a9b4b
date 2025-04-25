-- Create a demo organization
INSERT INTO "org" ("id", "name", "plan")
VALUES ('10000000-0000-0000-0000-000000000001', 'CreativeCo', 'growth')
ON CONFLICT DO NOTHING;

-- Create demo users
INSERT INTO "user" ("id", "org_id", "role", "email", "avatar_url")
VALUES 
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Admin', 'admin@creativeco.example', 'https://ui-avatars.com/api/?name=Admin&background=random'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'ProjectManager', 'pm@creativeco.example', 'https://ui-avatars.com/api/?name=Project+Manager&background=random'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Member', 'member@creativeco.example', 'https://ui-avatars.com/api/?name=Team+Member&background=random')
ON CONFLICT DO NOTHING;

-- Create demo projects
INSERT INTO "project" ("id", "org_id", "name", "status", "start_date", "end_date", "colour")
VALUES 
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Website Redesign', 'active', NOW(), NOW() + INTERVAL '30 days', '#38bdf8'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Marketing Campaign', 'active', NOW(), NOW() + INTERVAL '45 days', '#fb923c')
ON CONFLICT DO NOTHING;

-- Add users to projects
INSERT INTO "project_member" ("project_id", "user_id", "access_role")
VALUES 
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'member'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'member'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'member'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'member'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'member')
ON CONFLICT DO NOTHING;

-- Create demo tasks for Website Redesign project
INSERT INTO "task" ("project_id", "creator_id", "assignee_id", "name", "description", "status", "estimate_hours", "due_date", "priority", "order_index")
VALUES 
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Design homepage mockup', 'Create a new responsive design for the homepage', 'doing', 6, NOW() + INTERVAL '5 days', 'high', 1),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Implement navigation', 'Code the responsive navigation menu', 'todo', 4, NOW() + INTERVAL '7 days', 'med', 2),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Content migration', 'Move content from old site to new design', 'todo', 8, NOW() + INTERVAL '10 days', 'med', 3),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'SEO optimization', 'Update meta tags and improve page structure for SEO', 'todo', 5, NOW() + INTERVAL '12 days', 'high', 4),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Cross-browser testing', 'Test website in all major browsers', 'todo', 3, NOW() + INTERVAL '15 days', 'low', 5)
ON CONFLICT DO NOTHING;

-- Create demo tasks for Marketing Campaign project
INSERT INTO "task" ("project_id", "creator_id", "assignee_id", "name", "description", "status", "estimate_hours", "due_date", "priority", "order_index")
VALUES 
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Campaign strategy document', 'Create overall strategy for Q3 marketing campaign', 'doing', 8, NOW() + INTERVAL '3 days', 'high', 1),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Design social media assets', 'Create images for Instagram, Twitter and Facebook', 'todo', 6, NOW() + INTERVAL '6 days', 'med', 2),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Email sequence', 'Write 5-part email sequence for campaign', 'todo', 4, NOW() + INTERVAL '8 days', 'med', 3),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'PPC ad setup', 'Configure Google Ads campaigns', 'todo', 5, NOW() + INTERVAL '10 days', 'high', 4),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Campaign analytics', 'Set up reporting dashboard for campaign metrics', 'todo', 3, NOW() + INTERVAL '12 days', 'med', 5)
ON CONFLICT DO NOTHING;

-- Add subtasks
INSERT INTO "subtask" ("task_id", "name", "done")
SELECT "id", 'Research competitor designs', false 
FROM "task" 
WHERE "name" = 'Design homepage mockup'
AND NOT EXISTS (SELECT 1 FROM "subtask" WHERE "name" = 'Research competitor designs');

INSERT INTO "subtask" ("task_id", "name", "done")
SELECT "id", 'Create wireframes', false 
FROM "task" 
WHERE "name" = 'Design homepage mockup'
AND NOT EXISTS (SELECT 1 FROM "subtask" WHERE "name" = 'Create wireframes');

INSERT INTO "subtask" ("task_id", "name", "done")
SELECT "id", 'Mobile responsive design', false 
FROM "task" 
WHERE "name" = 'Design homepage mockup'
AND NOT EXISTS (SELECT 1 FROM "subtask" WHERE "name" = 'Mobile responsive design');

-- Create demo OKR
INSERT INTO "okr" ("id", "org_id", "title", "period", "progress_pct")
VALUES ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Q3 Company Goals', 'q3', 25)
ON CONFLICT DO NOTHING;

-- Create key results for the OKR
INSERT INTO "key_result" ("okr_id", "title", "target", "current")
VALUES 
('50000000-0000-0000-0000-000000000001', 'Increase website conversion rate', 5, 2),
('50000000-0000-0000-0000-000000000001', 'Launch new product features', 3, 0),
('50000000-0000-0000-0000-000000000001', 'Improve customer satisfaction score', 90, 75)
ON CONFLICT DO NOTHING;

-- Add absences
INSERT INTO "absence" ("user_id", "date_from", "date_to", "type")
VALUES 
('20000000-0000-0000-0000-000000000003', NOW() + INTERVAL '20 days', NOW() + INTERVAL '25 days', 'holiday'),
('20000000-0000-0000-0000-000000000002', NOW() + INTERVAL '15 days', NOW() + INTERVAL '16 days', 'sick')
ON CONFLICT DO NOTHING;

-- Create automation
INSERT INTO "automation" ("org_id", "trigger", "action", "active")
VALUES 
('10000000-0000-0000-0000-000000000001', 
 '{"type": "task_status_changed", "conditions": {"status": "review"}}',
 '{"type": "notify_slack", "channel": "#qa", "message": "Task moved to review: {{task.name}}"}',
 true)
ON CONFLICT DO NOTHING;