import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";
import { timeStamp } from "console";

export interface IUser{
    username:string;    
    password:string;
    email:string;
    createdAt?: Date;
    updatedAt?: Date;
    _id?:mongoose.Types.ObjectId;
}

const UserSchema  = new Schema<IUser>({
    username:{
        type:String, 
        unique:true,
        trim:true,
        minlength:3,

    },
    password:{
        type:String, 
        required:true,
        minlength:6,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate: {
            validator: function(v: string) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    
    
},
{
timestamps:true,
}
)



UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;