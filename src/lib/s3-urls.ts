import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3 from '@/lib/aws';

const BUCKET_NAME = 'uc-application';


export async function getSignedS3Url(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME!,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
  return url;
}