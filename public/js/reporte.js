
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

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Error al obtener datos');
            return;
        }

        const { salidas, materiales } = data;

        // Crear Excel en navegador con ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Salidas');

        worksheet.columns = [
            { header: 'Folio', key: 'Folio' },
            { header: 'Chofer', key: 'Chofer_nombre' },
            { header: 'Cliente', key: 'Cliente_nombre' },
            { header: 'Dirección', key: 'Direccion' },
            { header: 'Atención a', key: 'Atencion_a' },
            { header: 'Teléfono', key: 'Telefono' },
            { header: 'Pedido', key: 'Numero_Pedido' },
            { header: 'Solicita', key: 'Quien_solicita' },
            { header: 'Motivo', key: 'Motivo_salida' },
            { header: 'Observaciones', key: 'Observaciones' },
            { header: 'Fecha', key: 'Fecha' },
            { header: 'Código', key: 'Codigo' },
            { header: 'Descripción', key: 'Descripcion' },
            { header: 'Cantidad', key: 'Cantidad' },
            { header: 'UM', key: 'Um' },
            { header: 'Obs. Material', key: 'Observacion' }
        ];

        salidas.forEach(salida => {
            const materialesDeSalida = materiales.filter(mat => mat.Folio === salida.Folio);

            if (materialesDeSalida.length > 0) {
                materialesDeSalida.forEach(mat => {
                    worksheet.addRow({
                        ...salida,
                        Codigo: mat.Codigo,
                        Descripcion: mat.Descripcion,
                        Cantidad: mat.Cantidad,
                        Um: mat.Um,
                        Observacion: mat.Observacion
                    });
                });
            } else {
                worksheet.addRow({
                    ...salida,
                    Codigo: '',
                    Descripcion: '',
                    Cantidad: '',
                    Um: '',
                    Observacion: ''
                });
            }
        });

        // Descargar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ReporteSalidas.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al generar el reporte');
    }
});


