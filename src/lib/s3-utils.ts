import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';


import s3 from '@/lib/aws';

const BUCKET_NAME = 'uc-application';

const getJsonFromS3 = async (fileName: string) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);
    const data = await s3.send(command);

    // Convert the stream to a buffer
    const streamToBuffer = (stream: any) =>
      new Promise<Buffer>((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk: any) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });

    const fileData = await streamToBuffer(data.Body);

    // Parse and return the JSON content
    return JSON.parse(fileData.toString('utf-8'));
  } catch (error) {
    console.error('Error fetching or parsing file from S3:', error);
    throw error; // Rethrow or handle accordingly
  }
};

export default getJsonFromS3;
