import { credentialsAuth } from "./credentialsAuth"; 


export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    credentialsAuth, 
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
