import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export const authOptions:NextAuthOptions = {
    providers: [
CredentialsProvider({
    name: "Credentials",
    credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
    },
    async authorize(credentials, req){
        try{

        if(!credentials || !credentials.email || !credentials.password) {
            throw new Error("Email and password are required");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if(!user) {
            throw new Error("No user found with this email");   
        }
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if(!isValid) {
            throw new Error("Invalid password");
        }
        return {
            id: user._id.toString(),
            email: user.email,
        }
    }catch (error) {
console.error("Error in authorize:", error);
        throw new Error("Authentication failed");
    }

},
}),],
callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.email = user.email;
        }
        return token;
    },
    async session({ session, token, user }) {
        if (session.user) {
            session.user.id = token.id as string 
        }

        return session;
    }
},
pages: {
    signIn:'/login',
    error: '/login',

},
session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
},
secret: process.env.NEXT_AUTH_SECRET,
};
