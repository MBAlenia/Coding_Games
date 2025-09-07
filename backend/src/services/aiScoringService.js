const axios = require('axios');
const redisService = require('./redisService');

/**
 * Service d'évaluation des réponses par IA (Google Gemini)
 */
class AIScoringService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    this.apiUrl = process.env.AI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.model = process.env.AI_MODEL || 'gemini-pro';
  }

  /**
   * Évalue une réponse de candidat avec l'IA
   * @param {string} question - La question posée
   * @param {string} candidateAnswer - La réponse du candidat
   * @param {number} maxScore - Score maximum possible pour cette question
   * @returns {Promise<{score: number, feedback: string}>}
   */
  async scoreAnswer(question, candidateAnswer, maxScore) {
    try {
      // Check cache first to avoid repeated expensive API calls (only if Redis is connected)
      let cachedResult = null;
      if (redisService.isConnected) {
        const cacheKey = redisService.constructor.keys.aiResult(`${question.substring(0, 50)}_${candidateAnswer.substring(0, 50)}`);
        cachedResult = await redisService.get(cacheKey);
        
        if (cachedResult) {
          console.log('📦 AI scoring result loaded from cache');
          return cachedResult;
        }
      }

      console.log('=== DÉBUT ÉVALUATION IA ===');
      console.log('Question:', question.substring(0, 100) + '...');
      console.log('Réponse candidat:', candidateAnswer.substring(0, 200) + '...');
      console.log('Score max:', maxScore);
      
      if (!this.apiKey) {
        console.warn('AI API key not configured, using fallback scoring');
        return this.fallbackScoring(candidateAnswer, maxScore);
      }

      const prompt = `Tu es un évaluateur automatique. Tu dois répondre EXACTEMENT dans le format demandé.

QUESTION: ${question}
RÉPONSE: ${candidateAnswer}
SCORE_MAX: ${maxScore}

Évalue cette réponse selon ces critères :
- Exactitude technique
- Qualité du code/logique  
- Complétude de la réponse
- Clarté et structure

IMPORTANT: Tu DOIS répondre UNIQUEMENT dans ce format exact, sans aucun autre texte :
SCORE: [nombre entre 0 et ${maxScore}]
FEEDBACK: [explication en maximum 50 mots]

Ne pas ajouter d'introduction, de conclusion ou d'autre texte.`;

      console.log('=== ENVOI À L\'IA ===');
      console.log('Prompt envoyé:', prompt);

      const requestBody = {
        contents: [{
          parts: [{
            text: `Tu es un expert en évaluation de code et de réponses techniques. Tu dois donner des scores précis et justes.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.1,
          topP: 0.8,
          topK: 10
        }
      };

      console.log('Requête IA:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      console.log('=== RÉPONSE DE L\'IA ===');
      console.log('Réponse complète:', JSON.stringify(response.data, null, 2));
      
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      console.log('Texte de réponse IA:', aiResponse);
      
      const parsedResult = this.parseAIResponse(aiResponse, maxScore);
      console.log('Résultat parsé:', parsedResult);
      console.log('=== FIN ÉVALUATION IA ===\n');
      
      // Cache the result for 24 hours (only if Redis is connected)
      if (redisService.isConnected) {
        const cacheKey = redisService.constructor.keys.aiResult(`${question.substring(0, 50)}_${candidateAnswer.substring(0, 50)}`);
        await redisService.set(cacheKey, parsedResult, redisService.constructor.TTL.VERY_LONG);
        console.log('💾 AI result cached');
      }
      
      return parsedResult;

    } catch (error) {
      console.error('Erreur lors de l\'évaluation IA:', error.message);
      return this.fallbackScoring(candidateAnswer, maxScore);
    }
  }

  /**
   * Parse la réponse de l'IA pour extraire le score et le feedback
   * @param {string} aiResponse - Réponse brute de l'IA
   * @param {number} maxScore - Score maximum
   * @returns {{score: number, feedback: string}}
   */
  parseAIResponse(aiResponse, maxScore) {
    try {
      console.log('Réponse IA brute:', aiResponse);
      
      // Nettoyer la réponse en supprimant les espaces et retours à la ligne inutiles
      const cleanResponse = aiResponse.trim();
      
      // Extraire le score avec plusieurs patterns possibles
      const scorePatterns = [
        /SCORE:\s*(\d+)/i,
        /Score:\s*(\d+)/i,
        /score:\s*(\d+)/i,
        /(\d+)\s*\/\s*\d+/,  // Format "X/Y"
        /(\d+)\s*points?/i,   // Format "X points"
        /^(\d+)$/m            // Juste un nombre seul sur une ligne
      ];
      
      let score = null;
      for (const pattern of scorePatterns) {
        const match = cleanResponse.match(pattern);
        if (match) {
          score = parseInt(match[1]);
          break;
        }
      }
      
      // Si aucun score trouvé, chercher le premier nombre dans la réponse
      if (score === null) {
        const numberMatch = cleanResponse.match(/(\d+)/);
        if (numberMatch) {
          score = parseInt(numberMatch[1]);
        }
      }
      
      // Validation et limitation du score
      if (score === null || isNaN(score)) {
        console.warn('Aucun score valide trouvé dans la réponse IA, utilisation du fallback');
        return this.fallbackScoring('', maxScore);
      }
      
      score = Math.max(0, Math.min(score, maxScore));
      
      // Extraire le feedback
      const feedbackPatterns = [
        /FEEDBACK:\s*(.+)/is,
        /Feedback:\s*(.+)/is,
        /feedback:\s*(.+)/is,
        /Explication:\s*(.+)/is,
        /Justification:\s*(.+)/is
      ];
      
      let feedback = 'Évaluation automatique';
      for (const pattern of feedbackPatterns) {
        const match = cleanResponse.match(pattern);
        if (match) {
          feedback = match[1].trim();
          // Limiter la longueur du feedback
          if (feedback.length > 200) {
            feedback = feedback.substring(0, 200) + '...';
          }
          break;
        }
      }
      
      // Si pas de feedback structuré trouvé, prendre les premiers mots après le score
      if (feedback === 'Évaluation automatique') {
        const afterScore = cleanResponse.replace(/SCORE:\s*\d+/i, '').trim();
        if (afterScore.length > 0) {
          feedback = afterScore.substring(0, 150);
          if (afterScore.length > 150) feedback += '...';
        }
      }

      console.log(`Score extrait: ${score}/${maxScore}, Feedback: ${feedback}`);
      return { score, feedback };
      
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse IA:', error);
      return this.fallbackScoring('', maxScore);
    }
  }

  /**
   * Système de notation de secours si l'IA n'est pas disponible
   * @param {string} answer - Réponse du candidat
   * @param {number} maxScore - Score maximum
   * @returns {{score: number, feedback: string}}
   */
  fallbackScoring(answer, maxScore) {
    if (!answer || answer.trim().length === 0) {
      return { score: 0, feedback: 'Aucune réponse fournie' };
    }

    // Scoring basique basé sur la longueur et la présence de mots-clés
    const answerLength = answer.trim().length;
    let score = 0;

    if (answerLength > 10) score += Math.floor(maxScore * 0.3); // 30% pour avoir écrit quelque chose
    if (answerLength > 50) score += Math.floor(maxScore * 0.2); // 20% pour une réponse substantielle
    if (answer.includes('function') || answer.includes('def') || answer.includes('class')) {
      score += Math.floor(maxScore * 0.3); // 30% pour du code structuré
    }
    if (answer.includes('return') || answer.includes('SELECT') || answer.includes('print')) {
      score += Math.floor(maxScore * 0.2); // 20% pour des instructions de retour/output
    }

    score = Math.min(score, maxScore);

    return { 
      score, 
      feedback: 'Évaluation automatique (IA non disponible)' 
    };
  }

  /**
   * Évalue plusieurs réponses en lot
   * @param {Array} submissions - Array d'objets {question, answer, maxScore}
   * @returns {Promise<Array>} - Array de résultats {score, feedback}
   */
  async scoreBatch(submissions) {
    const results = [];
    
    for (const submission of submissions) {
      const result = await this.scoreAnswer(
        submission.question, 
        submission.answer, 
        submission.maxScore
      );
      results.push(result);
      
      // Petit délai pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Fonction de test pour valider le parsing des réponses IA
   * @param {string} testResponse - Réponse de test à parser
   * @param {number} maxScore - Score maximum
   * @returns {{score: number, feedback: string}}
   */
  testParsing(testResponse, maxScore) {
    return this.parseAIResponse(testResponse, maxScore);
  }
}

module.exports = new AIScoringService();
