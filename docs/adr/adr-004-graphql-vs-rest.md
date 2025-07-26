# ADR-004: GraphQL vs REST para Comunicación API

**Fecha:** 26 de julio de 2025  
**Estado:** Accepted

## Contexto

El proyecto requiere establecer una arquitectura de comunicación eficiente entre el frontend y backend, así como integración con servicios externos. Las opciones principales evaluadas fueron:

- **GraphQL**: Lenguaje de consulta y manipulación de datos para APIs
- **REST**: Arquitectura tradicional basada en recursos y métodos HTTP

### Factores considerados

Railway expone una API GraphQL nativa que simplifica significativamente la orquestación de servicios y gestión de contenedores efímeros. Esta característica influye directamente en la decisión arquitectónica del proyecto.

#### Evaluación de GraphQL

- **Integración nativa con Railway**: API GraphQL lista para usar
- **Consultas declarativas**: El cliente especifica exactamente qué datos necesita
- **Endpoint único**: Una sola URL para todas las operaciones
- **Tipado fuerte**: Schema bien definido y validación automática
- **Introspección**: Documentación automática y herramientas de desarrollo

#### Evaluación de REST

- **Madurez del ecosistema**: Amplia adopción y herramientas disponibles
- **Simplicidad conceptual**: Mapeo directo de recursos a endpoints
- **Cache HTTP estándar**: Aprovechamiento de cache de navegadores y CDNs
- **Stateless**: Cada request es independiente y autocontenido

### Casos de uso del proyecto

1. **Orquestación de auditorías**: Trigger y monitoreo de contenedores efímeros
2. **Gestión de resultados**: Consulta de datos de auditorías con filtros complejos
3. **Dashboard en tiempo real**: Actualizaciones live del estado de auditorías
4. **Integración con Railway**: Gestión del ciclo de vida de contenedores

## Decisión

**Adoptamos GraphQL para la comunicación frontend-backend utilizando Apollo Client, aprovechando la API GraphQL nativa de Railway.**

### Arquitectura implementada

#### Stack GraphQL

- **Backend**: Apollo Server + TypeScript para el schema y resolvers
- **Frontend**: Apollo Client + React para consultas declarativas
- **Integración**: Railway GraphQL API para orquestación de contenedores

#### Schema principal

```graphql
type Query {
  audits(filter: AuditFilter): [Audit!]!
  auditStatus(id: ID!): AuditStatus!
  containers: [Container!]!
}

type Mutation {
  startAudit(input: StartAuditInput!): Audit!
  stopAudit(id: ID!): Boolean!
}

type Subscription {
  auditUpdates(id: ID!): AuditStatus!
}
```

#### Beneficios implementados

1. **Consultas precisas**: Frontend solicita exactamente los datos necesarios
2. **Evitar múltiples endpoints**: Una sola URL para todas las operaciones
3. **Tipado end-to-end**: Consistencia desde schema hasta UI
4. **Subscriptions**: Updates en tiempo real para el dashboard

## Consecuencias

### Positivas

- **Integración seamless con Railway**: Aprovechamiento directo de la API nativa
- **Flexibilidad de consultas**: Clientes pueden solicitar datos específicos
- **Mejor performance**: Reducción de over-fetching y under-fetching
- **Documentación automática**: Schema como fuente de verdad
- **Tipado fuerte**: Detección temprana de errores en desarrollo
- **Cache inteligente**: Apollo Client optimiza automáticamente las consultas
- **Subscriptions**: Actualizaciones en tiempo real sin polling

### Negativas

- **Curva de aprendizaje**: Necesidad de dominar diseño de schemas y resolvers
- **Dependencia de Railway**: Acoplamiento con la API GraphQL de Railway
- **Complejidad de cache**: Cache de GraphQL más complejo que HTTP cache
- **Debugging**: Herramientas de debug diferentes a REST tradicional
- **Overhead inicial**: Setup más complejo comparado con REST simple
- **N+1 queries**: Riesgo de problemas de performance en resolvers mal diseñados

### Mitigaciones

- **Training y documentación**: Guías internas para schema design y best practices
- **DataLoader pattern**: Implementación para resolver N+1 query problems
- **Monitoring GraphQL**: Herramientas específicas para monitorear performance
- **Abstraction layer**: Interfaces que permitan migración futura si es necesario
- **Error handling**: Estrategias robustas para manejo de errores GraphQL
- **Schema governance**: Procesos para evolución controlada del schema

---

## Summary

### GraphQL over REST for API Communication

**Decision**: Adopt GraphQL for frontend-backend communication using Apollo Client, leveraging Railway's native GraphQL API for service orchestration.

**Context**: Railway provides a native GraphQL API that significantly simplifies container orchestration and service management. The project evaluated GraphQL versus traditional REST architecture for both internal communication and external service integration.

**Key Advantages of GraphQL**:

- **Native Railway integration**: Direct utilization of Railway's GraphQL API without additional abstraction layers
- **Declarative queries**: Frontend specifies exactly what data is needed, reducing over-fetching
- **Single endpoint**: One URL for all operations instead of multiple REST endpoints
- **Strong typing**: End-to-end type safety from schema to UI components
- **Real-time capabilities**: Built-in subscriptions for live dashboard updates
- **Intelligent caching**: Apollo Client automatically optimizes query caching

**Key Challenges**:

- **Learning curve**: Team needs to master schema design, resolvers, and GraphQL-specific patterns
- **Railway API dependency**: Tight coupling with Railway's GraphQL API structure
- **Complex caching**: GraphQL caching strategies are more sophisticated than traditional HTTP caching

**Rationale**: The native GraphQL support in Railway, combined with the project's need for flexible data fetching and real-time updates, makes GraphQL the optimal choice despite the initial complexity. The declarative nature of GraphQL queries aligns perfectly with the dynamic requirements of security audit orchestration and result visualization.
