-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla salidasalmacen.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Cliente` varchar(100) DEFAULT NULL,
  `Direccion` text DEFAULT NULL,
  `Contacto` varchar(100) DEFAULT NULL,
  `Numero` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cliente` (`Cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla salidasalmacen.folio
CREATE TABLE IF NOT EXISTS `folio` (
  `Folio` int(11) NOT NULL AUTO_INCREMENT,
  `Usuario_id` int(11) DEFAULT NULL,
  `Fecha` datetime NOT NULL,
  PRIMARY KEY (`Folio`) USING BTREE,
  KEY `Usuario_id` (`Usuario_id`),
  CONSTRAINT `Usuario_id` FOREIGN KEY (`Usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla salidasalmacen.materiales
CREATE TABLE IF NOT EXISTS `materiales` (
  `Folio` int(11) DEFAULT NULL,
  `Codigo` varchar(50) DEFAULT NULL,
  `Descripcion` text DEFAULT NULL,
  `Cantidad` varchar(100) DEFAULT NULL,
  `Um` varchar(4) DEFAULT NULL,
  `Observacion` text DEFAULT NULL,
  KEY `folioMaterial` (`Folio`),
  CONSTRAINT `folioMaterial` FOREIGN KEY (`Folio`) REFERENCES `folio` (`Folio`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla salidasalmacen.salidas
CREATE TABLE IF NOT EXISTS `salidas` (
  `Folio` int(11) DEFAULT NULL,
  `Usuario_id` int(11) DEFAULT NULL,
  `Chofer_nombre` varchar(100) DEFAULT NULL,
  `Cliente_nombre` varchar(50) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Atencion_a` varchar(100) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Numero_Pedido` varchar(50) DEFAULT NULL,
  `Quien_solicita` varchar(100) DEFAULT NULL,
  `Motivo_salida` text DEFAULT NULL,
  `Observaciones` text DEFAULT NULL,
  `Fecha` datetime DEFAULT NULL,
  KEY `folio` (`Folio`),
  KEY `usuario` (`Usuario_id`),
  CONSTRAINT `folio` FOREIGN KEY (`Folio`) REFERENCES `folio` (`Folio`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `usuario` FOREIGN KEY (`Usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla salidasalmacen.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Contrasena` varchar(100) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Correo` (`Correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
