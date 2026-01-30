class LEData {
  async compressImage(file: string, maxResolution: number, quality: number = 0.85, iconize: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        if (iconize) {
          canvas.width = maxResolution;
          canvas.height = maxResolution;

          const scale = Math.max(maxResolution / img.width, maxResolution / img.height);

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          const dx = (maxResolution - scaledWidth) / 2;
          const dy = 0;

          ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
        } else {
          const aspectRatio = img.width / img.height;
          let newWidth = img.width;
          let newHeight = img.height;

          if (img.width > img.height) {
            if (img.width > maxResolution) {
              newWidth = maxResolution;
              newHeight = maxResolution / aspectRatio;
            }
          } else {
            if (img.height > maxResolution) {
              newHeight = maxResolution;
              newWidth = maxResolution * aspectRatio;
            }
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = file;
    });
  }
}

export const data = new LEData();
