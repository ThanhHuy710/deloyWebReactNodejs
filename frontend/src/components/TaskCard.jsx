import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useState } from "react";

export default function TaskCard({ task, index,handleTaskChanged }) {
  const [isEditting,setIsEditting]=useState(false);
  const [updateTaskTitle,setUpdateTaskTitle]=useState(task.title || '');
  const [isUpdating,setIsUpdating]=useState(false);

  const toggleTaskCompleteButton=async ()=>
  {
    try {
      if(task.status==='active')
      {
        await api.put(`/tasks/${task._id}`,
          {
            status:"complete",
            completedAt: new Date().toISOString(),
          }
        );
        toast.success(`${task.title} đã hoàn thành` );
      } else
      {
        await api.put(`/tasks/${task._id}`,
          {
            status:"active",
            // clear completedAt when reverting to active
            completedAt: null,
          }
        );
        toast.success(`${task.title} đã đổi thành chưa hoàn thành` );
      }
      handleTaskChanged();
    } catch (error) {
        console.error("Lỗi xảy ra khi update task.",error);
        toast.error("Lỗi xảy ra khi update nhiệm vụ");
    }
  }
  const updateTask= async ()=>
  {
    try {
      if (isUpdating) return; // prevent double submit
      if ((updateTaskTitle || '').trim() === '') {
        toast.error("Tiêu đề không được để trống");
        return;
      }
      if (updateTaskTitle === task.title) {
        // nothing changed
        setIsEditting(false);
        return;
      }
      setIsUpdating(true);
      await api.put(`/tasks/${task._id}`,{
        title: updateTaskTitle
      });
      toast.success(`Cập nhật nhiệm vụ ${updateTaskTitle} thành công` );
      // mark not editing after successful update
      setIsEditting(false);
      handleTaskChanged();
    } catch (error) {
        console.error("Lỗi xảy ra khi update task.",error);
        toast.error("Lỗi xảy ra khi update nhiệm vụ");
    } finally {
      setIsUpdating(false);
    }
  }
  const deleteTask= async(taskId)=>{
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã xóa");
      handleTaskChanged();
    } catch (error) {
        console.error("Lỗi xảy ra khi xóa task.",error);
        toast.error("Lỗi xảy ra khi xóa nhiệm vụ");
    }
  }
  const handleKeyPress=(event)=>
  {
    if(event.key ==='Enter')
      updateTask();
  }
  return (
    <>
      <Card
        className={cn(
          "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transiton-all duration-200 animate-fade-in group",
          task.status === "complete" && "opacity-75"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center gap-4">
          {/* nút tròn */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0 size-8 rounded-full transition-all duration-200",
              task.status == "complete"
                ? "text-success hover:text-success/80"
                : "text-muted-foreground hover:text-primary"
            )}
            onClick={toggleTaskCompleteButton}
          >
            {task.status == "complete" ? (
              <CheckCircle2 className="size-5" />
            ) : (
              <Circle className="size-5" />
            )}
          </Button>

          {/* hiển thị hoặc chỉnh sửa tiêu đề */}
          <div className="flex-1 min-w-0">
            {isEditting ? (
              <Input
                placeholder="Cần phải làm gì?"
                className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
                type="text"
                value={updateTaskTitle}
                onChange={(e)=>setUpdateTaskTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  // if currently updating, ignore blur
                  if (isUpdating) return;
                  // if changed, save on blur; otherwise just close edit mode
                  if ((updateTaskTitle || '').trim() !== (task.title || '').trim()) {
                    updateTask();
                  } else {
                    setIsEditting(false);
                  }
                }}
              />
            ) : (
              <p
                className={cn(
                  "text-base transition-all duration-200",
                  task.status === "complete"
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {task.title}
              </p>
            )}
             {/* ngày tạo & ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>

            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
          </div>
         
          {/* nút chỉnh và xóa */}
          <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
            {/* nút edit */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
              onClick={()=>
              {
                setIsEditting(true);
                setUpdateTaskTitle(task.title || '');
              }
              }
            >
              <SquarePen className="size-4" />
            </Button>

            {/* nút xoá */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
              onClick={()=>deleteTask(task._id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
