import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

/* We ca finally defined the function
   post, get, patch, put and we don't 
   have to use Request method and a 
   switch method 
*/
export async function POST(
   /* Our post will provide us with
      a request which is a type of 
      request.
   */
   request: Request
) {
   /* To get our request body we would use const body */
   const body = await request.json();
   /* We would extract all the fields we need from
      our body
   */
   const {
      email,
      name,
      password
   } = body;

   const hashedPassword = await bcrypt.hash(password, 12);

   const user = await prisma.user.create({
      data: {
         email,
         name,
         hashedPassword
      }
   });
   /* to return the response we have to use 
      next response 
   */
   return NextResponse.json(user);
}


































































































// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// import prisma from "@/app/libs/prismadb";

// export async function POST(
//    request: Request,
// ) {
//    const body = await request.json();
//    const {
//       email,
//       name,
//       password,
//    } = body;

//    const hashedPassword = await bcrypt.hash(password, 12);

//    const user = await prisma.user.create({
//       data: {
//          email,
//          name,
//          hashedPassword,
//       }
//    });

//    return NextResponse.json(user);
// }































































































































































































