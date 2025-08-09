-- Script de migration sécurisé qui vérifie l'existence des colonnes

-- Procédure pour ajouter une colonne seulement si elle n'existe pas
DELIMITER //
CREATE PROCEDURE AddColumnIfNotExists(
    IN tableName VARCHAR(100),
    IN columnName VARCHAR(100),
    IN columnDefinition TEXT
)
BEGIN
    DECLARE columnExists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO columnExists
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = tableName
    AND COLUMN_NAME = columnName;
    
    IF columnExists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD COLUMN `', columnName, '` ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

-- Ajout sécurisé des colonnes pour questions
CALL AddColumnIfNotExists('questions', 'time_limit', 'INT DEFAULT 30 COMMENT \'Temps limite en minutes\'');
CALL AddColumnIfNotExists('questions', 'language', 'VARCHAR(50) NOT NULL DEFAULT \'javascript\' COMMENT \'Langage requis\'');
CALL AddColumnIfNotExists('questions', 'difficulty', 'ENUM(\'easy\', \'medium\', \'hard\') DEFAULT \'medium\'');
CALL AddColumnIfNotExists('questions', 'points', 'INT DEFAULT 100 COMMENT \'Points attribués\'');

-- Ajout sécurisé des colonnes pour assessments
CALL AddColumnIfNotExists('assessments', 'total_time', 'INT DEFAULT 90 COMMENT \'Temps total en minutes\'');
CALL AddColumnIfNotExists('assessments', 'passing_score', 'INT DEFAULT 70 COMMENT \'Score minimum %\'');
CALL AddColumnIfNotExists('assessments', 'is_active', 'BOOLEAN DEFAULT TRUE');

-- Ajout sécurisé des colonnes pour users
CALL AddColumnIfNotExists('users', 'phone', 'VARCHAR(20)');
CALL AddColumnIfNotExists('users', 'company', 'VARCHAR(255)');
CALL AddColumnIfNotExists('users', 'position', 'VARCHAR(255)');
CALL AddColumnIfNotExists('users', 'experience_years', 'INT');
CALL AddColumnIfNotExists('users', 'skills', 'JSON COMMENT \'Liste des compétences\'');
CALL AddColumnIfNotExists('users', 'resume_url', 'VARCHAR(500)');
CALL AddColumnIfNotExists('users', 'linkedin_url', 'VARCHAR(500)');
CALL AddColumnIfNotExists('users', 'github_url', 'VARCHAR(500)');
CALL AddColumnIfNotExists('users', 'notes', 'TEXT COMMENT \'Notes du recruteur\'');
CALL AddColumnIfNotExists('users', 'status', 'ENUM(\'active\', \'inactive\', \'pending\') DEFAULT \'active\'');
CALL AddColumnIfNotExists('users', 'last_login', 'TIMESTAMP NULL');

-- Ajout sécurisé des colonnes pour submissions
CALL AddColumnIfNotExists('submissions', 'execution_time', 'INT COMMENT \'Temps d\'exécution en ms\'');
CALL AddColumnIfNotExists('submissions', 'memory_used', 'VARCHAR(20) COMMENT \'Mémoire utilisée\'');
CALL AddColumnIfNotExists('submissions', 'error_message', 'TEXT');
CALL AddColumnIfNotExists('submissions', 'executed_at', 'TIMESTAMP NULL');

-- Création des nouvelles tables si elles n'existent pas
CREATE TABLE IF NOT EXISTS `test_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,
  `test_case_index` INT NOT NULL,
  `input` TEXT,
  `expected_output` TEXT,
  `actual_output` TEXT,
  `passed` BOOLEAN DEFAULT FALSE,
  `execution_time` INT COMMENT 'Temps en ms',
  `error_message` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE,
  INDEX `idx_submission_test` (`submission_id`, `test_case_index`)
);

CREATE TABLE IF NOT EXISTS `candidate_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL COMMENT 'Action effectuée',
  `details` JSON COMMENT 'Détails de l\'action',
  `performed_by` INT NOT NULL COMMENT 'ID du recruteur',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`performed_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_candidate_history` (`candidate_id`, `created_at`)
);

-- Suppression de la procédure temporaire
DROP PROCEDURE AddColumnIfNotExists;
