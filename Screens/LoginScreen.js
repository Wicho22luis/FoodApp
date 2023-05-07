import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { useNavigation } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
import { Center, HStack } from 'native-base';
import GradientText from './GradientText';
import GradientButton from './GradientButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';

const LoginScreen = () => {
    //VARIABLES NECESARIAS
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    //METODO ESCUCHA QUE HACE EL CAMBIO DE PANTALLA CUANDO EL USUARIO SE HA LOGGEADO CORRECTAMENTE
    useEffect(() => {
        const moveToHome = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })
        return moveToHome;

    })
    //METODO PARA CREAR UN USUARIO
    const handleSignUp = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Registered with: ", user.email);
            })
            .catch(error => alert(error.message))
    }
    //METODO PARA INICIAR SESION
    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Logged in with: ", user.email);
            })
            .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}>
            <GradientText text="FoodApp" style={[styles.title]} />
            <HStack width={'70%'} marginTop={7} marginBottom={7}>
                <Text style={styles.subTitle}>Log in</Text>
            </HStack>


            <HStack style={styles.textInputContainer}>
                <MaterialCommunityIcons name='email' color={theme.text_icons} size={20} />
                <TextInput
                    placeholder='Email'
                    placeholderTextColor={theme.text_icons}
                    style={styles.textInput}
                    onChangeText={text => setEmail(text)}
                    type={'mail'}/>
            </HStack>

            <HStack style={styles.textInputContainer}>
                <MaterialCommunityIcons name='key' color={theme.text_icons} size={20} />
                <TextInput
                    placeholder='Password'
                    placeholderTextColor={theme.text_icons}
                    onChangeText={text => setPassword(text)}
                    style={styles.textInput}
                    secureTextEntry/>
            </HStack>

            <TouchableOpacity style={styles.containerButton} onPress={handleLogin}>
                <GradientButton text="Log In" style={styles.text} />
            </TouchableOpacity>
        </View>

    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background_color,
    },
    containerButton: {
        alignItems: 'center',
        width: 300,
        marginTop: 60,
    }, 
    title: {
        marginTop: 70,
        fontSize: 40,
        fontWeight: '900'
    },
    text: {
        fontSize: 14,
        color: theme.text_icons,
        width: '80%',
        height: 30,
        borderRadius: 25,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    subTitle: {
        fontSize: 25,
        color: theme.text_icons,
        textAlign: 'left',
        fontWeight: '500'
    },
    textInput: {

        width: '70%',
        padding: 10,
        paddingStart: 10,
        height: 50,
        backgroundColor: 'transparent',
        color: theme.text_icons
    },
    textInputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 30,
        marginTop: 20,
        paddingLeft: 10,
        height: 30,
    }
})