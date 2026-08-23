### Fetch API personalizado

Este proyecto utiliza la funcionalidad nativa del FETCH API para realizar solicitudes HTTP de manera personalizada. El objetivo es proporcionar una interfaz sencilla y flexible para interactuar con APIs externas, manejando configuraciones específicas adaptando algunas de las peticiones http más comunes.

Cabe aclarar que este proyecto no es un reemplazo completo del FETCH API, sino una capa adicional que facilita su uso en ciertos escenarios. El proyecto sigue en construcción y esta sujeto a cambios y mejoras continuas. De momento, se encuentra en una fase inicial de desarrollo y se espera que evolucione con el tiempo.

Recientemente he agregado una version alterna dentro del mismo paquete, cuya funcionalidad asemeja como trabaja axios, si bien no funcionan y no integra todo lo que ofrece axios, resulta una alternativa a mi parecer mucho mas funcional que la primera version que lance. Esta nueva versión resuelve un par de detalles como lo son el manejo de la url de la api y la persistencia del token en caso de ser enviado en la peticion. A continuación te muestro la nueva forma de trabajar con este paquete, no obstante puedes continuar trabajando en la primera version que igual continuare dando soporte y agregando funcionalidades hasta donde la logica y el fetch me lo permitan.

### Instalación

```bash
npm i @bryanochoa/custom-fetch-api

```

### pnpm

```bash
pnpm add @bryanochoa/custom-fetch-api

```

### yarn

```bash
yarn add @bryanochoa/custom-fetch-api


```

## Versión 2 implementación mediante clase CustomFetchAPI

Para esta nueva versión el enfoque se hace mediante una clase cuya instancia maneja las peticiones http más comunes(GET,POST,PUT,PATCH,DELETE), cada verbo contiene su metodo respectivo en la instancia.

---

**Ejemplo de uso**

- Peticion GET:

```
import {CustomFetchAPI} from "@bryanochoa/custom-fetch-api"

const  fetcher = new  CustomFetchAPI({
baseUrl:  "https://api.example.com",
});
const  data = await  fetcher.get("/data");
console.log(data, "DATA");
```

- Petición POST:

```
import {CustomFetchAPI} from "@bryanochoa/custom-fetch-api"

const  fetcher = new  CustomFetchAPI({
baseUrl:  "https://api.example.com",
});
const  data = await  fetcher.post("/data",{
body:{}
});
```

- Petición PUT:

```
import {CustomFetchAPI} from "@bryanochoa/custom-fetch-api"

const  fetcher = new  CustomFetchAPI({
baseUrl:  "https://api.example.com",
});
const  data = await  fetcher.put("/data/1",{
body:{}
});
```

- Petición DELETE:

```
import {CustomFetchAPI} from "@bryanochoa/custom-fetch-api"

const  fetcher = new  CustomFetchAPI({
baseUrl:  "https://api.example.com",
});
const  data = await  fetcher.delete("data/1");
```

## Manejo del token

En este nuevo enfoque al ser una instancia de una clase, cuenta con metodos para colocar o remover el token en la peticion http se configura de la siguiente forma. Puedes configurar la persistencia del token en localStorage o sessionStorage desde la instancia de la clase y asi no tener que colocarlo en cada peticion donde tengas que colocar el token, esta configuracion es opcional,si no la configuras en este punto puedes hacerlo desde el metodo de la instancia setToken() su segundo parametro es un objeto de configuracion que te permite configurar la persistencia del token en localStorage o sessionStorage, si no lo configuras el token se colocara en la peticion pero no se guardara en ningun lado y tendras que colocarlo en cada peticion donde sea necesario.
:
const fetcher = new CustomFetchAPI({
baseUrl: "https://api.example.com",
// safeTokenOn:{
// keyname:"token",
// storage:"sessionStorage | localStorage "
// }
});
//agregar token a localStorage/sessionStorage
fetcher.setToken("token_here",{
storage:"localStorage",
keyname:"token"
})

//eliminar token
fetcher.removeToken()

```
En esta nueva implementación del manejo del token,  te permite configurar la persistencia del token ya sea en local storage o en session storage una vez colocado el token intento emular el comportamiento de axios con los interceptores, al mandar el token  si existe en todas las peticiones mediante el header de Authorization todo eso lo hace automaticamente ya que es el caso mas común de enviar el token en una api.

En conclusión, esta nueva versión de la librería ofrece una forma más estructurada y flexible de realizar solicitudes HTTP, con un manejo más eficiente del token de autenticación y una interfaz más clara para interactuar con APIs externas.

## ¿Y entonces, que enfoque deberia elegir?

Ten encuenta que la primera versión esta enfocada en realizar peticiones HTTP ya sea desde el frontend  o el backend (en versiones de nodejs que ya soporten el fetch api) y en esta nueva implementación el enfoque incluye la persistencia del token mediante localStorage o sessionStorage, por lo que si tu proyecto requiere de esta funcionalidad te recomiendo utilizar la segunda versión, en caso contrario puedes seguir utilizando la primera versión que igual seguirá recibiendo soporte y mejoras hasta donde la logica y  el fetch api nativo me lo permita.

## Versión 1 función  makeApiRequest()

- Ejemplo de uso

Petición GET:

```

const data = await makeApiRequest('https://api.example.com/data');

```

Petición POST:

```

const data = await makeApiRequest('https://api.example.com/data', {
method: 'POST',

body: {
key: 'value'
}
});

```

Petición PUT:

```

const data = await makeApiRequest('https://api.example.com/data', {
method: 'PUT',
body: {
key: 'value'
}
});

```

Si tu peticion maneja tokens de autenticación, puedes incluirlos en el objeto de configuración:

```

const data = await makeApiRequest('https://api.example.com/data', {
method: 'GET',
token:"your_token_here"
});

```

La petición incluira el token en el encabezado de autorización de la solicitud HTTP.

También es posible agregar searchParams a la URL de la solicitud:

```

const data = await makeApiRequest('https://api.example.com/data', {
method: 'GET',
searchParams: {
param1: 'value1',
param2: 'value2'
}
});

```

- Tipado de peticiciones

Al utilizar TypeScript, se puede tipar la respuesta de la solicitud HTTP para obtener un mejor control sobre los datos recibidos. Por ejemplo:

```

interface ApiResponse {
id: number;
name: string;}

```

Petición GET:

```

const data = await makeApiRequest<ApiResponse>('https://api.example.com/data');

    console.log(data.id);

```

Esa es una forma de asegurarse de que la respuesta de la solicitud HTTP cumpla con la estructura esperada y evitar errores en tiempo de ejecución.

Al utilizar searchParams, la URL final de la solicitud incluirá los parámetros de búsqueda especificados: 'https://api.example.com/data?param1=value1&param2=value2'. Cabe aclarar que si se desea agregar searchParams a la URL, se debe pasar un objeto con las propiedades y valores correspondientes.

Por ultimo, se puede cambiar el content-type de la solicitud HTTP, por defecto se utiliza 'application/json', pero puede cambiarse a formData en caso de que la petición requiera enviar archivos

No lo mencione en ejemplos anteriores pero por defecto, las peticiones de tipo POST,PUT,PATCH la propiedad body se convierte automáticamente a JSON por ende es obligatorio que para esta propiedad se pase un objeto, de lo contrario la petición fallara.

El proyecto se encuentra en constante desarrollo y se espera que se agreguen más funcionalidades y mejoras en el futuro.
```
