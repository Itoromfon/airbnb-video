'use client'
 
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
import Header  from '../Header';
import Input from '../input/Input';
import { toast } from 'react-hot-toast'
import Button from '../Button';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {  
    const registerModal = useRegisterModal(); /* Where we get our control from */
    const loginModal = useLoginModal();
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
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => { /* onSubmit function with a type of submitHandler */    
        setIsLoading(true)

        /* We would initiate an Axios POST code */ 
        axios.post('/api/register', data) /* Data is a field values - names, email, password */
        .then(() => {
            toast.success('Success!')
            loginModal.onOpen();
            /*We would close the register modal once we have successfully register */
            registerModal.onClose();
        })
        .catch((error) => {//we use catch when we want to catch an error
            toast.error('Something went wrong')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const toggle = useCallback(() => {
        loginModal.onOpen();
        registerModal.onClose();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Header 
                title='Welcome to Airbnb'
                subtitle='Create an account'
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
                id='name'
                label='Name'
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
                        Already have an account?
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
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return ( 
        <Modal  
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            /* We wrap the onSubmit function with this
            hook handleSubmit */
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
     );
}
 
export default RegisterModal;