<script lang="ts">
  type Props = {
    files: string[];
    type?: "text" | "image" | "audio" | "video" | "all";
  };

  let { files = $bindable([]), type = "image" }: Props = $props();

  // Whether the drop is currently being dragged over.
  let dragging = $state(false);

  // The valid MIME types for each file type.
  const types = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/aac"],
    video: ["video/mp4", "video/webm", "video/ogg"],
    text: ["text/plain"],
    all: [],
  };

  /**
   * Check if a file is of a valid type.
   * @param file The file to check.
   */
  const isValidFileType = (file: File): boolean => {
    if (type === "all") return true;
    return types[type].includes(file.type);
  };

  /**
   * Convert a File to a base64 string.
   * @param file The file to convert.
   */
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  /**
   * Processes dropped or selected files.
   * @param input The files to process.
   */
  const process = async (input: FileList | null) => {
    if (!input) return; // No files to process.
    // Otherwise filter and process files.
    const validFiles = Array.from(input).filter(isValidFileType);

    // Alert if no valid files were found.
    if (validFiles.length === 0) {
      debug.error(false, "Whatever you just dropped in is strange! Try something else?");
      return;
    }

    // Convert files to base64 and add.
    const newFiles = await Promise.all(validFiles.map(toBase64));
    files = [...files, ...newFiles];
  };

  /**
   * The accept attribute for the file input.
   */
  const acceptAttribute = $derived(type === "all" ? undefined : types[type].join(","));

  /**
   * Calculates the total size of the uploaded files in megabytes.
   */
  const totalSizeMB = $derived.by(() => {
    const totalBytes = files.reduce((sum, file) => {
      const base64Length = file.length - (file.indexOf(",") + 1);
      const sizeInBytes = (base64Length * 3) / 4;
      return sum + sizeInBytes;
    }, 0);
    return (totalBytes / (1024 * 1024)).toFixed(2);
  });
</script>

<label
  class={[
    "flex flex-col shrink-0 items-center justify-center w-full h-48 border-2px p-2 bg-surface rounded-lg cursor-pointer attention transition",
    dragging ? "border-pretty-brand" : "border-surface-out",
  ].join(" ")}
  ondragover={(e: DragEvent) => {
    e.preventDefault();
    dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={async (e: DragEvent) => {
    e.preventDefault();
    dragging = false;
    await process(e.dataTransfer?.files ?? null);
  }}
>
  <div class="flex flex-col items-center justify-center pt-5 pb-6 text-mono-subtle">
    <span class="font-symbol text-5xl mb-2">
      {#if type === "image"}
        add_photo_alternate
      {:else if type === "audio"}
        cadence
      {:else if type === "text"}
        article
      {:else}
        upload
      {/if}
    </span>

    <p class="text-sm text-center">Drag 'n' drop {type} files here, or click to select files</p>
    <!-- Debug the file size below in megabytes-->
    <p class="text-xs">{files.length} {files.length !== 1 ? "files" : "file"}, {totalSizeMB} MB</p>
  </div>
  <input
    type="file"
    class="hidden"
    multiple
    accept={acceptAttribute}
    onchange={async (e: Event) => {
      const target = e.target as HTMLInputElement;
      await process(target.files);
      target.value = "";
    }}
  />
</label>
