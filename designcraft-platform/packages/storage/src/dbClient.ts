import { Pool, PoolClient } from 'pg';
import { Project, Page, PageVersion } from '@designcraft/types';

export class DatabaseClient {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const query = `
      INSERT INTO projects (name, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [project.name, project.description, project.userId];
    const result = await this.pool.query(query, values);
    
    return result.rows[0];
  }

  async getProject(id: string): Promise<Project | null> {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  async createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    const query = `
      INSERT INTO pages (project_id, name, slug, document_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [page.projectId, page.name, page.slug, page.documentId];
    const result = await this.pool.query(query, values);
    
    return result.rows[0];
  }

  async getPage(id: string): Promise<Page | null> {
    const query = 'SELECT * FROM pages WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  async createPageVersion(version: Omit<PageVersion, 'id' | 'createdAt'>): Promise<PageVersion> {
    const query = `
      INSERT INTO page_versions (page_id, document, version, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [version.pageId, JSON.stringify(version.document), version.version, version.createdBy];
    const result = await this.pool.query(query, values);
    
    return {
      ...result.rows[0],
      document: JSON.parse(result.rows[0].document)
    };
  }

  async getPageVersions(pageId: string): Promise<PageVersion[]> {
    const query = `
      SELECT * FROM page_versions 
      WHERE page_id = $1 
      ORDER BY version DESC
    `;
    
    const result = await this.pool.query(query, [pageId]);
    
    return result.rows.map(row => ({
      ...row,
      document: JSON.parse(row.document)
    }));
  }

  async getLatestPageVersion(pageId: string): Promise<PageVersion | null> {
    const query = `
      SELECT * FROM page_versions 
      WHERE page_id = $1 
      ORDER BY version DESC 
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [pageId]);
    
    if (result.rows.length === 0) return null;
    
    return {
      ...result.rows[0],
      document: JSON.parse(result.rows[0].document)
    };
  }
}