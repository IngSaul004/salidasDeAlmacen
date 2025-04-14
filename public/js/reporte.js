    // Obtener usuario
    fetch('/ObtenerUsuario')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.usuario) {
        document.getElementById('usuario').textContent = data.usuario.Usuario;
      } else {
        document.getElementById('usuarioSpan').textContent = 'Usuario no encontrado';
      }
    })
    .catch(error => {
      console.error('Error al obtener el usuario:', error);
    });


    document.getElementById('cerrarSesion').addEventListener('click', function(){
        fetch('/logout');
        window.location.href = "/";
     });

     
document.getElementById('footer').addEventListener('click', function(){
    const popup = document.getElementById('popup');
    popup.style.display = "flex";
 });

 document.getElementById('cerrar-btn').addEventListener('click', function(){
    const popup = document.getElementById('popup');
    popup.style.display = "none";
 });  


document.getElementById('generarReporte').addEventListener('click', async () => {
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;
    const filtro = document.getElementById('Filtro').value;

    // Validar fechas
    if (!fechaInicial || !fechaFinal) {
        alert('Selecciona ambas fechas');
        return;
    }

    try {
        const response = await fetch('/generarReporteSalida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fechaInicial, fechaFinal, filtro })
        });

        // Verificar si la respuesta es correcta
        console.log('Respuesta del servidor:', response); // Añadir un log para ver la respuesta

        if (response.ok) {
            const blob = await response.blob(); // Obtener el archivo como blob
            console.log('Blob recibido:', blob); // Log para ver si el blob es correcto
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ReporteSalidas.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            alert('Error al generar el reporte');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al generar el reporte');
    }
});
