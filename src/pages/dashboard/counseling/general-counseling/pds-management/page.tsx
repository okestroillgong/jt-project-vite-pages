

import { useMemo, useState } from "react";
import { usePathname } from "@/lib/hooks/useAppLocation";
import { RightActions } from "@/components/app/RightActions";
import { DataTable } from "@/components/app/DataTable";
import { usePageStore } from "@/lib/store/pageStore";
import { 
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TitleIcon from "@/assets/icons/webp/title-icon.webp";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 테이블 타입 정의
type Representative = { id: number; name: string };
type Branch = { id: number; name: string };
type CallList = { id: number; listName: string; serviceName: string; status: "활성" | "비활성" };

// 컬럼 정의
const representativeColumns: ColumnDef<Representative>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "name", header: "대표" },
];

const branchColumns: ColumnDef<Branch>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "name", header: "지점" },
];

const callListColumns: ColumnDef<CallList>[] = [
  { accessorKey: "id", header: "순번" },
  { accessorKey: "listName", header: "생성리스트" },
  { accessorKey: "serviceName", header: "아웃바운드 서비스명" },
  { accessorKey: "status", header: "상태" },
];


// 간단한 테이블을 위한 재사용 컴포넌트
function SimpleSortableTable<TData, TValue>({ title, columns, data }: { title: string; columns: ColumnDef<TData, TValue>[]; data: TData[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
  
    const table = useReactTable({
      data,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
  
    return (
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="rounded-lg border overflow-auto" style={{ height: `${2.5 * (data.length + 1) + 0.1}rem`}}>
            <Table>
                <TableHeader className="sticky top-0 bg-[#f1f1f1] z-10">
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <TableHead key={header.id} className={cn("h-12 px-4", header.index < headerGroup.headers.length - 1 ? "border-r border-gray-300" : "")}>
                        {header.isPlaceholder ? null : (
                            <div
                                className="flex items-center cursor-pointer select-none"
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                    asc: <ArrowUp className="ml-2 h-3 w-3" />,
                                    desc: <ArrowDown className="ml-2 h-3 w-3" />,
                                }[header.column.getIsSorted() as string] ?? 
                                (header.column.getCanSort() ? <ArrowUpDown className="ml-2 h-3 w-3" /> : null)}
                            </div>
                        )}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} className="h-10">
                        {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className={cn("px-4", cell.column.id !== row.getVisibleCells()[row.getVisibleCells().length - 1].column.id ? "border-r border-gray-300" : "")}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        결과가 없습니다.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
      </div>
    );
  }

export default function PdsManagementPage() {
  const tabId = usePathname();
  const { currentState, updateTableData } = usePageStore();

  // 임시 데이터
  const representativeData: Representative[] = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `대표 ${i + 1}` })), []);
  
  const branchData: Branch[] = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `지점 ${i + 1}` })), []);

  const handleSearch = () => {
    const dummyCallList: CallList[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      listName: `리스트 ${String.fromCharCode(65 + i)}`,
      serviceName: `서비스명 ${i + 1}`,
      status: i % 2 === 0 ? "활성" : "비활성",
    }));
    updateTableData(tabId, 'pdsCallListTable', dummyCallList);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img src={TitleIcon} alt="타이틀 아이콘" width={40} height={40} />
            <h1 className="text-lg font-semibold">PDS관리</h1>
        </div>
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink>상담관리</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink>일반상담</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>PDS관리</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-end">
        <RightActions
          actions={[
            { id: "execute" },
            { id: "stop" },
            { id: "terminate" },
            { id: "search", onClick: handleSearch },
            { id: "delete" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SimpleSortableTable title="대표" columns={representativeColumns} data={representativeData} />
        <SimpleSortableTable title="지점" columns={branchColumns} data={branchData} />
      </div>

      <DataTable
        title="콜리스트"
        columns={callListColumns}
        data={currentState?.tables?.['pdsCallListTable'] || []}
      />
    </div>
  );
}
