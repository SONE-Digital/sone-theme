const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../src/sone-theme/images/canon-colorado-m-series');
const mockupInputDir = path.join(__dirname, 'templates/images/canon-colorado-m-series');

async function convertWebpToJpg(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

async function convertAllImages() {
  // Convert images in sone-theme directory
  if (fs.existsSync(inputDir)) {
    const files = fs.readdirSync(inputDir);
    for (const file of files) {
      if (file.endsWith('.webp')) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(inputDir, file.replace('.webp', '.jpg'));
        await convertWebpToJpg(inputPath, outputPath);
      }
    }
  }

  // Convert images in mockup directory
  if (fs.existsSync(mockupInputDir)) {
    const files = fs.readdirSync(mockupInputDir);
    for (const file of files) {
      if (file.endsWith('.webp')) {
        const inputPath = path.join(mockupInputDir, file);
        const outputPath = path.join(mockupInputDir, file.replace('.webp', '.jpg'));
        await convertWebpToJpg(inputPath, outputPath);
      }
    }
  }

  console.log('🎉 Conversion complete!');
}

convertAllImages().catch(console.error);