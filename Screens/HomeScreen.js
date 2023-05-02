import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [ listEmployee , setListEmployee] = useState([])


  const handleSignOut = () =>{
    auth.signOut()
    .then(() => {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))
  }

  const getData = () =>{
    
    var employeesData = database.ref('Empleados/');
    employeesData.on('value', (snapshot) => {
       const data = snapshot.val();
       const empleados=Object.keys(data).map(key => ({
        id:key,
        ...data[key]
       }));
       console.log(empleados)
       setListEmployee(empleados);
    });

  }

  useEffect(() => {
    getData();
  })


  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity  onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      {
          listEmployee.map((item, index) =>{
            return(
              <View key={index}>
                <Text>{item.Nombre}</Text>
                <Text>{item.Puesto}</Text>
              </View>
            )
          })
      }
      
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({

  container:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40
},
buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
},
})