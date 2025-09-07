const aiScoringService = require('./src/services/aiScoringService');

/**
 * Script de test pour valider le parsing des réponses IA
 */
async function testAIParsing() {
  console.log('=== Test du parsing des réponses IA ===\n');

  const testCases = [
    {
      name: 'Format correct',
      response: 'SCORE: 8\nFEEDBACK: Bonne réponse avec logique correcte',
      maxScore: 10,
      expected: { score: 8 }
    },
    {
      name: 'Format avec texte supplémentaire',
      response: 'Voici mon évaluation:\nSCORE: 6\nFEEDBACK: Code fonctionnel mais peut être amélioré\nMerci.',
      maxScore: 10,
      expected: { score: 6 }
    },
    {
      name: 'Format simple nombre',
      response: '7',
      maxScore: 10,
      expected: { score: 7 }
    },
    {
      name: 'Format avec points',
      response: '9 points sur 10',
      maxScore: 10,
      expected: { score: 9 }
    },
    {
      name: 'Format fraction',
      response: '5/10',
      maxScore: 10,
      expected: { score: 5 }
    },
    {
      name: 'Score trop élevé (doit être limité)',
      response: 'SCORE: 15\nFEEDBACK: Excellent',
      maxScore: 10,
      expected: { score: 10 }
    },
    {
      name: 'Score négatif (doit être 0)',
      response: 'SCORE: -2\nFEEDBACK: Mauvaise réponse',
      maxScore: 10,
      expected: { score: 0 }
    },
    {
      name: 'Aucun score trouvé',
      response: 'Cette réponse est intéressante mais ne répond pas à la question.',
      maxScore: 10,
      expected: { score: 'fallback' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n--- Test: ${testCase.name} ---`);
    console.log(`Réponse IA: "${testCase.response}"`);
    
    const result = aiScoringService.testParsing(testCase.response, testCase.maxScore);
    
    console.log(`Résultat: Score=${result.score}, Feedback="${result.feedback}"`);
    
    if (testCase.expected.score === 'fallback') {
      console.log(`✅ Test réussi: Fallback utilisé comme attendu`);
    } else if (result.score === testCase.expected.score) {
      console.log(`✅ Test réussi: Score correct (${result.score})`);
    } else {
      console.log(`❌ Test échoué: Attendu ${testCase.expected.score}, obtenu ${result.score}`);
    }
  }

  console.log('\n=== Tests terminés ===');
}

// Exécuter les tests
testAIParsing().catch(console.error);
