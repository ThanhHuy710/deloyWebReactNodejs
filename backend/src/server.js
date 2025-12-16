import express from "express"; // Framework để tạo server HTTP
import taskRoute from "./routes/tasksRouters.js"; // Định nghĩa các endpoint liên quan đến tasks
import { connectDB } from "./config/db.js"; // Hàm kết nối đến database
import dotenv from "dotenv"; // Đọc biến môi trường từ file .env
import cors from "cors"; // Cho phép truy cập từ domain khác (Cross-Origin Resource Sharing)


dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json()); 

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));


app.use("/api/tasks", taskRoute); 

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bat dau tren cong ${PORT}`);
  });
});
