'use client'
import { User } from '@prisma/client';
import axios from 'axios';
import { error } from 'console';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Props {
    id: number;
    onUserUpdate: (userData: User) => Promise<boolean>;
}

const UserForm = ({ id, onUserUpdate }: Props) => {
    const [needFetch, setNeedFetch] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<User>();

    useEffect(() => {
        if (id == 0) {
            reset({
                name: "",
                email: "",
                age: 0,
            });
        }
        else {
            setNeedFetch(false);
            fetchUser();
        }
    }, [id, needFetch]);

    const fetchUser = async () => {
        const userResponse = await axios.get("/api/users/" + id);
        reset({
            name: userResponse.data?.name ?? "",
            email: userResponse.data?.email ?? "",
            age: userResponse.data?.age,
        });
    }

    const onSubmit: SubmitHandler<User> = async (data) => {
        data.id = id;
        const isSuccess = await onUserUpdate(data);
        if (isSuccess) {
            (document.getElementById('userModal') as HTMLDialogElement).close();
            setNeedFetch(true);
            reset();
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className='font-bold text-lg'>{id === 0 ? 'Add New User' : 'Edit User'}</h3>

            <div className='mb-4 mt-2'>
                <label className='text-sm mb-2 block' htmlFor='name'>
                    Name
                </label>
                <input type="text" id="name" {...register('name', { required: 'Name is required' })} className='input input-bordered w-full'
                />
                {errors.name && (
                    <p className='text-red-500 text-xs italic'>{errors.name.message}</p>
                )}
            </div>

            <div className='mb-4'>
                <label className='text-sm mb-2 block' htmlFor='email'>
                    Email
                </label>
                <input type="email" id='email' {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid Email Address' } })} className='input input-bordered w-full'
                />
                {errors.email && (
                    <p className='text-red-500 text-xs italic'>{errors.email.message}</p>
                )}
            </div>

            <div className='mb-4'>
                <label className='text-sm mb-2 block' htmlFor='age'>
                    Age
                </label>
                <input type="age" id='age' {...register('age', { required: 'Age is required', min: { value: 18, message: 'Must be at least 18' } })} className='input input-bordered'
                />
                {errors.age && (
                    <p className='text-red-500 text-xs italic'>{errors.age.message}</p>
                )}
            </div>

            <button type='submit' className='btn btn-primary'>
                Submit
            </button>
        </form>
    )
}

export default UserForm
