# Système d'Évaluation par IA

## Vue d'ensemble
Le système évalue automatiquement les réponses des candidats en utilisant l'IA (OpenAI GPT) et calcule le score moyen des questions répondues pour chaque assessment.

## Architecture

### Tables Utilisées
- **submissions** : Stocke les réponses des candidats avec leur score IA
- **questions** : Contient les questions avec `max_score` (score maximum)
- **assessment_questions** : Liaison many-to-many entre assessments et questions
- **candidate_invitations** : Statut et score final de l'assessment

### Flux d'Évaluation

#### 1. Soumission de Réponse
Quand un candidat soumet une réponse (`POST /api/submissions/:questionId`):
1. Création d'un enregistrement `submissions` avec statut "pending"
2. Envoi à l'IA avec le prompt : "Voici la question : [question] Voici la réponse : [réponse] D'après toi, combien de points vaut cette réponse sur [max_score] points ?"
3. Mise à jour avec le score IA et feedback dans `test_results`

#### 2. Calcul du Score Final
Le score final d'un assessment = **moyenne des pourcentages des questions répondues**
- Seules les questions avec soumissions sont comptées
- Formule : `(score_obtenu / max_score) * 100` par question
- Score final = moyenne de tous les pourcentages

#### 3. Timeout Automatique
Le système de timeout utilise ce calcul pour finaliser les assessments expirés.

## Configuration IA

### Variables d'Environnement
```env
GEMINI_API_KEY=your-gemini-api-key-here
AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
AI_MODEL=gemini-pro
```

### Système de Secours
Si l'IA n'est pas disponible, un système de notation basique est utilisé :
- 30% pour avoir écrit quelque chose
- 20% pour une réponse substantielle (>50 caractères)
- 30% pour du code structuré (mots-clés détectés)
- 20% pour des instructions de retour/output

## API Endpoints

### Pour Candidats
- `GET /api/assessments/:id/my-results` - Voir ses propres résultats détaillés

### Pour Soumissions
- `POST /api/submissions/:questionId` - Soumettre une réponse (évaluation IA automatique)
- `GET /api/submissions/:id` - Statut d'une soumission
- `GET /api/submissions` - Historique des soumissions

## Format des Données

### Réponse de Soumission
```json
{
  "message": "Code submitted and evaluated successfully",
  "submissionId": 123,
  "status": "passed",
  "score": 85.5,
  "maxScore": 100,
  "feedback": "Excellente solution, code propre et efficace"
}
```

### Résultats d'Assessment
```json
{
  "assessment": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "duration": 60
  },
  "results": {
    "totalQuestions": 5,
    "answeredQuestions": 3,
    "unansweredQuestions": 2,
    "averageScore": 78.33,
    "questionResults": [...]
  }
}
```

## Sécurité et Performance

### Gestion d'Erreurs
- Timeout de 30 secondes pour les appels IA
- Système de secours si l'IA échoue
- Logs détaillés pour le debugging

### Optimisations
- Délai de 100ms entre évaluations en lot
- Cache des résultats dans la base de données
- Évaluation asynchrone pour ne pas bloquer l'interface

## Tests
```bash
cd backend
npm install
node test-ai-scoring.js  # Test complet du système
```

Le système garantit une évaluation équitable et automatique des réponses candidats avec fallback en cas de problème IA.
