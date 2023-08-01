/* it's a server component so we aren't writing
   use client on the top.
*/

//let's import the following

import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import TripsClient from "./TripsClient";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";

const TripsPage = async () => {
    const currentUser = await getCurrentUser();

    //let check if there is any current user
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

    const reservations = await getReservations({
        userId: currentUser.id
    });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No trips found"
                    subtitle="Looks like you haven't reserved any trips"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient
                //let's pass in some props
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage