import { FilterType } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

import { Filter } from "lucide-react";
import { Button } from "./ui/button";

export default function StatsAndFilters({ 
  completedTasksCount = 0,
  activeTasksCount = 0,
  filter = "all",
  setFilter
}) {
  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* phần thống kê */}
        <div className="flex gap-3">
        <Badge
          variant="secondary"
          className="bg-white/50 text-accent-foreground border border-info/20"
        >
          {activeTasksCount} {FilterType.active}
        </Badge>
          <Badge
            variant="secondary"
            className="bg-white/50 text-accent-foreground border-info/20"
          >
            {completedTasksCount} {FilterType.completed}
          </Badge>
        </div>
        {/* phần filter */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* lấy toàn bộ danh sách và duyệt qua từng ptu  */}
          {Object.keys(FilterType).map((type) => (
            <Button
              key={type}//react nhận diện ptu duy nhất
              variant={filter === type ? "gradient" : "ghost"}
              size="sm"
              className="capitalize flex items-center gap-1"
              onClick={()=>setFilter(type)}
            >
              <Filter className="size-4" />
              {FilterType[type]}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
