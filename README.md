# FrontEnd Para Portofolio 

Este repositorio guarda el formato utilizado para la creacion de un portafolio digital (curriculum), diseñado y creado aplicando modalidades de trabajo agil (Sprint y Scrum) que permiten mejorar el rendimiento a la hora de desarrollar.

Este se desarrollo aplicando control de versionado e integracion de cambios mediante Git, utilizando estandares de buena convencion para la definicion de commits y ramas de trabajo.


---
## 🔗 Repositorios Relacionados

- **Backend (API REST):** [ProyEK-BACKEND](https://github.com/ElianKunze13/ProyEK-BACKEND-.git)

---

## 🛠️ Herramientas implementadas
### Lenguajes
- **TypeScript v5.0** 
- **HTML** 
- **CSS** 

### Frameworks y Librerías 
*   [![Angular](https://img.shields.io/badge/Angular-19.1.2-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
*   [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
*   [![Font Awesome](https://img.shields.io/badge/Font_Awesome-6.5.0-528DD7?style=flat&logo=fontawesome&logoColor=white)](https://fontawesome.com/)


### Herramientas varias
*   [![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
*   [![npm](https://img.shields.io/badge/npm-9%2B-CB3837?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/)
---

## Documentacion y prototipos
- Prototipo visual (frontend): https://xkfti.magicloops.app/
- Gestión del proyecto (Trello): https://trello.com/invite/b/6862e7dca5c65a1ac3e0c315/ATTId497b92eabe2acf4bfafb3734af59c6cC685978C/webpotafolio


--- 

## Implementacion de IA
Herramientas de inteligencia artificial implementadas:
- DeepSeek (sugerencias esteticas/visuales y de componentes)
- ChatGPT (sugerencias esteticas/visuales y de componentes)
- ClaudeIA (generacion estructura documentacion)
- GitHub Copilot (manejo de errores)
- MagicLoops (para prototipado visual de la interfaz web)


---

## 📂 Estructura del Repositorio
```
ProyEK-FRONTEND-/
|
├── 📁 public/                    # Recursos estáticos (imágenes, iconos, etc.)
├── 📁 src/                       
│   ├── 📁 app/                   
│   │   ├── 📁 Components/        # Componentes reutilizables donde se define formato y estilos (HTML, TS, CSS)
│   │   ├── 📁 Guards/            # Guards para protección de rutas
│   │   ├── 📁 Modelos/           # Modelos de datos (interfaces/enums)
│   │   ├── 📁 Servicios/         # Servicios para lógica de negocio y API
│   │   ├── (otros archivos) 
│   │   
│   │
│   └── 📁 environments/          # Configuraciones por entorno (development/production)
│
├── 📄 package.json               # Dependencias del proyecto 
├── 📄 angular.json               # Configuración del workspace de Angular
├── 📄 tsconfig.json              # Configuración base de TypeScript
└── 📄 README.md                  # Archivo actual (presentación/documentación)
```

---

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (`npm install -g @angular/cli`)

### Instalación

1. **Clonar el repositorio:**
```bash
   git clone https://github.com/tu-usuario/ProyEK-FRONTEND-.git
   cd ProyEK-FRONTEND-
```

2. **Instalar dependencias:**
```bash
   npm install
```

3. **Configurar variables de entorno:**
   - Este proyecto utiliza archivos de entorno para manejar configuraciones como la URL de la API.
   - Edita los archivos en `src/environments/` según tu configuración (URLs de API, etc.)

4. **Ejecutar en modo desarrollo:**
```bash
   ng serve
```
   La aplicación estará disponible en `http://localhost:4200`

5. **Compilar para producción:**
```bash
   ng build --configuration production
```

---


## 📖 Licencias
- 'ESTE PROYECTO FUE CREADO CON FINES EDUCATIVOS Y PARA USO PERSONAL'



