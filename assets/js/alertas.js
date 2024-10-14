export class Alerts {
    static publicationSuccessful(message) {
        Swal.fire({
            icon: 'success',
            title: '¡Tu foto se ha publicado con éxito!',
            text: message,
            timer: 3000,
            showConfirmButton: false
        });
    }

    static async confirmDeletion() {
        return await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    }

    static deletionSuccessful() {
        Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'La imagen ha sido eliminada con éxito.',
            timer: 3000,
            showConfirmButton: false
        });
    }

    static deletionError(errorText) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al eliminar la imagen: ${errorText}`,
            timer: 3000,
            showConfirmButton: false
        });
    }

    static deletionCancelled() {
        Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'La imagen no fue eliminada',
            timer: 2000,
            showConfirmButton: false
        });
    }

    static showError(error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo conectar con el servidor.',
            timer: 3000,
            showConfirmButton: false
        });
        console.error('Error:', error);
    }
}
