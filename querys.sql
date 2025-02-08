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
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    id_proveedor INT,
    FOREIGN KEY (id_proveedor) 
        REFERENCES proveedores(id_proveedor) 
        ON DELETE CASCADE
);

-- Crear la tabla de cabecera de factura, que depende de personas
CREATE TABLE cabecera_factura (
    id_factura SERIAL PRIMARY KEY,
    id_persona INT,  -- Primero defines la columna
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    -- Luego defines la clave foránea con ON DELETE CASCADE
    FOREIGN KEY (id_persona) 
        REFERENCES personas(id_persona) 
        ON DELETE CASCADE
);

-- Crear la tabla de detalle de factura, que depende de cabecera_factura y productos
CREATE TABLE detalle_factura (
    id_detalle SERIAL PRIMARY KEY,
    id_factura INT,
    id_producto INT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    -- Definición de claves foráneas al final
    FOREIGN KEY (id_factura) 
        REFERENCES cabecera_factura(id_factura) 
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto) 
        REFERENCES productos(id_producto) 
        ON DELETE CASCADE
);