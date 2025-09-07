-- Base de données : coding_platform

-- Table des utilisateurs (recruteurs, candidats)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('recruiter', 'candidate') NOT NULL,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des évaluations (tests)
CREATE TABLE IF NOT EXISTS `assessments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `language` VARCHAR(50) NOT NULL, -- ex: 'javascript', 'python'
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
  `created_by` INT NOT NULL, -- ID du recruteur
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des questions
CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `language` ENUM('javascript', 'python', 'java', 'sql') NOT NULL,
  `template_code` TEXT, -- Code de démarrage pour le candidat
  `time_limit` INT DEFAULT 60, -- en minutes
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `difficulty` ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
  `points` INT DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des soumissions de code
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `assessment_id` INT NOT NULL,
  `code` TEXT NOT NULL,
  `language` VARCHAR(50) NOT NULL,
  `results` JSON, -- Stockage des résultats des tests
  `score` FLOAT, -- Score obtenu
  `status` ENUM('pending', 'running', 'completed', 'error') NOT NULL,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les invitations aux tests
CREATE TABLE IF NOT EXISTS `invitations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessment_id` INT NOT NULL,
  `candidate_email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE, -- Token unique pour l'invitation
  `status` ENUM('pending', 'completed') DEFAULT 'pending',
  `expires_at` TIMESTAMP NOT NULL,
  `created_by` INT NOT NULL, -- ID du recruteur
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
