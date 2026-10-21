declare module "motion/react" {
  import type { ComponentType } from "react";

  export const motion: Record<string, ComponentType<any>>;
  export const AnimatePresence: ComponentType<any>;
  export type Variants = Record<string, any>;
}

declare module "motion" {
  export const useScroll: (...args: any[]) => any;
  export const useTransform: (...args: any[]) => any;
}
