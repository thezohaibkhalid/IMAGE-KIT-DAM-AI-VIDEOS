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
            async authorize(
                credentials: { email?: string; password?: string } | undefined,
                req: any
            ): Promise<{ id: string; email: string; username: string } | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email or password are required");
                }
                interface IUser {
                    _id: { toString(): string };
                    email: string;
                    username: string;
                    password: string;
                }
                try {
                    dbConnect();
                    const user: IUser | null = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    const isPasswordValid: boolean = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                    };
                } catch (error) {
                    throw error;
                }
            }
        }),
      ],
};