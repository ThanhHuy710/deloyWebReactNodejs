import mongoose from "mongoose";
const taskSchema=new mongoose.Schema({
    title:{
    type:String,
    required:true,
    trim:true,
    },
    status:{
    type:String,
    enum:["active","complete"],
    required:true,
    default: "active",
    },
    completedAt:{
    type:Date,
    default:Date.now,
    },    
},
{
    timestamps:true, //tự động tạo 2 trường createdAt và updatedAt
}
);
const Task=mongoose.model("Task",taskSchema);
export default Task;