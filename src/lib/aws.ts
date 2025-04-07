import { S3Client } from '@aws-sdk/client-s3';

// Initialize the S3 client
const s3 = new S3Client({
    region: 'ap-south-1', // Correct region for Mumbai
    credentials: {
      accessKeyId: 'AKIASRRB7DVG24BETOHB', // Use your actual Access Key
      secretAccessKey: 'C28kHL0XtPM60qgnM3TA89wrlwKSLLmkczdI3HdO', // Use your actual Secret Key
    },
  });

export default s3;

