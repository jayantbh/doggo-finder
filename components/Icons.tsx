import React, { FC, SVGProps } from "react";

type Props = {
  size?: number;
  color?: string;
} & SVGProps<SVGSVGElement>;

const Icon: FC<Props & { svgPath: string }> = ({
  size = 64,
  color = "grey",
  svgPath,
  ...props
}) => (
  <svg
    height={props.height || size}
    width={props.width || size}
    color={color}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d={svgPath}
    ></path>
  </svg>
);

export const Cross: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  );
};

export const Left: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
    />
  );
};

export const Right: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  );
};

export const Upload: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  );
};

export const Download: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
    />
  );
};

export const Fetch: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  );
};

export const CrossFlat: FC<Props> = ({ ...props }) => {
  return <Icon {...props} svgPath="M6 18L18 6M6 6l12 12" />;
};

export const Check: FC<Props> = ({ ...props }) => {
  return (
    <Icon {...props} svgPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  );
};

export const Exclaim: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  );
};

export const Info: FC<Props> = ({ ...props }) => {
  return (
    <Icon
      {...props}
      svgPath="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  );
};

export const DoubleDown: FC<Props> = ({ ...props }) => {
  return <Icon {...props} svgPath="M19 13l-7 7-7-7m14-8l-7 7-7-7" />;
};

export const DoubleUp: FC<Props> = ({ ...props }) => {
  return <Icon {...props} svgPath="M5 11l7-7 7 7M5 19l7-7 7 7" />;
};
