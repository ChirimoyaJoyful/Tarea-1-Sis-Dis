
**INSTRUCCIONES DE USO:**
- Descargar la carpeta del repositorio. 
- Ejecutar comando `docker compose -f "docker-compose.yaml" up -d --build` en la carpeta raíz del proyecto para levantar el conteneder docker con los programas a utilizar. 
- Buscar en la url `localhost:3000/inventory/search?q=*` donde * es el término a buscar.
- Al presionar enter se mostrarán se consultará primero en Redis si se encuentra el término (key), si no lo está, se consulta a través de gRPC el servidor y este a su vez a la base de datos.
- Se despliegan los resultados.

CONFIGURACION DE REDIS: 
- Se utiliza una memoria de 2 megabytes.
- Se utiliza una política de remoción LRU (Least Recently Used).