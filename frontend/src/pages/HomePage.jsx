import AddTask from "@/components/AddTask";
import DateTimerFilter from "@/components/DateTimerFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
export default function HomePage() {
  const [taskBuffer,setTaskBuffer]=useState([]);
  const [activeTaskCount,setActiveTaskCount]=useState(0);
  const [completeTaskCount,setCompleteTaskCount]=useState(0);
  const [filter,setFilter]=useState('all');
  const [dateQuery,setDateQuery]=useState('today');
  const [page,setPage]=useState(1);

  //async function trả về 1 promise thay vì trả về giá trị ngay lập tức(ở đây lấy danh sách tasks từ server )
  const fetchTasks = useCallback(async () => {
    try {
      //axios gửi HTTP request từ trình duyệt hoặc Node.js..
      //dễ dùng hơn fetch,tự động chuyển đổi json(server sẽ trả về Json),Hỗ trợ xử lý lỗi, timeout, interceptor…
      const res = await api.get(`/tasks?filter=${dateQuery}`); //await tạm dừng fetchTasks cho đến khi nhận phản hồi từ server
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.log("lỗi xảy ra khi truy xuất tasks :", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks."); //1 popup bên phải trình duyệt hiện lên
    }
  }, [dateQuery]);

  useEffect(() => {
    // when date filter changes, reset to first page and fetch
    setPage(1);
    fetchTasks();
  }, [dateQuery, fetchTasks]);

  const fillteredTasks=taskBuffer.filter((task)=>
  {
    switch(filter){
      case 'active':
        return task.status=== 'active';
      case 'completed':
        return task.status==='complete';
      default:
        return true;
    }
  })
  const handleTaskChanged=()=>
  {
    fetchTasks();
  }
  
  //phân trang
  const handleNext=()=>
  {
    if(page < totalPages)
      setPage((pre)=>pre+1);
  };
  const handlePrev=()=>
  {
    if(page > 1)
      setPage((pre)=>pre-1);
  };
  const handlePageChange=(newPage)=>
  {
    setPage(newPage)
  }
  //ceil làm tròn
  const totalPages=Math.max(1, Math.ceil(fillteredTasks.length/visibleTaskLimit));

  useEffect(() => {
    // clamp page to valid range when totalPages changes
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const visibleTasks=fillteredTasks.slice(
    (page-1)*visibleTaskLimit,
    page*visibleTaskLimit
  );
  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
        }}
      />
      {/* Your Content/Components */}
      <div className="container pt-8 m-auto relative z-10">
        <div className="d-block w-full max-w-2xl p-6 xm-auto space-y-6 m-auto">
          {/* Đầu trang */}
          <Header />

          {/* Tạo nhiệm vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged}/>

          {/* Thống kê bộ lọc */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

          {/* Danh sách nhiệm vụ */}
          <TaskList 
          filteredTasks={visibleTasks} 
          filter={filter}
           handleTaskChanged={handleTaskChanged}/>

          {/* Phân trang và lọc theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination 
            handleNext={handleNext}
            handlePrev={handlePrev}
            handlePageChange={handlePageChange}
            page={page}
            totalPages={totalPages}      
            />
            <DateTimerFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          {/* Chân trang */}
          <Footer 
          activeTasksCount={activeTaskCount}
          completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
}
