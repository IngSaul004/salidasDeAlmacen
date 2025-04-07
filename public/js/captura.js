let arrayForm1 = [];
let datosForm1 = {};
let material = {};
let arrayMaterial = [];
let folioActual = 0;

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



//llamada al endpoint de ultimo folio para obtenerlo
fetch('/UltimoFolio')
  .then(response => response.json())
  .then(data => {
    folioActual = parseInt(data.folio); // lo guardamos como número
    document.getElementById('folio').textContent = folioActual;
  })
  .catch(error => console.error('Error al obtener el último folio:', error));



document.getElementById('verLista').addEventListener('click', function (event){
    event.preventDefault();
    const listado = document.getElementById('imprimirListado');
    listado.style.display = "flex";
});

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
        const listado = document.getElementById('listado');
        listado.style.display = "flex";
        const formulario = document.getElementById('formulario');
        formulario.style.display = "none";
      } else {
        alert('No se pudo obtener el usuario de la sesión');
      }
    })
    .catch(error => {
      console.error('Error al obtener el usuario:', error);
      alert('Error al obtener la información del usuario');
    });
});





 //funcion para registrar materiales 

 document.getElementById('guardarLista').addEventListener('click', function(event){
  event.preventDefault();
  const codigo = document.getElementById('codigo');
  const descripcionMaterial = document.getElementById('descripcionMaterial');
  const cantidad = document.getElementById('cantidad');
  const um = document.getElementById('um');
  const observacionLista = document.getElementById('observacionLista');

  material = {
    Codigo: codigo.value,
    Descripcion: descripcionMaterial.value,
    Cantidad: cantidad.value,
    Um: um.value,
    Observacion: observacionLista.value
  };
  arrayMaterial.push(material);
  alert('Material Guardado');
    codigo.value = "";
    descripcionMaterial.value = "";
    cantidad.value = "";
    um.value = "";
    observacionLista.value = "";
 });

 
document.getElementById('regresar').addEventListener('click', function (event) {
  event.preventDefault();

  const listado = document.getElementById('imprimirListado');
  listado.style.display = "none";
});


 // Función para mostrar los materiales en la tabla
document.getElementById('verLista').addEventListener('click', function () {
  const tbody = document.querySelector('#verListado tbody');
  tbody.innerHTML = ''; // Limpiamos antes de agregar nuevos

  arrayMaterial.forEach((material, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${material.Cantidad}</td>
      <td>${material.Um}</td>
      <td>${material.Descripcion}</td>
      <td>${material.Codigo}</td>
      <td>${material.Observacion}</td>
      <td><button class="borrar" data-codigo="${material.Codigo}">Borrar</button></td>
    `;
    tbody.appendChild(row);
  });

  // Mostrar la tabla (por si está oculta)
  document.getElementById('imprimirListado').style.display = 'block';
});

// Evento para borrar el material desde la tabla
document.querySelector('#verListado tbody').addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('borrar')) {
    const codigoAEliminar = event.target.getAttribute('data-codigo');

    // Buscar el índice del material con el código especificado
    const indice = arrayMaterial.findIndex(material => material.Codigo === codigoAEliminar);

    if (indice !== -1) {
      // Eliminar el material del array
      arrayMaterial.splice(indice, 1);
      alert('Material eliminado con éxito.');

      // Actualizar la tabla después de eliminar el material
      mostrarMateriales();
    } else {
      alert('El material con el código especificado no se encuentra.');
    }
  }
});

// Función para mostrar los materiales en la tabla (actualizada después de eliminar)
function mostrarMateriales() {
  const tbody = document.querySelector('#verListado tbody');
  tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos

  arrayMaterial.forEach((material, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${material.Cantidad}</td>
      <td>${material.Um}</td>
      <td>${material.Descripcion}</td>
      <td>${material.Codigo}</td>
      <td>${material.Observacion}</td>
      <td><button class="borrar" data-codigo="${material.Codigo}">Borrar</button></td>
    `;
    tbody.appendChild(row);
  });
}

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
                      <td>${material.Codigo}</td>
                      <td>${material.Descripcion}</td>
                      <td>${material.Um}</td>
                      <td>${material.Cantidad}</td>
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
Nombre y Firma
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

document.getElementById('registrar').addEventListener('click', function () {
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






