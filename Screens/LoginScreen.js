import { View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from 'react';
import { auth, database } from "../firebase";
import { useNavigation } from '@react-navigation/native';


import { FormControl, HStack, AlertDialog, Button, VStack } from 'native-base';
import GradientText from './GradientText';
import GradientButton from './GradientButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';

import { useForm, Controller } from 'react-hook-form';

const LoginScreen = () => {

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    //VARIABLES NECESARIAS
    //const [email, setEmail] = useState('')
    //const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const [uType, setUType] = useState()

    //METODO ESCUCHA QUE HACE EL CAMBIO DE PANTALLA CUANDO EL USUARIO SE HA LOGGEADO CORRECTAMENTE Y SELECCIONA LA PANTALLA CORRESPONDIENTE
    useEffect(() => {
        const moveToHome = auth.onAuthStateChanged(user => {
            if (user) {
                //REFERENCIA A LA BD USANDO EL USER ID ASIGNADO POR FIREBASE
                const reference = database.ref('Users/' + user.uid);
                //EVENTO ESCUCHA QUE SE EJECUTA SOLO UNA VEZ PARA OBTENER EL USER ID DESDE LA REFERENCIA DEL USUARIO ACTUAL
                reference.once("value")
                    .then(function (snapshot) {
                        setUType(snapshot.val().UType);
                    });
                console.log('Tipo de usuario: ' + uType);
                //NAVEGACION AL COMPONENTE CORRESPONDIENTE
                if (uType === 'Admin') {
                    navigation.replace('AdminDashboard')
                } else if (uType === 'Chef') {
                    navigation.replace('HomeChef')
                } else if (uType === 'Waiter') {
                    navigation.replace('HomeWaiter')
                }
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
    const handleLogin = (data) => {
        auth.signInWithEmailAndPassword(data.email, data.password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Logged in with: ", data);
            })
            .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}>
            <GradientText text="FoodApp" style={[styles.title]} />
            <HStack width={'70%'} marginTop={7} marginBottom={7}>
                <Text style={styles.subTitle}>Log in</Text>
            </HStack>


            <FormControl width={'70%'} isRequired isInvalid={'email' in errors}>
                <VStack>
                    <HStack style={styles.textInputContainer}>
                        <MaterialCommunityIcons name='email' color={theme.text_icons} size={20} />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Email'
                                    placeholderTextColor={theme.text_icons}
                                    style={styles.textInput}
                                    type={'mail'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value} />
                            )}
                            name="email"
                            rules={{ required: 'Email is required' }}
                            defaultValue=""
                        />
                    </HStack>
                    <FormControl.ErrorMessage>
                        {errors.email?.message}
                    </FormControl.ErrorMessage>
                </VStack>
            </FormControl>



            <FormControl width={'70%'} isRequired isInvalid={'password' in errors} >
                <VStack>
                    <HStack style={styles.textInputContainer}>
                        <MaterialCommunityIcons name='key' color={theme.text_icons} size={20} />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Password'
                                    placeholderTextColor={theme.text_icons}
                                    style={styles.textInput}
                                    secureTextEntry
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value} />
                            )}
                            name="password"
                            rules={{ required: 'Password is required' }}
                            defaultValue=""
                        />
                    </HStack>
                    <FormControl.ErrorMessage>
                        {errors.password?.message}
                    </FormControl.ErrorMessage>
                </VStack>
            </FormControl>


            <TouchableOpacity style={styles.containerButton} onPress={handleSubmit(handleLogin)}>
                <GradientButton text="Log In" style={styles.button} />
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
        backgroundColor: theme.background_color
    }, containerButton: {
        alignItems: 'center',
        width: 300,
        marginTop: 60,
    }, title: {
        marginTop: 70,
        fontSize: 40,
        fontWeight: '900'
    },
    button: {
        fontSize: 14,
        color: theme.text_icons,
        height: 30,
        borderRadius: 25,
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 230
    },
    subTitle: {
        fontSize: 25,
        color: theme.text_icons,
        textAlign: 'left',
        fontWeight: '500',
        textAlignVertical: 'bottom',
        height: 30
    },
    textInput: {
        width: '100%',
        padding: 10,
        paddingStart: 10,
        height: 50,
        backgroundColor: 'transparent',
        color: theme.text_icons
    },
    textInputContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 30,
        marginTop: 20,
        paddingLeft: 10,
        height: 30,
    }


})