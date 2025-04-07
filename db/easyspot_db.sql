-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-04-2025 a las 22:39:06
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `easyspot_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Event`
--

CREATE TABLE `Event` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `venueId` int(11) DEFAULT NULL,
  `dateTime` datetime(3) NOT NULL,
  `city` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `availableTickets` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `poster` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Event`
--

INSERT INTO `Event` (`id`, `title`, `venueId`, `dateTime`, `city`, `price`, `availableTickets`, `description`, `poster`) VALUES
(2, 'Blink 182 – Enema of the State Pop Punk Tour', 2, '2025-04-30 20:00:00.000', 'Barcelona', 27.00, 200, 'Blink 182 se presenta en la Enema of the State Pop Punk Tour, interpretando su clásico álbum en un directo lleno de energía punk y nostalgia de los 90.', 'https://i.scdn.co/image/ab67616d0000b2736da502e35a7a3e48de2b0f74'),
(3, 'C. Tangana – El Madrileño Fusion Fiesta Tour', 3, '2025-04-29 20:00:00.000', 'Barcelona', 30.00, 195, 'C. Tangana encabeza la El Madrileño Fusion Fiesta Tour, presentando su icónico álbum \'El Madrileño\' en un directo que fusiona flamenco, rumba y trap con un ambiente espectacular.', 'https://i.scdn.co/image/ab67616d0000b273a408c78e231f716383a58eb3'),
(4, 'Yung Beef – Andromicfms Trap Vibe Tour', 4, '2025-04-28 20:00:00.000', 'Bilbao', 20.00, 200, 'Yung Beef se presenta en la Andromicfms Trap Vibe Tour para interpretar su álbum \'Andromicfms 4\', un directo lleno de energía urbana.', 'https://i.scdn.co/image/ab67616d0000b273a224026a114983ddba9525b2'),
(5, 'Joy Orbison – Still Slippin Vol. 1 House Tour', 5, '2025-04-27 20:00:00.000', 'Madrid', 24.00, 198, 'Joy Orbison presenta \'Still Slippin Vol. 1\' en la Still Slippin House Tour, una experiencia en directo que fusiona ritmos house y electrónica experimental.', 'https://i.scdn.co/image/ab67616d0000b273966e75adbd78c77fa9e359b2'),
(6, 'DJ Shadow – Action Adventure Cinematic Tour', 6, '2025-04-26 20:00:00.000', 'Barcelona', 27.00, 200, 'DJ Shadow presenta \'Action Adventure\' en la Action Adventure Cinematic Tour, un directo instrumental con atmósferas cinematográficas y electrónicas.', 'https://i.scdn.co/image/ab67616d0000b27334c8920faf316228bcc18eb1'),
(7, 'Los Punsetes – Que le den por culo Tour', 7, '2025-04-25 20:00:00.000', 'Bilbao', 21.00, 200, 'Los Punsetes se presentan en la Que le den por culo Tour, ofreciendo un directo irreverente y lleno de actitud punk.', 'https://i.scdn.co/image/ab67616d0000b273e9a7a8a90703137902ed3a0d'),
(8, 'Sexy Zebras – Calle Liberación Punk Revolution Tour', 8, '2025-04-24 20:00:00.000', 'Madrid', 25.00, 200, 'Sexy Zebras presenta \'Calle Liberación\' en la Calle Liberación Punk Revolution Tour, un directo explosivo que fusiona punk con energía callejera.', 'https://i.scdn.co/image/ab67616d0000b2730ace22d5804bff60e44313fb'),
(9, 'Alcalá Norte – Alcalá Norte Urban Beats Tour', 9, '2025-04-23 20:00:00.000', 'Bilbao', 21.00, 200, 'Alcalá Norte presentará su álbum homónimo en la Alcalá Norte Urban Beats Tour, un directo lleno de ritmos urbanos y un toque indie inconfundible.', 'https://i.scdn.co/image/ab67616d0000b273595e1bf8555752b5c6479ac6'),
(10, 'Carlangas – Carlangas Intimate Tour', 10, '2025-04-22 20:00:00.000', 'Madrid', 23.00, 200, 'Carlangas se presenta en la Carlangas Intimate Tour, ofreciendo un directo íntimo y personal en el que se destacan los matices del folk.', 'https://i.scdn.co/image/ab67616d0000b27385c7de284967303f77897473'),
(11, 'Carolina Durante – Elige Tu Propia Aventura Adventure Tour', 11, '2025-04-21 20:00:00.000', 'Madrid', 23.00, 200, 'Carolina Durante presentará \'Elige Tu Propia Aventura\' en la Adventure Tour, un directo que mezcla punk-pop con una actitud irreverente.', 'https://i.scdn.co/image/ab67616d0000b2731fbe9ca7f0de7b7c7713654b');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Order`
--

