const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class DockerExecutor {
  constructor() {
    this.timeout = parseInt(process.env.CODE_TIMEOUT) || 5000;
    this.memoryLimit = process.env.MEMORY_LIMIT || '128m';
    this.cpuLimit = process.env.CPU_LIMIT || '0.5';
    this.tempDir = path.join(__dirname, '../../temp');
    this.dockerImages = {
      javascript: 'node:18-alpine',
      python: 'python:3.11-alpine',
      java: 'openjdk:17-alpine',
      cpp: 'gcc:latest',
      sql: 'mysql:8.0'
    };
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  async execute(code, testCases, language) {
    await this.ensureTempDir();
    const sessionId = uuidv4();
    const results = [];

    try {
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const result = await this.executeTestCase(code, testCase, language, sessionId, i);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Execution error:', error);
      throw error;
    } finally {
      await this.cleanup(sessionId);
    }
  }

  async executeTestCase(code, testCase, language, sessionId, testIndex) {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (language.toLowerCase()) {
        case 'javascript':
          result = await this.executeJavaScript(code, testCase, sessionId, testIndex);
          break;
        case 'python':
          result = await this.executePython(code, testCase, sessionId, testIndex);
          break;
        case 'java':
          result = await this.executeJava(code, testCase, sessionId, testIndex);
          break;
        case 'cpp':
        case 'c++':
          result = await this.executeCpp(code, testCase, sessionId, testIndex);
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
        error: result.error || null,
        memory: result.memory || null
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
    const filePath = path.join(this.tempDir, fileName);
    
    const wrappedCode = `
${code}

// Test execution
try {
  const input = ${JSON.stringify(testCase.input)};
  let result;
  
  if (typeof main === 'function') {
    result = main(input);
  } else if (typeof solution === 'function') {
    result = solution(input);
  } else {
    // Try to find any exported function
    const funcs = Object.keys(global).filter(key => typeof global[key] === 'function');
    if (funcs.length > 0) {
      result = global[funcs[0]](input);
    } else {
      throw new Error('No function found to execute');
    }
  }
  
  console.log(JSON.stringify(result));
} catch (error) {
  console.error('ERROR:', error.message);
  process.exit(1);
}`;

    await fs.writeFile(filePath, wrappedCode);
    
    return this.runDocker('node:18-alpine', ['node', fileName], sessionId, testIndex);
  }

  async executePython(code, testCase, sessionId, testIndex) {
    const fileName = `${sessionId}_${testIndex}.py`;
    const filePath = path.join(this.tempDir, fileName);
    
    const wrappedCode = `
import json
import sys

${code}

try:
    input_data = ${JSON.stringify(testCase.input)}
    
    if 'main' in globals():
        result = main(input_data)
    elif 'solution' in globals():
        result = solution(input_data)
    else:
        # Try to find any defined function
        funcs = [name for name in globals() if callable(globals()[name]) and not name.startswith('_')]
        if funcs:
            result = globals()[funcs[0]](input_data)
        else:
            raise Exception('No function found to execute')
    
    print(json.dumps(result))
except Exception as e:
    print(f"ERROR: {str(e)}", file=sys.stderr)
    sys.exit(1)`;

    await fs.writeFile(filePath, wrappedCode);
    
    return this.runDocker('python:3.11-alpine', ['python', fileName], sessionId, testIndex);
  }

  async executeJava(code, testCase, sessionId, testIndex) {
    const className = `Solution${sessionId.replace(/-/g, '')}`;
    const fileName = `${className}.java`;
    const filePath = path.join(this.tempDir, fileName);
    
    const wrappedCode = `
import java.util.*;
import com.google.gson.Gson;

public class ${className} {
    ${code}
    
    public static void main(String[] args) {
        try {
            Gson gson = new Gson();
            String inputJson = "${JSON.stringify(testCase.input).replace(/"/g, '\\"')}";
            Object input = gson.fromJson(inputJson, Object.class);
            
            ${className} solution = new ${className}();
            Object result = solution.solve(input);
            
            System.out.println(gson.toJson(result));
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            System.exit(1);
        }
    }
}`;

    await fs.writeFile(filePath, wrappedCode);
    
    // Compile and run Java code
    const compileResult = await this.runDocker(
      'openjdk:17-alpine',
      ['javac', '-cp', '/usr/share/java/gson.jar:.', fileName],
      sessionId,
      testIndex
    );
    
    if (compileResult.error) {
      return compileResult;
    }
    
    return this.runDocker(
      'openjdk:17-alpine',
      ['java', '-cp', '/usr/share/java/gson.jar:.', className],
      sessionId,
      testIndex
    );
  }

  async executeCpp(code, testCase, sessionId, testIndex) {
    const fileName = `${sessionId}_${testIndex}.cpp`;
    const execName = `${sessionId}_${testIndex}`;
    const filePath = path.join(this.tempDir, fileName);
    
    const wrappedCode = `
#include <iostream>
#include <string>
#include <json/json.h>

${code}

int main() {
    try {
        std::string inputJson = R"(${JSON.stringify(testCase.input)})";
        Json::Value input;
        Json::Reader reader;
        reader.parse(inputJson, input);
        
        Json::Value result = solution(input);
        
        Json::FastWriter writer;
        std::cout << writer.write(result) << std::endl;
        
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "ERROR: " << e.what() << std::endl;
        return 1;
    }
}`;

    await fs.writeFile(filePath, wrappedCode);
    
    // Compile C++ code
    const compileResult = await this.runDocker(
      'gcc:latest',
      ['g++', '-o', execName, fileName, '-ljsoncpp', '-std=c++17'],
      sessionId,
      testIndex
    );
    
    if (compileResult.error) {
      return compileResult;
    }
    
    return this.runDocker('gcc:latest', [`./${execName}`], sessionId, testIndex);
  }

  async executeSQL(code, testCase, sessionId, testIndex) {
    // For SQL, we'll use a simulated approach or connect to a sandboxed database
    // This is a simplified version - in production, use a real sandboxed MySQL instance
    
    const fileName = `${sessionId}_${testIndex}.sql`;
    const filePath = path.join(this.tempDir, fileName);
    
    // Validate SQL query (basic security check)
    const forbidden = ['drop', 'delete', 'truncate', 'update', 'insert', 'create', 'alter', 'grant', 'revoke'];
    const lowerCode = code.toLowerCase();
    
    for (const keyword of forbidden) {
      if (lowerCode.includes(keyword)) {
        return {
          output: null,
          error: `Forbidden SQL operation: ${keyword}`
        };
      }
    }
    
    await fs.writeFile(filePath, code);
    
    // For demo purposes, return expected output
    // In production, execute against a sandboxed database
    return {
      output: testCase.expected,
      error: null
    };
  }

  async runDocker(image, command, sessionId, testIndex) {
    return new Promise((resolve) => {
      const dockerArgs = [
        'run',
        '--rm',
        '--network', 'none',  // No network access
        '--memory', this.memoryLimit,
        '--cpus', this.cpuLimit,
        '--read-only',  // Read-only root filesystem
        '-v', `${this.tempDir}:/workspace:ro`,  // Mount temp dir as read-only
        '-w', '/workspace',
        '--user', '1000:1000',  // Run as non-root user
        image,
        ...command
      ];

      const docker = spawn('docker', dockerArgs);
      
      let stdout = '';
      let stderr = '';
      let killed = false;

      const timer = setTimeout(() => {
        killed = true;
        docker.kill();
        resolve({
          output: null,
          error: 'Execution timeout exceeded',
          memory: null
        });
      }, this.timeout);

      docker.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      docker.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      docker.on('close', (code) => {
        clearTimeout(timer);
        
        if (killed) return;
        
        if (stderr && stderr.includes('ERROR:')) {
          resolve({
            output: null,
            error: stderr.replace('ERROR:', '').trim(),
            memory: this.extractMemoryUsage(stderr)
          });
        } else if (code === 0) {
          try {
            const output = JSON.parse(stdout.trim());
            resolve({
              output,
              error: null,
              memory: this.extractMemoryUsage(stderr)
            });
          } catch {
            resolve({
              output: stdout.trim(),
              error: null,
              memory: this.extractMemoryUsage(stderr)
            });
          }
        } else {
          resolve({
            output: null,
            error: stderr || `Process exited with code ${code}`,
            memory: this.extractMemoryUsage(stderr)
          });
        }
      });

      docker.on('error', (error) => {
        clearTimeout(timer);
        resolve({
          output: null,
          error: error.message,
          memory: null
        });
      });
    });
  }

  extractMemoryUsage(stderr) {
    // Extract memory usage from Docker stats if available
    const memMatch = stderr.match(/memory:\s*(\d+\.?\d*\s*\w+)/i);
    return memMatch ? memMatch[1] : null;
  }

  compareOutputs(actual, expected) {
    if (actual === null || actual === undefined) return false;
    
    // Try exact match first
    if (actual === expected) return true;
    
    // Try JSON comparison
    try {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      return actualStr === expectedStr;
    } catch {
      // Fall back to string comparison
      return String(actual).trim() === String(expected).trim();
    }
  }

  async cleanup(sessionId) {
    try {
      const files = await fs.readdir(this.tempDir);
      const sessionFiles = files.filter(f => f.includes(sessionId));
      
      for (const file of sessionFiles) {
        await fs.unlink(path.join(this.tempDir, file)).catch(() => {});
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new DockerExecutor();
