/* Replace with your SQL commands */
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `key` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

