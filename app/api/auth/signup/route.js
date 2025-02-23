import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/utils/db'

export async function POST(request){
    const { name, email, password, confirmPassword, role } = await request.json();

    const isValidEmail=(email)=>{
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }
    if (!name || !email || !password || !confirmPassword) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    if(!isValidEmail(email)){
        return NextResponse.json({message:'Invalid Email'},{status:400})
    }
    if(password!==confirmPassword){
        return NextResponse.json({message:'password do not match'},{status:400})
    }
    if(password.length<6){
        return NextResponse.json({message:'password must be 6 character long'},{status:400})
    }
    try {
        await connectDB()
        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json({message:'User already exists'},{status:400})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=new User({
            email,
            name,
            password:hashedPassword,
            role
        })
        await newUser.save()
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return NextResponse.json({message:'User created',user:userWithoutPassword },{status:201})
    } catch (error) {
        return NextResponse.json({message:'Something went wrong'},{status:500})

    }
}