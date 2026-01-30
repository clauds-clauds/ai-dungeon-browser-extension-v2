import { toast } from "svelte-sonner";

/**
 * `LEDebug` handles logging for the extension.
 */
class LEDebug {
  /**
   * Prints a message to the console
   * @param args The stuff to print to the console
   */
  log(verbose = false, ...args: any[]) {
    console.log("[Dungeon Extension v3]", ...args);
    toast.info("Info", { description: args.join(" ") });
  }

  /**
   * Prints a warning to the console
   * @param args The stuff to print to the console
   */
  warn(verbose = false, ...args: any[]) {
    console.warn("[Dungeon Extension v3]", ...args);
    toast.warning("Warning", { description: args.join(" ") });
  }

  /**
   * Prints an error to the console
   * @param args The stuff to print to the console
   */
  error(verbose = false, ...args: any[]) {
    console.error("[Dungeon Extension v3]", ...args);
    toast.error("Error", { description: args.join(" ") });
  }

  /**
   * Prints a success message to the console
   * @param args The stuff to print to the console.
   */
  success(verbose = false, ...args: any[]) {
    console.log("[Dungeon Extension v3]", ...args);
    toast.success("Success", { description: args.join(" ") });
  }

  welcome() {
    setTimeout(() => {
      toast.message("Hey, hey!", { description: "Thanks for installing the extension!" });
    }, 2000);

    setTimeout(() => {
      toast.message("", { description: "I hope you enjoy using it!" });
    }, 4000);

    setTimeout(() => {
      toast.message("", { description: "If you have any questions, feel free to reach out!" });
    }, 6000);

    setTimeout(() => {
      toast.message("", { description: "💙 - Claudia" });
    }, 8000);
  }
}

export const debug = new LEDebug();
