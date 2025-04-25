import { authenticateUser, captureError } from './_apiUtils.js';
import { generatePresignedUploadUrl } from './_s3.js';
import { getDbClient } from './_db.js';

export default async function handler(req, res) {
  console.log('API Request: POST /api/getFileUploadUrl');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    console.log('Authenticated user:', user.email);
    
    const { fileName, contentType, taskId, fileSize } = req.body;
    
    if (!fileName || !contentType || !taskId || !fileSize) {
      return res.status(400).json({ 
        error: 'fileName, contentType, taskId, and fileSize are required' 
      });
    }
    
    // Get user's database ID
    const db = getDbClient();
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, user.email),
    });
    
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    // Generate upload URL
    const { url, key, bucket } = await generatePresignedUploadUrl(
      fileName, 
      contentType,
      userRecord.id
    );
    
    // Create file record in database
    const fileRecord = await db.insert(db.schema.files).values({
      taskId,
      fileUrl: `s3://${bucket}/${key}`,
      mime: contentType,
      sizeKb: Math.ceil(fileSize / 1024),
      bucket,
    }).returning();
    
    console.log('Created file record:', fileRecord[0].id);
    
    res.status(200).json({ 
      uploadUrl: url,
      fileId: fileRecord[0].id,
      key
    });
  } catch (error) {
    captureError(error, { path: '/api/getFileUploadUrl', body: req.body });
    res.status(500).json({ error: error.message });
  }
}