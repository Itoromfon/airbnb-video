'use client'

import { signIn } from 'next-auth/react';
import axios from 'axios'
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc'
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Header from '../Header';
import Input from '../input/Input';
import { toast } from 'react-hot-toast'
import Button from '../Button';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { log } from 'console';

const LoginModal = () => {
    const router = useRouter(); /* We import router from next/navigation */
    const registerModal = useRegisterModal(); /* what controls the register form */
    const loginModal = useLoginModal(); /* what control whether the login-modal is open or close */
    const [isLoading, setIsLoading] = useState(false) /* Our logging state */

    const {
        /* We would write our useForm here to control our form */
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: { /* Object of default values */
        /* it doesn't matter what we write in our
           default value since we are using an input
           with an id of email
        */
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => { /* onSubmit function with a type of submitHandler */
        setIsLoading(true)

        /* Instead of calling axios.post to the register
           function we have to replace by using the 
           signIn option from next auth
        */
        signIn('credentials', {
            ...data, /* this data is only going to have email and password */
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false)

            /* Now we would check if the callback
               went alright
            */
           if (callback?.ok) {
              toast.success('Logged in')
              router.refresh /* going to help refresh our values in the logging modal */
              loginModal.onClose(); /* To close the modal */
           }

           if (callback?.error) {
            toast.error(callback.error);

           }
        })
    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Header
                title='Welcome back'
                subtitle='Login to your account!'
                center
            />
            <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id='password'
                label='Password'
                type='password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button
                outline
                label='Continue with Google'
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label='Continue with Github'
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div
                className='
                text-neutral-500
                text-center
                mt-4
                font-light
              '
            >
                <div className='
                    justify-center flex flex-row items-center gap-2'>
                    <div
                        className='
                        text-neutral-300
                        md:text-neutral-600
                        md:font-bold
                      '
                    >
                        First time using Airbnb
                    </div>
                    <div
                        onClick={toggle}
                        className='
                        text-neutral-100
                        md:text-neutral-800
                        cursor-pointer
                        hover:underline
                      '
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            /* We wrap the onSubmit function with this
            hook handleSubmit */
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal; 