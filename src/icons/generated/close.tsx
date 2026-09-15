import type { SVGProps } from "react";
const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 18"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="m2.697 1.636 13.667 13.667-1.06 1.061L1.635 2.697z"
    />
    <path
      fill="currentColor"
      d="M16.364 2.697 2.697 16.364l-1.061-1.06L15.303 1.635z"
    />
  </svg>
);
export { CloseIcon };
