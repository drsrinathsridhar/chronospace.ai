import type { SVGProps } from "react";
const TimelineTickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 5.5 5.5"
    width="1em"
    height="1em"
    {...props}
  >
    <path fill="currentColor" d="M1 0v4.5h4.5v1H0V0z" />
  </svg>
);
export { TimelineTickIcon };
