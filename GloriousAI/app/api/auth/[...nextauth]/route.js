import NextAuth from "next-auth";
require("dotenv").config();
import GoogleProvider from "next-auth/providers/google";
import { connectToDb } from "@utils/database";
import User from "@models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDb();
        //check if a user exists
        const userExists = await User.findOne({ email: profile.email });

        //if not crete a new user save to db
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", ""),
            image: profile.picture,
          });
        }
        return true;
      } catch (err) {
        console.log("failed to check if user exists", err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
