import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, Actionsheet, Select, useDisclose, Hidden, CheckIcon, Input, useState } from 'native-base';
import React from "react";
import { Text, View, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import theme from './theme';
import GradientIcon from './GradientIcon';
import DeleteGradientButton from './DeleteGradientButton';

export default function AddDishScreen() {
    const { isOpen, onOpen, onClose } = useDisclose();

    return (
        <>
            <View style={styles.container}>
                <VerticalGradientText text="Edit Dish Information" style={styles.titleScreen} />
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

            <HStack style={[styles.buttonsContainer, styles.darkBackground]}>
                <TouchableOpacity>
                    <VerticalGradientButton text="Save Changes" style={styles.actionButton} />
                </TouchableOpacity>

                <TouchableOpacity onPress={(onOpen)}>
                    <DeleteGradientButton text="Delete Dish" style={styles.actionButton} />
                </TouchableOpacity>
            </HStack>


            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <Actionsheet.Content style={styles.actionSheet}>
                    <VerticalGradientText text={'Delete Dish?'} style={styles.actionSheetTitle} />
                    <HStack style={styles.containerActionButtons}>
                        <TouchableOpacity onPress={onClose}>
                            <VerticalGradientButton text="Cancel" style={styles.actionButton} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={(onOpen)}>
                            <DeleteGradientButton text="Yes, delete" style={styles.actionButton} />
                        </TouchableOpacity>
                    </HStack>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
}

const styles = StyleSheet.create({
    darkBackground: {
        backgroundColor: theme.background_color
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
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
    buttonsContainer: {
        width: '100%',
        justifyContent: 'space-between',
        paddingLeft: 7,
        paddingRight: 7,
    },
    actionButton: {
        color: theme.text_icons,
        height: 30,
        borderRadius: 25,
        marginBottom: 15,
        textAlign: 'center',
        width: 170,
        textAlignVertical: 'center'
    },
    actionSheet: {
        borderTopRadius: 20,
        backgroundColor: theme.cards_background,
        paddingTop: 20,
        paddingBottom: 7,
        width: '100%',
    },
    actionSheetTitle: {
        fontSize: 26,
        fontWeight: '500',
        paddingLeft: 20,
        marginBottom: 7, 
        textAlign: 'left',  
        width: 370
    },
    containerActionButtons: {
        justifyContent: 'space-between',
        width: '100%',
        borderTopColor: theme.gray_borderColor,
        borderTopWidth: 1,
        paddingTop: 15
    }

})