A continuación se muestra el historial de cambios realizados en el paquete para que los usuarios puedan conocer las modificaciones y mejoras implementadas en cada versión.

para asegurarte que tienes la versión más reciente, puedes ejecutar el comando de actualización del gestor de paquetes que estés utilizando (npm, yarn, pnpm, etc.) para obtener la última versión disponible.

### 2.1.0

- Se trabajó en la persistencia de las opciones de configuración del token. Un inconveniente que ocurria con el paquete era que al momento de colocar las opciones de configuracion del token, estas solo se mantenian en memoria y al momento de recargar o reiniciar el proyecto estas opciones se perdian y no era posible retomar el token una vez asignado en local/session storage. Ahora con esta implementación es posible mantener en memoria estas opciones.

- Se agrego una nueva opción para almacenar el token, ahora dentro de las opciones de storage es posible tambien guardar el token en cookies asi puedes elegir en que lugar deseas almacenar el token, ya sea en local/session storage o en cookies.

### 2.0.2

- Se corrigió un error en la implementación de los searchParams en los metodos post,put,patch que no permitía enviar correctamente la petición correctamente y ocasionaban que la peticion fallará.
