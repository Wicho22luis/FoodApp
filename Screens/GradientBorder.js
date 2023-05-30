import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import theme from './theme';

export default function GradientBorder(props) {
    return (
        <LinearGradient start={[0, 0.5]}
            end={[1, 0.5]}
            colors={[theme.primary_color, theme.secondary_color]}
            style={{ borderRadius: 20 }}>
            <View style={styles.circleGradient}>
                <Text  style={styles.visit}>{props.text}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    circleGradient: {
        margin: 1,
        backgroundColor: theme.cards_background,
        borderRadius: 20
    },
    visit: {
        margin: 3,
        paddingHorizontal: 3,
        textAlign: "center",
        backgroundColor: theme.cards_background,
        color: theme.text_icons,
        fontSize: 12, 
        paddingTop: 0, 
    }
})