import type { SVGProps } from "react";
const CtaArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 8 10"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M1.338 10H0V8.528h1.137l4.34-3.535-4.34-3.521H0V0h1.338l1.726 1.4L6.683 4.27H8v1.443H6.683z"
    />
  </svg>
);
export { CtaArrowIcon };