CREATE TABLE `Order` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `totalAmount` decimal(10,2) NOT NULL,
  `status` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Order`
--

INSERT INTO `Order` (`id`, `userId`, `createdAt`, `totalAmount`, `status`) VALUES
(1, NULL, '2025-03-23 16:24:52.948', 30.00, 'paid'),
(2, NULL, '2025-03-23 16:27:59.193', 30.00, 'paid'),
(3, NULL, '2025-03-23 16:29:22.038', 30.00, 'paid'),
(4, NULL, '2025-03-23 16:32:35.720', 24.00, 'paid'),
(5, NULL, '2025-03-23 16:37:43.618', 24.00, 'paid'),
(6, NULL, '2025-03-23 16:39:22.096', 30.00, 'paid'),
(7, NULL, '2025-03-23 17:44:14.259', 30.00, 'paid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Payment`
--

CREATE TABLE `Payment` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `stripePaymentId` varchar(191) DEFAULT NULL,
  `paymentDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `paymentStatus` varchar(191) NOT NULL,
  `checkoutSessionId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Payment`
--

INSERT INTO `Payment` (`id`, `orderId`, `stripePaymentId`, `paymentDate`, `paymentStatus`, `checkoutSessionId`) VALUES
(7, 7, 'pi_3R5sZEP0qrySNBqk1G1bemy2', '2025-03-23 17:44:14.263', 'succeeded', 'cs_test_a17hpDEzpGJZQs0d3lfjZnR437j8pcu5hVvEqy4VMLBs1oTV0WjIzhBjuN');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Ticket`
--

CREATE TABLE `Ticket` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `eventId` int(11) DEFAULT NULL,
  `purchaseDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `qr` varchar(191) NOT NULL,
  `orderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Ticket`
--

INSERT INTO `Ticket` (`id`, `userId`, `eventId`, `purchaseDate`, `qr`, `orderId`) VALUES
(1, NULL, 3, '2025-03-23 16:24:52.964', '$XQ9PXXEBZ', 1),
(2, NULL, 3, '2025-03-23 16:27:59.201', '$HMK8LLKGQ', 2),
(3, NULL, 3, '2025-03-23 16:29:22.047', '$A1FXQQA73', 3),
(4, NULL, 5, '2025-03-23 16:32:35.729', '$E2BX406I6KFEKVX5TKVRSR3XG', 4),
(5, NULL, 5, '2025-03-23 16:37:43.630', '$JDKOJJW5W64ZJ45QTSJUM8MG9', 5),
(6, NULL, 3, '2025-03-23 16:39:22.109', '$3JD37LLRPS609S0X3IAZ3X1DW', 6),
(7, NULL, 3, '2025-03-23 17:44:14.268', '$WQ3SV85JQYCVA7KOQYDXM4VET', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `firebaseUid` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `displayName` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `User`
--

INSERT INTO `User` (`id`, `firebaseUid`, `email`, `displayName`, `createdAt`) VALUES
(1, 'RnpSUpc0IOR8Vy29ecwrKCuicuG2', 'enolgr@gmail.com', 'Enol González', '2025-03-23 15:06:34.241');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Venue`
--

