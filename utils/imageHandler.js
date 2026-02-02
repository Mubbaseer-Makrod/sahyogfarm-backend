const { uploadImage } = require('../config/cloudinary');

/**
 * Image Handler Utilities
 * Handles base64 image processing and cloud upload
 */

/**
 * Check if string is base64 encoded image
 * @param {string} str - String to check
 * @returns {boolean}
 */
const isBase64Image = (str) => {
  if (typeof str !== 'string') return false;
  return str.startsWith('data:image/');
};

/**
 * Validate base64 image
 * @param {string} base64String - Base64 encoded image
 * @throws {Error} - If validation fails
 */
const validateBase64Image = (base64String) => {
  // Check format
  const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image format');
  }

  const imageType = matches[1];
  const base64Data = matches[2];

  // Allowed image types
  const allowedTypes = ['jpeg', 'jpg', 'png', 'webp'];
  if (!allowedTypes.includes(imageType.toLowerCase())) {
    throw new Error(`Invalid image type. Allowed: ${allowedTypes.join(', ')}`);
  }

  // Check size (base64 is ~33% larger than actual file)
  const sizeInBytes = (base64Data.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  const maxSizeMB = parseInt(process.env.MAX_IMAGE_SIZE_MB || '5');

  if (sizeInMB > maxSizeMB) {
    throw new Error(`Image size (${sizeInMB.toFixed(2)}MB) exceeds maximum allowed (${maxSizeMB}MB)`);
  }

  return true;
};

/**
 * Process image array - upload base64 images, keep existing URLs
 * @param {array} images - Array of image URLs or base64 strings
 * @returns {Promise<array>} - Array of hosted URLs
 */
const processImages = async (images) => {
  if (!Array.isArray(images)) {
    throw new Error('Images must be an array');
  }

  const maxImages = parseInt(process.env.MAX_IMAGES_PER_PRODUCT || '10');
  if (images.length > maxImages) {
    throw new Error(`Maximum ${maxImages} images allowed per product`);
  }

  const processedImages = [];

  for (const image of images) {
    if (isBase64Image(image)) {
      // Validate and upload base64 image
      validateBase64Image(image);
      const url = await uploadImage(image);
      processedImages.push(url);
    } else if (typeof image === 'string' && image.startsWith('http')) {
      // Keep existing URL
      processedImages.push(image);
    } else {
      throw new Error('Invalid image format. Must be base64 or valid URL');
    }
  }

  return processedImages;
};

/**
 * Extract new images (base64) and existing images (URLs)
 * @param {array} images - Mixed array of base64 and URLs
 * @returns {object} - { newImages: [], existingImages: [] }
 */
const separateImages = (images) => {
  const newImages = [];
  const existingImages = [];

  images.forEach(image => {
    if (isBase64Image(image)) {
      newImages.push(image);
    } else if (typeof image === 'string' && image.startsWith('http')) {
      existingImages.push(image);
    }
  });

  return { newImages, existingImages };
};

module.exports = {
  isBase64Image,
  validateBase64Image,
  processImages,
  separateImages
};
