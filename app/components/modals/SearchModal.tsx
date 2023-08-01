'use client'

import { formatISO } from "date-fns";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";

import useSearchModal from "@/app/hooks/useSearchModal";
import CountrySelect, { CountrySelectValue } from "../input/CountrySelect";
import Header from "../Header";
import Calendar from "../input/Calendar";
import Counter from "../input/Counter";

import Modal from "./Modal";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    //let create a state for the daterange
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    //now let's import our map
    const Map = useMemo(() => {
        return dynamic(() => import('../Map'), {
            ssr: false
            //ssr means server side rendering
            /* we are going to re-render Map every time
               we change our location.
            */
        })
    }, []);

    const onBack = useCallback(() => {
        setStep((prevStep) => prevStep - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((prevStep) => prevStep + 1);
    }, []);

    // now let's write the onSubmit function
    const onSubmit = useCallback(async() => {
        if (step !== STEPS.INFO) {
            return onNext();
        }
        //otherwise let's define the current query
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        //now let's create our final url
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        //now let's reset our steps
        setStep(STEPS.LOCATION);
        searchModal.onClose();

        router.push(url);
    }, 
    [
        step,
        searchModal,
        location,
        router,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        onNext,
        params
    ]);

    //now let's write function for the actionLabel
    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }

        return 'Next';
    }, [step]);

    //now let's write function for the secondaryActionLabel
    const secondaryActionLabel =useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Header 
                title="Where do you wanna go?"
                subtitle="Find the perfect location!"
            />
            <CountrySelect
                value={location} 
                onChange={(value) => 
                    setLocation(value as CountrySelectValue)
                }
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    //the next step is date
    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar 
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    //let's create a bodyContent for STEPS.INFO
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Header 
                    title="More information"
                    subtitle="Find you perfect place!"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter
                    title="BathroomCount"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }

    return ( 
        <Modal 
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
     );
}
 
export default SearchModal;