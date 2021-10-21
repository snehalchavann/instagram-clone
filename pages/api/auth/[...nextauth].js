import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  pages:{
      signIn: "/auth/signin",
  },
  callbacks:{
      async session({session, token, user}){
        //   return username by taking name of the user from session
          session.user.username = session.user.name
            .split(" ")
            .join("")
            .toLocaleLowerCase();

            // assign uid from token returned by provider google
            session.user.uid = token.sub;
            return session;
      }
  }
})