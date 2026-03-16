import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export interface AssetUploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  type: string;
}

export class AssetManager {
  private s3: S3;
  private bucketName: string;
  private region: string;

  constructor(bucketName: string, region: string, accessKeyId?: string, secretAccessKey?: string) {
    this.bucketName = bucketName;
    this.region = region;

    this.s3 = new S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: 'v4'
    });
  }

  async uploadFile(file: File, folder: string = 'uploads/'): Promise<AssetUploadResult> {
    const key = `${folder}${uuidv4()}-${file.name}`;
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read'
    };

    try {
      const result = await this.s3.upload(params).promise();
      
      return {
        url: result.Location,
        key: result.Key,
        filename: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Delete failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  getSignedUrl(key: string, expiresIn: number = 3600): string {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiresIn
    };

    return this.s3.getSignedUrl('getObject', params);
  }

  async listFiles(prefix: string = ''): Promise<string[]> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix
    };

    try {
      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents?.map(item => item.Key || '') || [];
    } catch (error) {
      console.error('List files failed:', error);
      throw new Error('Failed to list files');
    }
  }
}