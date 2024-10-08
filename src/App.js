import './App.css';
import axios from "axios";
import react from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineElement,
} from 'chart.js';
import { Populares } from './componentes/Populares';
import { Footer } from './componentes/Footer';
import { Navbar } from './componentes/Navbar';
import { GrSatellite } from "react-icons/gr";
import { PiWaveSineDuotone } from "react-icons/pi";
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from "leaflet";



function App() {

  const baseURL = "https://api.open-elevation.com/api/v1/lookup";

  const [post, setPost] = react.useState([]);
  const [lineaDeVista, setLineaDeVista] = react.useState([]);
  const [alturaAntena1, setAlturaAntena1] = react.useState(100);
  const [alturaAntena2, setAlturaAntena2] = react.useState(100);
  const [coordenadas, setCoordenadas] = react.useState([
  {
    "latitude": 4.848398,
    "longitude": -75.714645
  },
  { 
    "latitude": 4.896642,
    "longitude": -75.844992
  }
  ])
  const [frecuencia,setFrecuencia] = react.useState();
  const [x,setX] = react.useState();
  const [y,setY] = react.useState();
  const [n,setN] = react.useState(1);
  const [radio, setRadio] = react.useState(0);
  const [unidadFrecuencia, setUnidadFrecuencia] = react.useState('Hz');
  const [unidadLongitud, setUnidadLongitud] = react.useState('M');
  const [elipsoide, setElipsoide] = react.useState([]);
  const [reset, setReset] = react.useState(false);
  const [errores, setErrores] = react.useState(false);
  const [mensajeError, setMensajeError] = react.useState("");
  const [horizonteRadio, setHorizonteRadio] = react.useState(0);
  const [potenciaTransmitida, setPotenciaTransmitida] = react.useState();
  const [gananciaTransmisor, setGananciaTransmisor] = react.useState();
  const [gananciaReceptor, setGananciaReceptor] = react.useState();
  const [perdidasAdicionales, setPerdidasAdicionales] =react.useState();
  const [potenciaRecibida, setPotenciaRecibida] = react.useState();
  const [coordenadasMapa, setCoordenadasMapa] = react.useState([
    [4.848398,-75.714645],
    [4.896642,-75.844992]
    ]);
  const [center, setCenter] = react.useState([4.896642,-75.844993]);

  const zonaFresnel = (frecuencia,x,y,n,unidadFrecuencia,unidadLongitud) => {

    x = Number(x);
    y = Number(y);
    frecuencia = Number(frecuencia);
    n = Number(n);
    
    switch(unidadFrecuencia){

      case 'GHz':
      frecuencia *=1000000000;
      //console.log("ESTÁ EN GHz");
      break;

      case 'MHz':
      frecuencia *=1000000;
      //console.log("ESTÁ EN MHZ");
      break;

      case 'KHz':
      frecuencia *=1000;
      //console.log("ESTÁ EN KHZ");
      break;
        
      default:
        //console.log("ESTÁ EN Hz");


    }

    switch(unidadLongitud){

      case 'KM':
      x *= 1000;
      y *= 1000;
      //console.log("ESTÁ EN KM");
      break;

      case 'MILLAS':
      x*= 1609;
      y*= 1609;
      //console.log("ESTÁ EN MILLAS");
      break;

      default:
      //console.log("ESTÁ EN METROS");


    }


    const velocidadLuz = 300000000;
    let longitudOnda;
    let paso2;
    let radio = 0;

    if(frecuencia&&x&&y&&n){

        longitudOnda = velocidadLuz/frecuencia;  
        const distancia = x + y;
        const paso1 = n*longitudOnda*x*y;
        paso2 = paso1/distancia;
        radio = Math.sqrt(paso2);
/*
            console.log(longitudOnda);
            console.log(distancia);
            console.log(paso1);
            console.log(paso2);
            console.log(`El radio es igual a: ${radio.toFixed(2)} metros`)*/
     }

  return radio;

}


const ejecutar = () =>{
  setRadio(zonaFresnel(frecuencia,x,y,n,unidadFrecuencia,unidadLongitud));
  CalcularElipsoide();

}

  async function createPost() {

    console.log(coordenadas)

try {
  
  await axios.post(baseURL,
    {
      "locations": puntosPeticion

    }
        )
      .then((response) => {

        
        setPost([...response.data.results]);
    
      });
      
      let coords = [
        [coordenadas[0].latitude, coordenadas[0].longitude],
        [coordenadas[1].latitude, coordenadas[1].longitude]
      ]

      let centerLat = Math.abs(coordenadas[0].latitude-coordenadas[1].latitude)/2;
      centerLat = coordenadas[0].latitude + centerLat;

      let centerLon = Math.abs(coordenadas[0].longitude-coordenadas[1].longitude)/2;
      centerLon = coordenadas[0].longitude + centerLon;

      let centerCoords = [centerLat,centerLon];

      setCenter(centerCoords);

      setCoordenadasMapa(coords);

      setErrores(false);
      setMensajeError("");
      ejecutar();


} catch (error) {
  ManejadorErrores(error);
}
    
}

const HorizonteRadio = () =>{

  let HR1 = Math.sqrt(17*alturaAntena1);
  let HR2 = Math.sqrt(17*alturaAntena2);
  let HR = HR1 + HR2;
  setHorizonteRadio(HR);

}

let PuntosMedios = [];
const NPuntos = 18;
const NApuntos = 20;

//Usando ambas coordenadas podemos calcular puntos intermedios haciendo sumas y restas de latitudes y longitudes

const calcularPuntos = (lat1,long1,lat2,long2) =>{

    let diferenciaEntreLatitudes = Math.abs(lat1-lat2);
    let diferenciaEntreLongitudes = Math.abs(long1-long2);

    let segmentoLatitudes = diferenciaEntreLatitudes/NPuntos;
    let segmentoLongitudes = diferenciaEntreLongitudes/NPuntos;


    for(let i = 0; i<NPuntos;i++){

        let puntoNuevo = {}; 

        if(lat1 > lat2){
            lat1 -= segmentoLatitudes;
            puntoNuevo.latitude = lat1;  
        }
        if(lat1 < lat2){
            lat1 += segmentoLatitudes;
            puntoNuevo.latitude = lat1
        }
        if(long1 > long2){
            long1-=segmentoLongitudes;
            puntoNuevo.longitude = long1;
        }
        if(long1 < long2){
            long1 +=segmentoLongitudes;
            puntoNuevo.longitude = long1;
        }

        PuntosMedios.push(puntoNuevo);         
    }



  } 


calcularPuntos(coordenadas[0].latitude,coordenadas[0].longitude,coordenadas[1].latitude,coordenadas[1].longitude);


//Aqui calculamos la linea de vista basandonos en puntos intermedios entre el punto más alto y el punto mas bajo

const calcularLineaDeVista = () => {

  try {
    
  let LineaVision =[];


  let aux = post.length;
  let alt1 = +post[0].elevation + +alturaAntena1;
  let alt2 = +post[aux-1].elevation + +alturaAntena2;
  
  let diferenciaEntreAlturas= Math.abs(alt1-alt2);

  let segmentoAltitudes = diferenciaEntreAlturas/(NApuntos-1);

  for(let i=0;i<NApuntos;i++){
  
    let puntoNuevo = {}
   
    if(alt1 > alt2){
    puntoNuevo.elevation = alt1 - segmentoAltitudes * i;
    }else if(alt1 < alt2){
    puntoNuevo.elevation = alt1 + segmentoAltitudes * i;

    }
    LineaVision.push(puntoNuevo);
  
  }
    setLineaDeVista(LineaVision);
    setErrores(false);
    setMensajeError("");
    HorizonteRadio();

} catch (error) {

  ManejadorErrores(error);

}}
let puntosPeticion = [coordenadas[0],...PuntosMedios,coordenadas[1]];

//Tomando como referencia las coordenadas hacemos la formula del semiverseno para conocer la distancia por la curvatura
const calcularDistanciaEntreDosCoordenadas = (lat1, lon1, lat2, lon2) => {
  // Convertir todas las coordenadas a radianes
  lat1 = gradosARadianes(lat1);
  lon1 = gradosARadianes(lon1);
  lat2 = gradosARadianes(lat2);
  lon2 = gradosARadianes(lon2);
  // Aplicar fórmula
  const RADIO_TIERRA_EN_KILOMETROS = 6371;
  let diferenciaEntreLongitudes = (lon2 - lon1);
  let diferenciaEntreLatitudes = (lat2 - lat1);
  let a = Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RADIO_TIERRA_EN_KILOMETROS * c;
};

const gradosARadianes = (grados) => {
  return grados * Math.PI / 180;
};

const distanciaEnKilometros = calcularDistanciaEntreDosCoordenadas(coordenadas[0].latitude, coordenadas[0].longitude, coordenadas[1].latitude, coordenadas[1].longitude);
let elipse1 = [];

//Con esta funcion podemos calcular cada uno de los puntos de la elipse de fresnel en dos series, con base en la altura de linea de vista
const CalcularElipsoide = () =>{

try {

  let distanciaTotal = distanciaEnKilometros*1000;
  let distanciaSegmentos = distanciaTotal/NApuntos;  

  for(let i=0;i<NApuntos;i++){
    let nuevaMarca = {}

    let xAux = distanciaSegmentos * i+1
    let yAux = distanciaTotal - distanciaSegmentos * i
    
    let radioPunto = zonaFresnel(frecuencia,xAux,yAux,n,unidadFrecuencia,unidadLongitud)

      nuevaMarca.elevation1 = radioPunto+lineaDeVista[i].elevation;
      nuevaMarca.elevation2 = lineaDeVista[i].elevation - radioPunto;
    
    elipse1.push(nuevaMarca);
    
  }
  //console.log(elipse1);
  setElipsoide(elipse1);
  setErrores(false);
  setMensajeError("");

  } catch (error) {

    ManejadorErrores(error);

  }}


  //CALCULOS ATENUACIONES

  const CalcularPotenciaRecibida = ({unidadFrecuencia,distancia, frecuencia}) => {
   
    console.log(unidadFrecuencia)
    try {
      
        switch(unidadFrecuencia){
    
            case 'GHz':
            frecuencia *=1000;
            break;
      
            case 'Hz':
            frecuencia = frecuencia/1000000;
            break;
      
            case 'KHz':
            frecuencia = frecuencia/1000;
            break;
    
            case 'MHz':
            break;
    
    
            default:
      
          }
      
          const perdidaEspacioLibre = 20 * Math.log10(distancia) + 20 * Math.log10(frecuencia) + 32.44;
    
    
        // Cálculo de la potencia recibida
        const potenciaRecibida = parseFloat(potenciaTransmitida) + parseFloat(gananciaTransmisor) + parseFloat(gananciaReceptor) - parseFloat(perdidaEspacioLibre) - parseFloat(perdidasAdicionales);
        setPotenciaRecibida(potenciaRecibida);
      } catch (error) {console.log(error)};
  }

  

  //Desde aqui se resetean todos los estados para reiniciar el grafico y no tener que recargar la pagina
  const RESET = () =>{
      setReset(prev => !prev); // Cambiar el estado para forzar el reinicio del gráfico
      setLineaDeVista([])
      setPost([])
      setElipsoide([])
      setErrores(false);
      setMensajeError("");
      console.log(reset)
  }

  //Desde aqui se reciben los errores en las funciones que lo requieren, a traves del tipo de error determinamos el mensaje
  const ManejadorErrores = (error) =>{

    let mensaje;

    setErrores(true);
    console.log(error.code);
  
    switch(error.code){

      case "ERR_NETWORK" :
        mensaje = "¡No hemos recibido respuesta del API, lo sentimos mucho! Intenta de nuevo en un momento...";
        setMensajeError(mensaje);
      break;
      case undefined:
        mensaje = "¡Debes Calcular primero el Mapa ▶ La linea de vision ▶ la zona Fresnel! Intentalo en ese orden..." 
        setMensajeError(mensaje);
      break;
      default:
    }
    }

    const obtenerCalidad = (valor) =>{

      const potencia = parseFloat(valor).toFixed(2);

      if(isNaN(potencia)){

        return `---`;

      }else if(potencia <= 0 && potencia >= -30) {

        return `${potencia} dBm EXCELENTE`;

      } else if (potencia <= -31 && potencia >= -60) {

        return `${potencia} dBm Muy Buena`;

      }else if(potencia <= -61 && potencia >= -80){

        return `${potencia} dBm Aceptable`;

      }else if(potencia <= -81 && potencia >= -100){

      return `${potencia} dBm Debil`;

     }else if(potencia <= -100){

      return `${potencia} dBm Muy debil`;

    }else {

        return `${potencia} dBm`; // Si no entra en las condiciones, solo se muestra el valor

      }



    }

    
      // Define el icono personalizado
      const customIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/718/718378.png", // URL de tu imagen
        iconSize: [40, 40], // tamaño del icono
        iconAnchor: [20, 20] // [mitad del ancho, altura completa]
        //popupAnchor: [100, 100], // posición del popup relativa al icono
      });

        
    const purpleOptions = { color: 'red' }
    

  ///////////////////////////////// CHART OPTIONS /////////////////////////////////

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


