'use client'
import { User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import UserForm from './UserForm';

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        initializeUsers();
    }, []);

    const initializeUsers = async () => {
        const userResponse = await axios.get('/api/users');
        setUsers(userResponse.data);
    }

    const openViewUser = (id: number) => {
        setUserId(id);
        (document.getElementById('viewModal') as HTMLDialogElement).showModal();
    }

    const openEditUser = (id: number) => {
        setUserId(id);
        (document.getElementById('userModal') as HTMLDialogElement).showModal();
    }
    const openNewUser = () => {
        setUserId(0);
        (document.getElementById('userModal') as HTMLDialogElement).showModal();
    }
    const openDeleteUser = (id: number) => {
        setUserId(id);
        (document.getElementById('deleteModal') as HTMLDialogElement).showModal();
    }

    const handleUserUpdate = async (userData: User) => {
        try {
            if (userData.id === 0) {
                await axios.post('/api/users/', userData);
            }
            else {
                await axios.patch('/api/users/' + userData.id, userData);
            }
        } catch (error) {
            console.log("Error:", error);
            return false;
        }

        await initializeUsers();
        return true;
    }

    const deleteUser = async () => {
        try {
            await axios.delete('/api/users/' + userId);
            (document.getElementById('deleteModal') as HTMLDialogElement).close();
            await initializeUsers();
        } catch (error) {
            console.log("Error:", error);
        }
    }
    const UserList = () => {
        const [users, setUsers] = useState<User[]>([]);
        const [userId, setUserId] = useState(0);

        useEffect(() => {
            initializeUsers();
        }, []);

        const initializeUsers = async () => {
            const userResponse = await axios.get('/api/users');
            setUsers(userResponse.data);
        }
    }

    return (
        <div className='container mx-auto p-4 shadow-md border rounded-lg'>
            <div className='flex justify-between'>
                <h1 className='font-bold text-3xl'>User Management</h1>
                <button className='btn btn-primary' onClick={openNewUser}>Create New User</button>
            </div>
            {users.length === 0 ? (
                <h3 className='font-bold  text-2xl text-red-500 flex flex-col justify-center items-center'>No Users Found</h3>
            ) : (
                <table className='table mt-4'>
                    <thead>
                        <tr>
                            <th className='text-red-500'>ID</th>
                            <th className='text-red-500'>Name</th>
                            <th className='text-red-500'>Age</th>
                            <th className='text-red-500'>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user =>
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.age}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className='mx-2 btn btn-primary' onClick={() => openViewUser(user.id)}>View</button>
                                    <button className='mx-2 btn btn-primary' onClick={() => openEditUser(user.id)}>Edit</button>
                                    <button className='mx-2 btn btn-error text-black' onClick={() => openDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <dialog id='viewModal' className='modal'>
                <div className='modal-box'>
                    <form method='dialog'>
                        <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => (document.getElementById('viewModal') as HTMLDialogElement).close()}>X</button>
                    </form>
                    <h3 className='font-bold text-lg'>User Details</h3>
                    <div>
                        <strong>Name:</strong> {users.find((user) => user.id === userId)?.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {users.find((user) => user.id === userId)?.email}
                    </div>
                    <div>
                        <strong>Age:</strong> {users.find((user) => user.id === userId)?.age}
                    </div>
                </div>
            </dialog>

            <dialog id='userModal' className='modal'>
                <div className='modal-box'>
                    <form method='dialog'>
                        <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
                    </form>
                    <UserForm id={userId} onUserUpdate={handleUserUpdate} />
                </div>
            </dialog>

            <dialog id='deleteModal' className='modal'>
                <div className='modal-box'>
                    <form method='dialog'>
                        <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
                    </form>
                    <h3 className='font-bold text-lg'>Are you sure?</h3>
                    <p className='py-4'>This user will be deleted permanently.</p>
                    <button className='btn btn-error text-black' onClick={deleteUser}>Confirm</button>
                </div>

            </dialog>


        </div>
    )
}

export default UserList
