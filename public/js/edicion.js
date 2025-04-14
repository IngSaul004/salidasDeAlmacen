let arrayForm1 = [];
let datosGenerales = {};
let arrayMaterial = [];
let material = {};
const materialesArray = [];
document.addEventListener('DOMContentLoaded', function () {
  // Constantes
  const imprimirBtn = document.getElementById('imprimir');
  const editarBtn = document.getElementById('editar');
  const guardarBtn = document.getElementById('guardar');
  const agregarFilaBtn = document.getElementById('agregarFila');
  const mostrarFolioBtn = document.getElementById('foliosBtn');
  const cerrarSesionBtn = document.getElementById('cerrarSesion');
  const selectFolios = document.getElementById('folios');

  // Estado inicial
  editarBtn.disabled = true;
  guardarBtn.disabled = true;
  agregarFilaBtn.disabled = true;

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

  cerrarSesionBtn.addEventListener('click', function (event) {
    event.preventDefault();
    fetch('/logout');
    window.location.href = "/";
  });

  // Cargar folios
  window.onload = cargarFolios();
  function cargarFolios() {
    fetch('/folios')
      .then(response => response.json())
      .then(data => {
        selectFolios.innerHTML = '<option value="">Seleccione un folio</option>';
        data.forEach(f => {
          const option = document.createElement('option');
          option.value = f.Folio;
          option.textContent = f.Folio;
          selectFolios.appendChild(option);
        });
      })
      .catch(error => console.error('Error al cargar los folios:', error));
  }

  // Cambiar folio
  selectFolios.addEventListener('change', function () {
    const folio = this.value;
    if (folio) {
      cargarInfoFolio(folio);
      this.disabled = true; // Deshabilitar select al elegir
    }
  });

  // Cargar info del folio
  // Cargar la información del folio y actualizar datosGenerales
  function cargarInfoFolio(folio) {
    fetch(`/folios/${folio}`)
      .then(response => response.json())
      .then(data => {
        const salida = data.salida;
        const materiales = data.materiales;

        // Rellenar campos
        document.getElementById('usuarioId').value = salida.Usuario_id || '';
        document.getElementById('usuarioFolio').value = salida.UsuarioNombre || '';
        document.getElementById('nombreChofer').value = salida.Chofer_nombre || '';
        document.getElementById('cliente').value = salida.Cliente_nombre || '';
        document.getElementById('direccionCliente').value = salida.Direccion || '';
        document.getElementById('atencionA').value = salida.Atencion_a || '';
        document.getElementById('numeroPedido').value = salida.Numero_Pedido || '';
        document.getElementById('quienSolicita').value = salida.Quien_solicita || '';
        document.getElementById('motivoSalida').value = salida.Motivo_salida || '';
        document.getElementById('observaciones').value = salida.Observaciones || '';

        // Asignar valores a datosGenerales
        datosGenerales = {
          Chofer_nombre: salida.Chofer_nombre || '',
          Cliente_nombre: salida.Cliente_nombre || '',
          Direccion: salida.Direccion || '',
          Atencion_a: salida.Atencion_a || '',
          Numero_Pedido: salida.Numero_Pedido || '',
          Quien_solicita: salida.Quien_solicita || '',
          Motivo_salida: salida.Motivo_salida || '',
          Observaciones: salida.Observaciones || ''
        };

        const tbody = document.querySelector('#verListadoVista tbody');
        tbody.innerHTML = '';

        materiales.forEach((mat, index) => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${index + 1}</td>
            <td contenteditable="true">${mat.Cantidad}</td>
            <td contenteditable="true">${mat.Um}</td>
            <td contenteditable="true">${mat.Descripcion}</td>
            <td contenteditable="true">${mat.Codigo}</td>
            <td contenteditable="true">${mat.Observacion || ''}</td>
            <td><button type="button" class="borrarFila">Borrar</button></td>
          `;
          tbody.appendChild(fila);
        });

        editarBtn.disabled = false;
        agregarFilaBtn.disabled = false;
      })
      .catch(err => console.error('Error al cargar info del folio:', err));
  }

  // Popup
  document.getElementById('footer').addEventListener('click', () => {
    document.getElementById('popup').style.display = "flex";
  });

  document.getElementById('cerrar-btn').addEventListener('click', () => {
    document.getElementById('popup').style.display = "none";
  });

  // Editar
  editarBtn.addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelectorAll('#formModificar input, #formModificar select').forEach(el => el.disabled = false);
    document.querySelectorAll('#verListadoVista tbody td').forEach(td => td.setAttribute('contenteditable', 'true'));
    guardarBtn.disabled = false;
    agregarFilaBtn.disabled = false;
  });

  // Agregar fila
  agregarFilaBtn.addEventListener('click', () => {
    const tbody = document.querySelector('#verListadoVista tbody');
    const fila = document.createElement('tr');
    for (let i = 0; i < 6; i++) {
      const celda = document.createElement('td');
      celda.setAttribute('contenteditable', 'true');
      fila.appendChild(celda);
    }
    const celdaBorrar = document.createElement('td');
    celdaBorrar.innerHTML = `<button type="button" class="borrarFila">Borrar</button>`;
    fila.appendChild(celdaBorrar);
    tbody.appendChild(fila);
  });

  // Borrar fila
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('borrarFila')) {
      e.target.closest('tr').remove();
    }
  });

  // Guardar
  guardarBtn.addEventListener('click', () => {
    // No redeclarar datosGenerales aquí, solo usar el objeto global
    const datosGenerales = {
      Folio: document.getElementById('folios').value,
      Usuario_id: document.getElementById('usuarioId').value,
      UsuarioNombre: document.getElementById('usuarioFolio').value,
      Chofer_nombre: document.getElementById('nombreChofer').value,
      Cliente_nombre: document.getElementById('cliente').value,
      Direccion: document.getElementById('direccionCliente').value,
      Atencion_a: document.getElementById('atencionA').value,
      Numero_Pedido: document.getElementById('numeroPedido').value,
      Quien_solicita: document.getElementById('quienSolicita').value,
      Motivo_salida: document.getElementById('motivoSalida').value,
      Observaciones: document.getElementById('observaciones').value
    };
    console.log('DATOS GENERALES GUARDAR', datosGenerales);
    arrayForm1.push(datosGenerales);
    console.log('DATOS GENERALES GUARDAR ARRAY', arrayForm1);
    
  
    // Actualiza el array de materiales
    document.querySelectorAll('#verListadoVista tbody tr').forEach(tr => {
      const tds = tr.querySelectorAll('td');
      materialesArray.push({
        Cantidad: tds[1].textContent,
        Um: tds[2].textContent,
        Descripcion: tds[3].textContent,
        Codigo: tds[4].textContent,
        Observacion: tds[5].textContent
      });

      console.log('MATERIALES EN EL ARRAY', materialesArray)
    });
  
    // Aquí puedes hacer un fetch POST para enviar los datos al servidor si lo necesitas
  
    // Deshabilitar campos y botones
    document.querySelectorAll('#formModificar input, #formModificar select').forEach(el => el.disabled = true);
    document.querySelectorAll('#verListadoVista tbody td').forEach(td => td.setAttribute('contenteditable', 'false'));
    guardarBtn.disabled = true;
    editarBtn.disabled = true;
    agregarFilaBtn.disabled = true;
  
    // Ahora puedes usar `datosGenerales` como lo hacías antes, ya que está actualizado globalmente
    console.log('Datos Generales:', datosGenerales);
    console.log('Materiales:', materialesArray);
  });

  function obtenerDatosGenerales() {
    return {
      Folio: document.getElementById('folios').value,
      Usuario_id: document.getElementById('usuarioId').value,
      Fecha: new Date().toISOString(), // Fecha actual
      UsuarioNombre: document.getElementById('usuarioFolio').value,
      Chofer_nombre: document.getElementById('nombreChofer').value,
      Cliente_nombre: document.getElementById('cliente').value,
      Direccion: document.getElementById('direccionCliente').value,
      Atencion_a: document.getElementById('atencionA').value,
      Numero_Pedido: document.getElementById('numeroPedido').value,
      Quien_solicita: document.getElementById('quienSolicita').value,
      Motivo_salida: document.getElementById('motivoSalida').value,
      Observaciones: document.getElementById('observaciones').value
    };
  }

  document.getElementById('imprimir').addEventListener('click', function() {
    // Datos a enviar al backend (estos vienen de tus formularios o variables)
    const datosGenerales = obtenerDatosGenerales();
    const materiales = materialesArray.map(material => ({
      Codigo: material.Codigo,
      Descripcion: material.Descripcion,
      Cantidad: String(material.Cantidad),
      Um: material.Um,
      Observacion: material.Observacion
    }));
    console.log('Materiales a enviar:', materiales);
    console.log('USUARIO ID', datosGenerales.Usuario_id);


    // Enviar los datos al backend
    fetch('/actualizarSalida', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        folio: datosGenerales.Folio,
        usuario_id: datosGenerales.Usuario_id, // Aquí puedes agregar el id del usuario que está realizando la acción
        fecha: new Date().toISOString(), // Fecha actual
        datosGenerales: datosGenerales,
        materiales: materiales
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
      // Si la actualización fue exitosa, entonces generar e imprimir el documento
      const contenidoFormulario = `
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 30px; font-size: 12px;">
          <div style="width: 48%; margin-bottom: 15px;">Folio: ${arrayForm1[0].Folio}</div>
          <div style="width: 48%; margin-bottom: 15px;">Fecha: ${datosGenerales.Fecha}</div>
          <div style="width: 48%; margin-bottom: 15px;">Chofer: ${arrayForm1[0].Chofer_nombre}</div>
          <div style="width: 48%; margin-bottom: 15px;">Cliente: ${arrayForm1[0].Cliente_nombre}</div>
          <div style="width: 48%; margin-bottom: 15px;">Dirección: ${arrayForm1[0].Direccion}</div>
          <div style="width: 48%; margin-bottom: 15px;">Atención: ${arrayForm1[0].Atencion_a}</div>
          <div style="width: 48%; margin-bottom: 15px;">Pedido: ${arrayForm1[0].Numero_Pedido}</div>
          <div style="width: 48%; margin-bottom: 15px;">Solicitante: ${arrayForm1[0].Quien_solicita}</div>
          <div style="width: 48%; margin-bottom: 15px;">Motivo de Salida: ${arrayForm1[0].Motivo_salida}</div>
          <div style="width: 48%; margin-bottom: 15px;">Observaciones: ${arrayForm1[0].Observaciones}</div>
      </div>
    `;

    const contenidoMateriales = `
      <table>
          <thead>
              <tr>
                  <th>Cantidad</th>
                  <th>U/M</th>
                  <th>Descripción</th>
                  <th>Código</th>
                  <th>Observaciones</th>
              </tr>
          </thead>
          <tbody>
              ${materialesArray.map(material => `
                  <tr>
                      <td>${material.Cantidad}</td>
                      <td>${material.Um}</td>
                      <td>${material.Descripcion}</td>
                      <td>${material.Codigo}</td>
                      <td>${material.Observacion}</td>
                  </tr>
              `).join('')}
          </tbody>
      </table>
    `;

    const printWindow = window.open('', 'Imprimir Salida', 'height=600,width=800');
    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
    <html>
    <head>
        <title>Reporte de Salida de Material</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1 {
                text-align: center;
                margin-bottom: 20px;
                font-size: 16px;
            }
            h2 {
                font-size: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-size: 12px;
            }
            th {
                background-color: #f2f2f2;
            }
            .firma {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
            }
            .firma-box {
                width: 48%;
                text-align: center;
            }
            .firma-line {
                border-top: 1px solid #000;
                margin-top: 10px;
                width: 100px;
                margin: 10px auto 0 auto;
            }
            .logo {
                text-align: right;
                margin-bottom: 20px;
            }
            .logo img {
                width: 40px;
                height: auto;
            }
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                }
                table {
                    border: 1px solid #000;
                }
                th, td {
                    font-size: 10px;
                }
            }
        </style>
    </head>
    <body>
        <h1>IMPULSORA INDUSTRIAL DE REFRIGERACIÓN SA DE CV</h1>
        <h2 style="text-align: left; width: 50%;">CALLE MAIZ 43 C. GRANJAS ESMERALDA. CIUDAD DE 09640 IZTAPALAPA 55-5445-7875</h2>
        <h2 style="text-align: right; width: 45%; float: right; margin-top: -30px;">CARR.-TESISTAN # 8837 COL. PREDIO POTRERO GRANDE ZAPOPAN, JAL. C.P. 45200 TEL / FAX 3836-06-00</h2>
        <div class="logo">
            <img src="../img/IDERimago.png" alt="Logo Institucional">
        </div>
        ${contenidoFormulario}
        ${contenidoMateriales}
        <div class="firma">
            <div class="firma-box">
                <div class="firma-line"></div>
                Firma Personal de Almacén General
            </div>
            <div class="firma-box">
                <div class="firma-line"></div>
                Nombre y Firma de quien recibe
            </div>
        </div>
    </body>
    </html>`);
    printWindow.document.close();

    // Imprimir y cerrar
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 1000); // 1 segundo de espera para asegurar carga completa

    } else {
      alert('Hubo un problema al actualizar los datos.');
    }
  })
  .catch(error => {
    console.error('Error al actualizar la salida:', error);
    alert('Error al actualizar la salida. Intente nuevamente.');
  });
});
      
  
});
