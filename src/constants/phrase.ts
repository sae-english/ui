/** Responsive drawer width (% of viewport). Percentage increases on smaller screens. */
export const PHRASE_DRAWER_SIZE = {
  desktop: "50%",
  tablet: "70%",
  mobile: "90%",
} as const;

/** Viewport width breakpoints (px) for drawer size: up to mobile — 90%, up to tablet — 70%, else 50%. */
export const PHRASE_DRAWER_BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
} as const;

/** Drawer open direction */
export const PHRASE_DRAWER_DIRECTION = "rtl";
