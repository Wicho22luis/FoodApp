import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Spacer, View } from 'native-base';
import theme from './Screens/theme';

//PANTALLAS
import AdminDashboard from './Screens/AdminDashboard';
import LoginScreen from './Screens/LoginScreen';
import BackordersScreen from './Screens/BackordersScreen';
import UsersScreen from './Screens/UsersScreen';
import MenuScreen from './Screens/MenuScreen';
import AddDishScreen from './Screens/AddDishScreen'
import EditDishScreen from './Screens/EditDishScreen'
import MenuCategoriesScreen from './Screens/MenuCategoriesScreen';
import TableScreen from './Screens/TableScreen';
import SplashScreen from './Screens/SplashScreen';
import HomePageChef from './Screens/HomePageChef';
import HomePageWaiter from './Screens/HomePageWaiter';
import DetailsTableScreen from './Screens/DetailsTableScreen';
import WaiterMenu from './Screens/WaiterMenu';
import MenuReadOnly from './Screens/MenuReadOnly';
import MealDetail from './Screens/MealDetail';
import WaiterMenuCategories from './Screens/WaiterMenuCategories';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
            <Stack.Screen options={{ headerShown: false }} name="HomeWaiter" component={HomePageWaiter} />
            <Stack.Screen options={{ headerShown: false }} name="Menu" component={MenuScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Users" component={UsersScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Tables" component={TableScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="HomeChef" component={HomePageChef} />
            <Stack.Screen options={{ headerShown: false }} name="Backorders" component={BackordersScreen} />
            <Stack.Screen options={{ headerShown: false }} name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen options={{ headerShown: false }} name="Category" component={MenuCategoriesScreen} />
            <Stack.Screen options={{ headerShown: false }} name="AddDish" component={AddDishScreen} />
            <Stack.Screen options={{ headerShown: false }} name="EditDish" component={EditDishScreen} />
            <Stack.Screen options={{ headerShown: false }} name="TableDetail" component={DetailsTableScreen} />
            <Stack.Screen options={{ headerShown: false }} name="WaiterMenu" component={WaiterMenu} />
            <Stack.Screen options={{ headerShown: false }} name="WaiterMenuCategories" component={WaiterMenuCategories} />
            <Stack.Screen options={{ headerShown: false }} name="MenuReadOnly" component={MenuReadOnly} />
            <Stack.Screen options={{ headerShown: false }} name="MealDetail" component={MealDetail} />
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

