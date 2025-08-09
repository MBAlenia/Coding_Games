const { parentPort, workerData } = require('worker_threads');

function createSafeEnvironment() {
  // Environnement sécurisé - bloquer l'accès aux APIs dangereuses
  const safeGlobal = {
    console: {
      log: (...args) => {}, // Désactiver console.log
      error: (...args) => {},
      warn: (...args) => {}
    },
    Math: Math,
    Date: Date,
    JSON: JSON,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite
  };

  // Bloquer l'accès aux APIs dangereuses
  const blockedAPIs = [
    'require', 'process', 'global', 'Buffer', 'setInterval', 
    'setTimeout', 'setImmediate', 'clearInterval', 'clearTimeout',
    'clearImmediate', 'eval', 'Function', 'XMLHttpRequest', 'fetch'
  ];

  blockedAPIs.forEach(api => {
    safeGlobal[api] = undefined;
  });

  return safeGlobal;
}

function executeCode(code, testCases) {
  const results = [];
  const safeEnv = createSafeEnvironment();

  for (const testCase of testCases) {
    try {
      // Créer une fonction dans l'environnement sécurisé
      const wrappedCode = `
        (function() {
          ${code}
          
          // Exécuter le test
          try {
            const result = ${testCase.functionCall || 'undefined'};
            return result;
          } catch (e) {
            throw new Error('Test execution failed: ' + e.message);
          }
        })();
      `;

      // Utiliser Function constructor avec environnement limité
      const func = new Function(...Object.keys(safeEnv), `return ${wrappedCode}`);
      const startTime = Date.now();
      
      const result = func(...Object.values(safeEnv));
      const executionTime = Date.now() - startTime;

      const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed,
        executionTime
      });

    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: `Error: ${error.message}`,
        passed: false,
        executionTime: 0
      });
    }
  }

  return results;
}

try {
  const { code, testCases } = workerData;
  
  // Validation basique du code
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid code provided');
  }

  if (!testCases || !Array.isArray(testCases)) {
    throw new Error('Invalid test cases provided');
  }

  // Exécuter le code
  const results = executeCode(code, testCases);
  
  // Envoyer les résultats au thread principal
  parentPort.postMessage(results);

} catch (error) {
  parentPort.postMessage({
    error: true,
    message: error.message
  });
}
