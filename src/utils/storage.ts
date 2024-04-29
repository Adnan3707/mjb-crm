import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getStorageClient } from "../config/aws";
import { ENV } from "../constant/environment";

class Storage {
  private static instance: Storage;
  private storage: S3Client;
  private bucketName = ENV.AWS?.BUCKET_NAME ?? "";

  private constructor() {
    this.storage = getStorageClient();
  }

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  public async save(fileName: string, file: any): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });
    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.storage.send(deleteCommand);
    await this.storage.send(uploadCommand);
  }

  public async delete(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.storage.send(command);
  }

  public async getUrl(fileName: string) {
    return `https://${ENV.AWS.BUCKET_NAME}.s3.${ENV.AWS.REGION}.amazonaws.com/${fileName}`;
  }

  public async download(key: string) {
    const data = await this.storage.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
    return (await data.Body?.transformToString("utf8")) ?? "";
  }
}

export default Storage;
