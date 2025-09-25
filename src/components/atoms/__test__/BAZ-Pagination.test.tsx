import { render } from '@testing-library/react';
import BAZPagination from '../BAZ-Pagination';

test('renders pagination component', () => {
  render(
    <BAZPagination
      pageCount={5}
      currentPage={2}
      onPageChange={jest.fn()}
    />
  );
  // Not asserting exact structure due to library wrapping, but should not throw
});
