/* this is an action for a server component and not
   an API call.
*/

import prisma from "@/app/libs/prismadb";

//Now let write the interface 
interface IParams {
    //it is going to accept the following props.
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(
    //now the parameters would be params: IParams
    params: IParams
) {
    //now let's write a try block
    try {

        //let's extract all of our parameters
        const  { listingId, userId, authorId } = params;

        const query: any = {};

        //if there is listingId
        /* we would find all the reservation for this single
        listing we are looking at.
        */
        if (listingId) {
            query.listingId = listingId;
        }

        //if there is userId
        /* we are going to find all of the trips the user
        have.
        */
        if (userId) {
            query.userId = userId;
        }

        //if there is authorId
        /* we are going to search for the reservation other
        user need for our listing.
        */
        if (authorId) {
            query.listing = { userId: authorId }
        }
        /* if we search for userId we */

        //let write the reservation depending on the query.
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                CreatedAt: 'desc'
            }
        });
        
        //let sanitize the date object so we don't get any errors.
        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.CreatedAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString()
                }
            })
        );

        return safeReservations;
    } catch (error: any) {
        //let throw new error
        throw new Error(error);
    }
}















































































































