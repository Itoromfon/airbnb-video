import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    /* it going to accept request which is a type
       of request.  
    */
    request: Request
) {
    const currentUser = await getCurrentUser();//let's get our current user.

    // now let check if there is a current user
    if(!currentUser) {
        return NextResponse.error();
    }

    // now let extract our body
    const body = await request.json();

    /* now let extract all of the field which we will
       have from our body.
    */
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price
    } = body;

    /* Now we are going to iterate over all of this
       items to know whether one of them is missing.
    */
    Object.keys(body).forEach((value:any) => {
        if (!body[value]) {
            NextResponse.error();
        }
    });

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount, 
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}