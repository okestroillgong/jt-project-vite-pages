import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 숫자에 천 단위 콤마를 추가하는 함수
export function formatNumberWithCommas(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return String(value); // 숫자로 변환할 수 없는 경우 원래 문자열 반환
  return num.toLocaleString('en-US');
}

// 콤마가 있는 숫자 문자열에서 콤마를 제거하는 함수
export function parseFormattedNumber(value: string): string {
  return value.replace(/,/g, '');
}
