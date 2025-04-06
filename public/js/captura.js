//funciona para habilitar los popups
document.getElementById('guardar').addEventListener('click', function (event){
    event.preventDefault();
    const listado = document.getElementById('listado');
    listado.style.display = "flex";
    const formulario = document.getElementById('formulario');
    formulario.style.display = "none";
});

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

