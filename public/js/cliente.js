document.addEventListener('DOMContentLoaded', function(){
    const registrarClienteBtn = document.getElementById('registrarCliente');

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

registrarClienteBtn.addEventListener('click', async function(event) {
    event.preventDefault();
  
    const cliente = document.getElementById('cliente').value;
    const direccion = document.getElementById('direccion').value;
    const contacto = document.getElementById('contacto').value;
    const numeroTelefonico = document.getElementById('numeroTelefonico').value;
  
    try {
      const response = await fetch("/registrarCliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cliente, direccion, contacto, numeroTelefonico })
      });
  
      const data = await response.json();
      
      if (data.success) {
        alert("Cliente registrado correctamente");
        // Opcional: Limpiar el formulario
        cliente = "";
        direccion = "";
        contacto = "";
        numeroTelefonico = "";
          } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      alert("Error al conectar con el servidor");
    }
  });
  
});