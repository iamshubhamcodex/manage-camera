import type { PropsWithChildren } from "react";

export type IconType = {
  size?: number;
  height?: number;
  width?: number;

  fill?: string;
  color?: string;
  strokeWidth?: number;
  view?: number;
} & React.SVGProps<SVGSVGElement>;

// Component for Wrapping SVG icons
const SvgWrapper = (props: IconType & PropsWithChildren) => {
  const { size, height, width, fill, view, children, ...propsToPass } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? width}
      height={size ?? height}
      viewBox={`0 0 ${view ?? "20"} ${view ?? "20"}`}
      fill={fill ?? "currentcolor"}
      {...propsToPass}
      {...(props?.onClick
        ? { style: { cursor: "pointer", ...(propsToPass?.style ?? {}) } }
        : {})}
    >
      {children}
    </svg>
  );
};
export default SvgWrapper;
