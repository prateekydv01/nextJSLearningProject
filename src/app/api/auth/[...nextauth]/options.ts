import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials:{
            username: { label: "Email", type: "text", placeholder: "your@mail.com" },
            password: { label: "Password", type: "password" },},
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user = await userModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user) { 
                    throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                    throw new Error("please verify your account first")
                    }

                    const isPassCorrect = await bcrypt.compare(credentials.password,user.password)
                    if(isPassCorrect){
                        return user
                    }else{
                        throw new Error('Invald Password')
                    }

                } catch (error:any) {
                    throw new Error(error)
                }
            }

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
        async jwt({ token, user}) {

            //write custom types
            if(user){
                token._id=user._id?.toString()
                token.isVerified = user?.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;

            }
            return token
        }
    },

    pages: {
        signIn: '/signin'
    },

    session:{
        strategy:'jwt'
    },

    secret: process.env.NEXTAUTH_SECRET
}
