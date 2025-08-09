// scripts/setup.js
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SetupManager {
  constructor() {
    this.projectRoot = path.join(__dirname, '..', '..');
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    try {
      // Vérifier Node.js
      const { stdout: nodeVersion } = await execAsync('node --version');
      console.log(`✅ Node.js: ${nodeVersion.trim()}`);
      
      // Vérifier npm
      const { stdout: npmVersion } = await execAsync('npm --version');
      console.log(`✅ npm: ${npmVersion.trim()}`);
      
      // Vérifier MySQL (optionnel)
      try {
        await execAsync('mysql --version');
        console.log('✅ MySQL is available');
      } catch (error) {
        console.log('⚠️  MySQL not found - you can use Docker instead');
      }
      
      // Vérifier Python (optionnel)
      try {
        const { stdout: pythonVersion } = await execAsync('python --version');
        console.log(`✅ Python: ${pythonVersion.trim()}`);
      } catch (error) {
        console.log('⚠️  Python not found - Python code execution will be limited');
      }
      
    } catch (error) {
      console.error('❌ Prerequisites check failed:', error.message);
      process.exit(1);
    }
  }

  async createDirectories() {
    console.log('📁 Creating directory structure...');
    
    const directories = [
      'src/controllers',
      'src/models',
      'src/routes',
      'src/middleware',
      'src/services',
      'src/services/temp',
      'src/database',
      'src/scripts',
      'uploads',
      'logs'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.projectRoot, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`✅ Created: ${dir}`);
      } catch (error) {
        console.log(`⚠️  Directory already exists: ${dir}`);
      }
    }
  }

  async createConfigFiles() {
    console.log('⚙️  Creating configuration files...');

    // Créer .env.example
    const envExample = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coding_platform

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
SESSION_SECRET=your-session-secret

# Code Execution Limits
CODE_TIMEOUT=5000
MEMORY_LIMIT=128MB

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
`;

    try {
      await fs.writeFile(path.join(this.projectRoot, '.env.example'), envExample);
      console.log('✅ Created .env.example');
      
      // Vérifier si .env existe
      try {
        await fs.access(path.join(this.projectRoot, '.env'));
        console.log('✅ .env file already exists');
      } catch {
        await fs.writeFile(path.join(this.projectRoot, '.env'), envExample);
        console.log('✅ Created .env file');
      }
    } catch (error) {
      console.error('❌ Failed to create config files:', error.message);
    }

    // Créer .gitignore
    const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Uploads
uploads/*
!uploads/.gitkeep

# Temporary files
src/services/temp/*
!src/services/temp/.gitkeep

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
`;

    try {
      await fs.writeFile(path.join(this.projectRoot, '.gitignore'), gitignore);
      console.log('✅ Created .gitignore');
    } catch (error) {
      console.error('❌ Failed to create .gitignore:', error.message);
    }
  }

  async createHealthCheck() {
    console.log('🏥 Creating health check...');
    
    const healthCheck = `// healthcheck.js
const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3001,
  path: '/api/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(\`Health check status: \${res.statusCode}\`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('Health check failed:', err.message);
  process.exit(1);
});

request.end();
`;

    try {
      await fs.writeFile(path.join(this.projectRoot, 'healthcheck.js'), healthCheck);
      console.log('✅ Created health check');
    } catch (error) {
      console.error('❌ Failed to create health check:', error.message);
    }
  }

  async createStartupScripts() {
    console.log('🚀 Creating startup scripts...');

    // Script de démarrage Windows
    const windowsStart = `@echo off
echo Starting Coding Platform...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Installer les dépendances si nécessaire
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Démarrer le serveur
echo Starting server...
npm run dev
pause
`;

    // Script de démarrage Unix/Linux
    const unixStart = `#!/bin/bash
echo "Starting Coding Platform..."
echo

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Démarrer le serveur
echo "Starting server..."
npm run dev
`;

    try {
      await fs.writeFile(path.join(this.projectRoot, 'start-windows.bat'), windowsStart);
      await fs.writeFile(path.join(this.projectRoot, 'start-unix.sh'), unixStart);
      
      // Rendre le script Unix exécutable
      try {
        await execAsync('chmod +x start-unix.sh');
      } catch {
        // Ignorer si on n'est pas sur Unix
      }
      
      console.log('✅ Created startup scripts');
    } catch (error) {
      console.error('❌ Failed to create startup scripts:', error.message);
    }
  }

  async installDependencies() {
    console.log('📦 Installing dependencies...');
    
    try {
      console.log('Installing npm packages...');
      await execAsync('npm install', { cwd: this.projectRoot });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      console.log('💡 Try running "npm install" manually');
    }
  }

  async displaySummary() {
    console.log('\n🎉 Setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Configure your database connection in .env file');
    console.log('2. Create the database schema (see database/schema.sql)');
    console.log('3. Start the development server:');
    console.log('   npm run dev');
    console.log('\n🌐 URLs:');
    console.log('   API Health Check: http://localhost:3001/api/health');
    console.log('   Candidate Registration: http://localhost:3000/candidate/javascript/intermediate');
    console.log('   Recruiter Dashboard: http://localhost:3000/recruiter/dashboard');
    console.log('\n💡 Tips:');
    console.log('   - Use "npm run dev" for development with auto-reload');
    console.log('   - Check logs/ directory for application logs');
    console.log('   - Use Docker Compose for easy deployment');
  }

  async run() {
    console.log('🚀 Setting up Coding Platform Backend...\n');
    
    try {
      await this.checkPrerequisites();
      await this.createDirectories();
      await this.createConfigFiles();
      await this.createHealthCheck();
      await this.createStartupScripts();
      await this.installDependencies();
      await this.displaySummary();
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// Exécuter le setup
if (require.main === module) {
  const setup = new SetupManager();
  setup.run();
}

module.exports = SetupManager;