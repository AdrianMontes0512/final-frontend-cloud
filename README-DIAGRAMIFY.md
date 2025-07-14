# Diagramify - Editor de Diagramas Profesional

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.x-green.svg)

Una herramienta moderna y profesional para crear diagramas de flujo, diagramas AWS, diagramas ER y más, con un editor de código estilo VS Code.

## 🚀 Características Principales

### 🎨 Interfaz Moderna
- **Landing Page Profesional** con hero section, características y demos
- **Sistema de Pestañas** elegante para navegación entre secciones
- **Modales Animados** para login y registro
- **Diseño Responsivo** que se adapta a cualquier pantalla

### 💻 Editor Avanzado
- **Editor de Código Tipo VS Code**:
  - Altura fija con scroll interno
  - Números de línea sincronizados
  - Sintaxis highlighting
  - Autocompletado y validación

### 📊 Tipos de Diagramas Soportados
1. **Diagramas de Flujo** - Procesos y workflows
2. **Diagramas AWS** - Arquitecturas cloud
3. **Diagramas ER** - Bases de datos relacionales
4. **Diagramas de Secuencia** - Interacciones temporales
5. **Diagramas de Clases** - Estructuras OOP
6. **Diagramas de Red** - Topologías de red

### 🛠️ Funcionalidades del Editor

#### Entrada de Datos
- **Múltiples Formatos**: JSON, YAML, Texto plano
- **Carga desde Archivos**: Soporte para .txt, .json, .yaml, .yml
- **Carga desde GitHub**: URL directa a archivos de repositorios
- **Validación en Tiempo Real**: Verificación de sintaxis y contenido

#### Generación y Visualización
- **Generación Bajo Demanda**: Los diagramas solo se muestran al presionar "Generar"
- **Vista Previa Interactiva**: Visualización inmediata del resultado
- **Múltiples Estilos**: Cada tipo de diagrama tiene su formato específico

#### Exportación
- **Formato TXT**: Disponible inmediatamente
- **Formato SVG**: Próximamente (preparado para implementación)
- **Formato PNG**: Próximamente (preparado para implementación)
- **Formato PDF**: Próximamente (preparado para implementación)

### 🔧 Características Técnicas
- **Estado Persistente**: Mantiene el código entre navegaciones
- **Sincronización Visual**: Números de línea perfectamente alineados
- **Validación Inteligente**: Verificación de contenido antes de generar
- **Manejo de Errores**: Mensajes claros y útiles para el usuario

## 🚦 Cómo Usar

### 1. Inicio Rápido
```bash
npm install
npm run dev
```

### 2. Usando el Editor

1. **Selecciona el Tipo de Diagrama**:
   - Usa el dropdown para elegir entre Flujo, AWS, ER, etc.

2. **Escribe o Carga tu Código**:
   - Escribe directamente en el editor
   - Sube un archivo con el botón "Subir"
   - Carga desde GitHub con el botón "GitHub"

3. **Genera el Diagrama**:
   - Presiona "Generar" cuando tengas el código listo
   - El diagrama aparecerá en el panel derecho

4. **Exporta tu Trabajo**:
   - Usa el botón "Exportar" para descargar el diagrama

### 3. Formatos de Entrada Soportados

#### JSON (Recomendado)
```json
{
  "proceso": "Sistema de Login",
  "pasos": [
    {
      "id": 1,
      "accion": "Usuario ingresa credenciales",
      "tipo": "input"
    },
    {
      "id": 2,
      "accion": "Validar credenciales",
      "tipo": "proceso"
    }
  ]
}
```

#### YAML
```yaml
proceso: Sistema de Login
pasos:
  - id: 1
    accion: Usuario ingresa credenciales
    tipo: input
  - id: 2
    accion: Validar credenciales
    tipo: proceso
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   └── DiagramEditor.tsx     # Editor principal
├── pages/
│   ├── face.tsx             # Landing page
│   └── mainPage.tsx         # Página principal con pestañas
├── services/
│   └── auth.ts              # Servicios de autenticación
├── utilities/
│   └── ProtectedRoute.tsx   # Rutas protegidas
└── assets/                  # Recursos estáticos
```

## 🎯 Funcionalidades Implementadas

### ✅ Completado
- [x] Landing page profesional
- [x] Sistema de pestañas navegable
- [x] Editor de código estilo VS Code
- [x] Números de línea sincronizados
- [x] Múltiples tipos de diagrama
- [x] Validación de entrada
- [x] Carga desde archivos locales
- [x] Carga desde URLs de GitHub
- [x] Exportación básica (TXT)
- [x] Generación bajo demanda
- [x] Interfaz responsive

### 🔄 En Desarrollo
- [ ] Exportación avanzada (SVG, PNG, PDF)
- [ ] Generación de diagramas visuales reales
- [ ] Integración con APIs de terceros
- [ ] Sistema de templates
- [ ] Colaboración en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📝 Notas de Desarrollo

### Estructura del Editor
El componente `DiagramEditor` es el corazón de la aplicación:
- Maneja el estado del código y configuración
- Implementa la sincronización de scroll
- Gestiona la generación y exportación
- Controla la validación de entrada

### Sistema de Validación
```typescript
const validateCode = (code: string): string | null => {
  if (!code.trim()) return 'El código no puede estar vacío';
  if (code.trim().length < 10) return 'El código debe tener al menos 10 caracteres';
  return null;
};
```

### Carga desde GitHub
La función `loadFromGithub` convierte URLs de GitHub a URLs raw automáticamente:
```typescript
let rawUrl = githubUrl
  .replace('github.com', 'raw.githubusercontent.com')
  .replace('/blob/', '/');
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la branch (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ para crear diagramas de forma profesional y eficiente.
