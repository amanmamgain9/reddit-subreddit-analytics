export interface APIResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface GetSubredditsParams {
  page?: number;
  pageSize?: number;
  filters?: FilterOptions;
  sort?: SortOptions;
}

export interface Subreddit {
    id: string;
    name: string;
    description: string;
    subscribers: number;
    activeUsers: number;
    created: string;
    nsfw: boolean;
    categories: string[];
    url: string;
    icon?: string;
    bannerImage?: string;
    language: string;
    type: 'public' | 'private' | 'restricted';
    allowImages: boolean;
    allowVideos: boolean;
  }
  
  export interface SubredditResponse {
    results: Subreddit[];
    pagination: PaginationResponse;
  }
  
  export interface FilterOptions {
    search?: string;
    subscriberMin?: number | null;
    subscriberMax?: number | null;
    categories?: string[];
    nsfw?: boolean;
    type?: 'public' | 'private' | 'restricted';
    language?: string;
  }

  export interface PaginationResponse {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  }
  
  export interface SortOptions {
    field: keyof Subreddit;
    direction: 'asc' | 'desc';
  }
