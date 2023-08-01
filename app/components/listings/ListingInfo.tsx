'use client'

import useCountries from "@/app/hooks/useCountries";

import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

//Now let's import our map
const Map = dynamic(() => import('../Map'), {
    ssr: false
})

interface ListingInfoProps {
    /* it's going to accept this following props with
       their types.
    */
    user: SafeUser;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined //with a type of undefined  
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
    //Now let's extract our useCountries hooks.
    const { getByValue } = useCountries();

    //now we want the coordinate
    const coordinates = getByValue(locationValue)?.latlng;

    return ( 
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div 
                    className="
                        text-xl
                        font-semibold
                        flex
                        flex-row
                        items-center
                        gap-2
                    "
                >
                    <div>Hosted by {user?.name}</div>
                    {/* Now let's add our little avatar here */}
                    <Avatar 
                        src={user?.image}
                    />
                </div>
                <div 
                    className="
                        flex
                        flex-row
                        items-center
                        gap-4
                        font-light
                        text-neutral-500
                    "
                >
                    <div>
                        {guestCount} guests
                    </div>
                    <div>
                        {roomCount} rooms
                    </div>
                    <div>
                        {bathroomCount} bathrooms
                    </div>
                </div>
            </div>
            <hr />
            {/* let now display our category. */}
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <hr />
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
            <hr />
            {/*Now let's add our Map.*/}
            <Map center={coordinates} />
        </div>
     );
}
 
export default ListingInfo;
/* Now let add some loading state */