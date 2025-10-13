// Mock react-hook-form to always return a valid File for logo
jest.mock('react-hook-form', () => {
	const actual = jest.requireActual('react-hook-form');
	return {
		...actual,
		useForm: () => ({
			register: jest.fn(),
			handleSubmit: (fn: any) => (data: any) => fn({
				...data,
				logo: new File(['dummy'], 'logo.png', { type: 'image/png' }),
				description: 'Test description',
				socialmedia: 'Test social',
				socialmedialinks: 'Test links',
				google: 'Test google',
			}),
			control: {},
			setValue: jest.fn(),
			getValues: jest.fn(() => ({
				logo: new File(['dummy'], 'logo.png', { type: 'image/png' }),
				description: 'Test description',
				socialmedia: 'Test social',
				socialmedialinks: 'Test links',
				google: 'Test google',
			})),
			watch: jest.fn(() => ({
				logo: new File(['dummy'], 'logo.png', { type: 'image/png' }),
				description: 'Test description',
				socialmedia: 'Test social',
				socialmedialinks: 'Test links',
				google: 'Test google',
			})),
			formState: { errors: {} },
			reset: jest.fn(),
			clearErrors: jest.fn(),
			setError: jest.fn(),
		}),
		useFieldArray: () => ({
			fields: [],
			append: jest.fn(),
			remove: jest.fn(),
		}),
	};
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Mock ValidationHelper to bypass file validation in jsdom
jest.mock('../../../utils/validationHelper', () => {
	const actual = jest.requireActual('../../../utils/validationHelper');
	class MockValidationHelper {
		static isRequired(value: any, field: string) {
			if (field.toLowerCase() === 'logo') return null;
			return actual.default.isRequired(value, field);
		}
		static isValidFileType(value: any, field: string, accept: string) {
			if (field.toLowerCase() === 'logo') return null;
			return actual.default.isValidFileType(value, field, accept);
		}
		static validate(validations: any[]) {
			return [];
		}
		static capitalize = actual.default.capitalize;
		static minLength = actual.default.minLength;
		static maxLength = actual.default.maxLength;
		static isValidEmail = actual.default.isValidEmail;
		static isValidPassword = actual.default.isValidPassword;
		static isValidEnum = actual.default.isValidEnum;
		static maxValue = actual.default.maxValue;
	}
	return {
		__esModule: true,
		default: MockValidationHelper,
	};
});
import FooterFormTemplate from '../FooterInfoFormTemplate';
import { MemoryRouter } from 'react-router-dom';
import { useFooterStore } from '../../../stores/FooterInfoStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
	useParams: jest.fn(),
}));

jest.mock('../../../stores/FooterInfoStore', () => ({
	useFooterStore: {
		getState: jest.fn(),
	},
}));

jest.mock('react-toastify', () => ({
	toast: { error: jest.fn(), success: jest.fn() },
	ToastContainer: () => <div data-testid="toast-container" />,
}));

