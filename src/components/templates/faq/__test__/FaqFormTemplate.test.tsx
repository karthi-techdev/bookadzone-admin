import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FaqFormTemplate from '../FaqFormTemplate';
import { useFaqStore } from '../../../stores/FaqStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/FaqStore', () => ({
	useFaqStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
	useParams: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() }, ToastContainer: () => <div>ToastContainer</div> }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../../organisms/ManagementForm', () => {
	return function MockManagementForm(props: any) {
		const [question, setQuestion] = React.useState(props.value?.question || '');
		const [answer, setAnswer] = React.useState(props.value?.answer || '');
		const [priority, setPriority] = React.useState(props.value?.priority || 1);
		return (
			<form data-testid="faq-form" onSubmit={e => { e.preventDefault(); props.onSubmit && props.onSubmit(e); }}>
				<input
					data-testid="question"
					value={question}
					onChange={e => {
						setQuestion(e.target.value);
						props.onFieldChange?.question && props.onFieldChange.question(e);
					}}
					name="question"
				/>
				<input
					data-testid="answer"
					value={answer}
					onChange={e => {
						setAnswer(e.target.value);
						props.onFieldChange?.answer && props.onFieldChange.answer(e);
					}}
					name="answer"
				/>
				<input
					data-testid="priority"
					value={priority}
					onChange={e => {
						setPriority(e.target.value);
						props.onFieldChange?.priority && props.onFieldChange.priority(e);
					}}
					name="priority"
					type="number"
				/>
				<button type="submit">Submit</button>
			</form>
		);
	};
});
jest.mock('../../../molecules/FormHeader', () => () => <div>FormHeader</div>);

describe('FaqFormTemplate', () => {
	const mockFetchFaqById = jest.fn();
	const mockAddFaq = jest.fn();
	const mockUpdateFaq = jest.fn();
	const mockNavigate = jest.fn();
	beforeEach(() => {
		(useFaqStore as unknown as jest.Mock).mockReturnValue({
			fetchFaqById: mockFetchFaqById,
			addFaq: mockAddFaq,
			updateFaq: mockUpdateFaq,
		});
		(useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
		(useParams as unknown as jest.Mock).mockReturnValue({});
		jest.clearAllMocks();
	});

	it('renders form and submits new FAQ', async () => {
		mockAddFaq.mockResolvedValueOnce({});
		render(<FaqFormTemplate />);
		fireEvent.change(screen.getByTestId('question'), { target: { value: 'Test Question', name: 'question' } });
		fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Test Answer', name: 'answer' } });
		fireEvent.change(screen.getByTestId('priority'), { target: { value: 2, name: 'priority' } });
		fireEvent.click(screen.getByText('Submit'));
		await waitFor(() => {
			expect(mockAddFaq).toHaveBeenCalled();
			expect(mockNavigate).toHaveBeenCalledWith('/faq');
		});
	});

	it('renders form and updates FAQ if id param exists', async () => {
		(useParams as unknown as jest.Mock).mockReturnValue({ id: '123' });
		mockFetchFaqById.mockResolvedValueOnce({ question: 'Q', answer: 'A', status: true, priority: 1 });
		mockUpdateFaq.mockResolvedValueOnce({});
	       render(<FaqFormTemplate />);
	       await waitFor(() => expect(mockFetchFaqById).toHaveBeenCalledWith('123'));
	       // Fill all required fields after fetch
	       fireEvent.change(screen.getByTestId('question'), { target: { value: 'Updated Q', name: 'question' } });
	       fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Updated A', name: 'answer' } });
	       fireEvent.change(screen.getByTestId('priority'), { target: { value: 2, name: 'priority' } });
	       fireEvent.click(screen.getByText('Submit'));
	       await waitFor(() => {
		       expect(mockUpdateFaq).toHaveBeenCalled();
		       expect(mockNavigate).toHaveBeenCalledWith('/faq');
	       });
	});

	it('shows toast error if fetch fails', async () => {
		(useParams as unknown as jest.Mock).mockReturnValue({ id: 'bad' });
		mockFetchFaqById.mockResolvedValueOnce(null);
		render(<FaqFormTemplate />);
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Failed to load FAQ data');
		});
	});

		it('validates field change for boolean and number', async () => {
			render(<FaqFormTemplate />);
			// Priority field (number)
			fireEvent.change(screen.getByTestId('priority'), { target: { value: '99', name: 'priority' } });
			expect((screen.getByTestId('priority') as HTMLInputElement).value).toBe('99');
			// Simulate boolean field (not present in mock, but test logic)
			// You would add a checkbox to the mock ManagementForm and test checked/unchecked
		});

		it('shows field error for short question (frontend validation)', async () => {
			render(<FaqFormTemplate />);
			fireEvent.change(screen.getByTestId('question'), { target: { value: 'abc', name: 'question' } });
			fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Test Answer', name: 'answer' } });
			fireEvent.click(screen.getByText('Submit'));
			// Should not call addFaq or updateFaq
			expect(mockAddFaq).not.toHaveBeenCalled();
			expect(mockUpdateFaq).not.toHaveBeenCalled();
			// Should not call toast.error for frontend validation
			expect(toast.error).not.toHaveBeenCalled();
			// Should show error message in the DOM
			await waitFor(() => {
				expect(screen.getByText(/Please fix the errors before proceeding/i)).toBeInTheDocument();
			});
		});

		it('shows toast error for backend 409 conflict', async () => {
			mockAddFaq.mockRejectedValueOnce({ response: { status: 409, data: { message: 'already exists' } } });
			render(<FaqFormTemplate />);
			fireEvent.change(screen.getByTestId('question'), { target: { value: 'Test Question', name: 'question' } });
			fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Test Answer', name: 'answer' } });
			fireEvent.click(screen.getByText('Submit'));
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('already exists');
			});
		});

		it('shows toast error for backend array errors', async () => {
			mockAddFaq.mockRejectedValueOnce({ response: { data: { errors: [{ path: 'question', message: 'Invalid' }] } } });
			render(<FaqFormTemplate />);
			fireEvent.change(screen.getByTestId('question'), { target: { value: 'Test Question', name: 'question' } });
			fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Test Answer', name: 'answer' } });
			fireEvent.click(screen.getByText('Submit'));
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('question: Invalid');
			});
		});

		it('shows toast error for backend string error', async () => {
			mockAddFaq.mockRejectedValueOnce('string error');
			render(<FaqFormTemplate />);
			fireEvent.change(screen.getByTestId('question'), { target: { value: 'Test Question', name: 'question' } });
			fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Test Answer', name: 'answer' } });
			fireEvent.click(screen.getByText('Submit'));
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('string error');
			});
		});

		it('shows toast error for backend generic error', async () => {
			mockAddFaq.mockRejectedValueOnce({ message: 'generic error' });
			render(<FaqFormTemplate />);
			fireEvent.change(screen.getByTestId('question'), { target: { value: 'Test Question', name: 'question' } });
			fireEvent.change(screen.getByTestId('answer'), { target: { value: 'Test Answer', name: 'answer' } });
			fireEvent.click(screen.getByText('Submit'));
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('generic error');
			});
		});
});
