'use client'

import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi'
import { useSearchParams } from 'next/navigation';

import useSearchModal from '@/app/hooks/useSearchModal';
import useCountries from '@/app/hooks/useCountries';
import { differenceInDays } from 'date-fns';

const Search = () => {
    const searchModal = useSearchModal();
    //let's add params 
    const params = useSearchParams();
    //let's add getByValue
    const { getByValue } = useCountries();

    /* now let's get individual field which we will
       from the search parameters.
    */

    const locationValue = params?.get('locationValue');
    const startDate = params?.get('startDate');
    const endDate = params?.get('endDate');
    const guestCount = params?.get('guestCount');

    //now let's define our location label.
    const locationLabel = useMemo(() => {
        if (locationValue) {
            return getByValue(locationValue as string)?.label
        }

        return 'Anywhere';
    }, [getByValue, locationValue]);

    //now let's write the duration label
    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1
            }

            return `${diff} Days`;
        }

        return 'Any Week'
    }, [startDate, endDate]);

    //now let's write the guest label
    const guestLabel = useMemo(() => {
        return `${guestCount} Guests`;
    }, [guestCount]);

    return ( 
        <div
            onClick={searchModal.onOpen}
            className="
                border-[1px]
                w-full
                md:w-auto
                py-2
                rounded-full
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
            "
        >
            <div 
                className="
                    flex
                    flex-grow
                    items-center
                    justify-between
                "
            >
                <div 
                    className="
                        text-sm
                        font-semibold
                        px-6
                    "
                >
                    {locationLabel}
                </div>
                <div 
                    className="
                        hidden
                        sm:block
                        text-sm
                        font-semibold
                        px-6
                        border-x-[1px]
                        flex-1
                        text-center
                    "
                >
                   {durationLabel} 
                </div>
                <div 
                    className="
                        text-sm
                        pl-6
                        pr-2
                        text-gray-600
                        flex
                        flex-row
                        items-center
                        gap-2
                    "
                >
                    <div className="hidden sm:block">{guestLabel}</div>
                    <div 
                        className="
                           p-2
                           bg-rose-500
                           rounded-full
                           text-white 
                        "
                    >
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>         
        </div>
     );
}
 
export default Search;