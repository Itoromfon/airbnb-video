/* fetching the current user in next js 13 
   using server component
*/

import { getServerSession } from "next-auth/next";
// getServerSession is a server component

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

/* Now let write a quick function to get our session */
export async function getSession() {
    return await getServerSession(authOptions)
    // getServerSession is used in react server component
}

/* Now let write our getCurrentUser function */
export default async function getCurrentUser() {
    // Now open a try and catch block
    try {
        const session = await getSession() // to get our session
        if (!session?.user?.email) {
            return null; // that means the session does not exists
        } 

        const currentUser = await prisma.user.findUnique({
            // To find our current user
            where: {
                email: session.user.email as string
            }
        });

        /* If we don't have the current user */
        if (!currentUser) {
            return null;
        }

      return {
        ...currentUser,
        createdAt: currentUser.createdAt.toISOString(),
        updatedAt: currentUser.updatedAt.toISOString(),
        emailVerified: currentUser.emailVerified?.toISOString() || null
      };
    } catch (error: any) {  
        /* The catch is use to handle errors 
           with a type of any
        */
       return null; // we aren't throwing any error
    }
}