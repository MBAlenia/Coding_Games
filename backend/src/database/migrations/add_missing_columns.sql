-- Ajout des colonnes manquantes pour une meilleure gestion

-- Ajout de colonnes pour les questions (une par une pour éviter les erreurs)
ALTER TABLE `questions` ADD COLUMN `time_limit` INT DEFAULT 30 COMMENT 'Temps limite en minutes';
ALTER TABLE `questions` ADD COLUMN `language` VARCHAR(50) NOT NULL DEFAULT 'javascript' COMMENT 'Langage requis pour cette question';
ALTER TABLE `questions` ADD COLUMN `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium';
ALTER TABLE `questions` ADD COLUMN `points` INT DEFAULT 100 COMMENT 'Points attribués pour cette question';

-- Ajout de colonnes pour les assessments
ALTER TABLE `assessments` ADD COLUMN `total_time` INT DEFAULT 90 COMMENT 'Temps total en minutes';
ALTER TABLE `assessments` ADD COLUMN `passing_score` INT DEFAULT 70 COMMENT 'Score minimum pour réussir en %';
ALTER TABLE `assessments` ADD COLUMN `is_active` BOOLEAN DEFAULT TRUE;

-- Ajout de colonnes pour les users (candidats)
ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(20);
ALTER TABLE `users` ADD COLUMN `company` VARCHAR(255);
ALTER TABLE `users` ADD COLUMN `position` VARCHAR(255);
ALTER TABLE `users` ADD COLUMN `experience_years` INT;
ALTER TABLE `users` ADD COLUMN `skills` JSON COMMENT 'Liste des compétences';
ALTER TABLE `users` ADD COLUMN `resume_url` VARCHAR(500);
ALTER TABLE `users` ADD COLUMN `linkedin_url` VARCHAR(500);
ALTER TABLE `users` ADD COLUMN `github_url` VARCHAR(500);
ALTER TABLE `users` ADD COLUMN `notes` TEXT COMMENT 'Notes du recruteur';
ALTER TABLE `users` ADD COLUMN `status` ENUM('active', 'inactive', 'pending') DEFAULT 'active';
ALTER TABLE `users` ADD COLUMN `last_login` TIMESTAMP NULL;

-- Ajout de colonnes pour les submissions
ALTER TABLE `submissions` ADD COLUMN `execution_time` INT COMMENT 'Temps d\'exécution en ms';
ALTER TABLE `submissions` ADD COLUMN `memory_used` VARCHAR(20) COMMENT 'Mémoire utilisée';
ALTER TABLE `submissions` ADD COLUMN `error_message` TEXT;
ALTER TABLE `submissions` ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `submissions` ADD COLUMN `executed_at` TIMESTAMP NULL;

-- Table pour stocker les résultats détaillés des tests
CREATE TABLE IF NOT EXISTS `test_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,
  `test_case_index` INT NOT NULL,
  `input` JSON,
  `expected_output` JSON,
  `actual_output` JSON,
  `passed` BOOLEAN DEFAULT FALSE,
  `execution_time` INT COMMENT 'Temps en ms',
  `error_message` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE,
  INDEX idx_submission_test (`submission_id`, `test_case_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour l'historique des candidats
CREATE TABLE IF NOT EXISTS `candidate_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` JSON,
  `performed_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`performed_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX idx_candidate_history (`candidate_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
