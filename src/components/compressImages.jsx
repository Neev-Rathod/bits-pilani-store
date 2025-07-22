import React from "react";

const compressImage = (file, maxSizeKB = 300, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to match image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image on canvas
        ctx.drawImage(image, 0, 0);

        // Compress and convert to Blob
        canvas.toBlob(
          (blob) => {
            if (blob.size / 1024 <= maxSizeKB) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              // If still too large, recursively compress more
              compressImage(file, maxSizeKB * 0.8, quality * 0.8).then(resolve);
            }
          },
          "image/jpeg",
          quality
        );
      };
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
  for (let i = 0; i < files.length; i++) {
    const compressedImage = await compressImage(files[i], maxSizeKB, quality);
    compressedImages.push(compressedImage);
  }
  return compressedImages;
};

export default compressImages;
