 // Añadimos el evento 'click' para el botón, en lugar de 'submit' en el formulario
 document.getElementById("login").addEventListener("click", async function(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena })
    });

    const data = await response.json();
    if (data.success) {
        if(data.Usuario){
            window.location.href = "/Menu";
        }
    }
  });