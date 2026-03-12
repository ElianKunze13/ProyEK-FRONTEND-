# FrontEnd Para Portofolio 

Este repositorio guarda el formato utilizado para la creacion de portafolio digital personal(curriculum), aplicando control de versionado e integracion de cambios mediante Git, utilizando estandares de buena convencion para definicion de commits y ramas.

---
## 🔗 Repositorios Relacionados

- **Backend:** [ProyEK-BACKEND](https://github.com/ElianKunze13/ProyEK-BACKEND-.git)

---

## Documentacion y prototipos
- Prototipo visual (frontend): https://xkfti.magicloops.app/
- Historias de usuario: https://trello.com/invite/b/6862e7dca5c65a1ac3e0c315/ATTId497b92eabe2acf4bfafb3734af59c6cC685978C/webpotafolio


--- 

## Implementacion de IA
Herramientas de inteligencia artificial implementadas:
- DeepSeek (sugerencias esteticas/visuales y de componentes)
- ChatGPT (sugerencias esteticas/visuales y de componentes)
- ClaudeIA (generacion estructura documentacion)
- GitHub Copilot (manejo de errores)
- MagicLoops (para prototipado visual de la web)


---

## 📂 Estructura del Repositorio
```
ProyEK-FRONTEND-/
|
├── 📁 public/                    # Recursos estáticos (imágenes, iconos, etc.)
├── 📁 src/                       
│   ├── 📁 app/                   
│   │   ├── 📁 Components/        # Componentes reutilizables donde se define formato y estilos
│   │   ├── 📁 Guards/            # Guards para protección de rutas
│   │   ├── 📁 Modelos/           # Modelos de datos (interfaces/enums)
│   │   ├── 📁 Servicios/         # Servicios para lógica de negocio y API
│   │   ├── (otros archivos) 
│   │   
│   │
│   └── 📁 environments/          # Configuraciones por entorno (development/production)
│
├── 📄 package.json               # Dependencias del proyecto 
├── 📄 angular.json              
├── 📄 tsconfig.json             
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
- This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.2 and SpringBoot.


