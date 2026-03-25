flowchart TD

    %% ClientesV
    subgraph Clientes["📱 Clientes"]
        Web["🌐 Cliente Web (Angular SPA)"]
        Mobile["📱 Cliente Móvil (App Android / iOS)"]
    end

    %% Backend
    subgraph Backend["⚙️ Servidor Backend (Node.js)"]
        Node["🟩 Node.js Runtime"]
        API["🟢 API REST (Express.js)"]
        Swagger["📄 Swagger UI (/api-docs)"]

        Node --> API
        Node --> Swagger
    end

    %% Base de datos
    subgraph Neon["☁️ Infraestructura Base de Datos (Neon)"]
        Postgres[("🐘 PostgreSQL")]
    end

    Dev["👨‍💻 Desarrollador / QA"]

    %% Conexiones
    Web -- "HTTP/REST (JSON)" --> API
    Mobile -- "HTTP/REST (JSON)" --> API
    Dev -- "HTTP (documentación API)" --> Swagger
    API -- "Consultas SQL / Pool de conexión" --> Postgres