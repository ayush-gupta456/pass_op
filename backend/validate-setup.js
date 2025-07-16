const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Password Manager Backend Setup...\n');

// Check if required files exist
const requiredFiles = [
    'server.js',
    'package.json',
    '.env',
    'API.md',
    'README.md',
    'test-api.js'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} - Found`);
    } else {
        console.log(`❌ ${file} - Missing`);
    }
});

// Check package.json
console.log('\n📦 Validating package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required dependencies
    const requiredDeps = ['express', 'mongodb', 'dotenv', 'cors', 'body-parser'];
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✅ ${dep} - Found in dependencies`);
        } else {
            console.log(`❌ ${dep} - Missing from dependencies`);
        }
    });
    
    // Check scripts
    const requiredScripts = ['start', 'dev'];
    requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
            console.log(`✅ ${script} script - Found`);
        } else {
            console.log(`❌ ${script} script - Missing`);
        }
    });
    
    // Check devDependencies
    if (packageJson.devDependencies && packageJson.devDependencies.nodemon) {
        console.log('✅ nodemon - Found in devDependencies');
    } else {
        console.log('❌ nodemon - Missing from devDependencies');
    }
    
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
}

// Check .env file
console.log('\n🔧 Validating .env configuration...');
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars = ['MONGO_URI', 'PORT', 'FRONTEND_URL'];
    
    envVars.forEach(varName => {
        if (envContent.includes(varName)) {
            console.log(`✅ ${varName} - Found in .env`);
        } else {
            console.log(`❌ ${varName} - Missing from .env`);
        }
    });
} catch (error) {
    console.log('❌ Error reading .env file:', error.message);
}

// Check server.js syntax
console.log('\n🚀 Validating server.js syntax...');
try {
    require('./server.js');
    console.log('❌ server.js loaded (server may have started)');
} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.log('❌ Missing dependencies - run: npm install');
    } else if (error.message.includes('ECONNREFUSED')) {
        console.log('⚠️  MongoDB connection error - make sure MongoDB is running');
        console.log('✅ server.js syntax is valid');
    } else {
        console.log('❌ Syntax error in server.js:', error.message);
    }
}

// Check if node_modules exists
console.log('\n📚 Checking dependencies...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules directory found');
    
    // Check if key packages are installed
    const keyPackages = ['express', 'mongodb', 'dotenv'];
    keyPackages.forEach(pkg => {
        if (fs.existsSync(path.join('node_modules', pkg))) {
            console.log(`✅ ${pkg} package installed`);
        } else {
            console.log(`❌ ${pkg} package not installed`);
        }
    });
} else {
    console.log('❌ node_modules directory not found - run: npm install');
}

console.log('\n🎯 Setup Validation Complete!');
console.log('\nNext steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run: npm start (or npm run dev for development)');
console.log('3. Test the API: node test-api.js');
console.log('4. Check health endpoint: http://localhost:5000/api/health');
