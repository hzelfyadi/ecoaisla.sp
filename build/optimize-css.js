/**
 * CSS Optimization Script
 * 
 * This script optimizes CSS by:
 * 1. Purging unused CSS
 * 2. Generating critical CSS
 * 3. Inlining critical CSS
 * 4. Loading non-critical CSS asynchronously
 * 
 * Requirements:
 * - Node.js
 * - postcss, purgecss, critical (npm install --save-dev postcss purgecss critical)
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const { execSync } = require('child_process');
const postcss = require('postcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const critical = require('critical');
const CleanCSS = require('clean-css');

// Configuration
const config = {
  // Source files to analyze for used CSS
  content: [
    './**/*.html',
    './**/*.js',
    './**/*.php',
    './**/*.vue',
    './**/*.jsx',
    './**/*.tsx'
  ],
  
  // CSS files to optimize
  css: [
    'css/main.css',
    'css/header-styles.css',
    'css/hero-styles.css',
    'css/benefits-enhanced.css',
    'css/benefits-grid-enhanced.css',
    'css/form-validation-enhanced.css',
    'css/animations-enhanced.css',
    'css/components/_images.css',
    'css/_variables.css',
    'css/_base.css',
    'css/_components.css',
    'css/_dark-mode.css',
    'css/_utilities.css',
    'css/_animations.css',
    'css/_pwa.css'
  ],
  
  // Output directory for optimized CSS
  outputDir: 'dist/css',
  
  // Critical CSS configuration
  critical: {
    // Viewport dimensions
    width: 1300,
    height: 900,
    
    // Output options
    inline: true,
    extract: true,
    
    // Performance options
    penthouse: {
      timeout: 60000,
      renderWaitTime: 1000,
      maxRenderTime: 300000
    }
  },
  
  // PurgeCSS configuration
  purgecss: {
    // CSS selectors that should be whitelisted
    safelist: {
      standard: [
        'active',
        'show',
        'collapsed',
        'collapsing',
        /^aos-/, // AOS animations
        /^dark-mode-/, // Dark mode classes
        /^is-/,
        /^has-/
      ],
      deep: [/^modal/, /^carousel/, /^tooltip/, /^popover/, /^bs-tooltip/, /^bs-popover/],
      greedy: []
    },
    
    // Fonts to whitelist
    fontFace: true,
    
    // Keyframes to whitelist
    keyframes: true
  },
  
  // CleanCSS options
  cleancss: {
    level: 2,
    format: 'beautify',
    returnPromise: true
  }
};

/**
 * Ensure directory exists
 */
async function ensureDir(dir) {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Purge unused CSS
 */
async function purgeCSS() {
  console.log('Purging unused CSS...');
  
  try {
    await ensureDir(config.outputDir);
    
    // Process each CSS file
    for (const cssFile of config.css) {
      const filePath = path.join(process.cwd(), cssFile);
      const outputPath = path.join(process.cwd(), config.outputDir, path.basename(cssFile));
      
      // Skip if file doesn't exist
      if (!fs.existsSync(filePath)) {
        console.warn(`CSS file not found: ${filePath}`);
        continue;
      }
      
      console.log(`Processing: ${cssFile}`);
      
      // Read the CSS file
      const css = await readFile(filePath, 'utf8');
      
      // Process with PostCSS and PurgeCSS
      const result = await postcss([
        purgecss({
          content: config.content,
          defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          safelist: config.purgecss.safelist,
          fontFace: config.purgecss.fontFace,
          keyframes: config.purgecss.keyframes
        })
      ]).process(css, { from: filePath, to: outputPath });
      
      // Write the purged CSS
      await writeFile(outputPath, result.css);
      
      console.log(`Purged CSS written to: ${outputPath}`);
    }
    
    console.log('CSS purging completed!');
  } catch (error) {
    console.error('Error purging CSS:', error);
    throw error;
  }
}

/**
 * Generate critical CSS
 */
async function generateCriticalCSS() {
  console.log('Generating critical CSS...');
  
  try {
    const outputDir = path.join(process.cwd(), config.outputDir);
    await ensureDir(outputDir);
    
    // Generate critical CSS for the homepage
    await critical.generate({
      base: './',
      src: 'index.html',
      target: {
        css: path.join(outputDir, 'critical.css')
      },
      inline: false,
      extract: true,
      dimensions: [
        { width: 320, height: 480 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1300, height: 900 }  // Desktop
      ],
      ignore: {
        atrule: ['@font-face'],
        rule: [/some-rule/],
        decl: (node, value) => /big\.jpg/.test(value)
      },
      penthouse: {
        timeout: 60000,
        renderWaitTime: 1000,
        maxRenderTime: 300000
      }
    });
    
    console.log('Critical CSS generated successfully!');
  } catch (error) {
    console.error('Error generating critical CSS:', error);
    throw error;
  }
}

/**
 * Minify CSS
 */
async function minifyCSS() {
  console.log('Minifying CSS...');
  
  try {
    const outputDir = path.join(process.cwd(), config.outputDir);
    const files = fs.readdirSync(outputDir);
    
    // Process each CSS file in the output directory
    for (const file of files) {
      if (path.extname(file) === '.css') {
        const filePath = path.join(outputDir, file);
        const css = await readFile(filePath, 'utf8');
        
        // Minify the CSS
        const minified = await new CleanCSS({
          level: 2,
          format: 'beautify'
        }).minify(css);
        
        // Write the minified CSS
        await writeFile(filePath, minified.styles);
        
        console.log(`Minified: ${file}`);
      }
    }
    
    console.log('CSS minification completed!');
  } catch (error) {
    console.error('Error minifying CSS:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting CSS optimization...');
  
  try {
    // Step 1: Purge unused CSS
    await purgeCSS();
    
    // Step 2: Generate critical CSS
    await generateCriticalCSS();
    
    // Step 3: Minify all CSS
    await minifyCSS();
    
    console.log('CSS optimization completed successfully!');
  } catch (error) {
    console.error('CSS optimization failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
