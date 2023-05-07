import React from "react";
import { Text, View, StyleSheet} from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import theme from './theme';



export default function GradientText(props) {
    return (
                <MaskedView maskElement={<Text style={[props.style, {backgroundColor:'transparent'}]}>{props.text}</Text>}>
                    <LinearGradient
                        // Button Linear Gradient
                        colors={[theme.primary_color, theme.secondary_color]}
                        star={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                       <Text style={[props.style, {opacity: 0}]}>{props.text}</Text>
                    </LinearGradient>
                </MaskedView>
    );
}