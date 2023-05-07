import { StatusBar } from 'expo-status-bar';
import { Center } from 'native-base';

import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import theme from './theme';

export default function DisableGradientButton(props) {
    return (
        <LinearGradient
            // Button Linear Gradient
            colors={[theme.disable_light_color, theme.disable_light_color]}
            style={[props.style]}
        >
        <Text style={[props.style, { backgroundColor: 'transparent' }, {alignItems: 'center'}]}>{props.text}</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 30,
        borderRadius: 25,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center'

    }
})