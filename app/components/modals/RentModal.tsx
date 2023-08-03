/* since it using the hook it is a 
   client component
*/
'use client'


import useRentModal from "@/app/hooks/useRentModal";
import { useCallback, useMemo, useState } from "react";

import Header from "../Header";

import Modal from "./Modal";
import { categories } from "../navbar/Categories";
import CategoryInput from "../input/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../input/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../input/Counter";
import ImageUpload from "../input/ImageUpload";
import Input from "../input/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


enum STEPS {
    CATEGORY = 0, // map it to 0
    LOCATION = 1, // map it to 1
    INFO = 2, // map it to 2
    IMAGES = 3, // map it to 3
    DESCRIPTION = 4, // map it to 4
    PRICE = 5 // map it to 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    //we are going to set isLoading to false
    const [isLoading, setIsLoading] = useState(false)

    // Now let write the control for the STEPS
    const [step, setStep] = useState(STEPS.CATEGORY);
    /* the default will step.category which will 
       default to zero.
    */

    
    const {
    /* We would write our useForm here to control our form */
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        //the default value for this form will be
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,//price is one by default
            title: '',
            description: ''
        }
    });

    const category = watch('category');//to watch the category
    const location = watch('location');//to watch the location
    const guestCount = watch('guestCount')//to watch the guestCount and the default is one
    const roomCount = watch('roomCount')//to watch the roomCount
    const bathroomCount = watch('bathroomCount')//to watch the bathroomCount
    const imageSrc = watch('imageSrc')//to watch the imageSrc

    const Map = useMemo(() => {
        
        return dynamic(() => import('../Map'), {
            ssr: false
        })
        /* We are going to rerender this dynamic Map
           every time location changes
        */
    }, []);

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    /* Now let create our function which will go
       backward or forward
    */
    const onBack = () => { // value minus one
        setStep((prevStep) => prevStep - 1);
    }

    // const onBack = useCallback(() => {
    //     setStep(prevStep => prevStep -1)
    // }, [])

    //we are creating on next function
    const onNext = () => { // value plus one
        setStep((prevStep) => prevStep + 1);
    }

    //Now let create an onSubmit function   
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('api/listings', data)
        .then(() => {
            toast.success('Listing Created!');
            router.refresh();//now we are going to call router.refresh
            reset();//And then call reset, reset is gotten from useForm
            setStep(STEPS.CATEGORY);//to reset the step to the first step
            rentModal.onClose(); 
        })
        .catch(() => {
            /* the .catch function is use to catch
               an error.
            */
            toast.error('Something went wrong.');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const actionLabel = useMemo(() => {
        // price is our last step
        if (step === STEPS.PRICE) {
            return 'Create'; 
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        // category is our first step
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Back';
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Header 
                title="which of these best describes your place?"
                subtitle="pick a category"
            />
            <div 
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                    max-h-[50vh]
                    overflow-y-auto
                "
            >
                {categories.map((item) => {
                    return (
                        <div 
                          key={item.label}
                          className="col-span-1"
                        >
                            <CategoryInput 
                            /* we are going to extract category
                               and call set custom value and we
                               are going to pass the category 
                               which we extracted here.
                            */
                                onClick={(category) => setCustomValue('category', category)}
                                selected={category === item.label}
                                label={item.label} 
                                icon={item.icon}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="Where is your place located?"
                    subtitle="Help guests find you!"
                />
                <CountrySelect 
                /* The on change is going to accept a 
                   value and we would then run set custom
                   value with an id of location and we are
                   then going to pass the value like that.
                */
                    onChange={(value) => setCustomValue('location', value)}
                    value={location}
                />
                {/* Now we have to add our map */}
                <Map 
                    center={location?.latlng}
                />
                
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="Share some basics about your place"
                    subtitle="what amenities do you have?"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                />
                <ImageUpload 
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="How would you describe your place"
                    subtitle="Short and sweet works best!"
                />
                <Input 
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                /> 
                <hr />
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                /> 
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="Now, set your price"
                    subtitle="How much do you charge per night?"
                />
                <Input 
                    id="price"
                    label="Price"
                    formatPrice={true} 
                    type="number"
                    disabled={isLoading}//disabled is going to be control by isLoading
                    register={register}//register is going to be control by register
                    errors={errors}//errors is going to be control by errors
                    required
                />
            </div>
        )
    }

    return ( 
        <Modal 
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction = {step === STEPS.CATEGORY ? undefined : onBack}
            title="Airbnb your home!"  
            body={bodyContent} 
        />
     );
}
 
export default RentModal;



































































































































































































