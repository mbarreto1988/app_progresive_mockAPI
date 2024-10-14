import { Alerts } from './alertas.js';


const url_base = 'https://6708314d8e86a8d9e42e50e1.mockapi.io/fotos';
const reel = document.getElementById('reel');
const dialogCardDetail = document.getElementById('dialogCardDetail');
const showCardDetail = document.getElementById('showCardDetail');
const dialogCamera = document.getElementById('dialogCamera');
const closeButtonCamera = document.querySelector('.close-camera');
const camara_img = document.getElementById('camara-img');


async function mostrarImagenes() {
    try {
        const response = await fetch(url_base);
        if (!response.ok) {
            console.error(`Error en la llamada a la API: ${response.status}`);
            return null;
        } else {
            const data = await response.json();
            reel.innerHTML = '';
            data.forEach(image => {
                const card = document.createElement('div');
                card.classList = 'card';
                card.innerHTML = `
                    <div class="card-data">
                        <img src="${image.url}" class="card-img" alt="${image.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${image.titulo}</h5>
                            <button class="button cardDetail">Detalles</button>
                            <br>
                        </div>
                    </div>
                `;
                const button = card.querySelector('.cardDetail');
                button.addEventListener('click', () => {
                    showCardDetail.innerHTML = `
                        <button class="close-button" aria-label="Close">&times;</button>
                        <img src="${image.url}" alt="${image.titulo}" class="img-modal">
                        <h2>${image.titulo}</h2>
                        <p>Fecha: ${new Date(image.fecha).toLocaleString()}</p>
                        <button id="btn-delete" class="btn-delete">Eliminar</button>
                    `;
                    dialogCardDetail.showModal();
                    const closeButton = document.querySelector('.close-button');
                    closeButton.addEventListener('click', () => {
                        dialogCardDetail.close();
                    });
                    const btnDelete = document.getElementById('btn-delete');
                    btnDelete.addEventListener('click', async () => {
                        await eliminarImagen(image.id);                        
                    });
                });                
                reel.appendChild(card);
            });
        }
    } catch (error) {
        console.error(`Error en la conexión: ${error.message}`);
        return null;
    }
}


async function eliminarImagen(imageId) {
    dialogCardDetail.close();
    try {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (confirmacion.isConfirmed) {
            const response = await fetch(`${url_base}/${imageId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                Alerts.deletionSuccessful()
                setTimeout(() => {
                    window.location.reload(); 
                }, 3000);
                dialogCardDetail.close();
            } else {
                const errorText = await response.text();
                Alerts.deletionError(errorText)
            }
        } else {
            Alerts.deletionCancelled()
        }
    } catch (error) {
        Alerts.showError(error)
        console.error('Error al eliminar la imagen:', error);
    }
}


camara_img.addEventListener('click', (event) => {
    event.preventDefault();
    dialogCamera.showModal();
});

closeButtonCamera.addEventListener('click', () => dialogCamera.close());
document.addEventListener('DOMContentLoaded', mostrarImagenes);

