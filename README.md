The Linkin´ Tool 📡📡📡

Es un software que toma principios de ingenieria de radiopropagación presentes en la Ingenieria de Telecomunicaciones para planear enlaces punto a punto de manera precisa.

¿En que consiste? 🔻

Sección destinada para ingresar las coordenadas y características de los puntos A y B de los enlaces. Los parámetros a ajustar incluyen latitud, longitud, altura de la antena respecto al suelo, potencia de transmisión (Tx) en dBm, y ganancia de la antena Tx en dBi. A partir de estos datos, y considerando la ganancia de recepción (Rx) en dBi, es posible calcular la potencia recibida por la antena de Rx en dBm.

![image](https://github.com/user-attachments/assets/f818c37c-87bc-43c8-8cda-be3e1f6d6057)

En el apartado central añadimos parametros como la Frecuencia, la zona de fresnel a calcular (1,2,3...) y las perdidas adicionales que podemos inferir en el sistema (atenuaciones por condiciones del sitio, proximamente se podrá calcular de forma automatizada) y nos permite calcular la distancia maxima entre ambas antenas de acuerdo a los parametros del horizonte de radio.

![image](https://github.com/user-attachments/assets/d945b7cd-469f-4d8c-9f0f-a45a363cac70)

Estos botones nos permiten ejecutar diferentes acciones las cuales podemos dividir:

📌Mostrar Mapa: Calcula puntos intermedios entre ambas coordenadas y los grafica en función de su elevación.
📌Mostrar Linea de Vista: Calcula una linea recta entre ambas antenas teniendo en cuenta la altura sumistrada y nos permite evaluar de manera visual si existe alguna interferencia en el terreno.
📌Mostrar Zona de Fresnel: Calcula el radio de la zona de fresnel para cada punto de la linea de vista para determinar si nuestro enlace podrá operar en condiciones optimas o tendremos atenuaciones a causa de interferencias del terreno. 
📌Reset: Nos permite eliminar los datos de nuestra grafica.
![image](https://github.com/user-attachments/assets/603b2b8a-6c23-482e-b455-a9a41a1253f7)

🗺📍 Grafico

Podemos identificar en este ejemplo tres series de datos:
🔹Puntos de elevación del terreno entre coordenadas A y B.
🔹Puntos de linea de vista entre A y B.
🔹un Elipse correspondiente al radio de la zona de fresnel para cada punto de la linea de vista. (en el ejemplo se toma una frecuencia de 7 MHz).

![image](https://github.com/user-attachments/assets/b5ae9d5b-8a43-4490-b873-422063726cff)

🎯🔰 Mapa
Nos permite visualizar en el mapa la ubicación de ambas antenas (tenemos que proporcionar latitud y longitud de cada una en el primer apartado) en el terreno y su linea de vista.
![image](https://github.com/user-attachments/assets/e7550033-401a-4761-868d-62a3d910e3a1)

🛠🟡Coordenadas de ejemplo
En esta tabla se referencian algunos puntos arbitrarios en la región de Risaralda y Caldas para la ubicación de antenas para testear enlaces entre ellos.
![image](https://github.com/user-attachments/assets/43139af3-7574-471b-8302-72e6f5ceaa08)

Desarrollado por Alejandro Torres - Icebreaker26 septiembre 2024 - Universidad Católica de Pereira - Ingenieria de Sistemas y Telecomunicaciones

Proximamente apartado matematico ⬇






