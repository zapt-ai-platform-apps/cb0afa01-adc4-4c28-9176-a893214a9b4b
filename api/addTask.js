import { authenticateUser, captureError } from './_apiUtils.js';
import { getDbClient } from './_db.js';

export default async function handler(req, res) {
  console.log('API Request: POST /api/addTask');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user.email);
    
    const db = getDbClient();
    const { projectId, name, description, assigneeId, status, estimateHours, dueDate, priority } = req.body;
    
    if (!projectId || !name) {
      return res.status(400).json({ error: 'Project ID and task name are required' });
    }
    
    // Get user's database ID
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, user.email),
    });
    
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    // Get max order index for the project
    const maxOrderResult = await db.select({
      maxOrder: db.sql`MAX(${db.schema.tasks.orderIndex})`,
    }).from(db.schema.tasks)
      .where(eq(db.schema.tasks.projectId, projectId));
    
    const nextOrderIndex = (maxOrderResult[0]?.maxOrder || 0) + 1;
    
    // Create new task
    const newTask = await db.insert(db.schema.tasks).values({
      projectId,
      name,
      description: description || null,
      creatorId: userRecord.id,
      assigneeId: assigneeId || null,
      status: status || 'todo',
      estimateHours: estimateHours || null,
      dueDate: dueDate || null,
      priority: priority || 'med',
      orderIndex: nextOrderIndex,
    }).returning();
    
    console.log('Created new task:', newTask[0].id);
    
    res.status(201).json({ task: newTask[0] });
  } catch (error) {
    captureError(error, { path: '/api/addTask', body: req.body });
    res.status(500).json({ error: error.message });
  }
}