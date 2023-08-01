/* This is not a route this is a direct communication 
   from server component to the database.
*/

//let start by import prisma  
import prisma from "@/app/libs/prismadb"; 

//Now let write the interface 
interface IParams {
    //it going to accept a listingId with a type of string
    listingId?: string;
}

export default async function getListingById(
    //now the parameters would be params: IParams
    params: IParams
) {
    //now let write the try and catch block
    try {
        //we would extract the listingId from params
        const { listingId } = params;
        
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                /* we want to load the user so we can load
                   the proper image and the name of the user.
                */
                user: true  
            }
        });
        //now let's check if there is any listing 
        if (!listing) {
            return null;
        }

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            //let's sanitize our user
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: 
                    listing.user.emailVerified?.toISOString() || null,
            }
        };
    } catch (error: any) {//to catch any error
        throw new Error(error);
    }
}