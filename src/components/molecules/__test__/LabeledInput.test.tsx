import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LabeledInput from '../LabeledInput';

describe('LabeledInput', () => {
  const baseProps = {
    name: 'testField',
    label: 'Test Label',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    baseProps.onChange.mockClear();
  });

  it('renders label and text input', () => {
    render(<LabeledInput {...baseProps} type="text" value="" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange for text input', () => {
    render(<LabeledInput {...baseProps} type="text" value="" />);
    fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'abc' } });
    expect(baseProps.onChange).toHaveBeenCalledWith({
      target: { name: 'testField', value: 'abc' },
    });
  });

  it('renders textarea input', () => {
    render(<LabeledInput {...baseProps} type="textarea" label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders select input', () => {
    const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
    render(
      <LabeledInput {...baseProps} type="select" options={options} value="a" placeholder="Select" />
    );
    // react-select renders the selected value, not the placeholder, when value is set
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<LabeledInput {...baseProps} type="text" error="Error!" />);
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  describe('LabeledInput - full coverage', () => {
    const baseProps = {
      name: 'testField',
      label: 'Test Label',
      onChange: jest.fn(),
    };

    beforeEach(() => {
      baseProps.onChange.mockClear();
    });

    it('renders and handles checkbox', () => {
      render(<LabeledInput {...baseProps} type="checkbox" value={true} />);
      const input = screen.getByRole('checkbox');
      expect(input).toBeChecked();
      fireEvent.click(input);
      expect(baseProps.onChange).toHaveBeenCalled();
    });

    it('renders and handles radio', () => {
      const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
      render(<LabeledInput {...baseProps} type="radio" options={options} value="a" />);
      expect(screen.getByLabelText('A')).toBeChecked();
      fireEvent.click(screen.getByLabelText('B'));
      expect(baseProps.onChange).toHaveBeenCalled();
    });

    it('renders and handles select (single)', () => {
      const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
      render(<LabeledInput {...baseProps} type="select" options={options} value="b" />);
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('renders and handles select (multi)', () => {
      const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
      render(<LabeledInput {...baseProps} type="select" options={options} value={[]} multiple />);
      const combobox = screen.getByRole('combobox');
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      fireEvent.click(screen.getByText('A'));
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      fireEvent.click(screen.getByText('B'));
      // Now both options should be selected and visible as multi-value labels
      expect(screen.getAllByText('A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('B').length).toBeGreaterThan(0);
    });

    it('renders and handles file input', () => {
      render(<LabeledInput {...baseProps} type="file" />);
      expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    });

    it('renders file input with existingFiles', () => {
      render(<LabeledInput {...baseProps} type="file" existingFiles="/test.png" />);
      expect(screen.getByAltText('test.png')).toBeInTheDocument();
    });

    it('renders password input and toggles visibility', () => {
      const togglePassword = jest.fn();
      render(<LabeledInput {...baseProps} type="password" value="secret" showPassword={false} togglePassword={togglePassword} />);
      const button = screen.getByLabelText('Show password');
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(togglePassword).toHaveBeenCalled();
    });

    it('renders password input with showPassword true', () => {
      render(<LabeledInput {...baseProps} type="password" value="secret" showPassword={true} togglePassword={() => {}} />);
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    });

    it('renders textarea and error', () => {
      render(<LabeledInput {...baseProps} type="textarea" error="Textarea error" />);
      expect(screen.getByText('Textarea error')).toBeInTheDocument();
    });

    it('renders select and error', () => {
      const options = [{ label: 'A', value: 'a' }];
      render(<LabeledInput {...baseProps} type="select" options={options} error="Select error" />);
      expect(screen.getByText('Select error')).toBeInTheDocument();
    });

    it('renders file input and error', () => {
      render(<LabeledInput {...baseProps} type="file" error="File error" />);
      expect(screen.getByText('File error')).toBeInTheDocument();
    });

    it('renders required label', () => {
      render(<LabeledInput {...baseProps} type="text" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders input with isAuth', () => {
      render(<LabeledInput {...baseProps} type="text" isAuth />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });
  });
});
