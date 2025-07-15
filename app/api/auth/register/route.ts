//next js server runs on edge not like the classic node.js server
import { NextRequest, NextResponse, userAgent } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
//steps
//1. connect to the database
//2. get the request body
//3. validate the request body
//4. check if the user already exists
//5. create the user
//6. return the user
//7. handle errors
//8. export the function

export async function POST(req: NextRequest) {
    try{
      const {email, password}=  await req.json()
      if(!email || !password) {
        return NextResponse.json({error: "Email and password are required"}, {status: 400});
      }
      await dbConnect();
      await User.findOne({email}).then((user)=>{
        if(user) {
          return NextResponse.json({error: "User already Registered"}, {status: 400});
        }
      })
      await User.create({
        email,
        password,
      }).then((user)=>{
        return NextResponse.json({message: "User Registered successfully", user}, {status: 201});
      }).catch((err)=>{
        return NextResponse.json({error: "Error creating user"}, {status: 500});
      })


    }
    catch(err){
        console.error("Error in user registration:", err);
        return NextResponse.json({error: "Failed to Create User Server Error Occurred"}, {status: 500});
    }
}



