class Ciudad{
    constructor(nombre){
        this.nombre = nombre; 
    }
}

class Conexion{
    constructor(origen, destino, tipo, atributos){
        this.origen = origen;
        this.destino = destino; 
        this.tipo = tipo; 
        this.atributos = atributos;
    }
}

class Ruta{
    constructor(){
        this.ciudades = []; 
        this.conexiones = [];
    }

    agregarCiudad(nombre){
        if(this.ciudades.length >= 6){
            alert("Ya fueron ingresadas todas las ciudades")
            return null
        }
        let ciudad = new Ciudad(nombre)
        this.ciudades.push(ciudad);
        this.guardarDatos();
        return ciudad;
    }

    agregarConexion(ciudadOrigen, ciudadDestino, tipo, atributos){
        let origen = this.ciudades.find(
            (ciudad) => ciudad.nombre === ciudadOrigen
        );
        let destino = this.ciudades.find(
            (ciudad) => ciudad.nombre === ciudadDestino
        );
        let conexion = new Conexion(origen, destino, tipo, atributos);
        this.conexiones.push(conexion);
        this.guardarDatos();
    }

    //Función para encontrar la ruta
    encontrarRuta(origen, destino){

        let rutasSolicitadas = {}; // Almacena las rutas solicitadas
        let cola = [];
        
        cola.push({ciudad: origen, ruta: []});
    
        while (cola.length>0){
            let elemento = cola.shift();
            let ciudadElemento = elemento.ciudad;
            let rutaElemento = elemento.ruta;
    
            //verificar si la ciudad es la de destino
            if(ciudadElemento === destino){ 
                let rutaEncontrada = '<h2>Ruta encontrada:</h2>'
                rutaElemento.forEach((conexion, index)=>{
                    rutaEncontrada +=`${index + 1}. Toma el ${conexion.tipo}, ${conexion.atributos} desde ${conexion.origen.nombre} hasta ${conexion.destino.nombre} <br> `
                }); 
                rutaEncontrada += '¡Felicidades, llegaste a destino!'

                //Mostrar el resultado 
                document.getElementById("ruta-result").innerHTML = rutaEncontrada;
                return;            
            }
            
            rutasSolicitadas[ciudadElemento.nombre] = true; 
            
            //Filtrar las conexiones de la ciudad ingresada
            let conexionesCiudad = this.conexiones.filter(
                (conexion) => conexion.origen === ciudadElemento
            );
            
            //Explorar todas las conexiones de la ciudad ingresada
            conexionesCiudad.forEach((conexion)=>{
                if(!rutasSolicitadas[conexion.destino.nombre]){
                    cola.push({
                        ciudad: conexion.destino, 
                        ruta: rutaElemento.concat(conexion)
                    })
                }
            })
        }
        
        //Mostrar un mensaje si no se encuentra unra ruta válida
        document.getElementById("ruta-result").textContent = "No existe una ruta válida entre las ciudades.";

    }

    guardarDatos(){
        localStorage.setItem('ruta', JSON.stringify(this));
    }

    cargarDatos(){
        let datosGuardados = localStorage.getItem('ruta');
        if(datosGuardados){
            let { ciudades, conexiones } = JSON.parse(datosGuardados);
            this.ciudades = ciudades.map((ciudad)=>new Ciudad(ciudad.nombre));
            this.conexiones = conexiones.map((conexion) =>{
                let origen = this.ciudades.find(
                    (ciudad)=>ciudad.nombre === conexion.origen.nombre
                );
                let destino = this.ciudades.find(
                    (ciudad) => ciudad.nombre === conexion.destino.nombre
                );
                return new Conexion(
                    origen, 
                    destino, 
                    conexion.tipo, 
                    conexion.atributos
                );
            });
        }
    }
};

function actualizarSelects() {
    let opciones = ruta.ciudades.map(
        (ciudad) => `<option>${ciudad.nombre}</option>`
    );
    let origenInput = document.getElementById("origen-input");
    let destinoInput = document.getElementById("destino-input");
    let origenBuscarInput = document.getElementById("origen-buscar-input");
    let destinoBuscarInput = document.getElementById("destino-buscar-input");
    origenInput.innerHTML = opciones.join("");
    destinoInput.innerHTML = opciones.join("");
    origenBuscarInput.innerHTML = opciones.join("");
    destinoBuscarInput.innerHTML = opciones.join("");
}

function cargarCiudadesExistente() {
    ruta.cargarDatos();
    actualizarSelects();
}

let ruta = new Ruta();
ruta.cargarDatos();
cargarCiudadesExistente()

//------Utilizo eventos para la interacción con el usuario-----//
let ciudadForm = document.getElementById('ciudad-form');
let conexionForm = document.getElementById('conexion-form');
let buscarRutaForm = document.getElementById("buscar-ruta-form");
let rutaResult = document.getElementById("ruta-result");

ciudadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ciudadInput = document.getElementById("ciudad-input");
    const nombreCiudad = ciudadInput.value;

    if (ruta.ciudades.some((ciudad) => ciudad.nombre == nombreCiudad)) {
        console.log(
            `La ciudad ${nombreCiudad} ya fue agregada. Por favor ingrese otra ciudad.`
            );
    }else{
        ruta.agregarCiudad(nombreCiudad);
        actualizarSelects();
        ciudadInput.value = "";
    }
});

conexionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let origenInput = document.getElementById("origen-input");
    let destinoInput = document.getElementById("destino-input");
    let tipoInput = document.getElementById("tipo-input");
    let atributosInput = document.getElementById("atributos-input");

    let nombreOrigen = origenInput.value;
    let nombreDestino = destinoInput.value;
    let tipoConexion = tipoInput.value;
    let atributosConexion = atributosInput.value;

    ruta.agregarConexion(
        nombreOrigen, 
        nombreDestino, 
        tipoConexion, 
        atributosConexion
    );

    origenInput.value = "";
    destinoInput.value = "";
    tipoInput.value = "";
    atributosInput.value = "";
});

buscarRutaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let nombreOrigenBuscar = document.getElementById("origen-buscar-input").value;
    let nombreDestinoBuscar = document.getElementById("destino-buscar-input").value;
    let origenBuscar = ruta.ciudades.find(
        (ciudad) => ciudad.nombre === nombreOrigenBuscar
    );
    let destinoBuscar = ruta.ciudades.find(
        (ciudad) => ciudad.nombre === nombreDestinoBuscar
    );

    rutaResult.textContent = "";
    ruta.encontrarRuta(origenBuscar, destinoBuscar);
  });





