import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagementTable from '../ManagementTable';

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

  it('renders StatusBadge as Active and Inactive', () => {
    // Active
    const activeData = [{ name: 'Active User', email: 'active@example.com', _id: '1', status: true }];
    render(
      <ManagementTable
        columns={columns}
        data={activeData}
        module="testModule"
        onToggleStatus={jest.fn()}
      />
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
    // Inactive
    const inactiveData = [{ name: 'Inactive User', email: 'inactive@example.com', _id: '2', status: false }];
    render(
      <ManagementTable
        columns={columns}
        data={inactiveData}
        module="testModule"
        onToggleStatus={jest.fn()}
      />
    );
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('calls onToggleStatus, onView, onDownload, onRestore, onPermanentDelete', () => {
    const row = { name: 'Test', email: 'test@example.com', _id: '1', status: true };
    const onToggleStatus = jest.fn();
    const onView = jest.fn();
    const onDownload = jest.fn();
    const onRestore = jest.fn();
    const onPermanentDelete = jest.fn();
    render(
      <ManagementTable
        columns={columns}
        data={[row]}
        module="testModule"
        onToggleStatus={onToggleStatus}
        onView={onView}
        onDownload={onDownload}
        onRestore={onRestore}
        onPermanentDelete={onPermanentDelete}
      />
    );
  // Status button
  fireEvent.click(screen.getByText(/active/i).closest('button')!);
  expect(onToggleStatus).toHaveBeenCalledWith(row);
  // View button
  fireEvent.click(screen.getByRole('button', { name: 'View' }));
  expect(onView).toHaveBeenCalledWith(row);
  // Download button
  fireEvent.click(screen.getByRole('button', { name: 'Download' }));
  expect(onDownload).toHaveBeenCalledWith(row);
  // Restore button
  fireEvent.click(screen.getByRole('button', { name: 'Restore' }));
  expect(onRestore).toHaveBeenCalledWith(row);
  // Permanent delete button
  fireEvent.click(screen.getByRole('button', { name: 'Permanent Delete' }));
  expect(onPermanentDelete).toHaveBeenCalledWith(row);
  });

  it('renders table with no actions', () => {
    render(
      <ManagementTable columns={columns} data={data} module="testModule" />
    );
    // Should not throw and should render data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});
