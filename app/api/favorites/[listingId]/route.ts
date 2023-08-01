import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function POST(
    /* when writing route handler we do not write
       export default we just write export.
    */
    request: Request,
    //and we are also going to extract params 
    { params } : { params: IParams }
) {
    const currentUser = await getCurrentUser();//let's get our current user.

    //now let check if there is a current user
    //since there isn't a current user let's return this.
    if (!currentUser) {
        return NextResponse.error();
    }

    //now let's extract listing id from our parameters
    const { listingId } = params;

    //now let's check the type of this listing ID
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID')
    }

    //now let's create our favorite Ids arrays
    let favoriteIds = [...(currentUser.favoriteIds || [])]

    //now let's push the new listing Id inside
    favoriteIds.push(listingId);

    //now we are going update the user
    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds
        }
    });

    return NextResponse.json(user); 
}

//now let's create a delete function
export async function DELETE(
    request: Request,
    { params } : { params : IParams }
) {
    //now let get current user
    const currentUser = await getCurrentUser();

    //if there is no current user
    if (!currentUser) {
        return NextResponse.error();
    }

    //now let's extract our listing id
    const { listingId } = params;

    //now let's check the type of this listing ID
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID')
    }

    //now let's modify the favorite Ids
    let favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds = favoriteIds.filter((id) => id !== listingId);

    //now let's update the users
    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds
        }
    });

    return NextResponse.json(user);
}

/* Now let's create a hook that would call this route. 
   useFavorite
*/


























































































































































