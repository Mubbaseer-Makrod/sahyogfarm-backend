const { uploadImage } = require('../config/cloudinary');
const sharp = require('sharp');

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
 * Create standardized image error
 * @param {string} message
 * @param {number} statusCode
 * @param {string} code
 * @param {object|null} details
 * @returns {Error}
 */
const createImageError = (message, statusCode = 400, code = 'IMAGE_ERROR', details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  if (details) error.details = details;
  return error;
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
    throw createImageError('Invalid base64 image format', 400, 'INVALID_IMAGE_FORMAT');
  }

  const imageType = matches[1];
  const base64Data = matches[2];

  // Allowed image types
  const allowedTypes = ['jpeg', 'jpg', 'png', 'webp'];
  if (!allowedTypes.includes(imageType.toLowerCase())) {
    throw createImageError(
      `Invalid image type. Allowed: ${allowedTypes.join(', ')}`,
      400,
      'INVALID_IMAGE_TYPE'
    );
  }

  return { imageType: imageType.toLowerCase(), base64Data };
};

/**
 * Calculate base64 size in MB
 * @param {string} base64Data
 * @returns {number}
 */
const getBase64SizeInMB = (base64Data) => {
  const sizeInBytes = (base64Data.length * 3) / 4;
  return sizeInBytes / (1024 * 1024);
};

/**
 * Compress base64 image to meet size constraints
 * @param {string} base64String
 * @param {object} options
 * @returns {Promise<string>}
 */
const compressBase64Image = async (base64String, options) => {
  const { base64Data } = validateBase64Image(base64String);
  const inputBuffer = Buffer.from(base64Data, 'base64');

  const maxDimension = parseInt(options.maxDimension || '1600', 10);
  const quality = parseInt(options.quality || '80', 10);
  const outputFormat = (options.outputFormat || 'webp').toLowerCase();

  const normalizedFormat = outputFormat === 'jpg' ? 'jpeg' : outputFormat;

  let pipeline = sharp(inputBuffer, { failOnError: false }).rotate();
  pipeline = pipeline.resize({
    width: maxDimension,
    height: maxDimension,
    fit: 'inside',
    withoutEnlargement: true
  });

  let outputBuffer;
  if (normalizedFormat === 'png') {
    outputBuffer = await pipeline.png({ quality }).toBuffer();
  } else if (normalizedFormat === 'jpeg') {
    outputBuffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  } else {
    outputBuffer = await pipeline.webp({ quality }).toBuffer();
  }

  const compressedBase64 = outputBuffer.toString('base64');
  const compressedSizeMB = getBase64SizeInMB(compressedBase64);

  if (compressedSizeMB > options.maxSizeMB) {
    throw createImageError(
      `Image size (${compressedSizeMB.toFixed(2)}MB) exceeds maximum allowed (${options.maxSizeMB}MB) after compression`,
      413,
      'IMAGE_TOO_LARGE'
    );
  }

  return `data:image/${normalizedFormat};base64,${compressedBase64}`;
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
  const maxSizeMB = parseInt(process.env.MAX_IMAGE_SIZE_MB || '5', 10);
  const maxDimension = parseInt(process.env.MAX_IMAGE_DIMENSION || '1600', 10);
  const outputFormat = process.env.IMAGE_OUTPUT_FORMAT || 'webp';
  const quality = parseInt(process.env.IMAGE_QUALITY || '80', 10);

  for (const image of images) {
    if (isBase64Image(image)) {
      // Validate and compress if needed
      const { base64Data } = validateBase64Image(image);
      const sizeInMB = getBase64SizeInMB(base64Data);

      const normalizedImage = sizeInMB > maxSizeMB
        ? await compressBase64Image(image, {
          maxSizeMB,
          maxDimension,
          outputFormat,
          quality
        })
        : image;

      const url = await uploadImage(normalizedImage);
      processedImages.push(url);
    } else if (typeof image === 'string' && image.startsWith('http')) {
      // Keep existing URL
      processedImages.push(image);
    } else {
      throw createImageError('Invalid image format. Must be base64 or valid URL', 400, 'INVALID_IMAGE');
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
