import React from 'react';

const Populares = () => {
  

  const populares = [
    {
      "name": "Alto del nudo Pereira",
      "latitude": 4.848398,
      "longitude": -75.714645
    },
    { 
      "name": "Vereda la palma La Virginia",
      "latitude": 4.896642,
      "longitude": -75.844992
    },
    { 
    "name": "Alto del rey Balboa",
    "latitude": 4.944233,
    "longitude": -75.936516
   },
   { 
  "name": "Alto del Madroño Belalcazar",
  "latitude": 4.939474,
  "longitude": -75.822918
     },
  { 
  "name": "Alto del Naranjo Manizales",
  "latitude": 5.003312,
  "longitude": -75.564867
     },
    ];

  return (
    <>        
    <h3 className='mx-center'>Lugares Populares para hacer pruebas</h3>
    <table className="table table-dark  table-striped table-hover shadow-lg p-3 mb-5 bg-body rounded" border="1">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Latitud</th>
          <th scope="col">Longitud</th>
        </tr>
      </thead>
      <tbody>
        {populares.map(puntero => (
          <tr key={puntero.name}>
            <td>{puntero.name}</td>
            <td>{puntero.latitude}</td>
            <td>{puntero.longitude}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </> );
};

export {Populares};
