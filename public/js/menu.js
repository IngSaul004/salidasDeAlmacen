document.getElementById('captura').addEventListener('click', function(){
    window.location.href = "/Captura";
});

document.getElementById('editar').addEventListener('click', function(){
    window.location.href = "/Edicion";
});

document.getElementById('reporte').addEventListener('click', function(){
    window.location.href = "/Reporte";
});

document.getElementById('cerrarSesion').addEventListener('click', function(){
    fetch('/logout')
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

 