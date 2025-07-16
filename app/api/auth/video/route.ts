import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({createdAt:-1}).lean();
        if(!Video || videos.length === 0) {
            return  NextResponse.json([], { status: 200 });
        }
        return NextResponse.json(videos, { status: 200 }); 
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        dbConnect();
        const { title, description, videoUrl, controls, thumbnailUrl, transformation, _id }: IVideo = await request.json();
        if (!title || !description ||  !videoUrl || !thumbnailUrl) {
            return NextResponse.json({ error: "Title, video URL, and thumbnail URL are required" }, { status: 400 });
        }


        const newVideo = new Video({
            _id: _id ? new mongoose.Types.ObjectId(_id) : undefined,
            title,
            description,
            videoUrl,
            controls: controls ?? true,
            thumbnailUrl,
            transformation:  {
                width: 1080,
                height: 1920,
                quality: transformation?.quality || 100
            }
        });

        const savedVideo = await Video.create(newVideo);
        return NextResponse.json(savedVideo, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }
}