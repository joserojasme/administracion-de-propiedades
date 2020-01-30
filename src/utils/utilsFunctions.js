export function numberFormat(num) {
    return num.toString().replace(/(\d)(?:(?=\d+(?=[^\d.]))(?=(?:[0-9]{3})+\b)|(?=\d+(?=\.))(?=(?:[0-9]{3})+(?=\.)))/g, "$1,");

}

export function handleKeyPressDecimal(event){
    let key = String.fromCharCode(window.event ? event.which : event.keyCode);
    const patron = /^[0-9\.]+$/;
    if(!patron.test(key)){
        return false;
    }else{
        return true;
    }
}

export function handleKeyPressNumeros(event){
    let key = String.fromCharCode(window.event ? event.which : event.keyCode);
    const patron = /^\d+$/;
    if(!patron.test(key)){
        return false;
    }else{
        return true;
    }
}

export function handleKeyPressTexto(event){
    let key = String.fromCharCode(window.event ? event.which : event.keyCode);
    const patron = /^[a-zA-Z ]*$/;
    if(!patron.test(key)){
        return false;
    }else{
        return true;
    }
}

export function HandleKeyPressTextoNumeros(event){
    let key = String.fromCharCode(window.event ? event.which : event.keyCode);
    const patron = /^[A-Za-z0-9\s]+$/;
    if(!patron.test(key)){
        return false;
    }else{
        return true;
    }
}

export function handleKeyPressTextoNumeroGuion(event){
    let key = String.fromCharCode(window.event ? event.which : event.keyCode);
    const patron = /^[A-Za-z0-9\-]*$/;
    if(!patron.test(key)){
        return false;
    }else{
        return true;
    }
}

export function handleKeyPressTextoEmail(event){
    let key = String.fromCharCode(window.event ? event.which : event.keyCode);
    const patron = /^[A-Za-z0-9\-\@\.\_À-ÿ\u00f1\u00d1]*$/;
    if(!patron.test(key)){
        return false;
    }else{
        return true;
    }
}

let letras="abcdefghyjklmnñopqrstuvwxyz";
let letrasMAYUS="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

export function tieneLetras(texto){
    for(let i=0; i<texto.length; i++){
       if (letras.indexOf(texto.charAt(i),0)!=-1){
          return 1;
       }

       if (letrasMAYUS.indexOf(texto.charAt(i),0)!=-1){
        return 1;
     }
    }
    
    return 0;
 }

export function formatofecha(fecha){
    return fecha.toString().substring(0, 10);
}

export  function nombreMes  (mes){
    var nombreMes;
    switch(mes){
        case 1:
        nombreMes = 'Enero';
        break;
        case 2:
        nombreMes = 'Febrero';
        break;
        case 3:
        nombreMes = 'Marzo';
        break;
        case 4:
        nombreMes = 'Abril';
        break;
        case 5:
        nombreMes = 'Mayo';
        break;
        case 6:
        nombreMes = 'Junio';
        break;
        case 7:
        nombreMes = 'Julio';
        break;
        case 8:
        nombreMes = 'Agosto';
        break;
        case 9:
        nombreMes = 'Septiembre';
        break;
        case 10:
        nombreMes = 'Octubre';
        break;
        case 11:
        nombreMes = 'Noviembre';
        break;
        case 12:
        nombreMes = 'Diciembre';
        break;
        default:
                nombreMes = 'Desconocido';
    }

    return nombreMes;
}