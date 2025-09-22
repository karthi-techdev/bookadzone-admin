

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FormHeader from '../FormHeader';
import { MemoryRouter } from 'react-router-dom';


it('renders FormHeader with managementName and type', () => {
  render(
    <MemoryRouter>
      <FormHeader managementName="Users" type="Add" addButtonLink="/add-user" />
    </MemoryRouter>
  );
  expect(screen.getByText(/Add Users/i)).toBeInTheDocument();
});


it('renders breadcrumbs', () => {
  render(
    <MemoryRouter>
      <FormHeader managementName="Users" type="Edit" addButtonLink="/edit-user" />
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
});
