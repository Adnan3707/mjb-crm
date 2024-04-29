import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from '../constant/environment';

const getStorageClient = () => new S3Client({
    region: ENV.AWS?.REGION,
    credentials: {
        accessKeyId: ENV.AWS?.ACCESS_KEY,
        secretAccessKey: ENV.AWS?.SECRET_KEY,
    },

})

export { getStorageClient };