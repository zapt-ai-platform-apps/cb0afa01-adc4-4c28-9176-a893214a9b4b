import { authenticateUser, captureError } from './_apiUtils.js';
import { getDbClient } from './_db.js';
import { eq, and, isNull } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('API Request: GET /api/getProjectTasks', req.query);
  
  if (!req.query.projectId) {
    return res.status(400).json({ error: 'projectId is required' });
  }

  try {
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user.email);
    
    const db = getDbClient();
    const projectId = req.query.projectId;
    
    // Get tasks for the project
    const tasks = await db.query.tasks.findMany({
      where: (tasks, { eq, and, isNull }) => (
        and(
          eq(tasks.projectId, projectId),
          isNull(tasks.deletedAt)
        )
      ),
      with: {
        subtasks: true,
        assignee: true,
      },
      orderBy: (tasks, { asc }) => [asc(tasks.orderIndex)],
    });
    
    console.log(`Found ${tasks.length} tasks for project ${projectId}`);
    
    res.status(200).json({ tasks });
  } catch (error) {
    captureError(error, { path: '/api/getProjectTasks', projectId: req.query.projectId });
    res.status(500).json({ error: error.message });
  }
}