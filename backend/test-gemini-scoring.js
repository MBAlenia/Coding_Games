const aiScoringService = require('./src/services/aiScoringService');

async function testGeminiScoring() {
  console.log('Testing Gemini AI Scoring System');
  console.log('================================');

  try {
    // Test 1: Simple JavaScript function
    console.log('\n1. Testing JavaScript function evaluation...');
    const jsQuestion = "Écrivez une fonction JavaScript qui calcule la somme de deux nombres.";
    const jsAnswer = "function sum(a, b) { return a + b; }";
    const jsResult = await aiScoringService.scoreAnswer(jsQuestion, jsAnswer, 100);
    console.log('JavaScript Result:', jsResult);

    // Test 2: Python function
    console.log('\n2. Testing Python function evaluation...');
    const pyQuestion = "Écrivez une fonction Python qui inverse une chaîne de caractères.";
    const pyAnswer = "def reverse_string(s):\n    return s[::-1]";
    const pyResult = await aiScoringService.scoreAnswer(pyQuestion, pyAnswer, 80);
    console.log('Python Result:', pyResult);

    // Test 3: SQL query
    console.log('\n3. Testing SQL query evaluation...');
    const sqlQuestion = "Écrivez une requête SQL pour sélectionner tous les utilisateurs actifs.";
    const sqlAnswer = "SELECT * FROM users WHERE status = 'active';";
    const sqlResult = await aiScoringService.scoreAnswer(sqlQuestion, sqlAnswer, 50);
    console.log('SQL Result:', sqlResult);

    // Test 4: Incomplete answer
    console.log('\n4. Testing incomplete answer...');
    const incompleteQuestion = "Expliquez le concept de récursion en programmation.";
    const incompleteAnswer = "La récursion c'est quand une fonction...";
    const incompleteResult = await aiScoringService.scoreAnswer(incompleteQuestion, incompleteAnswer, 100);
    console.log('Incomplete Result:', incompleteResult);

    // Test 5: Empty answer (fallback test)
    console.log('\n5. Testing empty answer (fallback system)...');
    const emptyResult = await aiScoringService.scoreAnswer("Test question", "", 100);
    console.log('Empty Answer Result:', emptyResult);

    console.log('\n✅ Gemini AI Scoring test completed successfully!');
    console.log('\n📝 Notes:');
    console.log('- Make sure GEMINI_API_KEY is set in your .env file');
    console.log('- The API key should have access to Gemini Pro model');
    console.log('- Fallback system activates if API fails');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your GEMINI_API_KEY in .env file');
    console.log('2. Verify internet connection');
    console.log('3. Ensure Gemini API quota is not exceeded');
  }
}

// Run the test
testGeminiScoring();
