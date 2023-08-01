//let's import the following

import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    reservationId?: string;
};

export async function DELETE (
    request: Request,
    // let's destructure params
    { params }: { params: IParams }
) {
    // now let get the user
    const currentUser = await getCurrentUser();

    // now let check if there is current user
    if(!currentUser) {
        return NextResponse.error();
    }

    //let extract the reservationId
    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
        throw new Error('Invalid ID');
    }

    const reservation = await prisma.reservation.deleteMany({
        /* we want to use some special queries with the 
           deleteMany
        */
       where: {
            id: reservationId,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } }
            ]
       }
    });

    return NextResponse.json(reservation);
}