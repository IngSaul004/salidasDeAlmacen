let arrayForm1 = [];
let datosForm1 = {};
let material = {};
let arrayMaterial = [];
let folioActual = 0;

const imprimir = document.getElementById('imprimir');
imprimir.disabled = true;

//LLamada al endpoint de usuario para mostrarlo
fetch('/ObtenerUsuario')
  .then(response => response.json())
  .then(data => {
    if (data.success && data.usuario) {
      const usuario = data.usuario;
      // Mostrar el nombre de usuario o cualquier otra propiedad en el span
      document.getElementById('usuario').textContent = usuario.Usuario;
    } else {
      document.getElementById('usuarioSpan').textContent = 'Usuario no encontrado';
    }
  })
  .catch(error => {
    console.error('Error al obtener el usuario:', error);
    document.getElementById('usuarioSpan').textContent = 'Error al obtener usuario';
  });

  window.onload = cargarClientes();
  function cargarClientes() {
    const selectCliente = document.getElementById('listaCliente');
    fetch('/clienteList')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        data.forEach(f => {
          const option = document.createElement('option');
          option.value = f.Cliente;
          option.textContent = f.Cliente;
          selectCliente.appendChild(option);
        });
      })
      .catch(error => console.error('Error al cargar los folios:', error));
  }

  // Cambiar folio
  document.getElementById('listaCliente').addEventListener('change', function () {
    const cliente = this.value;
    if (cliente) {
      cargarInfoCliente(cliente);
      this.disabled = true; // Deshabilitar select al elegir
    }
  });

  function cargarInfoCliente(cliente) {
    fetch(`/clienteListInfo/${cliente}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const clienteInfo = data[0];
  
          document.getElementById('direccionCliente').value = clienteInfo.Direccion || '';
          document.getElementById('atencionA').value = clienteInfo.Contacto || '';
          document.getElementById('numeroTelefonico').value = clienteInfo.Numero || '';
        } else {
          console.warn('Cliente no encontrado');
        }
      })
      .catch(err => console.error('Error al cargar info del cliente:', err));
  }
  




//llamada al endpoint de ultimo folio para obtenerlo
fetch('/UltimoFolio')
  .then(response => response.json())
  .then(data => {
    folioActual = parseInt(data.folio); // lo guardamos como número
    document.getElementById('folio').textContent = folioActual;
  })
  .catch(error => console.error('Error al obtener el último folio:', error));


document.getElementById('footer').addEventListener('click', function(){
    const popup = document.getElementById('popup');
    popup.style.display = "flex";
 });

 document.getElementById('cerrar-btn').addEventListener('click', function(){
    const popup = document.getElementById('popup');
    popup.style.display = "none";
 });

 document.getElementById('cerrarSesion').addEventListener('click', function(){
    fetch('/logout');
    window.location.href = "/";
 });

 //deshabilitar el formulario 1
 document.getElementById('folioNuevo').addEventListener('click', () => {
  const formulario = document.getElementById('formulario');
  const elementos = formulario.querySelectorAll('input, button, select, textarea');

  elementos.forEach(el => {
    if (el.id !== 'otrosText') {
      el.disabled = false;
    }
  });

  folioActual++; // Aumentamos el folio en la variable
  document.getElementById('folio').textContent = folioActual; // Lo mostramos
  const folioBtn = document.getElementById('folioNuevo');
  folioBtn.disabled = true;
});
  
 // Escuchar los radios por si el valor es otros
 const radiosMotivo = document.querySelectorAll('input[name="motivoSalida"]');
 const otrosInput = document.getElementById('otrosText');
 
 radiosMotivo.forEach(radio => {
   radio.addEventListener('change', () => {
     if (radio.checked && radio.value === 'Otros') {
       otrosInput.disabled = false;
       otrosInput.focus();
     } else {
       otrosInput.disabled = true;
       otrosInput.value = ""; // limpiar si se cambia de opción
     }
   });
 });
 

 document.getElementById('guardar').addEventListener('click', function (event) {
  event.preventDefault();  // Esto asegura que la página no se recargue si el formulario fuera un submit

  // Obtener los datos del formulario
  const folio = document.getElementById('folio').textContent;
  const nombreChofer = document.getElementById('nombreChofer').value;
  const listaCliente = document.getElementById('listaCliente').value;
  const direccionCliente = document.getElementById('direccionCliente').value;
  const atencionA = document.getElementById('atencionA').value;
  const telefono = document.getElementById('numeroTelefonico').value;
  const numeroPedido = document.getElementById('numeroPedido').value;
  const quienSolicita = document.getElementById('quienSolicita').value;
  const otrosText = document.getElementById('otrosText').value;
  const radios = document.querySelector('input[name="motivoSalida"]:checked');
  const observaciones = document.getElementById('observaciones').value;
  const fecha = new Date();
  const fechaN = fecha.toLocaleDateString();

  // Hacer una solicitud para obtener el usuario desde el servidor
  fetch('/ObtenerUsuario')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.usuario) {
        const usuario = data.usuario;

        // Validación de campos vacíos
        if (!nombreChofer || !listaCliente || !direccionCliente || !atencionA || !numeroPedido || !quienSolicita || !observaciones || !radios) {
          alert('Por favor, complete todos los campos obligatorios.');
          return; // Salir de la función si hay campos vacíos
        }

        // Si el motivo de salida es "Otros", se verifica si se ingresó texto en "otrosText"
        if (radios.value === 'Otros' && !otrosText) {
          alert('Por favor, ingrese un motivo en "Otros".');
          return; // Salir de la función si "otrosText" está vacío
        }

        // Crear los datos del formulario
        let datosForm1;
        if (radios.value === 'Otros') {
          datosForm1 = {
            Folio: folio,
            Usuario: usuario,
            Nombre_Chofer: nombreChofer,
            Lista_Cliente: listaCliente,
            Direccion_Cliente: direccionCliente,
            Atencion_A: atencionA,
            Telefono: telefono,
            Numero_Pedido: numeroPedido,
            Quien_Solicita: quienSolicita,
            Motivo_Salida: otrosText,
            Observaciones: observaciones,
            Fecha: fechaN
          };
        } else {
          datosForm1 = {
            Folio: folio,
            Usuario: usuario,
            Nombre_Chofer: nombreChofer,
            Lista_Cliente: listaCliente,
            Direccion_Cliente: direccionCliente,
            Atencion_A: atencionA,
            Telefono: telefono,
            Numero_Pedido: numeroPedido,
            Quien_Solicita: quienSolicita,
            Motivo_Salida: radios.value,
            Observaciones: observaciones,
            Fecha: fechaN
          };
        }

        // Si todo está bien, se guarda el formulario en el array
        arrayForm1.push(datosForm1);

        alert('Datos guardados con éxito ✅, Ingresa el material');
        const listado = document.getElementById('imprimirListado');
        listado.style.display = "flex";
        const formulario = document.getElementById('formulario');
        formulario.style.display = "none";
        console.log('Datos Generales Guardados', arrayForm1)
      } else {
        alert('No se pudo obtener el usuario de la sesión');
      }
    })
    .catch(error => {
      console.error('Error al obtener el usuario:', error);
      alert('Error al obtener la información del usuario');
    });
});

 // Función para registrar materiales
document.getElementById('registrar').addEventListener('click', function(event) {
  event.preventDefault();

  const confirmacion = confirm('¿Estás seguro de registrar?');

  if (!confirmacion) {
    console.log('Registro cancelado por el usuario.');
    return; // Si el usuario cancela, se detiene todo
  }

  arrayMaterial.length = 0; // Limpiamos el array por si ya había algo

  const filas = document.querySelectorAll('#verListado tbody tr');
  filas.forEach(fila => {
    const cantidad = fila.querySelector('input[name="cantidad[]"]').value.trim();
    const um = fila.querySelector('input[name="um[]"]').value.trim();
    const descripcion = fila.querySelector('input[name="descripcion[]"]').value.trim();
    const codigo = fila.querySelector('input[name="codigo[]"]').value.trim();
    const observacion = fila.querySelector('input[name="observacion[]"]').value.trim();

    const material = {
      Codigo: codigo,
      Descripcion: descripcion,
      Cantidad: cantidad,
      Um: um,
      Observacion: observacion
    };

    arrayMaterial.push(material);
  });

  console.log('Materiales registrados:', arrayMaterial);

  // Deshabilita el botón registrar para evitar duplicados
  document.getElementById('registrar').disabled = true;

  document.getElementById('agregar').disabled = true;

  document.getElementById('regresar').disabled = true;

  // Activa el botón imprimir
  document.getElementById('imprimir').disabled = false;
});
//funcion para agregar mas fila por los materiales
 document.getElementById('agregar').addEventListener('click', function(event){
  const tbody = document.querySelector('#verListado tbody');
  const nuevaFila = document.createElement('tr');
    
            nuevaFila.innerHTML = `
                <td></td>
                <td><input type="text" name="cantidad[]" placeholder="Cantidad"></td>
                <td><input type="text" name="um[]" placeholder="U/M"></td>
                <td><input type="text" name="descripcion[]" placeholder="Descripción"></td>
                <td><input type="text" name="codigo[]" placeholder="Código"></td>
                <td><input type="text" name="observacion[]" placeholder="Observación"></td>
                <td><button class="borrarFila">Borrar</button></td>
            `;
    
            tbody.appendChild(nuevaFila);
            actualizarNumeracion();
 });
 
 //borrar fila
 document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('borrarFila')) {
    e.preventDefault();
    const fila = e.target.closest('tr');
    if (fila) fila.remove();
    actualizarNumeracion();
  }
});
 
document.getElementById('regresar').addEventListener('click', function (event) {
  event.preventDefault();
  const listado = document.getElementById('imprimirListado');
  listado.style.display = "none";
  const formulario = document.getElementById('formulario');
  formulario.style.display = "grid";
  arrayForm1 = [];
  console.log('Datos generales borrados', arrayForm1);
});


document.getElementById('imprimir').addEventListener('click', function() {
  // Crear el contenido para la impresión
  const contenidoFormulario = `
  <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 30px; font-size: 12px; ">
      <div style="width: 48%; margin-bottom: 15px;">Folio: ${arrayForm1[0].Folio}</div>
      <div style="width: 48%; margin-bottom: 15px;">Fecha: ${arrayForm1[0].Fecha}</div>
      <div style="width: 48%; margin-bottom: 15px;">Chofer: ${arrayForm1[0].Nombre_Chofer}</div>
      <div style="width: 48%; margin-bottom: 15px;">Cliente: ${arrayForm1[0].Lista_Cliente}</div>
      <div style="width: 48%; margin-bottom: 15px;">Dirección: ${arrayForm1[0].Direccion_Cliente}</div>
      <div style="width: 48%; margin-bottom: 15px;">Atención: ${arrayForm1[0].Atencion_A}</div>
       <div style="width: 48%; margin-bottom: 15px;">Telefono: ${arrayForm1[0].Telefono}</div>
      <div style="width: 48%; margin-bottom: 15px;">Pedido: ${arrayForm1[0].Numero_Pedido}</div>
      <div style="width: 48%; margin-bottom: 15px;">Solicitante: ${arrayForm1[0].Quien_Solicita}</div>
      <div style="width: 48%; margin-bottom: 15px;">Motivo de Salida: ${arrayForm1[0].Motivo_Salida}</div>
      <div style="width: 48%; margin-bottom: 15px;">Observaciones: ${arrayForm1[0].Observaciones}</div>
  </div>
`;

  const contenidoMateriales = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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
              ${arrayMaterial.map(material => `
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

  // Crear la ventana de impresión
  const printWindow = window.open('', 'Imprimir Salida', 'height=600,width=800');
    printWindow.document.open();
    printWindow.document.write(`
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
            }
            th {
                background-color: #f2f2f2;
            }
            .firma {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
            }
            .firma div {
                width: 48%;
                text-align: center;
            }
             .firma-box {
text-align: center;
margin-bottom: 30px;
}

.firma-line {
border-top: 1px solid #000;
margin-top: 10px;
width: 100px; /* Ajusta el ancho de la línea según sea necesario */
margin-left: auto;
margin-right: auto;
}
            .logo {
                text-align: right;
                margin-bottom: 20px;
            }
            .logo img {
                width: 40px;
                height: auto;
                margin-top: -80;
            }
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                }
                h1 {
                    font-size: 16px;
                }
                table {
                    width: 100%;
                    border: 1px solid #000;
                }
                th, td {
                    font-size: 12px;
                }
            }
        </style>
    </head>
    <body>
        <h1 style="font-size: 16px;">IMPULSORA INDUSTRIAL DE REFIRGERACION SA DE CV</h1>
        <h2 style="font-size: 10px; text-align: left; width: 190px; margin-top: 30px;">CALLE MAIZ 43 C. GRANJAS ESMERALDA. CIUDAD DE 09640 IZTAPALAPA 55-5445-7875</h2>
        <h2 style="font-size: 10px;  width: 230px; margin-top: -40; margin-left: 80%;">CARR.-TESISTAN # 8837 COL. PREDIO POTRERO GRANDE ZAPOPAN, JAL. C.P. 45200 TEL / FAX 3836-06-00</h2>
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
</html>
    `);
    printWindow.document.close();

  // Imprimir y cerrar después de un breve retraso
  setTimeout(() => {
      printWindow.print();
      printWindow.close();
  }, 500);
});

document.getElementById('imprimir').addEventListener('click', function () {
  if (arrayForm1.length === 0 || arrayMaterial.length === 0) {
    alert("Faltan datos del formulario o materiales.");
    return;
  }

  // Preparamos los datos a enviar
  const salidaData = {
    datosForm: arrayForm1[0],  // Solo hay uno
    materiales: arrayMaterial
  };
  console.log(salidaData);

  fetch('/registrarSalida', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(salidaData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.folio) {
      alert(`Salida registrada correctamente ✅. Folio: ${data.folio}`);
      // Limpiar arrays si todo fue exitoso
      arrayForm1 = [];
      arrayMaterial = [];
    } else {
      alert('Hubo un error al registrar la salida.');
    }
  })
  .catch(error => {
    console.error('Error al enviar:', error);
    alert('Error de conexión con el servidor.');
  });

  setTimeout(() => {
    location.reload();
}, 1000);
});

 // Función para actualizar los números de las filas
 function actualizarNumeracion() {
  const filas = document.querySelectorAll('#verListado tbody tr');
  filas.forEach((fila, index) => {
      fila.cells[0].textContent = index + 1;
  });
}