//Config del grafico --------------------------------------------------------------
var misoptions = {
  responsive : true,
  animation : true,
 maintainAspectRatio:false,
  plugins : {
      legend : {
          display : true
      },
      tooltip:{
        callbacks:{
          label: (context) =>{
           try {
            return `Lat:${post[context.dataIndex].latitude}  Long: ${post[context.dataIndex].longitude} Alt:   ${post[context.dataIndex].elevation} LV: ${lineaDeVista[context.dataIndex].elevation.toFixed(2)} Metros ZF1: ${elipsoide[context.dataIndex].elevation1.toFixed(2)} ZF1: ${elipsoide[context.dataIndex].elevation2.toFixed(2)}`
           } catch (error) {
            return `Lat:${post[context.dataIndex].latitude}  Long: ${post[context.dataIndex].longitude}`
           } }
        }
      }
    },
  scales : {
      x : {
          min : 0,
          max : 100,
          display:true,
          mirror: false
         
      },
      y: {  
          ticks: { 
                    color: 'red',
                    display: true,
                    mirror: false,
                    
                  },
        display:true
      },
  },   
 

  indexAxis: 'x',

};
//DATOS DEL GRAFICO-------------------------------------------------------------------
var midata = {
   labels: post.map((data,index) => ((distanciaEnKilometros/(NApuntos-1))*index).toFixed(2) + " KM " /* + data.latitude +"  "+ data.longitude*/),
  datasets: [
    {
      label: 'Linea de vista',
      data: lineaDeVista.map((data)=> data.elevation),
      //data: alturas,
      fill: false,
      borderColor: 'red',
      tension: 0

    },
    {
      label: 'ZONA DE FRESNEL',
      data: elipsoide.map((data)=> data.elevation1),
      //data: alturas,
      fill: true+1,
      backgroundColor: 'rgba(255, 255, 0, 0.2)',
      borderColor: 'yellow',
      tension: 0.5

    },
    {
      label: 'ZONA DE FRESNEL',
      data: elipsoide.map((data)=> data.elevation2),
      fill: false,
      borderColor: 'yellow',
      tension: 0.5

    }    
    ,{
         label: distanciaEnKilometros.toFixed(3) + " Metros",
          data: 
            post.map((data)=> data.elevation),
          
           
          backgroundColor: 'rgba(15,52,96,1)',
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.8,
          Tooltip:{
            Title:  post.map((data,index) => ((distanciaEnKilometros/(NApuntos-1))*index).toFixed(2) + " KM "  + data.latitude +"  "+ data.longitude)
          }
      }
      
      
  ]

};


  return (

    <>

    <Navbar/>

    
    <div className='w-75 mx-auto' style={{ marginTop: '80px' }}>



    {errores &&(
      <div className="alert alert-success" role="alert" display="false">
      
          {mensajeError}

      </div>)
    }
    
    <div class="row">
      <div class="col-sm-4">

      <div class="card w-100">
        <h5 class="card-header">Antena Punto A  <GrSatellite/></h5>
          <div class="card-body">

          <span class="input-group-text" id="inputGroup-sizing-sm">Latitud A</span>
                    <input 
                    
                    id="inputLatitudAntena1" 
                    placeholder="Latitud" 

                        value={ 
                    
                          coordenadas[0].latitude ? coordenadas[0].latitude : " " 
                          }
                          onChange={ (e) => {
                            // setCoordenadas[0].longitude(e.target.value)
                             setCoordenadas((prevCoordenadas) => {
                               // Hacer una copia del array de coordenadas
                               const newCoordenadas = [...prevCoordenadas];
                               
                               // Modificar la longitud de la primera coordenada
                               newCoordenadas[0] = {
                                 ...newCoordenadas[0], // Hacer una copia del primer objeto de coordenadas
                                 latitude: parseFloat(e.target.value) // Actualizar la latitud
                               };
                               
                               // Devolver el nuevo array de coordenadas actualizado
                               return newCoordenadas;
                             })}}
                           

                        type='text'
                        className='form-control'
                    />
                    
                    <span className="input-group-text" id="inputGroup-sizing-sm">Longitud A</span>

                <input 
                    
                    id="inputLongitudAntena1" 
                    placeholder="Longitud" 

                        value={ coordenadas[0].longitude ? coordenadas[0].longitude: " "
                        }
                        onChange={ (e) => {
                         // setCoordenadas[0].longitude(e.target.value)
                          setCoordenadas((prevCoordenadas) => {
                            // Hacer una copia del array de coordenadas
                            const newCoordenadas = [...prevCoordenadas];
                            
                            // Modificar la longitud de la primera coordenada
                            newCoordenadas[0] = {
                              ...newCoordenadas[0], // Hacer una copia del primer objeto de coordenadas
                              longitude: parseFloat(e.target.value) // Actualizar la longitud
                            };
                            
                            // Devolver el nuevo array de coordenadas actualizado
                            return newCoordenadas;
                          })}}
                        
          

                        
                        type='text'
                        className='form-control'
                    />
                    <span className="input-group-text" id="inputGroup-sizing-sm">Altura antena A</span>

                     <input 
                    
                    id="inputAlturaAntena1" 
                    placeholder="Altura antena 1" 

                        value={alturaAntena1}
                        onChange={ (e) => setAlturaAntena1(e.target.value)}
                        type='text'
                        className='form-control'
                    />

                      <span className="input-group-text" id="inputGroup-sizing-sm">Potencia Tx dBm</span>

                      <input 

                      id="inputAlturaAntena1" 
                      placeholder="Altura antena 1" 

                      value={potenciaTransmitida ? potenciaTransmitida:" "}
                      onChange={ (e) => setPotenciaTransmitida(e.target.value)}
                      type='text'
                      className='form-control'
                      />
                    <span className="input-group-text" id="inputGroup-sizing-sm">Ganancia Tx dBi</span>

                        <input 

                        id="inputAlturaAntena1" 
                        placeholder="Ganancia del Transmisor" 

                        value={gananciaTransmisor ? gananciaTransmisor:" "}
                        onChange={ (e) => setGananciaTransmisor(e.target.value)}
                        type='text'
                        className='form-control'
                        />
                    

      </div>
      </div>
      </div>
    
      <div class="col-sm-4">
        <div class="card">    
        <h5 class="card-header"><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/><PiWaveSineDuotone/></h5>    

        <div class="card-body">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Frecuencia</span>
                      <div className='input-group mb-3'>
                      <input type="text" className="form-control border border-secondary w-75 d-inline-flex"
                        name='frecuencia'
                        placeholder={"Frecuencia en Hz"}
                        value={frecuencia}
                        onChange={e =>{ 
                          setFrecuencia(e.target.value)
                          ejecutar()
                        }} 
                        onKeyUp={()=> ejecutar()}
                      />
                      
                      <select aria-label="Default select example" class="btn btn-secondary dropdown-toggle w-25 d-inline-flex"
                      onChange={e => {
                        setUnidadFrecuencia(e.target.value)
                        ejecutar()
                      }
                      }      onClick={ejecutar}
                      >       
                      <option value="Hz">Hz</option>
                      <option value="MHz">MHz</option>
                      <option value="GHz">GHz</option>
                      </select>
                      </div>


                      <label for="customRange3" class="form-label">Zona Fresnel: {n}</label>
                      <input type="range" class="form-range danger" min="1" max="3" step="1" id="customRange3"
                                                  value={n}
                                                  onChange={e=> {
                                                    setN(e.target.value)
                                                    ejecutar()
                                                  }}
                                                  onKeyUp={ejecutar}

                      ></input>

                      <span className="input-group-text" id="inputGroup-sizing-sm">Horizonte de Radio: {horizonteRadio.toFixed(1)} KM {horizonteRadio>distanciaEnKilometros? "✅":"❌"}</span>
                      <span className="input-group-text" id="inputGroup-sizing-sm">Perdidas Adicionales dB</span>

                                  <input 

                                  id="inputAlturaAntena1" 
                                  placeholder="Perdidas adicionales" 

                                  value={perdidasAdicionales ? perdidasAdicionales:" "}
                                  onChange={ (e) => setPerdidasAdicionales(e.target.value)}
                                  type='text'
                                  className='form-control'
                                  />
        </div>
          
        </div>
        </div>


        <div class="col-sm-4">

          <div class="card w-100">
            <h5 class="card-header"><GrSatellite style={{ transform:  'scaleX(-1)' }}/>  Antena Punto B</h5>
              <div class="card-body">

              <span className="input-group-text" id="inputGroup-sizing-sm">Latitud B</span>

                            <input 

                              
                              id="inputLatitudAntena2" 
                              placeholder="Latitud" 

                                  value={ 
                                    coordenadas[1].latitude ? coordenadas[1].latitude : " " 
                                  }
                                  onChange={ (e) => {
                                    // setCoordenadas[0].longitude(e.target.value)
                                    setCoordenadas((prevCoordenadas) => {
                                      // Hacer una copia del array de coordenadas
                                      const newCoordenadas = [...prevCoordenadas];
                                      
                                      // Modificar la longitud de la primera coordenada
                                      newCoordenadas[1] = {
                                        ...newCoordenadas[1], // Hacer una copia del primer objeto de coordenadas
                                        latitude: parseFloat(e.target.value) // Actualizar la longitud
                                      };
                                      
                                      // Devolver el nuevo array de coordenadas actualizado
                                      return newCoordenadas;
                                    })}}
                                  
                                  type='text'
                                  className='form-control'
                              />
                                <span className="input-group-text" id="inputGroup-sizing-sm">Longitud B</span>

                            <input 
                              
                              id="inputLongitudAntena2" 
                              placeholder="Longitud" 

                                  value={
                                    coordenadas[1].longitude ? coordenadas[1].longitude : " "
                                  }

                                  onChange={ (e) => {
                                    // setCoordenadas[0].longitude(e.target.value)
                                    setCoordenadas((prevCoordenadas) => {
                                      // Hacer una copia del array de coordenadas
                                      const newCoordenadas = [...prevCoordenadas];
                                      
                                      // Modificar la longitud de la primera coordenada
                                      newCoordenadas[1] = {
                                        ...newCoordenadas[1], // Hacer una copia del primer objeto de coordenadas
                                        longitude: parseFloat(e.target.value) // Actualizar la longitud
                                      };
                                      
                                      // Devolver el nuevo array de coordenadas actualizado
                                      return newCoordenadas;
                                    })}}
                                  
                                  type='text'
                                  className='form-control'
                              />

                            <span className="input-group-text" id="inputGroup-sizing-sm">Altura antena B</span>

                            <input 
                              
                              id="inputAlturaAntena2" 
                              placeholder="Altura antena 2" 

                                  value={alturaAntena2}
                                  onChange={ (e) => setAlturaAntena2(e.target.value)}
                                  type='text'
                                  className='form-control'
                              />
                                <span className="input-group-text" id="inputGroup-sizing-sm">Potencia Rx dBm</span>

                                <input 

                                id="inputAlturaAntena1" 
                                          
                                placeholder="Potencia Recibida" 

                                //value={potenciaRecibida ? potenciaRecibida.toFixed(2) + " dBm":" "}
                                value={obtenerCalidad(potenciaRecibida)}
                                type='text'
                                className='form-control'
                                disabled={true}
                                />
                                <span className="input-group-text" id="inputGroup-sizing-sm">Ganancia Rx dBi</span>

                                  <input 

                                  id="inputAlturaAntena1" 
                                  placeholder="Ganancia del receptor" 

                                  value={gananciaReceptor ? gananciaReceptor:" "}
                                  onChange={ (e) => setGananciaReceptor(e.target.value)}
                                  type='text'
                                  className='form-control'
                                  />


              </div>
          </div>
          
        
        </div>

        
       

      </div>

      
      <div class="card">              
      <div class="card-body">

      <div className="btn-group w-100" role="group" aria-label="Basic radio toggle button group">

      <input type="radio" className="btn-check w-25" name="btnradio" id="btnradio1" autocomplete="off" onClick={createPost}/>
      <label className="btn btn-outline-danger" for="btnradio1">Mostrar Mapa</label>

      <input type="radio" className="btn-check w-25" name="btnradio" id="btnradio2" autocomplete="off" onClick={calcularLineaDeVista}/>
      <label className="btn btn-outline-danger" for="btnradio2">Mostrar Linea de vista</label>

      <input type="radio" className="btn-check w-25" name="btnradio" id="btnradio3" autocomplete="off" onClick={CalcularElipsoide}/>
      <label className="btn btn-outline-danger" for="btnradio3">Mostrar Zona Fresnel</label>

      <input type="radio" className="btn-check w-25" name="btnradio" id="btnradio4" autocomplete="off" onClick={RESET}/>
      <label className="btn btn-danger" for="btnradio4">RESET</label>

      </div>
      </div>
      </div>

      <div id='grafico'>
      <Line data={midata} options={misoptions}/>
      </div>
      
      <CalcularPotenciaRecibida distancia={distanciaEnKilometros} frecuencia={frecuencia} unidadFrecuencia ={unidadFrecuencia}/>
      
      

      </div>  


            <MapContainer center={center} zoom={11} scrollWheelZoom={true}    style={{ height: '50vh', width: '100wh' }}
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                      
                  <Polygon pathOptions={purpleOptions} positions={coordenadasMapa}/>
                  <Marker position={coordenadasMapa[0]} icon={customIcon}/>
                  <Marker position={coordenadasMapa[1]} icon={customIcon}/>


                  
          </MapContainer>
          <Populares/>

          <Footer/>

    </>
  );}

export default App;
