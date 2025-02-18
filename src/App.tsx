// App.tsx
import { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { SubredditFilters, SubredditTable, Pagination } from './components';
import subredditApi from './api/subreddit';
import { Subreddit, FilterOptions, PaginationResponse } from './types/subreddit';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/globalStyle';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${theme.spacing.md};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 24px;
  font-weight: 600;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 4px;
`;

function App() {
  // Initialize state from URL parameters
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [sortField, setSortField] = useState<keyof Subreddit>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('sort') as keyof Subreddit) || 'subscribers';
  });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('direction') as 'asc' | 'desc') || 'desc';
  });
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('search') || '',
      subscriberMin: params.get('minSubs') ? Number(params.get('minSubs')) : null,
      subscriberMax: params.get('maxSubs') ? Number(params.get('maxSubs')) : null
    };
  });
  const [pagination, setPagination] = useState<PaginationResponse>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: Number(params.get('page')) || 1,
      pageSize: 20,
      totalPages: 0,
      totalItems: 0
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubreddits = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await subredditApi.getSubreddits({
          page: pagination.page,
          pageSize: pagination.pageSize,
          filters,
          sort: { field: sortField, direction: sortDirection }
        });

        if (response.error) {
          throw new Error(response.error);
        }

        setSubreddits(response.data.results);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subreddits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubreddits();
  }, [filters, sortField, sortDirection, pagination.page, pagination.pageSize]);

  // Update URL parameters when state changes
  const updateUrlParams = useCallback((
    newFilters: FilterOptions,
    newSortField: keyof Subreddit,
    newSortDirection: 'asc' | 'desc',
    newPage: number
  ) => {
    const params = new URLSearchParams();
    
    // Add sort parameters
    params.set('sort', newSortField);
    params.set('direction', newSortDirection);
    params.set('page', String(newPage));
    
    // Add filter parameters
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.subscriberMin) params.set('minSubs', String(newFilters.subscriberMin));
    if (newFilters.subscriberMax) params.set('maxSubs', String(newFilters.subscriberMax));
    
    // Update URL without reload
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  const handleApplyChanges = (
    newFilters: FilterOptions,
    newSortField: keyof Subreddit,
    newSortDirection: 'asc' | 'desc'
  ) => {
    setFilters(newFilters);
    setSortField(newSortField);
    setSortDirection(newSortDirection);
    const newPage = 1; // Reset to first page when filters or sort changes
    setPagination((prev: PaginationResponse) => ({ ...prev, page: newPage }));
    updateUrlParams(newFilters, newSortField, newSortDirection, newPage);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev: PaginationResponse) => ({ ...prev, page: newPage }));
    updateUrlParams(filters, sortField, sortDirection, newPage);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container>
        <Title>Reddit Subreddit Analytics</Title>
        
        <SubredditFilters 
          filters={filters}
          sortField={sortField}
          sortDirection={sortDirection}
          onApply={handleApplyChanges}
        />

        {isLoading ? (
          <LoadingOverlay>Loading subreddits...</LoadingOverlay>
        ) : error ? (
          <ErrorMessage>Error: {error}</ErrorMessage>
        ) : (
          <>
            <SubredditTable subreddits={subreddits} />
            
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
