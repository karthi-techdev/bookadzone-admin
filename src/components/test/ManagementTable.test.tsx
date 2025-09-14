import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagementTable from '../organisms/ManagementTable';

describe('ManagementTable Component', () => {
  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
  ];

  const data = [
    { name: 'John Doe', email: 'john@example.com', _id: '1' },
    { name: 'Jane Smith', email: 'jane@example.com', _id: '2' },
  ];

  it('renders table headers correctly', () => {
    render(<ManagementTable columns={columns} data={data} module="testModule" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<ManagementTable columns={columns} data={data} module="testModule" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows no data message when no rows are provided', () => {
    render(<ManagementTable columns={columns} data={[]} module="testModule" />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('calls onEdit and onDelete callbacks when buttons clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <ManagementTable
        columns={columns}
        data={data}
        module="testModule"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Assuming buttons have accessible name 'Edit' and 'Delete'
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    expect(onEdit).toHaveBeenCalledWith(data[0]);
    expect(onDelete).toHaveBeenCalledWith(data[0]);
  });

  it('handles pagination if applicable', () => {
    // If pagination is implemented in ManagementTable, add the correct props to its type and update this test.
    render(
      <ManagementTable
        columns={columns}
        data={data}
        module="testModule"
      />
    );

    // Pagination controls and callbacks would be tested here if implemented
  });
});
