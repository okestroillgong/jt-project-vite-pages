

import React from "react";
import { Input } from "@/components/ui/input";
import { formatNumberWithCommas, parseFormattedNumber } from "@/lib/utils";

interface SimplifiedTableProps {
  // Add props if this needs to be controlled from outside
}

export function SimplifiedTable({ }: SimplifiedTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto w-full">
      <table className="w-full text-sm min-w-[1200px]">
        <thead className="bg-gray-100 text-gray-700">
          <tr className="border-b">
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap w-[150px]" rowSpan={2}>대출명</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap w-[150px]" rowSpan={2}>계좌번호</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap w-[100px]">조정</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap">원금</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap">비용</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap">이자</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap">연체이자</th>
            <th className="h-10 px-4 text-center font-medium border-r whitespace-nowrap">합계</th>
            <th className="h-10 px-4 text-center font-medium whitespace-nowrap">이율</th>
          </tr>
          <tr className="border-b">
            {/* Sub-header row */}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            {/* Loan Name & Account No: RowSpan 2 */}
            <td className="p-2 border-r align-middle text-center bg-white" rowSpan={2}>
              <Input className="h-8 w-full px-2 text-center" readOnly value="일반자금대출" />
            </td>
            <td className="p-2 border-r align-middle text-center bg-white" rowSpan={2}>
              <Input className="h-8 w-full px-2 text-center" readOnly value="123-456-7890" />
            </td>
            
            {/* Before Row */}
            <td className="p-2 border-r text-center bg-gray-50 font-medium whitespace-nowrap">전</td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2"><NumberInput /></td>
          </tr>
          <tr className="border-b">
            {/* After Row */}
            <td className="p-2 border-r text-center bg-gray-50 font-medium whitespace-nowrap">후</td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2 border-r"><NumberInput /></td>
            <td className="p-2"><NumberInput /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function NumberInput({ value, onChange }: { value?: number, onChange?: (val: number) => void }) {
  const [internalVal, setInternalVal] = React.useState("");

  return (
    <Input 
      className="h-8 w-full text-right px-2" 
      value={internalVal}
      onChange={(e) => {
        const val = e.target.value;
        const num = parseFormattedNumber(val);
        if (/^\d*$/.test(num)) {
            setInternalVal(formatNumberWithCommas(num));
        }
      }}
    />
  );
}