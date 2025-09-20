import { render, screen, fireEvent } from '@testing-library/react';
import BAZTextArea from '../BAZ-TextArea';

test('renders textarea with label', () => {
  render(<BAZTextArea label="Description" />);
  expect(screen.getByLabelText('Description')).toBeInTheDocument();
});

test('displays error message', () => {
  render(<BAZTextArea error="Required" />);
  expect(screen.getByText('Required')).toBeInTheDocument();
});
