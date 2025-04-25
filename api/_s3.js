import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

export function getS3Client() {
  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });
  
  return s3Client;
}

export async function generatePresignedUploadUrl(fileName, contentType, userId) {
  try {
    const s3Client = getS3Client();
    const bucket = process.env.S3_BUCKET_NAME;
    
    // Create a unique file ID to prevent overwrites
    const fileId = nanoid();
    const key = `uploads/${userId}/${fileId}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return {
      url,
      key,
      bucket,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}