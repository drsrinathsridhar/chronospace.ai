import type { SVGProps } from "react";
const HeroTrailFiltersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1 1"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <filter
        id="hero-smear"
        width={2.4}
        height={1.2}
        x={-0.1}
        y={-0.1}
        colorInterpolationFilters="sRGB"
        primitiveUnits="objectBoundingBox"
      >
        <feGaussianBlur stdDeviation="0.012 0" />
      </filter>
      <filter
        id="hero-flood-accent"
        width={2.4}
        height={1.2}
        x={-0.1}
        y={-0.1}
        colorInterpolationFilters="sRGB"
        primitiveUnits="objectBoundingBox"
      >
        <feFlood floodColor="#f25324" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
      <filter
        id="hero-flood-ink"
        width={2.4}
        height={1.2}
        x={-0.1}
        y={-0.1}
        colorInterpolationFilters="sRGB"
        primitiveUnits="objectBoundingBox"
      >
        <feFlood floodColor="#fff" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
    </defs>
  </svg>
);
export { HeroTrailFiltersIcon };
