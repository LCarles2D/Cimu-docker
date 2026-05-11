# CIMU Docker 

Infraestructura de microservicios dockerizada para el proyecto CIMU (Servicio Social UES). Este repositorio gestiona el despliegue del frontend en Astro y la base de datos CouchDB.

## Configuración Inicial

Para que los servicios se comuniquen correctamente, debes crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de CouchDB
COUCHDB_URL=http://couchdb:5984
COUCHDB_USER=admin_user
COUCHDB_PASSWORD=admin_password
```
**Nota:** Si utilizas una instancia externa de CouchDB, modifica COUCHDB_URL con la IP o dominio correspondiente.

## Instalacion y despliege
Sigue estos pasos para clonar el proyecto y levantar los servicios automáticamente mediante el script de instalación:
```bash
# 1. Clonar el repositorio
git clone https://github.com/LCarles2D/Cimu-docker.git
cd Cimu-docker

# 2. Dar permisos de ejecución al script
chmod +x ./install.sh

# 3. Ejecutar la instalación
./install.sh
```

## Requisitos
- Docker Engine 24.0+

- Docker Compose v2+

- Git
