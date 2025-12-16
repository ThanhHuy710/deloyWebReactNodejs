import Task from "../models/Task.js";
//các phương thức
export const getAllTasks = async (req, res) => {
  //lấy theo ngày,tháng,năm
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;
  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Nếu Chủ nhật thì lùi 6 ngày, còn lại thì tính từ thứ Hai
      const mondayDate = new Date(now);
      mondayDate.setDate(now.getDate() + diff);
      startDate = new Date(
        mondayDate.getFullYear(),
        mondayDate.getMonth(),
        mondayDate.getDate()
      );
      break;
    }

    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    // build aggregation pipeline: if a date filter exists, match by createdAt first
    const pipeline = [];
    if (Object.keys(query).length) {
      pipeline.push({ $match: query });
    }

    pipeline.push({
      $facet: { 
        tasks: [{ $sort: { createdAt: -1 } }],
        activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
        completeCount: [
          { $match: { status: "complete" } },
          { $count: "count" },
        ],
      },
    });

    const result = await Task.aggregate(pipeline);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;
    res.status(200).json({ tasks, activeCount, completeCount }); //gửi dữ liệu về frontend
  } catch (error) {
    console.log("loi khi goi getAllTasks:", error); //gui o sever chi cho dev xem dc
    res.status(500).json({ message: "loi he thong" }); //gui loi chung chung den nguoi dung
  }
};
export const createTasks = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save(); //lưu task mới xuống db
    res.status(201).json(newTask);
  } catch (error) {
    console.log("loi khi goi createTasks:", error); //gui o sever chi cho dev xem dc
    res.status(500).json({ message: "loi he thong " }); //gui loi chung chung den nguoi dung
  }
};
export const updateTasks = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );
    if (!updateTask) {
      return res.status(404).json({ message: "Nhiem vu khong ton tai" });
    }
    // trả về task đã cập nhật để client biết request đã hoàn thành
    res.status(200).json({ message: "Update", id: updateTask._id });
  } catch (error) {
    console.log("loi khi goi updateTasks:", error); //gui o sever chi cho dev xem dc
    res.status(500).json({ message: "loi he thong " }); //gui loi chung chung den nguoi dung
  }
};
export const deleteTasks = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return res.status(404).json({ message: "nhiem vu khong ton tai" });
    }
    // trả về xác nhận xóa để axios resolve và frontend có thể hiển thị toast/re-render
    return res.status(200).json({ message: "Deleted", id: deleteTask._id });
  } catch (error) {
    console.log("loi khi goi deleteTasks:", error); //gui o sever chi cho dev xem dc
    res.status(500).json({ message: "loi he thong " }); //gui loi chung chung den nguoi dung
  }
};
