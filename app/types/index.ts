import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<
    Listing, 
    "createdAt"
> & {
    createdAt: string;
}

export type safeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
}

export type SafeUser = Omit<
    User,
    //then we omit the following
    "createdAt" | "updatedAt" | "emailVerified"   
> & { //then we replace those values with our custom ones
    createdAt: string; // with a type of string
    updatedAt: string; // with a type of string
    emailVerified: string | null; // with a type of string or null
};