CREATE TABLE `Venue` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `address` varchar(191) NOT NULL,
  `capacity` int(11) NOT NULL,
  `contactDetails` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Venue`
--

INSERT INTO `Venue` (`id`, `name`, `city`, `address`, `capacity`, `contactDetails`) VALUES
(1, 'Teatro Barceló', 'Madrid', 'C. de Barceló, 11, 28004 Madrid', 800, 'info@teatrobarcelo.com'),
(2, 'Palau de la Música Catalana', 'Barcelona', 'C. de Mallorca, 15, 08013 Barcelona', 1200, 'info@palaudelamusica.cat'),
(3, 'Palau de la Música Catalana', 'Barcelona', 'C. de Mallorca, 15, 08013 Barcelona', 1200, 'info@palaudelamusica.cat'),
(4, 'Sala Caracol', 'Bilbao', 'C. de San Vicente, 8, 48001 Bilbao', 500, 'info@sala-caracol.com'),
(5, 'Teatro Barceló', 'Madrid', 'C. de Barceló, 11, 28004 Madrid', 800, 'info@teatrobarcelo.com'),
(6, 'Palau de la Música Catalana', 'Barcelona', 'C. de Mallorca, 15, 08013 Barcelona', 1200, 'info@palaudelamusica.cat'),
(7, 'Sala Caracol', 'Bilbao', 'C. de San Vicente, 8, 48001 Bilbao', 500, 'info@sala-caracol.com'),
(8, 'Teatro Barceló', 'Madrid', 'C. de Barceló, 11, 28004 Madrid', 800, 'info@teatrobarcelo.com'),
(9, 'Sala Caracol', 'Bilbao', 'C. de San Vicente, 8, 48001 Bilbao', 500, 'info@sala-caracol.com'),
(10, 'Teatro Barceló', 'Madrid', 'C. de Barceló, 11, 28004 Madrid', 800, 'info@teatrobarcelo.com'),
(11, 'Teatro Barceló', 'Madrid', 'C. de Barceló, 11, 28004 Madrid', 800, 'info@teatrobarcelo.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('40f965e9-2dd6-40ad-a7eb-28af69945766', '5fe82a42adde8972a7a62177d56ccb3c7fe21ae6e3cf7a7f32aec664f3b7d7e4', NULL, '20250323160000_add_order_ticket_relation', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250323160000_add_order_ticket_relation\n\nDatabase error code: 1060\n\nDatabase error:\nDuplicate column name \'orderId\'\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20250323160000_add_order_ticket_relation\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20250323160000_add_order_ticket_relation\"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:225', NULL, '2025-03-30 18:44:00.941', 0),
('b1d4dc0a-c373-45ae-8925-7646a10d8a0d', 'fd1effabc9e68459e498ca120652b1222b7b7d32b7ace71906110feca5e3d0fe', '2025-03-23 14:31:14.340', '20250323143114_init', NULL, NULL, '2025-03-23 14:31:14.198', 1),
('bdb9d514-6b89-4853-8232-92360c858b9e', '10720f4a9b61aa7188d5ebb29fffb9d8e6ee47600fcdfcf9e3e4f172847a49de', '2025-03-23 15:16:13.730', '20250323151613_add_order_ticket_relation', NULL, NULL, '2025-03-23 15:16:13.690', 1),
('cd6f523a-83ba-48b0-b909-ca315f956c82', '0af6b06ccdaee7e74f41d2b4696161800644e6261233e5b18820f2eca57b51fd', '2025-03-23 15:32:21.274', '20250323153221_add_checkout_session_id', NULL, NULL, '2025-03-23 15:32:21.250', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Event`
--
ALTER TABLE `Event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Event_venueId_fkey` (`venueId`);

--
-- Indices de la tabla `Order`
--
ALTER TABLE `Order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indices de la tabla `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Payment_checkoutSessionId_key` (`checkoutSessionId`),
  ADD KEY `Payment_orderId_fkey` (`orderId`);

--
-- Indices de la tabla `Ticket`
--
ALTER TABLE `Ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Ticket_qr_key` (`qr`),
  ADD KEY `Ticket_userId_fkey` (`userId`),
  ADD KEY `Ticket_eventId_fkey` (`eventId`),
  ADD KEY `Ticket_orderId_fkey` (`orderId`);

--
-- Indices de la tabla `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_firebaseUid_key` (`firebaseUid`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indices de la tabla `Venue`
--
ALTER TABLE `Venue`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Event`
--
ALTER TABLE `Event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `Order`
--
ALTER TABLE `Order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Payment`
--
ALTER TABLE `Payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Ticket`
--
ALTER TABLE `Ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `Venue`
--
ALTER TABLE `Venue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Event`
--
ALTER TABLE `Event`
  ADD CONSTRAINT `Event_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `Order`
--
ALTER TABLE `Order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `Ticket`
--
ALTER TABLE `Ticket`
  ADD CONSTRAINT `Ticket_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Ticket_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
