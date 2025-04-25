import { authenticateUser, captureError } from './_apiUtils.js';
import { getDbClient } from './_db.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('API Request: GET /api/getProjects');
  
  try {
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user.email);
    
    const db = getDbClient();
    
    // Get projects for the user's organization
    const projects = await db.query.projects.findMany({
      where: (projects, { isNull }) => isNull(projects.deletedAt),
      with: {
        projectMembers: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });
    
    console.log(`Found ${projects.length} projects`);
    
    res.status(200).json({ projects });
  } catch (error) {
    captureError(error, { path: '/api/getProjects' });
    res.status(500).json({ error: error.message });
  }
}