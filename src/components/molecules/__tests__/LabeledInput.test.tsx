import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import LabeledInput from '../LabeledInput';
import type { InputType } from '../../types/common';
import type { LabeledInputProps } from '../LabeledInput';

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
      render(<LabeledInput {...baseProps} type="checkbox" value={false} />);
      const input = screen.getByRole('checkbox');
      expect(input).not.toBeChecked();
      fireEvent.click(input);
      expect(baseProps.onChange).toHaveBeenCalledWith({
        target: { name: 'testField', value: true }
      });
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

    it('handles number input with valueAsNumber', () => {
      render(
        <LabeledInput
          name="testField"
          type="number"
          valueAsNumber
          value=""
          onChange={jest.fn().mockImplementation((e) => {
            expect(e.target.value).toBe(undefined);
          })}
        />
      );
      const input = screen.getByTestId('testField-input');
      fireEvent.change(input, { target: { value: '' } });
    });

    it('handles file input with multiple files', async () => {
      render(<LabeledInput {...baseProps} type="file" multiple accept="image/*" />);
      const input = screen.getByTestId('testField-input');
      
      const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['test2'], 'test2.png', { type: 'image/png' });
      
      // Create a mock FileList
      const fileList = {
        0: file1,
        1: file2,
        length: 2,
        item: (i: number) => i === 0 ? file1 : file2,
        [Symbol.iterator]: function* () {
          yield file1;
          yield file2;
        }
      };
      
      // Trigger change event with proper files
      fireEvent.change(input, { target: { files: fileList } });
      
      expect(baseProps.onChange).toHaveBeenCalledWith({
        target: { 
          name: 'testField', 
          value: [file1, file2],
          removedFiles: []
        }
      });
    });

    it('handles invalid file type', () => {
      render(<LabeledInput {...baseProps} type="file" accept="image/*" />);
      const input = screen.getByTestId('testField-input');
      
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      // Create a mock FileList
      const fileList = {
        0: invalidFile,
        length: 1,
        item: (i: number) => i === 0 ? invalidFile : null,
        [Symbol.iterator]: function* () {
          yield invalidFile;
        }
      };
      
      // Trigger change event with invalid file
      fireEvent.change(input, { target: { files: fileList } });
      
      expect(baseProps.onChange).toHaveBeenCalledWith({
        target: { 
          name: 'testField', 
          value: '__invalid_file_type__',
          removedFiles: []
        }
      });
    });

    it('handles file input with removed files', () => {
      const mockedOnChange = jest.fn();
      
      // Mount component with a pre-loaded file
      render(
        <LabeledInput
          name="testField"
          type="file"
          onChange={mockedOnChange}
          accept="*"
          multiple={true}
          disabled={false}
          existingFiles={['/test1.png']}
        />
      );

      // Find and click the remove button (needs group hover to be visible)
      const image = screen.getByAltText('test1.png');
      const imageWrapper = image.parentElement;
      if (!imageWrapper) {
        throw new Error('Image wrapper not found');
      }
      
      fireEvent.mouseEnter(imageWrapper);
      
      // Now find and click the remove button
      const removeButton = within(imageWrapper).getByRole('button', { name: 'Remove file' });
      fireEvent.click(removeButton);

      expect(mockedOnChange).toHaveBeenCalledWith({
        target: {
          name: 'testField',
          value: undefined,
          removedFiles: ['/test1.png']
        }
      });
    });

    it('handles radio button group without onChange', () => {
      const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
      render(<LabeledInput name="testField" type="radio" options={options} value="a" />);
      
      const radio = screen.getByLabelText('B');
      fireEvent.click(radio);
      // Should not throw error even without onChange
    });

    it('handles checkbox without onChange', () => {
      render(<LabeledInput name="testField" type="checkbox" value={false} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      // Should not throw error even without onChange
    });

    it('handles select without onChange', () => {
      const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
      render(<LabeledInput name="testField" type="select" options={options} value="a" />);
      
      const select = screen.getByText('A');
      fireEvent.click(select);
      // Should not throw error even without onChange
    });
  });
});
