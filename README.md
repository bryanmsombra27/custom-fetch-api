### Fetch API personalizado

Este proyecto utiliza la funcionalidad nativa del FETCH API para realizar solicitudes HTTP de manera personalizada. El objetivo es proporcionar una interfaz sencilla y flexible para interactuar con APIs externas, manejando configuraciones específicas adaptando algunas de las peticiones http más comunes.

Cabe aclarar que este proyecto no es un reemplazo completo del FETCH API, sino una capa adicional que facilita su uso en ciertos escenarios. El proyecto sigue en construcción y esta sujeto a cambios y mejoras continuas. De momento, se encuentra en una fase inicial de desarrollo y se espera que evolucione con el tiempo.

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
token:"Bearer your_token_here"
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
