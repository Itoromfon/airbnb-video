'use client'

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeUser, safeReservation } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";


interface ListingCardProps {
    data: SafeListing;
    reservation?: safeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    //Now let's extract this props 
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
    currentUser
}) => {
    /* Now let's first get our router which we will
       also need.
    */
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    /* Now let create a function called handle cancel which
       we will use in trips,reservation and other types
       of Listing types modification this component will
       have depending on where we are importing it.
    */
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

        //Now let check if the current card is disabled
        if (disabled) {
        //we would just break and return the function
            return;
        }

        onAction?.(actionId);
    }, [onAction, actionId, disabled])

    //Now let write a constant for our price
    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price;
    }, [reservation, data.price]);

    //Now let write a constant for reservation date
    const reservationDate = useMemo(() => {
        if (!reservation) {
        /* since there is no reservation, the reservation
           is going to be null.
        */
        return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])

    return ( 
        <div 
            onClick={() => router.push(`/listings/${data.id}`)}
            className="
            col-span-1 cursor-pointer
            "
        >
            <div className="flex flex-col gap-2 w-full">
                <div
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image 
                        fill
                        alt="Listing"
                        src={data.imageSrc}
                        className="
                            object-cover
                            h-full
                            w-full
                            group-hover:scale-110
                            transition
                        "
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton 
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        ${price}
                    </div>
                    {!reservation && (
                        <div className="font-light">night</div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button 
                        disabled={disabled}//disabled props control by whether the general card is disabled.
                        small//it's going to be a small button
                        label={actionLabel}
                        onClick={handleCancel}
                        /* we are not going to see the button now
                           cause we are not working with reservation. 
                        */
                    />
                )}
            </div>
        </div>
     );
}
 
export default ListingCard;