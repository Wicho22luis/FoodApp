import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import theme from './theme';

export default function GradientBorder2(props) {
    return (
        <LinearGradient start={[0, 0.5]}
            end={[1, 0.5]}
            colors={[theme.primary_color, theme.secondary_color]}
            style={{ borderRadius: 50 }}>
            <View style={styles.circleGradient}>
                <Text  style={[props.style, { backgroundColor: theme.background_color }, { alignItems: 'center' }]}>{props.text}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    circleGradient: {
        margin: 4,
        backgroundColor: theme.background_color,
        borderRadius: 50
    }
})