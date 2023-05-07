import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, View } from 'native-base';
import theme from './Screens/theme';

//PANTALLAS
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import BackordersScreen from './Screens/BackordersScreen';
import UsersScreen from './Screens/UsersScreen';
import MenuScreen from './Screens/MenuScreen';
import AddDishScreen from './Screens/AddDishScreen'
import EditDishScreen from './Screens/EditDishScreen'
import MenuCategoriesScreen from './Screens/MenuCategoriesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Backorders" component={BackordersScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Users" component={UsersScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Menu" component={MenuScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Category" component={MenuCategoriesScreen} />
            <Stack.Screen options={{ headerShown: false }} name="AddDish" component={AddDishScreen} />
            <Stack.Screen options={{ headerShown: false }} name="EditDish" component={EditDishScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

