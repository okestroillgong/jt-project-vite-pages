// "@/assets/icons/js/지니시스템로고2.tsx"

import * as React from "react";
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;              // 로고 색상
  size?: number | string;      // 로고 사이즈 (px 또는 CSS 크기)
};

const JsLogo = ({ color = "#58bf83", size = 28, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
    aria-label="Jani system logo"
    {...props}
  >
    <path
      d="M395.35 624.04C342.2 468.4 269.14 381.75 452.29 377.29c87.31-2.13 75.92-75.92 49.35-113.89-26.57-37.96-98.7-30.37-125.27 0-22.78 11.39-110.12 6.18-144.25 7.59-92.05 3.8-155.64 94.9-49.35 178.42s212.59 174.62 212.59 174.62Z"
      fill={color}
    />
    <circle cx={304.24} cy={100.17} r={72.13} fill={color} />
  </svg>
);

export default JsLogo;