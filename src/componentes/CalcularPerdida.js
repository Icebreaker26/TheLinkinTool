import React from "react";

const CalcularPotenciaRecibida = ({unidadFrecuencia,distancia, frecuencia}) => {

    const [potenciaTransmitida, setPotenciaTransmitida] = React.useState();
    const [gananciaTransmisor, setGananciaTransmisor] = React.useState();
    const [gananciaReceptor, setGananciaReceptor] = React.useState();
    const [perdidasAdicionales, setPerdidasAdicionales] =React.useState();


    // Pt: Potencia de transmisión en dBm
    // Gt: Ganancia de la antena transmisora en dBi
    // Gr: Ganancia de la antena receptora en dBi
    // d: Distancia en km
    // f: Frecuencia en MHz
    // L: Pérdidas adicionales del sistema en dB (opcional)
    //Toca convertir frecuencia a MHZ primero
    // Cálculo de las pérdidas por espacio libre
    
console.log(unidadFrecuencia)

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

    return(
        <>
                     <div className="input-group" id="inputs">
                     <span className="input-group-text" id="inputGroup-sizing-sm">Potencia Tx dBm</span>
                     <input 
                     
                        placeholder="Potencia del Transmisor" 

                        value={potenciaTransmitida ? potenciaTransmitida:" "}
                        onChange={ (e) => setPotenciaTransmitida(e.target.value)}
                        type='text'
                        className='form-control'
                    />
                    <span className="input-group-text" id="inputGroup-sizing-sm">Ganancia Tx dBi</span>

                    <input 

                    placeholder="Ganancia del Transmisor" 

                    value={gananciaTransmisor ? gananciaTransmisor:" "}
                    onChange={ (e) => setGananciaTransmisor(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                    <span className="input-group-text" id="inputGroup-sizing-sm">Ganancia Rx dBi</span>

                    <input 

                    placeholder="Ganancia del receptor" 

                    value={gananciaReceptor ? gananciaReceptor:" "}
                    onChange={ (e) => setGananciaReceptor(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                    <span className="input-group-text" id="inputGroup-sizing-sm">Perdidas Adicionales dB</span>

                    <input 

                    placeholder="Perdidas adicionales" 

                    value={perdidasAdicionales ? perdidasAdicionales:" "}
                    onChange={ (e) => setPerdidasAdicionales(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                    </div>
                    <div className="input-group">

                    <span className="input-group-text" id="inputGroup-sizing-sm">Potencia Recibida</span>

                    <input 

                    placeholder="Potencia Recibida" 

                    value={potenciaRecibida ? potenciaRecibida.toFixed(2) + " dB":" "}
                    type='text'
                    className='form-control'
                    disabled={true}
                    />
                    </div>
        </>

    ) 
}

/*
// Ejemplo de uso de la función:
const Pt = 20;  // Potencia de transmisión en dBm
const Gt = 10;  // Ganancia de la antena transmisora en dBi
const Gr = 10;  // Ganancia de la antena receptora en dBi
const d = 5;    // Distancia entre transmisor y receptor en km
const f = 2400; // Frecuencia de operación en MHz (2.4 GHz)
const L = 2;    // Pérdidas adicionales del sistema en dB (cables, conectores)

const Pr = CalcularPotenciaRecibida(Pt, Gt, Gr, d, f, L);
console.log(`La potencia recibida es: ${Pr.toFixed(2)} dBm`);
*/
export{CalcularPotenciaRecibida}