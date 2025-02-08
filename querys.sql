    CREATE TABLE usuarios (
        id_usuario SERIAL PRIMARY KEY,
        cedula VARCHAR(11) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100),
        telefono VARCHAR(20),
        nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
        contraseña TEXT NOT NULL,
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