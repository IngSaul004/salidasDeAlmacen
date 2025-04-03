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
 