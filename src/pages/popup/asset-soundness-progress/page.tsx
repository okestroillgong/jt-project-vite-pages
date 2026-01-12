

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";

// --- Mock Data ---
const basicDataItems = [
  "월말대출잔액명세서",
  "여신월결산명세서",
  "가지급금",
  "자산건전성분류명세서",
  "대출내역",
  "금감원여신관련보고서",
  "OLAP보고서",
  "CB-NICE정보",
];

const branches = [
  "본부채권", "기업금융부", "소비자금융부", "선릉지점", "대전지점", "목동지점", 
  "잠실지점", "이수역지점", "홍대역지점", "상계동지점", "광주지점"
];

const adjustmentItems = ["개인회생", "신용회복", "파산면책", "법무원장"];

export default function AssetSoundnessProgressPopup() {
  const [selectedMonth, setSelectedMonth] = useState("202510");

  const popupActions: PopupAction[] = [
    { id: "close", text: "닫기", onClick: () => window.close() },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-xs">
      {/* Standard Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold">건전성자료생성 진행상태</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {/* Filter Area */}
        <div className="flex items-center gap-2 bg-white p-2 border rounded-sm shadow-sm">
          <span className="font-bold">결산월:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="YYYYMM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="202510">202510</SelectItem>
              <SelectItem value="202509">202509</SelectItem>
              <SelectItem value="202508">202508</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Process Grid */}
        <div className="flex flex-col bg-white border rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="border-collapse w-full">
              <TableHeader>
                <TableRow className="bg-[#FFD700] hover:bg-[#FFD700]">
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1" colSpan={2}>기초자료생성</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1">1차발생</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1">지점배분</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1" colSpan={2}>지점별확인</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1">감리의뢰</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1" colSpan={2}>감리확인</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1">최종발생</TableHead>
                  <TableHead className="text-center border-b h-8 text-black font-bold p-1">할증차금</TableHead>
                </TableRow>
                <TableRow className="bg-[#FFD700] hover:bg-[#FFD700]">
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1 w-[200px]">항목</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">지점</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">감리자</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-b h-8 text-black font-bold p-1">시각</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row 1 */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="border-r p-1">{basicDataItems[0]}</TableCell>
                  <TableCell className="border-r p-1 text-center">10:00:00</TableCell>
                  <TableCell className="border-r p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>10:05:00</TableCell>
                  <TableCell className="border-r p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>10:10:00</TableCell>
                  
                  {/* Branch Check Section (First Row) */}
                  <TableCell className="border-r p-1 text-center">{branches[0]}</TableCell>
                  <TableCell className="border-r p-1 text-center">10:15:00</TableCell>
                  
                  {/* Audit Request (Rowspan) */}
                  <TableCell className="border-r p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>11:00:00</TableCell>
                  
                  {/* Audit Confirmation (Rowspan) */}
                  <TableCell className="border-r p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>홍길동</TableCell>
                  <TableCell className="border-r p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>11:30:00</TableCell>
                  
                  {/* Final Generation (Rowspan) */}
                  <TableCell className="border-r p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>12:00:00</TableCell>
                  
                  {/* Surcharge (Rowspan) */}
                  <TableCell className="p-1 text-center align-middle" rowSpan={Math.max(basicDataItems.length, branches.length)}>12:30:00</TableCell>
                </TableRow>

                {/* Remaining Rows (Max of basicData or branches) */}
                {Array.from({ length: Math.max(basicDataItems.length, branches.length) - 1 }).map((_, i) => {
                  const index = i + 1;
                  const item = basicDataItems[index] || "";
                  const branchName = branches[index] || ""; 
                  return (
                    <TableRow key={index} className="hover:bg-transparent">
                      <TableCell className="border-r p-1">{item}</TableCell>
                      <TableCell className="border-r p-1 text-center">{item ? `10:00:0${index}` : ""}</TableCell>
                      
                      {/* Branch Check Section */}
                      <TableCell className={cn("border-r p-1 text-center", !branchName && "bg-[#E8E8E8]")}>
                        {branchName}
                      </TableCell>
                      <TableCell className={cn("border-r p-1 text-center", !branchName && "bg-[#E8E8E8]")}>
                        {branchName ? "10:15:xx" : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bond Adjustment Confirmation Grid */}
        <div className="flex flex-col bg-white border rounded-sm shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <Table className="border-collapse w-full">
              <TableHeader>
                <TableRow className="bg-[#FFD700] hover:bg-[#FFD700]">
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1" colSpan={2}>채권조정 확정</TableHead>
                  <TableHead className="text-center border-r border-b h-8 text-black font-bold p-1">계산</TableHead>
                  <TableHead className="text-center border-b h-8 text-black font-bold p-1">영업구역 확정</TableHead>
                </TableRow>
                <TableRow className="bg-[#FFD700] hover:bg-[#FFD700]">
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1 w-[200px]">항목</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-r h-8 text-black font-bold p-1">시각</TableHead>
                  <TableHead className="text-center border-b h-8 text-black font-bold p-1">시각</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustmentItems.map((item, i) => (
                  <TableRow key={item} className="hover:bg-blue-50">
                    <TableCell className="border-r p-1 font-medium">{item}</TableCell>
                    <TableCell className="border-r p-1 text-center">14:00:0{i}</TableCell>
                    
                    {/* Merged Cells for Calculation and Region Confirmation */}
                    {i === 0 && (
                        <>
                            <TableCell className="border-r p-1 text-center align-middle" rowSpan={adjustmentItems.length}>
                                14:10:00
                            </TableCell>
                            <TableCell className="p-1 text-center align-middle" rowSpan={adjustmentItems.length}>
                                14:20:00
                            </TableCell>
                        </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}