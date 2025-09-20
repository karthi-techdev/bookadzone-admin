import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FaqFormTemplate from './FaqFormTemplate';
import { useFaqStore } from '../../stores/faqStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../stores/faqStore');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
	useParams: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() }, ToastContainer: () => <div>ToastContainer</div> }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../organisms/ManagementForm', () => (props: any) => (
	<form data-testid="faq-form" onSubmit={e => { e.preventDefault(); props.onSubmit && props.onSubmit(e); }}>
		<input
			data-testid="question"
			value={props.value?.question || ''}
			onChange={e => props.onFieldChange?.question && props.onFieldChange.question(e)}
			name="question"
		/>
		<input
			data-testid="answer"
			value={props.value?.answer || ''}
			onChange={e => props.onFieldChange?.answer && props.onFieldChange.answer(e)}
			name="answer"
		/>
		<input
			data-testid="priority"
			value={props.value?.priority || 1}
			onChange={e => props.onFieldChange?.priority && props.onFieldChange.priority(e)}
			name="priority"
			type="number"
		/>
		<button type="submit">Submit</button>
	</form>
));
jest.mock('../../molecules/FormHeader', () => () => <div>FormHeader</div>);

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
});
