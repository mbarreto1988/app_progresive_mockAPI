const entradaArchivo = document.getElementById('input-file');
const vistaPrevia = document.getElementById('preview');
const btnConfirmar = document.getElementById('btn-confirmar');


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
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Nivel de compresión ajustable
            callback(dataUrl);
        };
    };
}


entradaArchivo.addEventListener('change', (evento) => {
    const archivo = evento.target.files[0];
    if (archivo) {
      
        if (archivo.size > 2000000) {
            alert('La foto es muy grande, que no supere los 2MB.');
            return;
        }
        comprimirImagen(archivo, 800, 600, (dataUrl) => {
            vistaPrevia.src = dataUrl; 
        });
    }
});


btnConfirmar.addEventListener('click', async () => {
    const titulo = document.getElementById('titulo').value;
    const imagenBase64 = vistaPrevia.src;
    if (!titulo || !imagenBase64) {
        alert('Por favor completa todos los campos.');
        return;
    }
    const datos = {
        titulo: titulo,
        url: imagenBase64,
        fecha: new Date().toISOString()
    };
    console.log('Datos a enviar:', datos); 
    try {
        const respuesta = await fetch('https://6708314d8e86a8d9e42e50e1.mockapi.io/fotos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos) 
        });
        if (respuesta.ok) {
            alert('Foto publicada con éxito');
            window.location.href = 'index.html'; 
        } else {
            const errorText = await respuesta.text();
            alert(`Error al publicar la foto: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al publicar la foto:', error);
        alert('Error al publicar la foto...');
    }
});
