# ACASAPUFE.backend
Back-end desarrollado para el manejo de los diferentes sistemas de ACASAPUFE.

## REQUISITOS PARA INSTALACION DE LA API
- Copiar el .env.example y renombrarlo a .env
- Correr el comando "npm install"
- Hacer el build de la aplicacion typescript con el comando "npm run build"
- Correr el servidor uubicado en "dist" con el comando "npm run start"

## LENGUAJE UTILIZADO
Typescript

## BASE DE DATOS
La base de datos esta realizada en PostgreSQL, el dump de la base de datos para replicar en local la estructura que se necesita esta en la raiz del repositorio como "dump.sql".
Si se le cambiaria algo a la base de datos, ya sea el nombre de la db o el puerto, debe especificarse en el archivo ".env".