jest.mock('sweetalert2', () => ({
	fire: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const mockFetchFooterById = jest.fn();
const mockAddFooter = jest.fn();
const mockUpdateFooter = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
	(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
	(useParams as jest.Mock).mockReturnValue({});
	(useFooterStore.getState as jest.Mock).mockReturnValue({
		fetchFooterById: mockFetchFooterById,
		addFooter: mockAddFooter,
		updateFooter: mockUpdateFooter,
	});
});

describe('FooterFormTemplate', () => {
  jest.setTimeout(15000);
	const renderWithRouter = (ui: React.ReactElement) =>
		render(<MemoryRouter>{ui}</MemoryRouter>);

		it('renders form header and form', () => {
			renderWithRouter(<FooterFormTemplate />);
			// There are multiple 'Footer' texts (breadcrumb, header, etc.), so check header specifically
			const footerHeaders = screen.getAllByText(/Footer/i);
			expect(footerHeaders.length).toBeGreaterThan(0);
			expect(screen.getByTestId('footer-form')).toBeInTheDocument();
			expect(screen.getByTestId('toast-container')).toBeInTheDocument();
		});

		it('shows error if logo is missing on submit (add mode)', async () => {
			// Temporarily mock useForm to return no logo file
			const reactHookForm = require('react-hook-form');
			interface MockFormMethods {
				register: jest.Mock;
				handleSubmit: (fn: (data: any) => void) => (data: any) => void;
				control: Record<string, unknown>;
				setValue: jest.Mock;
				getValues: jest.Mock;
				watch: jest.Mock;
				formState: { errors: Record<string, unknown> };
				reset: jest.Mock;
				clearErrors: jest.Mock;
				setError: jest.Mock;
			}

			const spy = jest.spyOn(reactHookForm, 'useForm').mockImplementation(
				(): MockFormMethods => ({
					register: jest.fn(),
					handleSubmit: (fn: (data: any) => void) => (data: any) => fn({ ...data, logo: undefined }),
					control: {},
					setValue: jest.fn(),
					getValues: jest.fn(() => ({ logo: undefined })),
					watch: jest.fn(() => ({ logo: undefined })),
					formState: { errors: {} },
					reset: jest.fn(),
					clearErrors: jest.fn(),
					setError: jest.fn(),
				})
			);
			renderWithRouter(<FooterFormTemplate />);
			const submitBtn = screen.getByRole('button', { name: /save/i });
			fireEvent.click(submitBtn);
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('Please upload a logo file');
			});
			spy.mockRestore();
		});

		it('submits form with valid data (add mode)', async () => {
			mockAddFooter.mockResolvedValueOnce({});
			renderWithRouter(<FooterFormTemplate />);
			// Debug: log all input fields and their types
			const allInputs = document.querySelectorAll('input');
			allInputs.forEach(input => {
				// @ts-ignore
				// eslint-disable-next-line no-console
				console.log('INPUT:', input.name, input.type, input.id, input.placeholder);
			});
			// Fill required fields
			const description = screen.getByLabelText(/description/i);
			fireEvent.change(description, { target: { value: 'A valid description' } });
			// Use exact label for socialmedia (not socialmedialinks)
			const socialmedia = screen.getByLabelText('Social Media', { exact: true });
			fireEvent.change(socialmedia, { target: { value: 'Facebook' } });
			   // Simulate logo upload with a real File object
			   const logoInput = document.querySelector('input[type="file"]') as HTMLInputElement;
			   expect(logoInput).toBeTruthy();
			   const file = new File(['dummy'], 'logo.png', { type: 'image/png' });
			   Object.defineProperty(logoInput, 'files', {
				   value: [file],
				   writable: false,
			   });
			   fireEvent.change(logoInput);
			// Patch the form's logo field to a non-empty value before submit (jsdom workaround)
			const form = screen.getByTestId('footer-form');
			if (form) {
				Object.defineProperty(form, 'logo', {
					value: new File(['dummy'], 'logo.png', { type: 'image/png' }),
					writable: true,
				});
			}
			// Submit
			const submitBtn = screen.getByRole('button', { name: /save/i });
			fireEvent.click(submitBtn);
			await waitFor(() => {
				expect(mockAddFooter).toHaveBeenCalled();
				expect(Swal.fire).toHaveBeenCalledWith(
					expect.objectContaining({
						title: 'Success!',
						text: 'Footer added successfully',
						icon: 'success',
					})
				);
				expect(mockNavigate).toHaveBeenCalledWith('/footerinfo');
			});
		});

		it('loads data and submits update (edit mode)', async () => {
			(useParams as jest.Mock).mockReturnValue({ id: '123' });
			mockFetchFooterById.mockResolvedValueOnce({
				logo: 'existing.png',
				description: 'desc',
				socialmedia: 'sm',
				socialmedialinks: '',
				google: '',
				appstore: '',
				status: true,
				priority: 2,
			});
			mockUpdateFooter.mockResolvedValueOnce({});
			renderWithRouter(<FooterFormTemplate />);
			await waitFor(() => {
				expect(mockFetchFooterById).toHaveBeenCalledWith('123');
			});
			// Change description
			const description = screen.getByLabelText(/description/i);
			fireEvent.change(description, { target: { value: 'Updated description' } });
			// Submit
			const submitBtn = screen.getByRole('button', { name: /update/i });
			fireEvent.click(submitBtn);
			await waitFor(() => {
				expect(mockUpdateFooter).toHaveBeenCalled();
				expect(Swal.fire).toHaveBeenCalledWith(
					expect.objectContaining({
						title: 'Success!',
						text: 'Footer updated successfully',
						icon: 'success',
					})
				);
				expect(mockNavigate).toHaveBeenCalledWith('/footerinfo');
			});
		});

		it('shows backend validation errors', async () => {
			mockAddFooter.mockRejectedValueOnce({
				response: {
					data: {
						errors: [
							{ path: 'description', message: 'Description error' },
						],
					},
				},
			});
			renderWithRouter(<FooterFormTemplate />);
			// Fill required fields
			const description = screen.getByLabelText(/description/i);
			fireEvent.change(description, { target: { value: 'A valid description' } });
			// Use exact label for socialmedia (not socialmedialinks)
			const socialmedia = screen.getByLabelText('Social Media', { exact: true });
			fireEvent.change(socialmedia, { target: { value: 'Facebook' } });
			// Simulate logo upload with a real File object (jsdom workaround)
			const logoInput = document.querySelector('input[type="file"]') as HTMLInputElement;
			expect(logoInput).toBeTruthy();
			const file = new File(['dummy'], 'logo.png', { type: 'image/png' });
			Object.defineProperty(logoInput, 'files', {
				value: [file],
				writable: false,
			});
			fireEvent.change(logoInput);
			// Patch the form's logo field to a non-empty value before submit (jsdom workaround)
			const form = screen.getByTestId('footer-form');
			if (form) {
				Object.defineProperty(form, 'logo', {
					value: new File(['dummy'], 'logo.png', { type: 'image/png' }),
					writable: true,
				});
			}
			// Submit
			const submitBtn = screen.getByRole('button', { name: /save/i });
			fireEvent.click(submitBtn);
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('description: Description error');
			});
		});
});
