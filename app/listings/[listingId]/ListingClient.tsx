'use client'

import { Range } from "react-date-range";
import { toast } from "react-hot-toast";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Reservation } from "@prisma/client";
import { SafeListing, SafeUser, safeReservation } from "@/app/types";

import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";

import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

//let's create a calendar.
const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
};

interface ListingClientProps {
    /* it going to accept reservation with a type of
       Reservation which is optional then just add an
       array.
    */
    reservations?: safeReservation[];
    listing: SafeListing & {
        user: SafeUser
    };
    //current user with a type of safe user
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    //let's now extract the props.
    listing,
    //Now let's extract the reservations
    /* let it be equal to an empty array so you can save
       the .map and .fine without getting any errors.
    */
    reservations = [],
    currentUser
}) => {
    //Now let's import Login Modal.
    const loginModal = useLoginModal();
    const router = useRouter();

    //Now let write a constant to disable the date.
    const disabledDates = useMemo(() => {
        //let date be a type of Date with an array.
        let dates: Date[] = [];

        //let iterate over the reservations.
        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });

            dates = [...dates, ...range]
        });

        return dates;
    }, [reservations]);

    //now let create some state
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);  

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        setIsLoading(true);

        /* the api slash reservation does not exist yet. */
        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(() => {
            toast.success('Listing reserved');
            setDateRange(initialDateRange);
            router.push('/trips');
        })
        .catch(() => {
            toast.error('Something went wrong.');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [
        currentUser,
        dateRange.startDate,
        dateRange.endDate,
        listing?.id,
        loginModal,
        router,
        totalPrice
    ]);
    
    //let create the use-useEffect
    useEffect(() => {
    /* we are going to change the total price depending
       on how user select the date in our calendar.
    */
    /* use-effect will notice everytime time I make a 
       change in my calendar and it's going to count 
       how many days we have selected. if there is no
       day-count all we going to do is to display a 
       single night price   
    */
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price)
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    /* we are going to create a constant which will use 
       the existing categories array from Categories 
       component to get that exact category.
    */
    const category = useMemo(() => {
        return categories.find((item) => {
            return (
                item.label === listing.category
            );
        })
    }, [listing.category]);//we would pass listing.category cause it is a string.
    return ( 
        // <div>
        //     This is my Listing Client 
        // </div>
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                   <ListingHead 
                        //we are going to pass all this props
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                   /> 
                   <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                   ">
                        <ListingInfo 
                            /* we are going to pass in the 
                               following props.
                            */
                           user={listing.user}
                           category={category}
                           description={listing.description}
                           roomCount={listing.roomCount}
                           guestCount={listing.guestCount}
                           bathroomCount={listing.bathroomCount}
                           locationValue={listing.locationValue}
                        />
                        <div
                            className="
                                order-first
                                mb-10
                                md:order-last
                                md:col-span-3
                            "
                        >
                            <ListingReservation 
                                /* let's add the attributes
                                   which we need.
                                */
                               price={listing.price}
                               totalPrice={totalPrice}
                               onChangeDate={(value) => setDateRange(value)}
                               dateRange={dateRange}
                               onSubmit={onCreateReservation}
                               disabled={isLoading}
                               disabledDates={disabledDates}
                            />
                        </div>
                   </div>
                </div>  
            </div>
        </Container>
     );
}
 
export default ListingClient;