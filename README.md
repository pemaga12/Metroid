# Metroid
[¡Pruebalo aquí!](https://pemaga12.github.io/Metroid/)

# Integrantes
* Eva Verdú Rodríguez
* Pedro Martínez Gamero
* Ramon Rosa Pérez
* Victor Velázquez Cabrera

# Memoria del proyecto

## 1. Diseño del juego
### Objetivo del juego: cómo se gana, cómo se pierde.

El objetivo del juego es conseguir llegar a la sala del jefe final para enfrentarnos a él, para esto deberemos explorar el mapa hasta encontrar los power-ups que nos permetirán seguir avanzando. Ganaremos si somos capaces de llegar y derrotar al jefe final, y perderemos si nuestra vida (energía) baja a 0 al ser golpeados por los enemigos o caer en las superficies con lava.

### 2. Principales mecánicas

Los movimientos básicos al inicio del juego que puede hacer son el moverse en todas direcciones, saltar y disparar.

Gracias a los disparos, podemos activar las puertas las cuales se abrirán tras disparar 2 veces sobre ellas, después de unos segundos de espera, las puertas volveran a su estado inicial.

Tiene varias mecanicas que se van consiguiendo conforme va recogiendo distintos power ups. Dichos power-ups se obtienen por medio de los orbes distribuidos a lo largo del mapa que nos daran la posibilidad de convertirnos en bola y pasar por espacios más pequeños, el romper unos bloques específicos al contacto con ellos y el atravesar unas puertas rojas.

### 3. Personajes

* Samus: Personaje que controlamos.
* Zoomer/Pinchitos: Enemigo que hace daño por contacto, hemos implementado dos tipos distintos, uno que rebota al chocar con otro personaje o pared, y otro que al encontrarse con una pared la escala pegado a ella.
* Skree/Taladrillos: Enemigo que permanece inmovil en el techo de la sala hasta que detecta a Samus acercandose. Se lanza desde el techo siguiendo la posición de samus y explota al contacto con el suelo y con Samus infringiendole daño.
* Ripper/Larbitas: Enermigo que flota siempre a una misma altura rebotando al chocar con otros personajes o paredes. Hace daño a Samus si estos dos colisionan.
* Mother Brain: Enemigo final. En realidad el enemigo no hace nada, solo tiene una puerta protectora que se rope a los dos toques. La dificultad es matarlo (ya que tiene mucha vida) mientras evitas todos los cañones y enemigos en la sala. Si Samus se acerca Mother Brain le hará 10 de daño.

### 4. Diseño de la implementación: arquitectura y principales componentes.



### 5. Equipo de trabajo y reparto de tareas: descripción del trabajo realizado por cada uno de los integrantes del grupo y carga de trabajo realizada (0%-100%)

* Pedro Martínez Gamero
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
* Ramon Rosa Pérez
	* Búsqueda y preparación de sprites de pantallas de títulos
	* Audio del juego
	* Implementación del powerup ballmode
	* Implementación de los disparos
	* Animación de las puertas
	* Ayuda en implementación del enemigo Zoomer/Pinchitos
	* Ascensor
* Victor Velázquez Cabrera
	* Búsqueda y preparación de sprites de Samus, energía y explosiones.
	* Cambios de cámaras al pasar a otra sala.
	* Implementación y animación de la lava.
	* Diseño del HUB de energía.
	* Drop aleatorio de energía al matar enemigos.
	* Guía de controles y orbes.
	* Implementación y animación del enemigo Skree/Taladrillos.
	* Animaciones de explosión de los enemigos, energía y Samus en modo bola.
* Eva Verdú Rodríguez 
	* Mother Brain.
	* Cañones.
	* Presentacion de juego para la asignatura.
	* Puertas rojas.
	* Tiempo de daño de samus.
	* Ajuste y creación de Sprites de enemigos, Tiles, Orbes, cañones.
	* Ganar el juego.
	* Retoques en la organización del mapa.
	* Organización en componentes.
	* Saltamontes

### 6. Fuentes y referencias: Referencias a todos los assets utilizados en la realización del juego. 

* [Sprites Samus, Energía y Explosiones](https://ar.pinterest.com/pin/215187688422562272/)
* [Letras energía HUB](https://www.spriters-resource.com/nes/metroid/sheet/1777/?source=genre)
* [Wallpaper](https://coolwallpapers.me/5836458-planet-space-artist-artwork-digital-art-hd-4k-deviantart.html)
* [Imágenes del inicio, muerte y victoria](https://www.spriters-resource.com/nes/metroid/sheet/109511/)
* [Teclas para la guía](https://www.keybr.com/)



