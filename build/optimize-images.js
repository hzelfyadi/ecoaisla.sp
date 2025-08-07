/**
 * Image Optimization Script
 * 
 * This script optimizes images in the project by:
 * 1. Converting images to WebP format
 * 2. Generating responsive image sets
 * 3. Creating optimized versions for different screen sizes
 * 
 * Requirements:
 * - Node.js
 * - sharp (npm install sharp --save-dev)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

// Configuration
const config = {
  // Source directories containing images to optimize
  srcDirs: [
    'images',
    'assets/images'
  ],
  
  // Output directory for optimized images
  outputDir: 'dist/images',
  
  // Image quality (0-100)
  quality: 80,
  
  // Image widths to generate (in pixels)
  responsiveWidths: [320, 480, 768, 1024, 1366, 1600, 1920],
  
  // File extensions to process
  extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  
  // Skip existing files
  skipExisting: true,
  
  // Enable/disable WebP conversion
  convertToWebP: true,
  
  // Enable/disable responsive images
  generateResponsive: true
};

// Ensure output directory exists
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Get all files in a directory recursively
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

// Process a single image
async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Skip unsupported files
  if (!config.extensions.includes(ext)) {
    console.log(`Skipping unsupported file: ${filePath}`);
    return;
  }
  
  // Get relative path for output
  const relPath = path.relative(process.cwd(), filePath);
  const dirName = path.dirname(relPath);
  const fileName = path.basename(relPath, ext);
  
  // Create output directories
  const outputBaseDir = path.join(process.cwd(), config.outputDir);
  const outputDir = path.join(outputBaseDir, dirName);
  await ensureDir(outputDir);
  
  // Process original image
  await processImageSizes(filePath, outputDir, fileName, ext);
  
  // Convert to WebP if enabled
  if (config.convertToWebP && ext !== '.webp') {
    await processImageSizes(filePath, outputDir, fileName, '.webp');
  }
}

// Process image in different sizes
async function processImageSizes(inputPath, outputDir, baseName, ext) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  // Generate responsive sizes
  if (config.generateResponsive && (ext === '.jpg' || ext === '.jpeg' || ext === '.webp')) {
    for (const width of config.responsiveWidths) {
      // Skip if the requested width is larger than the original
      if (width > metadata.width) continue;
      
      const outputPath = path.join(outputDir, `${baseName}-${width}w${ext}`);
      
      // Skip if file exists and skipExisting is true
      if (config.skipExisting && fs.existsSync(outputPath)) {
        console.log(`Skipping existing: ${outputPath}`);
        continue;
      }
      
      // Resize and optimize the image
      await image
        .resize(width)
        .toFormat(ext.replace('.', ''), { quality: config.quality })
        .toFile(outputPath);
      
      console.log(`Generated: ${outputPath}`);
    }
  }
  
  // Generate original size (optimized)
  const outputPath = path.join(outputDir, `${baseName}${ext}`);
  
  // Skip if file exists and skipExisting is true
  if (config.skipExisting && fs.existsSync(outputPath)) {
    console.log(`Skipping existing: ${outputPath}`);
    return;
  }
  
  // Optimize the original image
  await image
    .toFormat(ext.replace('.', ''), { quality: config.quality })
    .toFile(outputPath);
  
  console.log(`Optimized: ${outputPath}`);
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  // Process each source directory
  for (const srcDir of config.srcDirs) {
    try {
      const fullSrcPath = path.join(process.cwd(), srcDir);
      
      // Check if source directory exists
      if (!fs.existsSync(fullSrcPath)) {
        console.warn(`Source directory not found: ${fullSrcPath}`);
        continue;
      }
      
      console.log(`Processing directory: ${srcDir}`);
      
      // Get all files
      const files = await getFiles(fullSrcPath);
      
      // Process each file
      for (const file of files) {
        try {
          await processImage(file);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    } catch (err) {
      console.error(`Error processing directory ${srcDir}:`, err);
    }
  }
  
  console.log('Image optimization completed!');
}

// Run the script
main().catch(console.error);
