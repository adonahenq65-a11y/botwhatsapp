const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Variables para controlar el bot
let botProcess = null;
let botStatus = 'stopped';
let botLogs = [];

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para el panel de control)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal - Panel de control simple
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Jarabito Bot - Control Panel</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                color: #333;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 {
                color: #764ba2;
                text-align: center;
                margin-bottom: 30px;
            }
            .status-card {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                border-left: 4px solid #764ba2;
            }
            .status {
                font-size: 18px;
                margin: 10px 0;
            }
            .status.online {
                color: #28a745;
            }
            .status.offline {
                color: #dc3545;
            }
            .status.starting {
                color: #ffc107;
            }
            .button {
                background: #764ba2;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 5px;
                transition: background 0.3s;
            }
            .button:hover {
                background: #5a3d7a;
            }
            .button.stop {
                background: #dc3545;
            }
            .button.stop:hover {
                background: #c82333;
            }
            .button.restart {
                background: #ffc107;
                color: #333;
            }
            .button.restart:hover {
                background: #e0a800;
            }
            .logs {
                background: #1e1e1e;
                color: #00ff00;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
                height: 300px;
                overflow-y: auto;
                margin-top: 20px;
            }
            .log-entry {
                margin: 2px 0;
                font-size: 12px;
            }
            .qr-container {
                text-align: center;
                margin: 20px 0;
            }
            .qr-code {
                max-width: 300px;
                border: 2px solid #764ba2;
                border-radius: 10px;
            }
            .info {
                background: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Jarabito Bot - Panel de Control</h1>
            
            <div class="status-card">
                <h2>Estado del Bot</h2>
                <div class="status" id="status">Cargando...</div>
                <div class="status" id="uptime">Tiempo activo: -</div>
                <div class="button-container">
                    <button class="button" onclick="startBot()" id="startBtn">Iniciar Bot</button>
                    <button class="button stop" onclick="stopBot()" id="stopBtn">Detener Bot</button>
                    <button class="button restart" onclick="restartBot()" id="restartBtn">Reiniciar Bot</button>
                </div>
            </div>

            <div class="info">
                <strong>📱 Información importante:</strong>
                <ul>
                    <li>Escanea el código QR cuando el bot esté iniciando</li>
                    <li>El bot se reiniciará automáticamente si se cae</li>
                    <li>Los archivos temporales se limpian automáticamente</li>
                </ul>
            </div>

            <div class="qr-container" id="qrContainer" style="display: none;">
                <h3>Código QR para WhatsApp</h3>
                <img id="qrImage" class="qr-code" src="" alt="QR Code">
                <p>Abre WhatsApp en tu teléfono → Menú → WhatsApp Web → Escanea este código</p>
            </div>

            <h3>Logs del Bot:</h3>
            <div class="logs" id="logs">
                <div class="log-entry">>> Sistema iniciado...</div>
            </div>
        </div>

        <script>
            let statusInterval;
            let logsInterval;
            let qrInterval;

            function updateStatus() {
                fetch('/api/status')
                    .then(res => res.json())
                    .then(data => {
                        const statusEl = document.getElementById('status');
                        statusEl.className = 'status ' + data.status;
                        
                        let statusText = '';
                        if (data.status === 'online') {
                            statusText = '✅ En línea';
                        } else if (data.status === 'starting') {
                            statusText = '🔄 Iniciando...';
                        } else if (data.status === 'stopped') {
                            statusText = '⏹️ Detenido';
                        } else {
                            statusText = '❌ Error';
                        }
                        statusEl.textContent = 'Estado: ' + statusText;

                        if (data.uptime) {
                            document.getElementById('uptime').textContent = 'Tiempo activo: ' + data.uptime;
                        }

                        // Actualizar botones
                        document.getElementById('startBtn').disabled = data.status === 'online' || data.status === 'starting';
                        document.getElementById('stopBtn').disabled = data.status !== 'online';
                        document.getElementById('restartBtn').disabled = data.status === 'starting';

                        // Mostrar QR si está disponible
                        if (data.qr) {
                            document.getElementById('qrContainer').style.display = 'block';
                            document.getElementById('qrImage').src = data.qr;
                        } else {
                            document.getElementById('qrContainer').style.display = 'none';
                        }
                    });
            }

            function updateLogs() {
                fetch('/api/logs')
                    .then(res => res.json())
                    .then(data => {
                        const logsEl = document.getElementById('logs');
                        logsEl.innerHTML = data.logs.map(log => 
                            '<div class="log-entry">' + log + '</div>'
                        ).join('');
                        logsEl.scrollTop = logsEl.scrollHeight;
                    });
            }

            function startBot() {
                fetch('/api/start', { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            updateStatus();
                        } else {
                            alert('Error al iniciar el bot: ' + data.error);
                        }
                    });
            }

            function stopBot() {
                if (confirm('¿Estás seguro de detener el bot?')) {
                    fetch('/api/stop', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                updateStatus();
                            } else {
                                alert('Error al detener el bot: ' + data.error);
                            }
                        });
                }
            }

            function restartBot() {
                if (confirm('¿Estás seguro de reiniciar el bot?')) {
                    fetch('/api/restart', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                updateStatus();
                            } else {
                                alert('Error al reiniciar el bot: ' + data.error);
                            }
                        });
                }
            }

            // Actualizar cada 2 segundos
            statusInterval = setInterval(updateStatus, 2000);
            logsInterval = setInterval(updateLogs, 2000);
        </script>
    </body>
    </html>
    `);
});

// API endpoints para controlar el bot
app.get('/api/status', (req, res) => {
    let status = botStatus;
    let uptime = '-';
    
    if (botProcess && botProcess.pid) {
        try {
            // En Unix, puedes obtener el uptime del proceso
            if (process.platform !== 'win32') {
                const { execSync } = require('child_process');
                const output = execSync(`ps -o etime= -p ${botProcess.pid}`).toString().trim();
                uptime = output;
            } else {
                uptime = 'En ejecución';
            }
        } catch (e) {
            uptime = 'Desconocido';
        }
    }

    res.json({
        status: status,
        uptime: uptime,
        pid: botProcess ? botProcess.pid : null,
        qr: global.qrCode || null
    });
});

app.get('/api/logs', (req, res) => {
    res.json({
        logs: botLogs.slice(-100) // Últimos 100 logs
    });
});

app.post('/api/start', (req, res) => {
    if (botProcess) {
        return res.json({ success: false, error: 'El bot ya está en ejecución' });
    }

    try {
        startBotProcess();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post('/api/stop', (req, res) => {
    if (!botProcess) {
        return res.json({ success: false, error: 'El bot no está en ejecución' });
    }

    try {
        stopBotProcess();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post('/api/restart', (req, res) => {
    try {
        if (botProcess) {
            stopBotProcess();
        }
        setTimeout(() => {
            startBotProcess();
        }, 2000);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Función para iniciar el proceso del bot
function startBotProcess() {
    if (botProcess) {
        return;
    }

    botStatus = 'starting';
    addLog('>> Iniciando bot...');

    // Spawn del proceso del bot
    botProcess = spawn('node', ['index.js'], {
        cwd: __dirname,
        env: { ...process.env, FORCE_COLOR: true }
    });

    botProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                addLog(line);
                
                // Detectar QR en los logs
                if (line.includes('https://api.qrserver.com') || line.includes('QR code')) {
                    const qrMatch = line.match(/https:\/\/[^\s]+/);
                    if (qrMatch) {
                        global.qrCode = qrMatch[0];
                    }
                }
                
                // Detectar cuando el bot está listo
                if (line.includes('✅ BOT CONECTADO EXITOSAMENTE') || line.includes('LISTO PARA RECIBIR MENSAJES')) {
                    botStatus = 'online';
                    global.qrCode = null;
                }
            }
        });
    });

    botProcess.stderr.on('data', (data) => {
        addLog(`❌ ERROR: ${data.toString()}`);
        botStatus = 'error';
    });

    botProcess.on('close', (code) => {
        addLog(`>> Bot cerrado con código: ${code}`);
        botProcess = null;
        botStatus = 'stopped';
        
        // Reintentar automáticamente después de 5 segundos si no fue una detención manual
        if (code !== 0 && botStatus !== 'stopping') {
            addLog('>> Reintentando en 5 segundos...');
            setTimeout(() => {
                startBotProcess();
            }, 5000);
        }
    });

    botProcess.on('error', (err) => {
        addLog(`❌ Error al iniciar bot: ${err.message}`);
        botProcess = null;
        botStatus = 'error';
    });
}

// Función para detener el proceso del bot
function stopBotProcess() {
    if (!botProcess) {
        return;
    }

    botStatus = 'stopping';
    addLog('>> Deteniendo bot...');

    if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', botProcess.pid, '/f', '/t']);
    } else {
        botProcess.kill('SIGINT');
    }

    setTimeout(() => {
        if (botProcess) {
            try {
                botProcess.kill('SIGKILL');
            } catch (e) {}
            botProcess = null;
        }
        botStatus = 'stopped';
        addLog('>> Bot detenido');
    }, 5000);
}

// Función para agregar logs
function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    botLogs.push(`[${timestamp}] ${message}`);
    
    // Mantener solo los últimos 500 logs
    if (botLogs.length > 500) {
        botLogs = botLogs.slice(-500);
    }
    
    console.log(`[SERVER] ${message}`);
}

// Iniciar el bot automáticamente cuando el servidor arranque
setTimeout(() => {
    startBotProcess();
}, 2000);

// Limpiar al cerrar
process.on('SIGINT', () => {
    if (botProcess) {
        stopBotProcess();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    if (botProcess) {
        stopBotProcess();
    }
    process.exit(0);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor de control iniciado en http://localhost:${PORT}`);
    console.log(`📱 Panel de control disponible en http://localhost:${PORT}`);
});