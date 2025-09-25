# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-25

### Added
- Updated domain configuration to use `codingame.academy.alenia.io` pattern
- Added version display on login page (now shows "Version: 1.1.0")
- Created development-specific Docker configuration for easier local development

### Changed
- Updated environment variables for proper version handling in both development and production
- Modified Portainer stack configuration to use the new domain pattern
- Updated Docker Compose production configuration with correct domain names
- Improved frontend development workflow with React development server

### Fixed
- Resolved container startup issues with MySQL due to missing environment variables
- Fixed SSL certificate errors when frontend tried to connect to production domain instead of localhost
- Resolved 404 errors in AdminDashboard due to incorrect API endpoint usage
- Fixed TypeError in AdminDashboard due to missing `users` object in API service
- Resolved 500 Internal Server Errors due to non-existent `status` column in database queries
- Fixed 500 Internal Server Errors in candidate portal due to missing database tables and columns

## [1.0.0] - 2024-06-15

### Added
- Initial release of the Coding Platform
- Complete programming skills assessment platform with multi-language support (JavaScript, Python, SQL)
- Modern React frontend with Tailwind CSS
- Complete REST API with Node.js and Express
- JWT authentication with role-based access control
- Secure code execution in isolated containers
- MySQL database for persistence
- Redis cache for sessions
- Docker-based architecture for easy deployment