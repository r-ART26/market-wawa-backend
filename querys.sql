CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    cedula VARCHAR(11) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasenia TEXT NOT NULL,
    rol VARCHAR(20) NOT NULL
);

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    id_proveedor INT,
    FOREIGN KEY (id_proveedor) 
        REFERENCES proveedores(id_proveedor) 
        ON DELETE CASCADE
);

CREATE TABLE cabecera_factura (
    id_factura SERIAL PRIMARY KEY,
    id_cliente INT,  
    id_usuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) 
        REFERENCES clientes(id_cliente) 
        ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE
);

CREATE TABLE detalle_factura (
    id_detalle SERIAL PRIMARY KEY,
    id_factura INT,
    id_producto INT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_factura) 
        REFERENCES cabecera_factura(id_factura) 
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto) 
        REFERENCES productos(id_producto) 
        ON DELETE CASCADE
);

-- Inserción de usuarios
INSERT INTO usuarios (cedula, nombre, apellido, telefono, nombre_usuario, contrasenia, rol) VALUES
('12345678901', 'Juan', 'Pérez', '0987654321', 'admin_juan', 'admin123', 'administrador'),
('23456789012', 'María', 'López', '0976543210', 'cajero_maria', 'cajero123', 'cajero'),
('34567890123', 'Carlos', 'Gómez', '0965432109', 'cajero_carlos', 'cajero456', 'cajero');

-- Inserción de clientes
INSERT INTO clientes (cedula, nombre, apellido, direccion, telefono, email) VALUES
('11122233344', 'Ana', 'Fernández', 'Calle 123', '0991112223', 'ana@mail.com'),
('22233344455', 'Luis', 'Martínez', 'Av. Central 45', '0982223334', 'luis@mail.com');

-- Inserción de proveedores
INSERT INTO proveedores (nombre, direccion, telefono, email) VALUES
('Distribuidora Alimentos', 'Av. Industrial 100', '0981112233', 'contacto@alimentos.com'),
('Snacks Express', 'Calle Comercio 50', '0972223344', 'ventas@snacksexpress.com'),
('Bazar Hogar', 'Av. Principal 200', '0963334455', 'info@bazarhogar.com');

-- Inserción de productos
INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor) VALUES
('Arroz 1kg', 'Bolsa de arroz de 1kg', 1.00, 1.50, 100, 1), 
('Aceite 1L', 'Aceite vegetal de 1 litro', 2.50, 3.50, 50, 1),
('Galletas Choco', 'Paquete de galletas de chocolate', 0.80, 1.20, 200, 2), 
('Papas Fritas', 'Bolsa de papas fritas 150g', 0.90, 1.50, 150, 2),
('Plato de Cerámica', 'Plato blanco de cerámica', 3.00, 5.00, 30, 3), 
('Taza de Café', 'Taza de cerámica para café', 2.00, 4.00, 40, 3);

-- Inserción de cabeceras de factura
INSERT INTO cabecera_factura (id_cliente, id_usuario, total) VALUES
(1, 2, 5.20), 
(2, 3, 8.00); 

-- Inserción de detalles de factura
INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 1.50, 3.00), 
(1, 3, 2, 1.20, 2.40), 
(2, 2, 1, 3.50, 3.50), 
(2, 5, 1, 5.00, 5.00); 