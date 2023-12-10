import axios from 'axios';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserForm from '../app/components/UserForm';
jest.mock('axios');

describe('UserForm component', () => {
    it('should render UserForm with no errors', () => {
        render(<UserForm id={0} onUserUpdate={jest.fn()} />);

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });
    it('should display form validation errors', async () => {
        render(<UserForm id={0} onUserUpdate={jest.fn()} />);

        userEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Must be at least 18/i)).toBeInTheDocument();
        });
    });

    it('should submit user form successfully', async () => {
        const onUserUpdateMock = jest.fn().mockResolvedValue(true);

        render(<UserForm id={0} onUserUpdate={onUserUpdateMock} />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Mariel Mabano' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'marielmabano@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '21' } });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(onUserUpdateMock).toHaveBeenCalledWith({
                id: 0,
                name: 'Mariel Mabano',
                email: 'marielmabano@gmail.com',
                age: '21',
            });
        });
    });

    it('should close user modal on submit', async () => {
        const onUserUpdateMock = jest.fn().mockResolvedValue(true);
        const closeMock = jest.fn();
        document.getElementById = jest.fn().mockReturnValue({ close: closeMock });

        render(<UserForm id={0} onUserUpdate={onUserUpdateMock} />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Mariel Mabano' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'marielmabano@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '21' } });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(onUserUpdateMock).toHaveBeenCalledWith({
                id: 0,
                name: 'Mariel Mabano',
                email: 'marielmabano@gmail.com',
                age: '21',
            });
            expect(closeMock).toHaveBeenCalled();
        });
    });

    it('should fetch and pre-fill form fields on edit', async () => {
        const onUserUpdateMock = jest.fn().mockResolvedValue(true);
        const fetchMock = jest.fn().mockResolvedValue({ data: { name: 'Mariel Mabano', email: 'marielmabano@gmail.com', age: 21 } });
        axios.get = fetchMock;

        render(<UserForm id={1} onUserUpdate={onUserUpdateMock} />);

        await waitFor(() => {
            const nameLabel = screen.getByLabelText(/Name/i);
            expect(nameLabel).toBeInTheDocument();
            expect(nameLabel).toHaveValue('Mariel Mabano');

            const emailLabel = screen.getByLabelText(/Email/i);
            expect(emailLabel).toBeInTheDocument();
            expect(emailLabel).toHaveValue('marielmabano@gmail.com');

            const ageLabel = screen.getByLabelText(/Age/i);
            expect(ageLabel).toBeInTheDocument();
            expect(ageLabel).toHaveValue('21');
        });
    });
       
});