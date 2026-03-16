import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export interface AssetUploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  type: string;
}

export class AssetManager {
  private supabase: any;
  private bucketName: string;

  constructor(supabaseUrl: string, supabaseKey: string, bucketName: string = 'assets') {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.bucketName = bucketName;
  }

  async uploadFile(file: File, folder: string = 'uploads/'): Promise<AssetUploadResult> {
    const path = `${folder}${uuidv4()}-${file.name}`;
    
    try {
      const { data, error } = await this.supabase
        .storage
        .from(this.bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicData } = this.supabase
        .storage
        .from(this.bucketName)
        .getPublicUrl(path);

      return {
        url: publicData.publicUrl,
        path: path,
        filename: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Delete failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  getSignedUrl(path: string, expiresIn: number = 3600): string {
    const { data } = this.supabase
      .storage
      .from(this.bucketName)
      .createSignedUrl(path, expiresIn);

    return data.signedUrl;
  }

  async listFiles(path: string = ''): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .storage
        .from(this.bucketName)
        .list(path, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        throw error;
      }

      return data?.map((item: any) => item.name) || [];
    } catch (error) {
      console.error('List files failed:', error);
      throw new Error('Failed to list files');
    }
  }

  async downloadFile(path: string): Promise<Blob> {
    try {
      const { data, error } = await this.supabase
        .storage
        .from(this.bucketName)
        .download(path);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download file');
    }
  }
}
