# ADR-001: Elección de Railway como Plataforma de Ejecución

**Fecha:** 26 de julio de 2025  
**Estado:** Accepted

## Contexto

Necesitábamos evaluar y seleccionar una plataforma serverless para el despliegue de contenedores de corta duración para nuestro proyecto de microservicios. Las opciones principales consideradas fueron:

- **Railway**: Plataforma serverless moderna con enfoque en simplicidad
- **AWS Fargate**: Servicio de contenedores serverless de Amazon Web Services
- **Google Cloud Run**: Plataforma serverless de contenedores de Google Cloud

### Criterios de evaluación

Los factores más importantes para nuestra decisión fueron:

1. **Facilidad de uso**: Simplicidad en configuración y despliegue
2. **API GraphQL nativa**: Soporte integrado para APIs GraphQL
3. **CLI (Command Line Interface)**: Herramientas de línea de comandos robustas
4. **Plan gratuito**: Disponibilidad de tier gratuito para desarrollo y pruebas
5. **Tiempo de arranque rápido**: Latencia mínima en el spin-up de contenedores

## Decisión

**Optamos por Railway como el servicio principal serverless para desplegar contenedores de corta duración.**

### Justificación

Railway destacó en todos los criterios evaluados:

- ✅ **Facilidad de uso excepcional**: Configuración mínima y despliegue automático desde Git
- ✅ **API GraphQL nativa**: Soporte integrado sin configuración adicional
- ✅ **CLI potente**: Herramientas de desarrollo y despliegue intuitivas
- ✅ **Plan gratuito generoso**: Ideal para desarrollo y proyectos pequeños
- ✅ **Spin-up ultrarrápido**: Arranque de contenedores en segundos

## Consecuencias

### Positivas

- Reducción significativa en tiempo de configuración y despliegue
- Menor complejidad operacional
- Costos iniciales bajos gracias al plan gratuito
- Experiencia de desarrollo mejorada

### Negativas

- **Vendor lock-in**: Dependencia del proveedor Railway
- **Límites del plan gratuito**: Restricciones de RAM/CPU en el tier gratuito
- **Necesidad de monitoreo**: Requerimiento de supervisar el uso para evitar exceder límites
- **Menos maduro**: Plataforma relativamente nueva comparada con AWS/GCP

### Mitigaciones

- Monitorear continuamente el uso de recursos
- Planificar migración a plan de pago cuando sea necesario
- Mantener arquitectura portable para reducir vendor lock-in
- Establecer alertas de uso de recursos

---

## Summary

### Railway Platform Selection for Serverless Container Deployment

**Decision**: Railway was selected as the primary serverless platform for deploying short-lived containers in our microservices architecture.

**Key Pros**:

- Exceptional ease of use with minimal configuration
- Native GraphQL API support
- Powerful CLI tools for development workflow
- Generous free tier for development and small projects
- Ultra-fast container spin-up times

**Key Cons**:

- Vendor lock-in dependency on Railway platform
- Resource limitations (RAM/CPU) on free tier
- Need for continuous usage monitoring
- Relatively newer platform with smaller ecosystem

**Rationale**: Railway's simplicity, developer experience, and cost-effectiveness for our use case outweighed the potential risks of vendor dependency and resource limitations. The platform aligns perfectly with our need for rapid development and deployment of containerized microservices.
