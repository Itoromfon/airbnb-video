import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import LoginModal from "@/app/components/modals/LoginModal";

export async function POST(
    //let write request with a type of request  
    request: Request
) {
    //first let get the current user
    const currentUser = await getCurrentUser();

    // now let check if there is current user
    if (!currentUser) {
        return NextResponse.error();
    }

    // now let get our body
    const body = await request.json();

    /* Now let extract all of the field which we will
       have from our body.
    */
    const {
        listingId,
        startDate,
        endDate,
        totalPrice,
    } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.error();
    }

    /* Now let me create a listing and reservation - the 
       way we gonna do that is we are going to update the
       current listing and create a new reservation
    */
   const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice
                }
            }
        }
   });

   // and lastly let return NextResponse
   return NextResponse.json(listingAndReservation);
}