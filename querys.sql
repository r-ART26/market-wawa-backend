-- Crear la tabla de roles primero, ya que personas depende de ella
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Crear la tabla de personas, que incluye la clave foránea a roles
CREATE TABLE personas (
    id_persona SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    id_rol INT REFERENCES roles(id_rol) ON DELETE SET NULL
);

-- Crear la tabla de proveedores
CREATE TABLE proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

-- Crear la tabla de productos, que depende de proveedores
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10,2) NOT NULL, -- Precio al que el proveedor vende el producto
    precio_venta DECIMAL(10,2) NOT NULL, -- Precio al que se venderá al cliente
    stock INT NOT NULL CHECK (stock >= 0),
    id_proveedor INT REFERENCES proveedores(id_proveedor) ON DELETE SET NULL
);

-- Crear la tabla de cabecera de factura, que depende de personas
CREATE TABLE cabecera_factura (
    id_factura SERIAL PRIMARY KEY,
    id_persona INT REFERENCES personas(id_persona) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL
);

-- Crear la tabla de detalle de factura, que depende de cabecera_factura y productos
CREATE TABLE detalle_factura (
    id_detalle SERIAL PRIMARY KEY,
    id_factura INT REFERENCES cabecera_factura(id_factura) ON DELETE CASCADE,
    id_producto INT REFERENCES productos(id_producto) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);