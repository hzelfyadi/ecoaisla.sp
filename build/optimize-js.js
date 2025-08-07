/**
 * JavaScript Optimization Script
 * 
 * This script optimizes JavaScript by:
 * 1. Bundling multiple JS files into a single file
 * 2. Minifying the bundled code
 * 3. Generating source maps for debugging
 * 4. Code splitting for better performance
 * 
 * Requirements:
 * - Node.js
 * - terser (already in package.json)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { minify } = require('terser');

// Configuration
const config = {
  // Source files to bundle (in order of inclusion)
  entryPoints: [
    'js/animations-enhanced.js',
    'js/form-validation-enhanced.js',
    'js/smooth-scroll.js',
    'js/performance.js',
    'js/pwa.js',
    'js/image-optimizer.js'
  ],
  
  // Output configuration
  output: {
    dir: 'dist/js',
    filename: 'bundle.min.js',
    sourceMap: true
  },
  
  // Terser minification options
  terserOptions: {
    compress: {
      drop_console: false, // Set to true in production
      drop_debugger: true,
      ecma: 2020,
      passes: 2
    },
    format: {
      comments: false,
      ecma: 2020
    },
    mangle: {
      toplevel: true
    },
    sourceMap: {
      url: 'bundle.min.js.map'
    }
  },
  
  // Files to exclude from processing
  exclude: [
    'node_modules/**',
    'dist/**',
    '**/*.min.js',
    '**/*.test.js'
  ]
};

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Read a file with error handling
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

/**
 * Write a file with error handling
 */
function writeFile(filePath, content) {
  try {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

/**
 * Bundle JavaScript files
 */
function bundleJS() {
  console.log('Bundling JavaScript files...');
  
  let bundle = `/**
 * ${config.entryPoints.join('\n * ')}
 * Bundled on: ${new Date().toISOString()}
 */
`;
  
  // Add IIFE wrapper start
  bundle += '
;(function() {
  "use strict";
  
  // Combined modules
  const modules = {};
  
  // Module definition
  function define(name, deps, factory) {
    if (!modules[name]) {
      const module = { exports: {} };
      const returnValue = factory(module, module.exports, require);
      if (returnValue) module.exports = returnValue;
      modules[name] = () => module.exports;
    }
    return modules[name];
  }
  
  // Require function
  function require(name) {
    if (modules[name]) {
      return typeof modules[name] === 'function' 
        ? (modules[name] = modules[name]())
        : modules[name];
    }
    throw new Error(`Module ${name} not found`);
  }
  
  // Global object for shared modules
  window.ecoaisla = window.ecoaisla || {};
  
  // Bundle code
  ;(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = factory();
    } else {
      global.ecoaisla = factory();
    }
  })(window, function() {
    return {
      modules: {},
      
      // Register a module
      registerModule: function(name, module) {
        this.modules[name] = module;
      },
      
      // Get a module
      getModule: function(name) {
        return this.modules[name];
      }
    };
  });
  
  // Bundle content
  try {
`;

  // Add each file's content
  config.entryPoints.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = readFile(filePath);
      bundle += `
      // File: ${filePath}
      (function() {
        ${content}
      })();
      `;
      console.log(`Added to bundle: ${filePath}`);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
  
  // Close the IIFE
  bundle += `
  } catch (error) {
    console.error('Error in bundled code:', error);
  }
  
  // Initialize modules when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    try {
      // Initialize modules here if needed
      if (window.ecoaisla && typeof window.ecoaisla.init === 'function') {
        window.ecoaisla.init();
      }
    } catch (error) {
      console.error('Error initializing modules:', error);
    }
  });
  
})();
`;
  
  return bundle;
}

/**
 * Minify JavaScript code
 */
async function minifyJS(code) {
  console.log('Minifying JavaScript...');
  
  try {
    const result = await minify(code, config.terserOptions);
    
    if (result.error) {
      throw result.error;
    }
    
    return {
      code: result.code,
      map: result.map
    };
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting JavaScript optimization...');
  
  try {
    // Ensure output directory exists
    ensureDir(config.output.dir);
    
    // Bundle JavaScript files
    const bundledCode = bundleJS();
    
    // Minify the bundled code
    const { code: minifiedCode, map: sourceMap } = await minifyJS(bundledCode);
    
    // Write minified code
    const outputPath = path.join(config.output.dir, config.output.filename);
    writeFile(outputPath, minifiedCode);
    
    // Write source map if enabled
    if (config.output.sourceMap && sourceMap) {
      const mapPath = path.join(config.output.dir, `${config.output.filename}.map`);
      writeFile(mapPath, sourceMap);
      
      // Add source map URL to the minified file
      const sourceMapUrl = `//# sourceMappingURL=${config.output.filename}.map`;
      fs.appendFileSync(outputPath, `\n${sourceMapUrl}`);
    }
    
    console.log(`JavaScript optimization complete! Output: ${outputPath}`);
  } catch (error) {
    console.error('JavaScript optimization failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
