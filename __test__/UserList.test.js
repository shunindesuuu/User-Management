import axios from 'axios';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../app/components/UserList';
jest.mock('axios');

describe('UserList component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders UserList component without errors', async () => {
        axios.get.mockResolvedValue({ data: [] });
    
        render(<UserList />);
    
        const userListHeading = await screen.findByText('User Management');
        const createNewUserButton = screen.getByText('Create New User');
    
        expect(userListHeading).toBeInTheDocument();
        expect(createNewUserButton).toBeInTheDocument();
      });
    it('renders correctly', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Mariel', age: 21, email: 'mariel@gmail.com' },
                { id: 2, name: 'jiyo', age: 22, email: 'jiyo@gmail.com' },
            ],
        });

        render(<UserList />);

        await waitFor(() => {
            expect(screen.getByText('User Management')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('Mariel')).toBeInTheDocument();
            expect(screen.getByText('jiyo')).toBeInTheDocument();
            expect(screen.getByText('21')).toBeInTheDocument();
            expect(screen.getByText('22')).toBeInTheDocument();

        });
    });

    it('renders correctly with no users', async () => {
        axios.get.mockResolvedValue({ data: [] });
        render(<UserList />);
        await waitFor(() => {
            expect(screen.getByText('User Management')).toBeInTheDocument();
            expect(screen.getByText('No Users Found')).toBeInTheDocument();
        });
    });

    it('renders the Create New User button', async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(<UserList />);

        await waitFor(() => {
            expect(screen.getByText('User Management')).toBeInTheDocument();
            expect(screen.getByText('Create New User')).toBeInTheDocument();
        });
    });
    it('renders the view, edit and delete button', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Mariel', age: 21, email: 'mariel@gmail.com' },
            ],
        });

        render(<UserList />);

        await waitFor(() => {
            expect(screen.getByText('User Management')).toBeInTheDocument();
            expect(screen.getByText('View')).toBeInTheDocument();
            expect(screen.getByText('Edit')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });
    });

});
