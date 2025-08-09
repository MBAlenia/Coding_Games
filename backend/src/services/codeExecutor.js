const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CodeExecutor {
  constructor() {
    this.timeout = parseInt(process.env.CODE_TIMEOUT) || 5000;
    this.memoryLimit = process.env.MEMORY_LIMIT || '128MB';
    this.sandboxDir = path.join(__dirname, '../../sandbox');
  }

  async execute(code, testCases, language) {
    const sessionId = uuidv4();
    const results = [];

    try {
      // Ensure sandbox directory exists
      await fs.mkdir(this.sandboxDir, { recursive: true });

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const result = await this.executeTestCase(code, testCase, language, sessionId, i);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Code execution error:', error);
      throw error;
    } finally {
      // Cleanup
      await this.cleanup(sessionId);
    }
  }

  async executeTestCase(code, testCase, language, sessionId, testIndex) {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (language) {
        case 'javascript':
          result = await this.executeJavaScript(code, testCase, sessionId, testIndex);
          break;
        case 'python':
          result = await this.executePython(code, testCase, sessionId, testIndex);
          break;
        case 'sql':
          result = await this.executeSQL(code, testCase, sessionId, testIndex);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      const executionTime = Date.now() - startTime;
      
      return {
        input: testCase.input,
        expected: testCase.expected,
        actual: result.output,
        passed: this.compareOutputs(result.output, testCase.expected),
        executionTime,
        error: result.error || null
      };
    } catch (error) {
      return {
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        passed: false,
        executionTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  async executeJavaScript(code, testCase, sessionId, testIndex) {
    const fileName = `${sessionId}_${testIndex}.js`;
    const filePath = path.join(this.sandboxDir, fileName);
    
    // Wrap code with test case
    const wrappedCode = `
      ${code}
      
      // Test execution
      try {
        const input = ${JSON.stringify(testCase.input)};
        const result = typeof main === 'function' ? main(input) : eval(input);
        console.log(JSON.stringify(result));
      } catch (error) {
        console.error('ERROR:', error.message);
      }
    `;

    await fs.writeFile(filePath, wrappedCode);

    return new Promise((resolve, reject) => {
      const child = spawn('node', [filePath], {
        timeout: this.timeout,
        cwd: this.sandboxDir
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (stderr && stderr.includes('ERROR:')) {
          resolve({ output: null, error: stderr.replace('ERROR:', '').trim() });
        } else if (code === 0) {
          try {
            const output = JSON.parse(stdout.trim());
            resolve({ output });
          } catch {
            resolve({ output: stdout.trim() });
          }
        } else {
          resolve({ output: null, error: stderr || 'Process exited with error' });
        }
      });

      child.on('error', (error) => {
        resolve({ output: null, error: error.message });
      });
    });
  }

  async executePython(code, testCase, sessionId, testIndex) {
    const fileName = `${sessionId}_${testIndex}.py`;
    const filePath = path.join(this.sandboxDir, fileName);
    
    // Wrap code with test case
    const wrappedCode = `
import json
import sys

${code}

try:
    input_data = ${JSON.stringify(testCase.input)}
    if 'main' in globals():
        result = main(input_data)
    else:
        result = eval(str(input_data))
    print(json.dumps(result))
except Exception as e:
    print(f"ERROR: {str(e)}", file=sys.stderr)
    `;

    await fs.writeFile(filePath, wrappedCode);

    return new Promise((resolve, reject) => {
      const child = spawn('python3', [filePath], {
        timeout: this.timeout,
        cwd: this.sandboxDir
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (stderr && stderr.includes('ERROR:')) {
          resolve({ output: null, error: stderr.replace('ERROR:', '').trim() });
        } else if (code === 0) {
          try {
            const output = JSON.parse(stdout.trim());
            resolve({ output });
          } catch {
            resolve({ output: stdout.trim() });
          }
        } else {
          resolve({ output: null, error: stderr || 'Process exited with error' });
        }
      });

      child.on('error', (error) => {
        resolve({ output: null, error: error.message });
      });
    });
  }

  async executeSQL(code, testCase, sessionId, testIndex) {
    // For SQL, we would need a database connection
    // This is a simplified implementation
    return {
      output: null,
      error: 'SQL execution not implemented yet'
    };
  }

  compareOutputs(actual, expected) {
    if (actual === null) return false;
    
    // Handle different types of comparison
    if (typeof expected === 'number') {
      return Math.abs(parseFloat(actual) - expected) < 0.0001;
    }
    
    if (Array.isArray(expected)) {
      try {
        const actualArray = Array.isArray(actual) ? actual : JSON.parse(actual);
        return JSON.stringify(actualArray.sort()) === JSON.stringify(expected.sort());
      } catch {
        return false;
      }
    }
    
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  async cleanup(sessionId) {
    try {
      const files = await fs.readdir(this.sandboxDir);
      const sessionFiles = files.filter(file => file.startsWith(sessionId));
      
      for (const file of sessionFiles) {
        await fs.unlink(path.join(this.sandboxDir, file));
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new CodeExecutor();
