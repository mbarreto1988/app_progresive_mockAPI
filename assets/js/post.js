import { Alerts } from './alertas.js';


const entradaArchivo = document.getElementById('input-file');
const vistaPrevia = document.getElementById('preview');
const video = document.getElementById('camera-preview');
const btnCamera = document.getElementById('btn-camera');
const btnCapture = document.getElementById('btn-capture');
const btnConfirmar = document.getElementById('btn-confirmar');
const networkStatus = document.getElementById('network-status');
const datosIncompletos = document.getElementById('datos-incompletos')


function verificarConectividad() {
    if (navigator.onLine) {
        btnConfirmar.disabled = false;
        btnConfirmar.style.backgroundColor = '#007bff';
        btnConfirmar.style.cursor = 'pointer';
        networkStatus.style.display = 'none';
    } else {
        btnConfirmar.disabled = true;
        btnConfirmar.style.backgroundColor = 'gray';
        btnConfirmar.style.cursor = 'no-drop';
        networkStatus.style.display = 'block';
    }
}


function comprimirImagen(archivo, maxWidth, maxHeight, callback) {
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                    height = Math.floor((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.floor((width * maxHeight) / height);
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(dataUrl);
        };
    };
}


function manejarCambioArchivo(evento) {
    const archivo = evento.target.files[0];
    if (archivo) {
        comprimirImagen(archivo, 800, 600, (dataUrl) => {
            vistaPrevia.src = dataUrl;
        });
    }
}


async function confirmarSubida() {
    const titulo = document.getElementById('titulo').value;
    const imagenBase64 = vistaPrevia.src;    
    if (!titulo || !imagenBase64) {
        datosIncompletos.style.display = 'block';
        return;
    }    
    const base64Length = imagenBase64.length * (3 / 4) - 2;
    const sizeInMB = base64Length / (1024 * 1024);    
    if (sizeInMB > 2) {
        alert('La imagen es muy grande (mayor a 2MB), intente con una más pequeña.');
        return;
    }    
    const datos = {
        titulo: titulo,
        url: imagenBase64,
        fecha: new Date().toISOString()
    };    
    try {
        const respuesta = await fetch('https://6708314d8e86a8d9e42e50e1.mockapi.io/fotos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });        
        if (respuesta.ok) {
            document.getElementById('dialogCamera').style.display = 'none';
            Alerts.publicationSuccessful('Publicación Exitosa');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            const errorText = await respuesta.text();
            alert(`Error al publicar la foto: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al publicar la foto:', error);
        alert('Error al publicar la foto...');
    }
}


window.addEventListener('online', ()=> verificarConectividad());
window.addEventListener('offline', ()=> verificarConectividad());
btnConfirmar.addEventListener('click', confirmarSubida);
entradaArchivo.addEventListener('change', manejarCambioArchivo);

