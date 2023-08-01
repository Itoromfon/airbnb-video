import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export const authOptions:  AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
     /* The github provider is going to accept a clientId
        and a clientSecret
     */       
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
    /* The google provider is going to accept a clientId
       and a clientSecret
    */
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
    /*  the credentials is the name which is going
        to have an email and password
    */
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password '},
            },
            async authorize(credentials) {
                /* if the user forget to enter password or
                    email we are going to throw an error 
                    invalid credentials
                */
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }

                /* let find the user using our credentials
                    email. 
                */
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if(!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                /* if the password entered by the user is
                    actually correct
                */
               const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
               );

               if (!isCorrectPassword) {
                 throw new Error('Invalid credentials');
               }

               return user;
            }
        })
    ],
    /* when ever any error occurs it's going to
       redirect to our slash / page
    */
    pages: {
        signIn: '/', 
    },
    /* We only enable debug if we are in 
       development, this help us see some 
       errors in the terminals that we won't
       normally see 
    */
    debug:process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
};

/* authOptions is the object we created at the beginning */
export default NextAuth(authOptions);














































































































































































































