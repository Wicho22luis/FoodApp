import React from "react";
import { Text, View, StyleSheet} from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import theme from './theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function GradientIcon(props) {
    return (
                <MaskedView maskElement={<MaterialCommunityIcons {...props}/>}>
                    <LinearGradient
                        // Button Linear Gradient
                        colors={[theme.primary_color, theme.secondary_color]}
                    >
                       <MaterialCommunityIcons {...props} style={{opacity: 0}}/>
                    </LinearGradient>
                </MaskedView>
    );
}



