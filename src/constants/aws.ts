import { S3Client } from '@aws-sdk/client-s3';
import config from '../app/config';

export const s3Client = new S3Client({
  region: `${config.aws.region}`,
  credentials: {
    accessKeyId: `${config.aws.accessKeyId}`,
    secretAccessKey: `${config.aws.secretAccessKey}`,
  },
});
