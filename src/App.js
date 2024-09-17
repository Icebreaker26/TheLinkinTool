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
import { CalcularPotenciaRecibida } from './componentes/CalcularPerdida';
import { Footer } from './componentes/Footer';
import { Navbar } from './componentes/Navbar';



function App() {

  /*const baseURL = "https://jsonplaceholder.typicode.com/posts";*/
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

      setErrores(false);
      setMensajeError("");


} catch (error) {
  ManejadorErrores(error);
}
    
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
      <div className="alert alert-danger" role="alert" display="false">
      
          {mensajeError}

      </div>)
    }

      <div className="btn-group w-100" role="group" aria-label="Basic radio toggle button group">

      <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" onClick={createPost}/>
      <label className="btn btn-outline-danger" for="btnradio1">Calcular Mapa</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" onClick={calcularLineaDeVista}/>
      <label className="btn btn-outline-danger" for="btnradio2">Calcular Linea de vista</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autocomplete="off" onClick={CalcularElipsoide}/>
      <label className="btn btn-outline-danger" for="btnradio3">Calcular Zona Fresnel</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autocomplete="off" onClick={RESET}/>
      <label className="btn btn-outline-danger" for="btnradio4">RESET</label>

      </div>
                   
                  <div className="input-group" id='inputs'>
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
                    
                    </div>
                    <div className="input-group " id='inputs'>

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
                    </div>
                    <div className="input-group mb-3" id='inputs'>
                    <span className="input-group-text" id="inputGroup-sizing-sm">Frecuencia</span>

                      <input type="text" className="form-control border border-danger"
                        name='frecuencia'
                        placeholder={"Frecuencia en Hz"}
                        value={frecuencia}
                        onChange={e =>{ 
                          setFrecuencia(e.target.value)
                          ejecutar()
                        }} 
                        onKeyUp={ejecutar}
                      />
                      
                      <select aria-label="Default select example" class="btn btn-outline-secondary dropdown-toggle"
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


                      <span className="input-group-text" id="inputGroup-sizing-sm">Zona 1,2,3...</span>

                          <input type="text" className="form-control border border-danger" 
                            name='zona'
                            placeholder={"# Zona: 1,2,3"}
                            value={n}
                            onChange={e=> {
                              setN(e.target.value)
                              ejecutar()
                            }}
                            onKeyUp={ejecutar}
                          />
                      </div>
      <div id='grafico'>
      <Line data={midata} options={misoptions}/>
      </div>
      
    <div className="input-group w-100" id='inputs'>
    <span className="input-group-text" id="inputGroup-sizing-sm">Distancia A</span>
      <input  className="form-control border border-danger"
        name='distanciaX'
        placeholder={"Distancia A"}
        value={x}
        onChange={e => {
          setX(e.target.value)
          ejecutar()
        }}
        onKeyUp={ejecutar}

      />
      <span className="input-group-text" id="inputGroup-sizing-sm">Distancia B</span>

      <input
 className="form-control border border-danger"
        name='distanciaY'
        placeholder={"Distancia B"}
        value={y}
        onChange={e =>{
          setY(e.target.value)
          ejecutar()
        }}
        onKeyUp={ejecutar}
      />

      <select aria-label="Default select example" className="btn btn-outline-secondary dropdown-toggle"
                          onChange={e => {
                            setUnidadLongitud(e.target.value)
                            ejecutar()
                          }}
                          onClick={ejecutar}
                          >
                          <option value="M">M</option>
                          <option value="KM">KM</option>
                          <option value="MILLAS">MILLAS</option>
                          </select>
      
      </div>
      <p>Distancia A + Distancia B = {distanciaEnKilometros.toFixed(2)*1000} Metros = Distancia Total</p>
      <h3 id='resultado'>
        Radio en el punto = {radio.toFixed(2)} Metros
      </h3>
    
      <Populares/>
      <CalcularPotenciaRecibida distancia={distanciaEnKilometros} frecuencia={frecuencia} unidadFrecuencia ={unidadFrecuencia}/>
    </div>  
    <Footer/>

    </>
  );}

export default App;
