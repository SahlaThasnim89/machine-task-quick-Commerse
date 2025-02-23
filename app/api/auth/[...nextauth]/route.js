import NextAuth from "next-auth";
import User from '@/models/User'
import connectDB from '@/utils/db'
import bcrypt from 'bcryptjs'
import CredentialsProvider from "next-auth/providers/credentials";

const handler=NextAuth({
    session:{
        strategy:"jwt",
    },
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                email:{},
                password:{},
            },
            async authorize(credentials){
                try{
                    await connectDB()
                    const { email, password, role } = credentials;
                    const user=await User.findOne({email})
                    if(!user){
                        throw new Error("User not found")
                    }
                    const isValidPassword=await bcrypt.compare(
                        password?? "",user.password
                    );
                    if(!isValidPassword){
                        throw new Error("Invalid credentials")
                    }
                    return { id: user.id, email: user.email, role };
                }catch{
                    return null
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id=user.id;
                token.email=user.email;
                token.role = user.role;
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user={
                    email:token.email,
                    role: token.role,
                };
            };
            return session;
        }
    },
    pages:{
        signIn:"/sign-In"
    },
    secret:process.env.NEXTAUTH_SECRET

})
export { handler as GET, handler as POST };