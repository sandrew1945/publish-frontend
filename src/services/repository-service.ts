import { backendApi } from '@/lib/api-client';
import { RepoDTO } from '@/types/backend-types';

export interface RepositoryFilter {
  repoName?: string;
  ownerId?: number;
  status?: number;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

// NOTE: Field names match the backend Java PageResult serialized JSON, NOT MyBatis-Plus IPage convention.
export interface PageResult<T> {
  records: T[];
  totalRecords: number;
  pageSize: number;
  curPage: number;
  totalPages: number;
}

export const repositoryService = {
  async getRepositories(
    filter: RepositoryFilter,
    pageParams: PageParams
  ): Promise<PageResult<RepoDTO>> {
    const response = await backendApi.repository.repoPageQuery({
      ...filter,
      curPage: pageParams.page,
      limit: pageParams.pageSize,
    });
    const result = response.data.data as unknown as PageResult<RepoDTO>;
    if (result && result.records) {
      // Parse comma-separated collaborator IDs from the backend string field
      result.records = result.records.map((repo) => ({
        ...repo,
        collaboratorIds: repo.collaboratorIdsString
          ? repo.collaboratorIdsString.split(',').map(Number)
          : [],
      }));
    }
    return result;
  },

  async createRepository(repo: RepoDTO): Promise<void> {
    await backendApi.repository.createRepo(repo);
  },

  async updateRepository(repo: RepoDTO): Promise<void> {
    await backendApi.repository.updateRepo(repo);
  },

  async deleteRepository(repoId: number): Promise<void> {
    await backendApi.repository.deleteRepo({ repoId });
  },

  async validateRepoName(repoName: string): Promise<boolean> {
    // Use repoPageQuery to check if the exact name exists
    try {
      const response = await backendApi.repository.repoPageQuery({
        repoName,
        curPage: 1,
        limit: 10,
      });
      const records = (response.data.data as unknown as PageResult<RepoDTO>)?.records || [];
      const exists = records.some((r) => r.repoName === repoName);
      return !exists; // true if valid (name does not exist)
    } catch (error) {
      console.error('Failed to validate repo name', error);
      return true;
    }
  },
};
