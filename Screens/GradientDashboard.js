import { StatusBar } from 'expo-status-bar';
import { Center, HStack, VStack } from 'native-base';

import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import theme from './theme';


export default function GradienDashboard(props) {
    return (
        <LinearGradient
            // Button Linear Gradient
            colors={[theme.primary_color, theme.secondary_color]}
            star={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
        >
            <Text textAlign={'left'} style={styles.titleDashboard}>Sales: </Text>
            <Text style={styles.sales}>$10,000.00 m.n</Text>
            <HStack justifyContent={'center'}>
                <VStack>
                  <Text style={styles.text}>Occupied Tables:         </Text> 
                  <Text style={styles.text}>15/20</Text> 
                </VStack>
                <VStack>
                    <Text style={styles.text}>Pending Orders:</Text>
                    <Text style={styles.text}>10</Text> 
                </VStack>
            </HStack>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        borderRadius: 20,
        paddingTop: 10,
        paddingLeft: 10,
        justifyContent: 'center',
        paddingBottom: 10,
    }, titleDashboard:{
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '300', 
        paddingBottom: 10,
        paddingRight: 10,
    }, text: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '300', 
        paddingBottom: 2,
        paddingRight: 10,
        textAlign: 'center',
    },
     sales:{
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center',
        paddingBottom: 10,

    }
})
