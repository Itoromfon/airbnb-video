'use client'

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Header from "../Header";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
    /* it's going to accept this following props with
       their types.
    */
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    //now let's extract all of this props.
    title,
    locationValue,
    imageSrc,
    id,
    currentUser
}) => {
    /* Now let's get our full location using this location
       value. we can do that using the useCountries hooks
    */
    const { getByValue } = useCountries();  
    
    const location = getByValue(locationValue);
    return ( 
        //now let's write a fragment <></>
        <>
            <Header 
                title={title}//title with a type of title
                subtitle={`${location?.region}, ${location?.label}`}
            />
            <div
                className="
                    w-full
                    h-[60vh]
                    overflow-hidden
                    rounded-xl
                    relative
                "
            >
                <Image 
                    alt="Image"
                    src={imageSrc}//source of image source
                    fill //props of fill
                    className="object-cover w-full"
                />
                <div className="absolute top-5 right-5">
                    <HeartButton 
                        /* we would pass the listingId as
                           id props.
                        */
                        listingId={id}
                        /* current user with a type of 
                           current user.
                        */
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </>
     );
}
 
export default ListingHead;