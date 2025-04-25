import { authenticateUser, captureError } from './_apiUtils.js';
import { getDbClient } from './_db.js';

export default async function handler(req, res) {
  console.log('API Request: POST /api/addProject');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user.email);
    
    const db = getDbClient();
    const { name, startDate, endDate, colour } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    // Get user's organization
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, user.email),
    });
    
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    // Create new project
    const newProject = await db.insert(db.schema.projects).values({
      name,
      orgId: userRecord.orgId,
      startDate: startDate || null,
      endDate: endDate || null,
      colour: colour || null,
    }).returning();
    
    console.log('Created new project:', newProject[0].id);
    
    // Add current user as project member
    await db.insert(db.schema.projectMembers).values({
      projectId: newProject[0].id,
      userId: userRecord.id,
      accessRole: 'member',
    });
    
    res.status(201).json({ project: newProject[0] });
  } catch (error) {
    captureError(error, { path: '/api/addProject', body: req.body });
    res.status(500).json({ error: error.message });
  }
}