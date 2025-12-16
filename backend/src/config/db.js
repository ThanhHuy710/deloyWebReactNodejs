import mongoose from 'mongoose';
//connect database
export const connectDB= async ()=>
{
    try{
        await mongoose.connect(
           process.env.MONGODB_CONNECTION_STRING
        );
    console.log("lien ket CSDL thanh cong");
    }catch(error){
        console.error("loi khi ket noi CDSL:",error);
        process.exit(1); //exit with error 1(thoat voi trang thai that bai),0(thoat voi trang thai thanh cong)
    }
}