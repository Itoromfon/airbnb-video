/* This is a server component so we cannot use hooks 
   we can only use actions which can only communicate
   with the database.
*/

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";

//let write the interface
interface IParams {
    //would have a listingId which is an optional string
    listingId?: string;
}

const ListingPage =  async (
    {
        //this is the parameters
        params
    } : {
        params: IParams
    }
) => {
    const listing = await getListingById(params);
    const reservations = await getReservations(params);
    //let's also add the currentUser
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }
    return ( 
        <ClientOnly>
            <ListingClient
                /* we are going to pass both listing and
                   current user.
                */
                listing={listing}
                currentUser={currentUser}
            />
        </ClientOnly>
     );
}
 
export default ListingPage;

//Now we going have to create an action.