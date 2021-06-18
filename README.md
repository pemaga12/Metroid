# Metroid
[¡Pruebalo aquí!](https://pemaga12.github.io/Metroid/)

# Integrantes
* Eva Verdú Rodríguez
* Pedro Martínez Gamero
* Ramon Rosa Pérez
* Victor Velázquez Cabrera

# Memoria del proyecto

## 1. Diseño del juego

### Objetivo del juego:

Nuestra protagonista es Samus Aran, una cazarrecompensas que debe adentrarse en el planeta Zebes para eliminar al lider de los Piratas espaciales, Mother Brain, que han robado a los Metroid que son las criaturas más peligrosas del planeta. 
El objetivo del juego es conseguir derrotar a Mother Brain, para esto deberemos explorar el mapa hasta encontrar los power-ups que nos permetirán llegar a la sala donde se cuentra dicho jefe. Ganaremos si somos capaces de llegar y derrotarla, y perderemos si nuestra vida (energía) baja a 0 al ser golpeados por los enemigos o caer en las superficies con lava.

### Principales mecánicas

Los movimientos básicos que Samus pueden hacer al inicio del juego son: moverse en todas direcciones, saltar y disparar.

Gracias a los disparos, podemos activar las puertas las cuales se abrirán tras disparar 2 veces sobre ellas, después de unos segundos de espera, las puertas volveran a su estado inicial.

Otras mecanicas se van consiguiendo conforme se van recogiendo distintos power ups. Dichos power-ups se obtienen por medio de los orbes distribuidos a lo largo del mapa que nos daran la posibilidad de:
- Convertirnos en bola y pasar por espacios más pequeños
- Romper unos bloques específicos al contacto con ellos 
- Atravesar unas puertas rojas.

### Personajes

Los personajes que nos encontramos a lo largo del juego son los siguientes:
- Samus: Personaje principal que controlamos.
- Zoomer/Pinchitos: Enemigo que hace daño por contacto, hemos implementado dos tipos distintos, uno que rebota al chocar con otro personaje o pared, y otro que al encontrarse con una pared la escala pegado a ella.
- Skree/Taladrillos: Enemigo que permanece inmovil en el techo de la sala hasta que detecta a Samus acercandose. Se lanza desde el techo siguiendo la posición de samus y explota al contacto con el suelo y con Samus infringiendole daño.
- Ripper/Larbitas: Enermigo que flota siempre a una misma altura rebotando al chocar con otros personajes o paredes. Hace daño a Samus si estos dos colisionan.
- Sidehoppers/Saltamontes: Enemigo que hace daño por contacto. Su forma de moverse es realizando saltos en dirección a Samus.
- Mother Brain: Enemigo final. En realidad el enemigo no hace nada, solo tiene una puerta protectora que se rope a los dos toques. La dificultad es matarlo (ya que tiene mucha vida) mientras evitas todos los cañones y enemigos en la sala. Si Samus se acerca Mother Brain le hará 10 de daño.

## 2. Diseño de la implementación: arquitectura y principales componentes.

El modo en el que hemos estructurado el proyecto ha sido el siguiente:
- Game.js : En el que incluimos el objeto Quintus, cargamos todos los recursos, creamos las escenas de inicio, el mapa, el hud y las escenas de pausa, game over y de victoria; también estan incluido los objetos necesarios para crear las escenas de inicio, pausa, game over y victoria, y Samus junto con las balas que dispara.
- Enemies.js : Incluimos el componente enemy_default definiendo los metodos kill y damage comunes para todos los enemigos del juego. Junto con el componente, creamos todos los enemigos explicados en el apartado anterior con el objeto vidas, que se refiere a las vidas que aleatoriamente sueltan los enemigos al morir; así como los loads necesarios para los enemigos y sus animaciones.
- Objects.js : Formado por el componente _canions_default_ , la función que se encarga de gestionar la vista dependiendo de la sala a la que se accede, el ascensor, los distintos tipos de puertas, lor orbes que funcionan como power-ups, la zona de finalización del juego y los cañones junto con su proyectil. Por último, también incorporamos el load de los ficheros necesarios junto con las animaciones de los anteriores objetos.

## 3. Equipo de trabajo y reparto de tareas:

* Eva Verdú Rodríguez (25%)
	* Mother Brain
	* Cañones
	* Implementación y animación del enemigo Saltamontes/Hopper
	* Presentacion de juego para la asignatura
	* Puertas rojas
	* Tiempo de daño de samus
	* Ajuste y creación de Sprites de enemigos, Tiles, Orbes, cañones
	* Ganar el juego
	* Retoques en la organización del mapa
	* Organización en componentes
* Pedro Martínez Gamero (25%)
	* Diseño del mapa 	
 	* Implementación de la funcionalidad de las puertas
	* Implementación del enemigo Zoomer/Pinchitos
	* Gestión de los orbes a la hora de cogerlos
	* Pantallas de títulos
	* Menú de pausa
	* Movimiento y animaciones de Samus
	* Ayuda en implementación de ascensor
	* Pantalla de partida perdida
	* Audio del juego
* Ramon Rosa Pérez (25%)
	* Búsqueda y preparación de sprites de pantallas de títulos
	* Audio del juego
	* Implementación del powerup ballmode
	* Implementación de los disparos
	* Animación de las puertas
	* Implementación del enemigo Zoomer/Pinchitos
	* Ascensor
	* Solución de bugs
	* Recopilación de fuentes utilizadas
* Victor Velázquez Cabrera (25%)
	* Búsqueda y preparación de sprites de Samus, energía y explosiones
	* Cambios de cámaras al pasar a otra sala
	* Implementación y animación de la lava
	* Diseño del HUB de energía
	* Drop aleatorio de energía al matar enemigos
	* Guía de controles y orbes
	* Implementación y animación del enemigo Skree/Taladrillos
	* Animaciones de explosión de los enemigos, energía y Samus en modo bola
	* Memoria


## 4. Fuentes y referencias:

* [Sprites Samus, Energía y Explosiones](https://ar.pinterest.com/pin/215187688422562272/)
* [Tiles](http://www.geocities.ws/devimon60652/metroid_brinstarobjects_ultragm2003.PNG)
* [Letras energía HUB](https://www.spriters-resource.com/nes/metroid/sheet/1777/?source=genre)
* [Wallpaper](https://coolwallpapers.me/5836458-planet-space-artist-artwork-digital-art-hd-4k-deviantart.html)
* [Imágenes del inicio, muerte y victoria](https://www.spriters-resource.com/nes/metroid/sheet/109511/)
* [Teclas para la guía](https://www.keybr.com/)
* [Enemigos](https://i.pinimg.com/originals/9c/c9/07/9cc907311710121099d01ee81fe2dec7.png)
* [Mother Brain](https://www.pinterest.es/pin/399976010635390417/?amp_client_id=CLIENT_ID(_)&mweb_unauth_id=&amp_url=https%3A%2F%2Fwww.pinterest.es%2Famp%2Fpin%2F399976010635390417%2F&from_amp_pin_page=true)
* Cañones y balas de cañón: Dibujado por nosotros
* Orbes: Dibujado por nosotros
* [Soundtrack](https://www.youtube.com/watch?v=2pcLtSle714)

