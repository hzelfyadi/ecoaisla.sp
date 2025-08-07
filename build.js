const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');

// Configuration
const config = {
  distDir: 'dist',
  cssDir: 'css',
  jsDir: 'js',
  imgDir: 'images',
  cssFiles: [
    'style.css',
    'header-styles.css',
    'hero-styles.css',
    'benefits-enhanced.css',
    'benefits-grid-enhanced.css',
    'form-validation-enhanced.css',
    'animations-enhanced.css'
  ],
  jsFiles: [
    'smooth-scroll.js',
    'form-validation-enhanced.js',
    'animations-enhanced.js'
  ]
};

// Create dist directory if it doesn't exist
if (!fs.existsSync(config.distDir)) {
  fs.mkdirSync(config.distDir);
  fs.mkdirSync(path.join(config.distDir, 'css'));
  fs.mkdirSync(path.join(config.distDir, 'js'));
  fs.mkdirSync(path.join(config.distDir, 'images'));
}

// Minify CSS
async function minifyCSS() {
  console.log('Optimizing CSS...');
  
  try {
    // First, run the CSS optimization script
    console.log('Running CSS optimization script...');
    const { execSync } = require('child_process');
    execSync('node build/optimize-css.js', { stdio: 'inherit' });
    
    // Then, minify the optimized CSS
    const files = fs.readdirSync(config.cssDir);
    
    for (const file of files) {
      if (path.extname(file) === '.css') {
        const filePath = path.join(config.cssDir, file);
        const outputPath = path.join(config.distDir, config.cssDir, file);
        
        // Skip if file doesn't exist (might have been processed by optimize-css.js)
        if (!fs.existsSync(filePath)) continue;
        
        // Read the CSS file
        const css = fs.readFileSync(filePath, 'utf8');
        
        // Minify the CSS
        const result = await new CleanCSS({
          level: 2,
          format: 'beautify',
          returnPromise: true
        }).minify(css);
        
        // Ensure the output directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        
        // Write the minified CSS
        fs.writeFileSync(outputPath, result.styles);
        
        console.log(`Minified: ${file}`);
      }
    }
    
    console.log('CSS optimization complete!');
  } catch (error) {
    console.error('Error optimizing CSS:', error);
    throw error;
  }
}

// Minify JavaScript
async function minifyJS() {
  console.log('Optimizing JavaScript files...');
  
  try {
    // First, run the JavaScript optimization script
    console.log('Running JavaScript optimization script...');
    const { execSync } = require('child_process');
    execSync('node build/optimize-js.js', { stdio: 'inherit' });
    
    // Process individual files if needed (for non-bundled files)
    const jsFiles = config.jsFiles.map(file => 
      path.join(config.jsDir, file)
    );
    
    // Process each JavaScript file
    for (const file of jsFiles) {
      if (fs.existsSync(file)) {
        const code = fs.readFileSync(file, 'utf8');
        const result = await minify(code, {
          compress: {
            drop_console: false, // Set to true in production
            drop_debugger: true,
            ecma: 2020,
            passes: 2
          },
          mangle: {
            toplevel: true
          },
          format: {
            comments: false,
            ecma: 2020
          }
        });
        
        const outputPath = path.join(
          config.distDir, 
          'js', 
          path.basename(file, '.js') + '.min.js'
        );
        
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, result.code);
        
        console.log(`Optimized: ${path.basename(file)}`);
      }
    }
    
    console.log('JavaScript optimization complete!');
  } catch (error) {
    console.error('Error optimizing JavaScript:', error);
    throw error;
  }
}

// Optimize images
async function optimizeImages() {
  console.log('Optimizing images...');
  
  try {
    // First, use the dedicated image optimization script
    console.log('Running image optimization script...');
    const { execSync } = require('child_process');
    execSync('node build/optimize-images.js', { stdio: 'inherit' });
    
    // Then, use imagemin for additional optimization
    console.log('Running additional image optimization...');
    await imagemin([`${config.imgDir}/**/*.{jpg,jpeg,png,webp,svg}`], {
      destination: `${config.distDir}/${config.imgDir}`,
      plugins: [
        imageminMozjpeg({ 
          quality: 80,
          progressive: true,
          arithmetic: false
        }),
        imageminPngquant({
          quality: [0.6, 0.8],
          speed: 4,
          strip: true
        }),
        imageminWebp({
          quality: 80,
          method: 6,
          alphaQuality: 80,
          preset: 'photo',
          sns: 80,
          filter: 40,
          autoFilter: true,
          sharpness: 5
        })
      ]
    });
    
    console.log('Images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
    throw error;
  }
}

// Copy HTML files
function copyHTML() {
  console.log('Copying HTML files...');
  
  const htmlFiles = fs.readdirSync('.').filter(file => 
    file.endsWith('.html')
  );
  
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace CSS links with minified version
    config.cssFiles.forEach(cssFile => {
      const cssPath = path.join(config.cssDir, cssFile);
      content = content.replace(
        new RegExp(`<link[^>]*href=["']${cssPath}["'][^>]*>`, 'g'),
        ''
      );
    });
    
    // Add minified CSS
    content = content.replace(
      '</head>',
      `  <link rel="stylesheet" href="css/styles.min.css">\n  </head>`
    );
    
    // Replace JS scripts with minified version
    config.jsFiles.forEach(jsFile => {
      const jsPath = path.join(config.jsDir, jsFile);
      content = content.replace(
        new RegExp(`<script[^>]*src=["']${jsPath}["'][^>]*>\\s*</script>`, 'g'),
        ''
      );
    });
    
    // Add minified JS before closing body
    content = content.replace(
      '</body>',
      `  <script src="js/scripts.min.js"></script>\n  </body>`
    );
    
    // Write processed HTML to dist
    fs.writeFileSync(
      path.join(config.distDir, file),
      content
    );
  });
  
  console.log('HTML files processed!');
}

// Run build process
async function build() {
  console.log('Starting build process...');
  
  try {
    await minifyCSS();
    await minifyJS();
    await optimizeImages();
    copyHTML();
    
    console.log('\nBuild completed successfully!');
    console.log(`Output directory: ${path.resolve(config.distDir)}`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Execute build
build();
