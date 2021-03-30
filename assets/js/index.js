// El primer módulo que creamos es la interfaz del programa
const interfaz = ( function (){
    const btnMenu   = document.getElementById( 'btn-menu' );
    const btnCerrar = document.getElementById( 'btn-cerrar' );
    const btnToggle = document.getElementById( 'btn-toggle' );
    
    
    const mostrarAPP = () => {
        document.getElementById( 'loader' ).classList.add( 'ocultar' );
        document.querySelector( 'main' ).removeAttribute( 'hidden' );
    }
    const mostrarLoader = () => {
        document.getElementById( 'loader' ).classList.remove( 'ocultar' );
        document.querySelector( 'main' ).setAttribute( 'hidden', true );  
    }
    const mostrarMenu = () => {
        document.getElementById( 'contenedor-menu' ).style.right = '0%';
    }
    const ocultarmenu = () => {
        document.getElementById( 'contenedor-menu' ).style.right = '-65%';
    }
    const mostrarHoras = () => {
        const seccionDias  = document.getElementById( 'temperatura-diaria' ),
              seccionHoras = document.getElementById( 'temperatura-horas'),
              flecha       = document.getElementById( 'flecha' ),
              //Seleccionamos el valor del atributo visible, lo guarda en un string
              visible      = seccionHoras.getAttribute( 'visible' );
        if( visible == 'false' ) {
            seccionHoras.setAttribute( 'visible', true );
            seccionHoras.style.bottom  = '0%';
            seccionHoras.setAttribute( 'visible', false );
            seccionHoras.style.bottom  = '-100%';
            seccionDias.style.opacity = '1';
            flecha.style.transform     = 'rotate(0deg)';
        }
    }



    btnMenu.addEventListener( 'click', mostrarMenu );
    btnCerrar.addEventListener( 'click', ocultarmenu );
    btnToggle.addEventListener( 'click', mostrarHoras);

    return {
        mostrarAPP,
        mostrarLoader
    }
})();
// Modulo que gestiona la localización de la aplicación
const localizacion = (function () {
    //Seleccionamos el input y el botón
    const inputLocalizacion = document.getElementById( 'add-localizacion' );
    const btnLocalizacion   = document.getElementById( 'btn-add-ciudad' );
    let inputValor;
    let addLocalizacion;

    //Cuando escribimos lo limpiamos y activamos el botón
    inputLocalizacion.addEventListener( 'input' , () => {
        //Borramos los espacios inciales y finales de una cadena de texto
        inputValor = inputLocalizacion.value.trim();
        //Si hay un valor desactivamos el botón y le asignamos la clase
        if ( inputValor ) {
            btnLocalizacion.removeAttribute( 'disabled' );
            btnLocalizacion.classList.remove( 'disabled');    
        } else {
            btnLocalizacion.setAttribute( 'disabled', true);
            btnLocalizacion.classList.add( 'disabled');    
        }
    });
    //Cuando el usuario aprete el botón se guardará el contenido en una variable
    //y vaciara el input y apagaré el botón
    btnLocalizacion.addEventListener( 'click', () => {
        addLocalizacion = inputValor;
        btnLocalizacion.setAttribute( 'disabled', true);
        btnLocalizacion.classList.add( 'disabled');  
        inputLocalizacion.value = '';

        //Llamamos al modulo que tenemos para obtener el tiempo
        obtenerTiempo.tiempoLocalidad( addLocalizacion );
    })
})();
// Modulo que gestiona la comunicación con la API
const obtenerTiempo = ( function () {
    //Guardamos la claves para conectarnos a las APIS en constantes
    const geoCodeKey     = '79c40968a1594d8494a61c98997d8457';
    const openWeatherKey = 'ce16d33e35f855d0bebee867f0ada7a3'
    
    //Guardamos en constantes la direcciones de las peticiones, en la primera obtendremos la latitud y la longitud para usarlas en la petición del tiempo, de la cual excluimos, las alertas y el tiempo en minutos
    const geoCodeURL     = ( localidad ) => `https://api.opencagedata.com/geocode/v1/json?q=${ localidad }&key=${ geoCodeKey }`;
    const openWeatherURL = ( lat, lon ) => `https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ lon }&exclude=minutely,alerts&appid=${ openWeatherKey }`;

    //Creamos las variables para guardar la latitud y la longitud
   

    const tiempoLocalidad = ( localidad ) => {
        let latitud,
            longitud;   
        const respuestaLatLong = fetch( geoCodeURL( localidad ) )
            .then( respuestaLatLong => respuestaLatLong.json() )
            .then( ( datos ) => {
                latitud  = datos.results[0].geometry.lat;
                longitud = datos.results[0].geometry.lng;
                console.log( latitud, longitud)
                })
            .catch( error => console.log( error ) )
        const respuestaTiempo = fetch( openWeatherURL( latitud, longitud ) )
            .then( respuestaTiempo => respuestaTiempo.json() )
            .then( ( datos ) => {
                console.log( datos )
                })
            .catch( error => console.log( error ) )

    }
    return {
        tiempoLocalidad
    }
})();

// Inicio
window.onload = function() {
    interfaz.mostrarAPP();


}
