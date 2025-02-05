import React, { useState } from 'react';
import styled from 'styled-components';
import { FilterOptions, Subreddit } from '../types/subreddit';

interface SubredditFiltersProps {
  filters: FilterOptions;
  sortField: keyof Subreddit;
  sortDirection: 'asc' | 'desc';
  onApply: (filters: FilterOptions, sortField: keyof Subreddit, sortDirection: 'asc' | 'desc') => void;
}

interface LocalState extends FilterOptions {
  search?: string;
  sortField: keyof Subreddit;
  sortDirection: 'asc' | 'desc';
}

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.sm};
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    box-sizing: border-box;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.background};
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    box-sizing: border-box;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

const ApplyButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  @media (max-width: 768px) {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const SubredditFilters: React.FC<SubredditFiltersProps> = ({
  filters,
  sortField,
  sortDirection,
  onApply,
}) => {
  const [localState, setLocalState] = useState<LocalState>({
    search: filters.search || '',
    subscriberMin: filters.subscriberMin,
    subscriberMax: filters.subscriberMax,
    sortField,
    sortDirection,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalState(prev => ({ ...prev, search: value }));
  };

  const handleSubscriberMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setLocalState(prev => ({ ...prev, subscriberMin: value }));
  };

  const handleSubscriberMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setLocalState(prev => ({ ...prev, subscriberMax: value }));
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalState(prev => ({ ...prev, sortField: e.target.value as keyof Subreddit }));
  };

  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalState(prev => ({ ...prev, sortDirection: e.target.value as 'asc' | 'desc' }));
  };

  const handleApply = () => {
    onApply(
      {
        search: localState.search || undefined,
        subscriberMin: localState.subscriberMin,
        subscriberMax: localState.subscriberMax,
      },
      localState.sortField,
      localState.sortDirection
    );
  };

  return (
    <div>
      <FiltersContainer>
        <FilterGroup>
          <Label>Search</Label>
          <Input
            type="text"
            value={localState.search}
            onChange={handleSearchChange}
            placeholder="Search subreddits..."
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Min Subscribers</Label>
          <Input
            type="number"
            value={localState.subscriberMin || ''}
            onChange={handleSubscriberMinChange}
            placeholder="Minimum subscribers"
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Max Subscribers</Label>
          <Input
            type="number"
            value={localState.subscriberMax || ''}
            onChange={handleSubscriberMaxChange}
            placeholder="Maximum subscribers"
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Sort By</Label>
          <Select value={localState.sortField} onChange={handleSortFieldChange}>
            <option value="name">Name</option>
            <option value="subscribers">Subscribers</option>
            <option value="activeUsers">Active Users</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Sort Direction</Label>
          <Select value={localState.sortDirection} onChange={handleSortDirectionChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </FilterGroup>
      </FiltersContainer>

      <ButtonContainer>
        <ApplyButton onClick={handleApply}>Apply Changes</ApplyButton>
      </ButtonContainer>
    </div>
  );
};
