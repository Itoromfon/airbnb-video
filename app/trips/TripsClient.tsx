'use client'

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Container from "../components/Container";
import Header from "../components/Header";

import { SafeUser, safeReservation } from "../types";
import ListingCard from "../components/listings/ListingCard";

interface TripsClientProps {
    reservations: safeReservation[];
    currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
    // let now extract the props
    reservations,
    currentUser
}) => {

    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    //Now let's write the onCancel function
    const onCancel = useCallback((id: string) => {
        setDeletingId(id)
        /* the set deleting would be the id in the 
           parameter
        */
       axios.delete(`/api/reservations/${id}`)
       .then(() => {
            toast.success('Reservation cancelled');
            router.refresh();
       })
       .catch((error) => {
            toast.error(error?.response?.data?.error)
       })
    }, [router]);

    return ( 
        <Container>
            <Header 
                title="Trips"
                subtitle="Where you've been and where you're going"
            />
            <div
                className="
                    mt-10
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                "
            >
                {reservations.map((reservation) => (
                    <ListingCard 
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancel reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
     );
}
 
export default TripsClient;