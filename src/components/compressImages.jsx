import heic2any from "heic2any";

const compressImage = (
  file,
  maxSizeKB = 300,
  quality = 0.7,
  maxIteration = 8
) => {
  return new Promise(async (resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      // Try to detect HEIC by extension or type
      const isHeic =
        file.name.match(/\.(heic|heif)$/i) ||
        file.type === "image/heic" ||
        file.type === "image/heif";

      if (!isHeic) return resolve(file);

      // Handle HEIC/HEIF files
      let blob;
      try {
        blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
      } catch (err) {
        console.warn("HEIC conversion failed:", err);
        return reject(
          new Error("Unsupported image format (HEIC decode failed)")
        );
      }

      // Replace original file with converted JPEG Blob
      const fileName = file.name.replace(/\.\w+$/i, ".jpg");
      file = new File([blob], fileName, { type: "image/jpeg" });
    } else {
      // Regular image type (JPEG, PNG, etc.)
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.match(/\.(heic|heif)$/i);

      if (isHeic) {
        // Convert HEIC even if MIME suggests it's an image
        try {
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const resultBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });
          const fileName = file.name.replace(/\.\w+$/i, ".jpg");
          file = new File([resultBlob], fileName, { type: "image/jpeg" });
        } catch (err) {
          console.warn("HEIC to JPEG conversion failed:", err);
          return reject(new Error("HEIC conversion failed"));
        }
      }
    }

    // Now process the (converted) image as JPEG
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => {
      const image = new Image();
      image.onerror = () => reject(new Error("Failed to load image"));
      image.onload = () => {
        let { width, height } = image;

        // Limit max resolution
        const MAX_DIMENSION = 2000;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width *= ratio;
          height *= ratio;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        // White background for transparency (PNG → JPG)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, width, height);

        const compress = (currentQuality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error("Canvas is empty"));
              }

              const fileSizeKB = blob.size / 1024;

              if (fileSizeKB <= maxSizeKB || currentQuality <= 0.2) {
                const fileName = file.name.replace(/\.\w+$/, ".jpg");
                resolve(new File([blob], fileName, { type: "image/jpeg" }));
              } else {
                const nextQuality = currentQuality * 0.9;
                if (maxIteration <= 1) {
                  const fileName = file.name.replace(/\.\w+$/, ".jpg");
                  resolve(new File([blob], fileName, { type: "image/jpeg" }));
                } else {
                  compress(nextQuality);
                }
              }
            },
            "image/jpeg",
            currentQuality
          );
        };

        compress(quality);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Compresses multiple images
 * @param {FileList | File[]} files
 * @param {number} maxSizeKB - Max file size in KB
 * @param {number} quality - Quality of image (0.1 to 1)
 * @returns {Promise<File[]>}
 */
const compressImages = async (files, maxSizeKB = 300, quality = 0.7) => {
  const compressedImages = [];
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    try {
      const compressedFile = await compressImage(file, maxSizeKB, quality);
      compressedImages.push(compressedFile);
    } catch (err) {
      console.warn(`Failed to compress ${file.name}:`, err);
      // Fallback: use original if possible, or skip
      const fallbackName = file.name.replace(/\.\w+$/, ".jpg");
      const fallbackFile = new File([file], fallbackName, {
        type: "image/jpeg",
      });
      compressedImages.push(fallbackFile);
    }
  }

  return compressedImages;
};

export default compressImages;
