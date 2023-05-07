import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, Image, FormControl, Select, useDisclose, Hidden, CheckIcon, Input, useState } from 'native-base';
import React from "react";
import { Text, View, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import theme from './theme';
import GradientIcon from './GradientIcon';

export default function AddDishScreen() {

    return (
        <>
            <View style={styles.container}>
                <VerticalGradientText text="Add Dish to Menu" style={styles.titleScreen} />
                <TextInput
                    placeholder='Dish Name'
                    placeholderTextColor={theme.text_icons}
                    style={styles.textInput} />

                <TextInput
                    placeholder='Preparation Time'
                    placeholderTextColor={theme.text_icons}
                    style={styles.textInput} />


                <HStack justifyContent={'space-between'} width={'100%'}>
                    <TextInput
                        placeholder='Price'
                        placeholderTextColor={theme.text_icons}
                        style={styles.priceInput}
                    />

                    <Box style={styles.selectButtonContainer}>
                        <Select placeholder="Category" style={styles.selectButton} borderColor={'transparent'} placeholderTextColor={theme.text_icons}>
                            <Select.Item label="Pasta" value="1" />
                            <Select.Item label="Pizza" value="2" />
                        </Select>
                    </Box>
                </HStack>


                <TextInput
                    placeholder='Dish Description...'
                    placeholderTextColor={theme.text_icons}
                    style={styles.descriptionTextInput} />


                <Center style={styles.imageContainer}>
                    <TouchableOpacity>
                        <GradientIcon name='file-image-plus-outline' size={45} />
                    </TouchableOpacity>
                </Center>




            </View >

            <TouchableOpacity >
                <VerticalGradientButton text="Save" style={styles.saveButton} />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: theme.background_color,
    },
    titleScreen: {
        fontSize: 23,
        fontWeight: '700',
        marginBottom: 25
    },
    textInput: {
        width: '100%',
        height: 30,
        backgroundColor: 'transparent',
        color: theme.text_icons,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 30,
        paddingLeft: 10,
        marginBottom: 15
    },
    selectButtonContainer: {
        borderRadius: 30,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        width: '47%',
        marginBottom: 10,
        height: 30,
    },
    priceInput: {
        width: '50%',
        height: 30,
        backgroundColor: 'transparent',
        color: theme.text_icons,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 30,
        paddingLeft: 10,
        marginBottom: 15

    },
    selectButton: {
        width: '100%',
        color: theme.text_icons,
        paddingTop: 0,
        paddingBottom: 0,
        alignContent: 'center'
    },
    descriptionTextInput: {
        width: '100%',
        height: 200,
        backgroundColor: 'transparent',
        color: theme.text_icons,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        paddingTop: 10,
        marginBottom: 15,
        textAlignVertical: 'top'
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: 'transparent',
        color: theme.text_icons,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 15,
    },
    saveButton: {
        color: theme.text_icons,
        width: '90%',
        height: 30,
        borderRadius: 25,
        marginLeft: 20,
        marginBottom: 15,
        textAlign: 'center',
        paddingTop: 2,
    },

})