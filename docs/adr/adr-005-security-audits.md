# ADR-005: Implementación de Auditorías de Seguridad

**Fecha:** 26 de julio de 2025  
**Estado:** Accepted

## Contexto

El sistema de auditorías de seguridad requiere implementar diferentes tipos de escaneos especializados, cada uno con herramientas y librerías específicas. La decisión sobre qué tecnologías utilizar para cada tipo de auditoría debe considerar:

1. **Madurez del ecosistema**: Disponibilidad de herramientas robustas y bien mantenidas
2. **Especialización por dominio**: Algunas herramientas son más efectivas en ciertos lenguajes
3. **Flexibilidad de implementación**: Capacidad de elegir la mejor herramienta para cada tarea
4. **Mantenibilidad**: Facilidad de actualización y soporte a largo plazo

### Herramientas evaluadas por categoría

#### Escaneo de puertos y servicios

- **Python**: `python-nmap` - Wrapper maduro para Nmap con excelente funcionalidad
- **Node.js**: Librerías nativas de networking, menos especializadas para escaneo de puertos

#### Análisis de dependencias y vulnerabilidades

- **Python**: `pip-audit` - Herramienta oficial para auditar dependencias Python
- **Node.js**: `npm audit`, `osv-scanner` - Herramientas nativas y especializadas del ecosistema

### Arquitectura de contenedores

Cada auditoría se ejecuta en contenedores efímeros especializados, orquestados por el servidor GraphQL principal. La organización de scripts debe facilitar el mantenimiento y la escalabilidad del sistema.

## Decisión

**Implementamos auditorías de seguridad utilizando tanto Python como Node.js, eligiendo el lenguaje más apropiado para cada tipo de escaneo según la madurez y especialización de las herramientas disponibles.**

### Estructura de implementación

```text
packages/backend/tasks/
├── python/
│   ├── requirements.txt          # Dependencias Python
│   ├── port-scan.py             # Escaneo de puertos con python-nmap
│   ├── python-deps-audit.py     # Auditoría de dependencias Python con pip-audit
│   └── config-audit.py          # Auditorías de configuración
└── node/
    ├── package.json             # Dependencias Node.js
    ├── dependency-scan.js       # Análisis con osv-scanner y npm audit
    ├── js-deps-audit.js         # Auditoría de dependencias JavaScript
    └── network-scan.js          # Escaneos de red con librerías nativas
```

### Distribución de responsabilidades

#### Scripts Python (`packages/backend/tasks/python/`)

- **Escaneo de puertos**: `python-nmap` para escaneos de red y servicios
- **Auditoría de dependencias Python**: `pip-audit` para proyectos Python
- **Auditorías de configuración**: Scripts especializados usando librerías Python

**Ejemplo de implementación**:

```python
# port-scan.py
import nmap
import json
import sys

def scan_ports(target, ports="1-1000"):
    nm = nmap.PortScanner()
    result = nm.scan(target, ports)
    return {
        "target": target,
        "scan_info": result["scan"],
        "hosts": dict(result["scan"])
    }

if __name__ == "__main__":
    target = sys.argv[1]
    result = scan_ports(target)
    print(json.dumps(result))
```

#### Scripts Node.js (`packages/backend/tasks/node/`)

- **Análisis de vulnerabilidades**: `osv-scanner` para detección de CVEs
- **Auditoría npm**: `npm audit` para proyectos JavaScript/TypeScript
- **Escaneos de red**: Implementaciones nativas con librerías Node.js

**Ejemplo de implementación**:

```javascript
// dependency-scan.js
const { execSync } = require('child_process');
const fs = require('fs');

function scanDependencies(projectPath) {
    try {
        const osvResult = execSync(`osv-scanner --format json ${projectPath}`, { encoding: 'utf8' });
        const npmResult = execSync(`npm audit --json`, { cwd: projectPath, encoding: 'utf8' });
        
        return {
            osv_scan: JSON.parse(osvResult),
            npm_audit: JSON.parse(npmResult),
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return { error: error.message };
    }
}

const projectPath = process.argv[2];
console.log(JSON.stringify(scanDependencies(projectPath)));
```

