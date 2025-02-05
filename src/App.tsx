// App.tsx
import { useState, useEffect } from 'react';
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
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [sortField, setSortField] = useState<keyof Subreddit>('subscribers');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pagination, setPagination] = useState<PaginationResponse>({
    page: 1,
    pageSize: 20,
    totalPages: 0,
    totalItems: 0
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

  const handleApplyChanges = (
    newFilters: FilterOptions,
    newSortField: keyof Subreddit,
    newSortDirection: 'asc' | 'desc'
  ) => {
    setFilters(newFilters);
    setSortField(newSortField);
    setSortDirection(newSortDirection);
    // Reset to first page when filters or sort changes
    setPagination((prev: PaginationResponse) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev: PaginationResponse) => ({ ...prev, page: newPage }));
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
