import mongoose ,{Document , Schema} from "mongoose";

export interface IChat extends Document{
    users: string[],
    latestmessage:{
        text: string,
        sender:string
    };

    createdAt:Date;
    UpdatedAt:Date;
}

const schema:Schema<IChat> = new Schema(
    {
        users:[{type:String , required:true}],
        latestmessage:{
            text:String,
            required: true
        }
    },{
        timestamps:true
    }
)

export const Chat = mongoose.model<IChat>("Chat",schema);