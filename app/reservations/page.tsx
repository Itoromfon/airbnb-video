import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";

import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        )
    }

    //now let fetch our reservation
    const reservations = await getReservations({
        /* we would use the authorId cause we want to load
           all the reservation on our listing.
        */
       authorId: currentUser.id
    });

    //Now let's write the empty state
    if  (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No reservations found"
                    subtitle="Looks like you have no reservations on your properties"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ReservationsClient  
                //let pass in the following props
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ReservationsPage;