import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings () {
    //Now let's open a try and catch block
     try {
        const currentUser = await getCurrentUser();

        // let check if there is current user
        if (!currentUser) {
            return [];
        }

        // now let's find our favorite
        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favoriteIds || [])]
                }
            }
        });

        // now let's sanitize our favorite
        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString()
        }));

        return safeFavorites;
     } catch (error: any) {
        throw new Error(error);
     }
}