import { authenticateUser, captureError } from './_apiUtils.js';
import { getDbClient } from './_db.js';

export default async function handler(req, res) {
  console.log('API Request: GET /api/getOKRs');
  
  try {
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user.email);
    
    const db = getDbClient();
    
    // Get user's organization
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, user.email),
    });
    
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    // Get OKRs for the user's organization
    const okrs = await db.query.okrs.findMany({
      where: (okrs, { eq }) => eq(okrs.orgId, userRecord.orgId),
      with: {
        keyResults: true,
      },
      orderBy: (okrs, { desc }) => [desc(okrs.createdAt)],
    });
    
    console.log(`Found ${okrs.length} OKRs`);
    
    res.status(200).json({ okrs });
  } catch (error) {
    captureError(error, { path: '/api/getOKRs' });
    res.status(500).json({ error: error.message });
  }
}