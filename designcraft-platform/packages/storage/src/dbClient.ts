import { MongoClient, Db, Collection } from 'mongodb';
import { Project, Page, PageVersion } from '@designcraft/types';

export class DatabaseClient {
  private client: MongoClient;
  private db: Db;
  private projects: Collection<Project>;
  private pages: Collection<Page>;
  private pageVersions: Collection<PageVersion>;

  constructor(connectionString: string, databaseName: string = 'designcraft') {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(databaseName);
    this.projects = this.db.collection<Project>('projects');
    this.pages = this.db.collection<Page>('pages');
    this.pageVersions = this.db.collection<PageVersion>('page_versions');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.projects.insertOne(newProject);
    return newProject;
  }

  async getProject(id: string): Promise<Project | null> {
    return await this.projects.findOne({ id });
  }

  async createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    const newPage: Page = {
      ...page,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.pages.insertOne(newPage);
    return newPage;
  }

  async getPage(id: string): Promise<Page | null> {
    return await this.pages.findOne({ id });
  }

  async createPageVersion(version: Omit<PageVersion, 'id' | 'createdAt'>): Promise<PageVersion> {
    const newVersion: PageVersion = {
      ...version,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    await this.pageVersions.insertOne(newVersion);
    return newVersion;
  }

  async getPageVersions(pageId: string): Promise<PageVersion[]> {
    return await this.pageVersions
      .find({ pageId })
      .sort({ version: -1 })
      .toArray();
  }

  async getLatestPageVersion(pageId: string): Promise<PageVersion | null> {
    return await this.pageVersions
      .find({ pageId })
      .sort({ version: -1 })
      .limit(1)
      .next();
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const result = await this.projects.findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async updatePage(id: string, updates: Partial<Page>): Promise<Page | null> {
    const result = await this.pages.findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await this.projects.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async deletePage(id: string): Promise<boolean> {
    const result = await this.pages.deleteOne({ id });
    return result.deletedCount > 0;
  }

  private generateId(): string {
    return `dc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
