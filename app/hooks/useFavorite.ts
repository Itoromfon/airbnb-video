import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";
import { request } from "http";

interface IUseFavorite {
    listingId: string;//listingId with a type of string.
    currentUser?: SafeUser | null//currentUser with a type of SafeUser or null
}

//Now let's write our hook
const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    //let write our hasFavorited constant
    const hasFavorited = useMemo(() => {
        //first let's get the list
        const list = currentUser?.favoriteIds || [];//so we don't get an error if there is no current user or favorite ids

        return list.includes(listingId)
    }, [currentUser, listingId]);

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => { //now let stop the propagaton
        e.stopPropagation();

        //now let's check if we have the current user.
        //since there is no current user.
        if (!currentUser) {
            return loginModal.onOpen();
        }
        
        //other we are going to open a try & catch block
        try {
            let request; //since we can change it

            if (hasFavorited) {
            /* if we already have this listing liked 
               we want to unlike it.
            */
                request = () => axios.delete(`/api/favorites/${listingId}`);               
            } else { // this time is going to call a post request
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            //just write await request
            await request();
            router.refresh();
            toast.success('success');
        } catch (error) {// to catch an error
            toast.error('Something went wrong.')
        }
    }, [
        currentUser, 
        hasFavorited, 
        listingId, 
        loginModal, 
        router
    ]);
    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite;
