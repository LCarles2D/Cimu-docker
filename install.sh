#!/usr/bin/env bash
set -euo pipefail

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

check_dependency() {
    if ! command -v "$1" &> /dev/null; then
        log_error "Dependencia no encontrada: $1. Por favor instálala."
        exit 1
    fi
}

main() {
    check_dependency "git"
    check_dependency "docker"
    
    ROOT_DIR=$(pwd)

    log_info "Todo listo para comenzar."
    if [ ! -d "frontend/Pagina_web_CIMU/.git" ]; then
        mkdir -p frontend/Pagina_web_CIMU 
        git clone https://github.com/marvin290900/Pagina_web_CIMU.git frontend/Pagina_web_CIMU
    else
        cd frontend/Pagina_web_CIMU && git pull origin main && echo "Actualizado el repositorio de frontend"
    fi
    cd "$ROOT_DIR"
    log_info "Levantando infraestructura"
    docker compose down --remove-orphans && echo "Detenido los servicios"
    docker compose up --build -d && echo "Iniciando los servicios"
    log_info "Pagina web corriendo en http://localhost:8081"
}

main "$@"