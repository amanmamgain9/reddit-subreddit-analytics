import React from 'react';
import styled from 'styled-components';
import { Subreddit } from '../types/subreddit';

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
    
    thead {
      display: none;
    }
    
    tbody {
      display: block;
    }
    
    tr {
      display: block;
      margin-bottom: ${({ theme }) => theme.spacing.md};
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: ${({ theme }) => theme.borderRadius};
      padding: ${({ theme }) => theme.spacing.sm};
    }
    
    td {
      display: block;
      text-align: left;
      padding: ${({ theme }) => theme.spacing.sm};
      border: none;
      
      &:before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        margin-right: ${({ theme }) => theme.spacing.sm};
      }
      
      &:after {
        content: "";
        display: table;
        clear: both;
      }
    }
  }
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

interface SubredditTableProps {
  subreddits: Subreddit[];
}

export const SubredditTable: React.FC<SubredditTableProps> = ({
  subreddits,
}) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Subscribers</Th>
            <Th>Categories</Th>
          </tr>
        </thead>
        <tbody>
          {subreddits.map((subreddit) => (
            <Tr key={subreddit.name}>
              <Td data-label="Name">{subreddit.name}</Td>
              <Td data-label="Description">{subreddit.description}</Td>
              <Td data-label="Subscribers">{subreddit.subscribers.toLocaleString()}</Td>
              <Td data-label="Categories">{subreddit.categories?.join(', ') || '-'}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
