// api/subredditApi.ts

import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  Subreddit, 
  SubredditResponse, 
  GetSubredditsParams,
  APIResponse,
  FilterOptions,
  SortOptions 
} from '../types/subreddit';

class SubredditAPI {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://communities-api.amanmamgain9.workers.dev/api/communities';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleApiError(error)
    );
  }

  private handleApiError(error: AxiosError): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        error.response.data?.message || 
        `API Error: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request: ' + error.message);
    }
  }

  private buildQueryParams({
    page = 1,
    pageSize = 20,
    filters,
    sort,
  }: GetSubredditsParams): URLSearchParams {
    const params = new URLSearchParams();

    // Add pagination params
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    // Add filter params
    if (filters) {
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.subscriberMin !== undefined && filters.subscriberMin !== null) {
        params.append('subscriberMin', filters.subscriberMin.toString());
      }
      if (filters.subscriberMax !== undefined && filters.subscriberMax !== null) {
        params.append('subscriberMax', filters.subscriberMax.toString());
      }
    }

    // Add sort params
    if (sort) {
      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
    }

    return params;
  }

  /**
   * Fetch subreddits with pagination, filtering, and sorting
   */
  public async getSubreddits(params: GetSubredditsParams = {}): Promise<APIResponse<SubredditResponse>> {
    try {
      const queryParams = this.buildQueryParams(params);
      const response = await this.api.get<SubredditResponse>(`?${queryParams.toString()}`);
      
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          data: { results: [], pagination: { page: 1, pageSize: 20, totalPages: 0, totalItems: 0 } },
          error: error.message,
          status: axios.isAxiosError(error) ? error.response?.status || 500 : 500
        };
      }
      throw error;
    }
  }

  /**
   * Get a single subreddit by name
   */
  public async getSubredditByName(name: string): Promise<APIResponse<Subreddit>> {
    try {
      const response = await this.api.get<Subreddit>(`/${encodeURIComponent(name)}`);
      
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          data: {} as Subreddit,
          error: error.message,
          status: axios.isAxiosError(error) ? error.response?.status || 500 : 500
        };
      }
      throw error;
    }
  }

  /**
   * Search subreddits with specific criteria
   */
  public async searchSubreddits(
    searchTerm: string,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<APIResponse<SubredditResponse>> {
    return this.getSubreddits({
      filters: {
        ...filters,
        search: searchTerm
      },
      sort
    });
  }

  /**
   * Get popular subreddits (sorted by subscribers)
   */
  public async getPopularSubreddits(limit: number = 10): Promise<APIResponse<SubredditResponse>> {
    return this.getSubreddits({
      pageSize: limit,
      sort: {
        field: 'subscribers',
        direction: 'desc'
      }
    });
  }
}

// Create a singleton instance
const subredditApi = new SubredditAPI();

export default subredditApi;
