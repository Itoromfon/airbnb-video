import { PrismaClient } from "@prisma/client";

/* let write some type for the prisma  */
/* We give a global definition of prisma
    so it can work through out our code
*/
declare global {
    var prisma: PrismaClient | undefined
}

/* we create a constant call client which
   either searches for globalThis.prisma
   or create a new PrismaClient  
*/
const client = globalThis.prisma || new PrismaClient()  
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client;