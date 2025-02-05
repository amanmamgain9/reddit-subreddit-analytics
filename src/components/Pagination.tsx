import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Button = styled.button<{ $active?: boolean }>`
  padding: 10px 14px;
  border: 1px solid ${props => props.$active ? '#007bff' : '#dee2e6'};
  background: ${props => props.$active ? '#007bff' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#212529'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 44px;
  font-size: 16px;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#0056b3' : '#f8f9fa'};
    border-color: ${props => props.$active ? '#0056b3' : '#c1c9d0'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    min-width: 40px;
    font-size: 14px;
  }
`;

const NavigationButton = styled(Button)`
  min-width: 90px;

  @media (max-width: 480px) {
    min-width: 70px;
  }
`;

const PageList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 360px) {
    display: none;
  }
`;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Container>
      <NavigationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </NavigationButton>

      <PageList>
        {getPageNumbers().map((pageNumber, index) => (
          typeof pageNumber === 'number' ? (
            <Button
              key={index}
              $active={pageNumber === currentPage}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ) : (
            <span key={index}>{pageNumber}</span>
          )
        ))}
      </PageList>

      <NavigationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </NavigationButton>
    </Container>
  );
};
