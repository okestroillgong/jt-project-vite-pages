import { LeftActions } from "@/components/app/LeftActions";
import { RightActions } from "@/components/app/RightActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardDefaultPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">메인 대시보드</h1>
      <p className="mt-2 text-muted-foreground">
        좌측 메뉴를 선택하여 작업을 시작하세요.
      </p>
      <div className="mt-8">
        <LeftActions actions={[]} />
      </div>
    </div>
  );
}