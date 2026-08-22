import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListBucketsCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// MinIO Configuration
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const MINIO_REGION = process.env.MINIO_REGION || 'us-east-1';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'indexorbit';

// S3 Client (MinIO uses S3-compatible API)
export const s3Client = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: MINIO_REGION,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

// Generate unique filename
export function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${random}.${ext}`;
}

// Upload file to MinIO
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<string> {
  const key = `${folder}/${generateFileName(fileName)}`;

  const command = new PutObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return the file path/URL
  return `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${key}`;
}

// Get presigned URL for download (for private files)
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

// Delete file from MinIO
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

// List buckets
export async function listBuckets(): Promise<string[]> {
  const command = new ListBucketsCommand({});
  const response = await s3Client.send(command);
  return response.Buckets?.map(b => b.Name || '') || [];
}

// Create bucket if not exists
export async function ensureBucket(): Promise<void> {
  try {
    const command = new CreateBucketCommand({
      Bucket: MINIO_BUCKET,
    });
    await s3Client.send(command);
    console.log(`Bucket ${MINIO_BUCKET} created or already exists`);
  } catch (error: any) {
    if (error.name !== 'BucketAlreadyOwnedByYou' && error.name !== 'BucketAlreadyExists') {
      throw error;
    }
    console.log(`Bucket ${MINIO_BUCKET} already exists`);
  }
}

// Extract key from MinIO URL
export function extractKey(url: string): string {
  return url.replace(`${MINIO_ENDPOINT}/${MINIO_BUCKET}/`, '');
}

// Get public URL for file
export function getPublicUrl(key: string): string {
  return `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${key}`;
}

// File type restrictions
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFileType(fileType: string): boolean {
  return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES].includes(fileType);
}

export function validateFileSize(fileSize: number): boolean {
  return fileSize <= MAX_FILE_SIZE;
}
