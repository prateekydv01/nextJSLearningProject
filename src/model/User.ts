import mongoose,{Schema,Document} from "mongoose"

export interface Message extends Document{
    content: string;
    createdAt:Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})

export interface User extends Document{
    username: string;
    email : string;
    password : string;
    verifyCode:string;
    verifyCodeExpiry: Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username Is Required"],
        trim:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:[true,"Email Is Required"],
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password Is Required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verification Code Is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"],
    },
   isVerified:{
        type:Boolean,
        default: false
    },
    isAcceptingMessage:{
        type:Boolean,
        default: true
    },
    messages:[MessageSchema]
})

//export in next js is different as next js dont knows that this model is already present or freshly made

const userModel =
//if there exist model already and this syntx is of type script that we want mongoose model of user type
(mongoose.models.User as mongoose.Model<User>) || 
//when new user model is creating
(mongoose.model<User>("User",userSchema))

export default userModel