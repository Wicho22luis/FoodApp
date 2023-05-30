# FoodApp
Es necesario ejecutar los siguientes comandos en la terminal antes de correr la app:

***npm install @react-navigation/native***

***npm install @react-navigation/native-stack***

***expo install firebase@8.2.3***

Y para que funcione Firebase, es necesario ejecutar el siguiente comando:

***expo install @react-native-async-storage/async-storage***

Luego en la carpeta node_modules del proyecto, hay que ir a esta ruta: ***\node_modules\@firebase\app\dist\index.rn.cjs.js***

En ese archivo hay que reemplazar esta linea: ***var AsyncStorage = require('react-native').AsyncStorage;***

Con esta otra: ***var AsyncStorage = require('@react-native-async-storage/async-storage').AsyncStorage;***

Con los pasos anteriores ya debería ejecutarse correctamente el proyecto.

## Instalaciones Adicionales
***npm install expo-image-picker
***npm  install react-native-select-dropdown