### Orquestación GraphQL

El servidor GraphQL gestiona la ejecución de ambos tipos de scripts:

```graphql
type Mutation {
  startPortScan(target: String!): AuditJob!
  startDependencyScan(projectPath: String!, language: AuditLanguage!): AuditJob!
  startConfigAudit(configType: ConfigType!): AuditJob!
}

enum AuditLanguage {
  PYTHON
  NODE
}
```

## Consecuencias

### Positivas

- **Aprovechar ecosistemas maduros**: Uso de las mejores herramientas de cada lenguaje
- **Especialización por dominio**: Python para network scanning, Node.js para análisis JavaScript
- **Flexibilidad de implementación**: Libertad para elegir la herramienta más adecuada
- **Reutilización de expertise**: Aprovechamiento de conocimiento existente en ambos ecosistemas
- **Escalabilidad independiente**: Cada tipo de auditoría puede evolucionar independientemente
- **Compatibilidad nativa**: Herramientas diseñadas específicamente para cada plataforma

### Negativas

- **Gestión de entornos Docker distintos**: Necesidad de mantener imágenes especializadas
- **Complejidad de dependencias**: Gestión separada de requirements.txt y package.json
- **Overhead de orquestación**: Mayor complejidad en el manejo de diferentes runtimes
- **Duplicación de lógica**: Posible repetición de funcionalidades entre implementaciones
- **Debugging complejo**: Diferentes herramientas y entornos de depuración
- **Mantenimiento dual**: Actualizaciones y parches en dos ecosistemas diferentes

### Mitigaciones

- **Containerización estandarizada**: Docker images optimizadas para cada runtime
- **Interfaz unificada**: API GraphQL que abstrae las diferencias de implementación
- **Logging centralizado**: Sistema único de logs independiente del lenguaje de implementación
- **Testing automatizado**: Suite de pruebas que valida ambos tipos de scripts
- **Documentación clara**: Guías específicas para cada tipo de implementación
- **Monitoreo unificado**: Métricas y alertas independientes del runtime utilizado

---

## Summary

### Multi-Language Security Audit Implementation

**Decision**: Implement security audits using both Python and Node.js, selecting the most appropriate language and tools for each specific audit type based on ecosystem maturity and specialization.

**Implementation Strategy**: Scripts are organized under `packages/backend/tasks/python/` and `packages/backend/tasks/node/`, with each directory containing specialized tools and dependencies for their respective ecosystems. All scripts are executed in short-lived containers orchestrated by the GraphQL server.

**Technology Distribution**:

- **Python tools**: `python-nmap` for port scanning, `pip-audit` for Python dependency analysis, specialized configuration audit scripts
- **Node.js tools**: `osv-scanner` for vulnerability detection, `npm audit` for JavaScript dependency analysis, native networking libraries

**Key Advantages**:

- **Ecosystem leverage**: Utilizes the best tools from both Python and Node.js communities
- **Domain specialization**: Python excels in network scanning and security tools, Node.js in JavaScript ecosystem analysis
- **Implementation flexibility**: Freedom to choose the most appropriate tool for each specific audit task
- **Mature tooling**: Access to well-established, actively maintained security libraries in both ecosystems

**Key Challenges**:

- **Multi-environment management**: Need to maintain separate Docker environments for Python and Node.js runtimes
- **Orchestration complexity**: Managing different execution environments and dependency systems
- **Dual maintenance**: Keeping both Python and Node.js dependencies updated and secure

**Rationale**: This hybrid approach maximizes the effectiveness of security audits by leveraging the strengths of each ecosystem. Python's mature security and networking libraries complement Node.js's native JavaScript analysis capabilities, providing comprehensive coverage while maintaining the flexibility to adopt the best tools for each specific audit type.
