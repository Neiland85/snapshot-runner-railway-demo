# ADR-002: Contenedores Efímeros para Auditorías de Seguridad

**Fecha:** 26 de julio de 2025  
**Estado:** Accepted

## Contexto

Nuestro sistema de auditorías de seguridad requiere ejecutar múltiples tipos de escaneos independientes, incluyendo:

- Escaneos de puertos y servicios
- Análisis de dependencias y vulnerabilidades
- Auditorías de configuración de seguridad
- Verificaciones de cumplimiento

Cada tipo de escaneo tiene requisitos específicos de herramientas, configuración y recursos. La necesidad de aislamiento entre auditorías es crítica para:

1. **Prevenir interferencias**: Evitar que un escaneo afecte los resultados de otro
2. **Seguridad**: Aislar procesos potencialmente peligrosos o con privilegios elevados
3. **Escalabilidad**: Permitir ejecución paralela de múltiples auditorías
4. **Reproducibilidad**: Garantizar entornos consistentes para cada ejecución

El sistema se integra con Railway utilizando su API GraphQL nativa para la orquestación y gestión del ciclo de vida de los contenedores.

## Decisión

**Empleamos contenedores de corta duración que se crean y destruyen bajo demanda para cada auditoría de seguridad individual.**

### Arquitectura implementada

1. **Contenedores especializados**: Cada tipo de auditoría tiene su imagen de contenedor optimizada
2. **Orquestación centralizada**: El servidor principal gestiona el ciclo de vida completo de los contenedores
3. **API GraphQL**: Utilizamos la API nativa de Railway para triggerar y monitorear las ejecuciones
4. **Recolección de resultados**: El orquestador recopila y consolida los resultados de todas las auditorías

### Flujo de ejecución

```text
1. Solicitud de auditoría → API GraphQL
2. Creación de contenedor especializado
3. Ejecución aislada del escaneo
4. Recolección de resultados
5. Destrucción del contenedor
6. Consolidación y reporte
```

## Consecuencias

### Positivas

- **Aislamiento mejorado**: Cada auditoría ejecuta en un entorno completamente independiente
- **Seguridad reforzada**: Procesos maliciosos o comprometidos no pueden afectar otras auditorías
- **Escalabilidad horizontal**: Capacidad de ejecutar múltiples auditorías en paralelo
- **Reproducibilidad**: Entornos consistentes y predecibles para cada ejecución
- **Gestión de recursos**: Liberación automática de recursos al completar cada auditoría
- **Flexibilidad**: Diferentes configuraciones y herramientas por tipo de auditoría

### Negativas

- **Complejidad de orquestación**: Gestión del ciclo de vida de múltiples contenedores efímeros
- **Overhead de inicialización**: Tiempo adicional para crear y destruir contenedores
- **Gestión de concurrencia**: Necesidad de controlar el número de contenedores simultáneos
- **Monitoreo complejo**: Seguimiento de múltiples procesos distribuidos y temporales
- **Debugging dificultado**: Logs y estados efímeros complican la resolución de problemas

### Mitigaciones

- **Sistema de colas**: Implementar cola de trabajos para gestionar la concurrencia
- **Timeouts inteligentes**: Establecer límites de tiempo apropiados para cada tipo de auditoría
- **Logging centralizado**: Recopilar logs antes de la destrucción del contenedor
- **Monitoreo en tiempo real**: Dashboard para visualizar el estado de todas las auditorías activas
- **Límites de recursos**: Configurar restricciones de CPU/memoria por contenedor
- **Retry automático**: Mecanismo de reintentos para auditorías fallidas

---

## Summary

### Ephemeral Containers for Security Audit Isolation

**Decision**: Implement short-lived, on-demand containers for security audits, with each audit type (port scans, dependency analysis, etc.) running in complete isolation.

**Architecture**: A central orchestrator manages the lifecycle of specialized containers triggered via Railway's GraphQL API. Each container is created on-demand, executes a specific audit task, reports results back to the orchestrator, and is immediately destroyed.

**Key Benefits**:

- **Complete isolation**: Each audit runs in its own container environment, preventing interference between concurrent scans
- **Enhanced security**: Malicious or compromised processes cannot affect other audits or the main system
- **Horizontal scalability**: Multiple audits can run in parallel without resource conflicts
- **Reproducible environments**: Consistent, clean state for every audit execution

**Key Challenges**:

- **Orchestration complexity**: Managing lifecycle of multiple ephemeral containers requires sophisticated coordination
- **Concurrency management**: Need to control simultaneous container limits and resource allocation
- **Operational overhead**: Container creation/destruction adds latency compared to persistent processes

**Rationale**: The security and isolation benefits of ephemeral containers outweigh the operational complexity. This architecture ensures that each security audit operates in a pristine, isolated environment, preventing cross-contamination of results and enhancing overall system security posture.
