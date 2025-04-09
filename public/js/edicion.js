//const y variables generales
const imprimirBtn = document.getElementById('imprimir');
const editarBtn = document.getElementById('guardar');
const guardarBtn = document.getElementById('editar');
const mostrarFolioBtn = document.getElementById('foliosBtn');
const cerrarSesionBtn = document.getElementById('cerrarSesion');

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

  //cerrar sesion boton

  cerrarSesionBtn.addEventListener('click', function(event){
    event.preventDefault();
    fetch('/logout');
    window.location.href = "/";
  });

  //obtener los folios funcion
 window.onload = cargarFolios();
  function cargarFolios() {
    fetch('/folios')
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById('folios');
        select.innerHTML = '<option value="">Seleccione un folio</option>'; // reinicia

        data.forEach(f => {
          const option = document.createElement('option');
          option.value = f.Folio;
          option.textContent = f.Folio;
          select.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar los folios:', error);
      });
  }

  
  // Agregar el event listener para cuando el select cambie de valor
  document.getElementById('folios').addEventListener('change', function() {
    const folio = this.value;
    if (folio) {
      cargarInfoFolio(folio);
    }
  });

  function cargarInfoFolio(folio) {
    fetch(`/folios/${folio}`)
      .then(response => response.json())
      .then(data => {
        const salida = data.salida;
        const materiales = data.materiales;

        // Llena los campos con los datos de la salida
        document.getElementById('usuarioFolio').value = salida.UsuarioNombre || '';
        document.getElementById('nombreChofer').value = salida.Chofer_nombre || '';
        document.getElementById('cliente').value = salida.Cliente_nombre || '';
        document.getElementById('direccionCliente').value = salida.Direccion || '';
        document.getElementById('atencionA').value = salida.Atencion_a|| '';
        document.getElementById('numeroPedido').value = salida.Numero_Pedido || '';
        document.getElementById('quienSolicita').value = salida.Quien_solicita || '';
        document.getElementById('motivoSalida').value = salida.Motivo_salida || '';
        document.getElementById('observaciones').value = salida.Observaciones || '';

        // Llena la tabla con los materiales
        const tbody = document.querySelector('#verListadoVista tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

        materiales.forEach((mat, index) => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${mat.Cantidad}</td>
            <td>${mat.Um}</td>
            <td>${mat.Descripcion}</td>
            <td>${mat.Codigo}</td>
            <td>${mat.Observacion || ''}</td>
            <td></td> <!-- Columna de borrar vacía por ahora -->
          `;
          tbody.appendChild(fila);
        });
      })
      .catch(err => {
        console.error('Error al cargar información del folio:', err);
      });
  }

  document.getElementById('footer').addEventListener('click', function(){
    const popup = document.getElementById('popup');
    popup.style.display = "flex";
 });

 document.getElementById('cerrar-btn').addEventListener('click', function(){
    const popup = document.getElementById('popup');
    popup.style.display = "none";
 });

  editarBtn.addEventListener('click', function(event){
    event.preventDefault();

        // Habilitar los campos de entrada
        document.querySelectorAll('#formModificar input').forEach(input => {
            input.disabled = false;
        });
        
        document.querySelectorAll('#formModificar select').forEach(select => {
            select.disabled = false;
        });
        
        // Habilitar el botón de guardar
        guardarBtn.disabled = false;
    
    

  });