/*
Levantar con PM2
pm2 start webhook.js --name "webhook-cimu"

En github: https://[IP_ADDRESS]/webhook-cimu

*/

const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cargar variables desde .env de forma manual (sin dependencias externas)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            process.env[key.trim()] = value;
        }
    });
}

// CONFIGURACIÓN
const SECRET = process.env.WEBHOOK_SECRET;
const PORT = process.env.WEBHOOK_PORT;
const SCRIPT_PATH = './install.sh';

http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/webhook-cimu') {
        let body = '';

        req.on('data', chunk => { body += chunk; });

        req.on('end', () => {
            // 1. VALIDACIÓN DE SEGURIDAD (HMAC SHA256)
            const signature = req.headers['x-hub-signature-256'];
            const hmac = crypto.createHmac('sha256', SECRET);
            const digest = 'sha256=' + hmac.update(body).digest('hex');

            if (signature !== digest) {
                console.error('Intento de acceso no autorizado. Firma inválida.');
                res.writeHead(401);
                return res.end('Invalid signature');
            }

            // 2. EJECUCIÓN DEL DESPLIEGUE
            console.log('Firma verificada. Iniciando despliegue...');

            exec(SCRIPT_PATH, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error en el script: ${err.message}`);
                    return;
                }
                if (stderr) console.error(`stderr: ${stderr}`);
                console.log(`stdout: ${stdout}`);
            });

            res.writeHead(200);
            res.end('Deployment started');
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
}).listen(PORT, () => {
    console.log(`Webhook seguro escuchando en el puerto ${PORT}`);
});