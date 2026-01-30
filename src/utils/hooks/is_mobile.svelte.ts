import { MediaQuery } from "svelte/reactivity";

const DEFAULT_MOBILE_WIDTH = 768;

class LEIsMobile extends MediaQuery {
  constructor(breakpoint: number = DEFAULT_MOBILE_WIDTH) {
    super(`(max-width: ${breakpoint - 1}px)`);
  }
}

export const isMobile = new LEIsMobile();
