import mongoose, {Schema, model, models} from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;


export interface IVideo{
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    controls: boolean;
    thumbnailUrl: string;
    transformation?: {
        width: number;
        height: number;
        quality: number;
    }
}

const VideoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true,
    },
    controls: {
        type: Boolean,
        default: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
        trim: true,
    },
    transformation: {
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        quality: { type: Number, min: 1, max: 100}, 
    }
}, {
    timestamps: true,
});



const Video = models?.Video || model<IVideo>("Video", VideoSchema);
export default Video;