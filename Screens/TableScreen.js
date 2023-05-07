import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, AspectRatio, Image, Actionsheet, FormControl, Select, useDisclose, Hidden, CheckIcon, Input, useState, FlatList } from 'native-base';
import React from "react";
import { Text, View, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import theme from './theme';
import DeleteGradientButton from './DeleteGradientButton';

export default function TableScreen() {

    const { isOpen, onOpen, onClose } = useDisclose();

    const tables = [
        { id: 1, number: 1, status: 'On hold', waiter: 'Don Wicho' },
        { id: 2, number: 2, status: 'On hold', waiter: 'Don Wicho' },
        { id: 3, number: 3, status: 'On hold', waiter: 'Don Wicho' },
        { id: 4, number: 4, status: 'On hold', waiter: 'Don Wicho' },
        { id: 5, number: 5, status: 'On hold', waiter: 'Don Wicho' },
        { id: 6, number: 6, status: 'On hold', waiter: 'Don Wicho' },

    ];

    return (
        <>
            <View style={styles.container}>
                <VerticalGradientText text="Tables" style={styles.titleScreen} />

                <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                    <Actionsheet.Content style={styles.actionSheet}>
                        <VerticalGradientText text={'Delete Table 1?'} style={styles.actionSheetTitle} />
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

                <FlatList numColumns={2} data={tables} renderItem={({ item }) => {
                    return <TouchableOpacity onPress={(onOpen)}>
                        <Center style={styles.tableContainer} justifyContent={'flex-start'}>
                            <HStack alignItems={'center'} width={'100%'}>
                                <VerticalGradientText text={item.number} style={styles.numberTable} />
                                <VStack>
                                    <Text style={styles.textStatus}>{item.status}</Text>
                                    <HStack width={120} justifyContent={'flex-end'} alignItems={'center'} >
                                        <Text style={styles.textWaiter}>{item.waiter}</Text>
                                        <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fmenu.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Center>

                    </TouchableOpacity>


                }} />
            </View>

            <TouchableOpacity style={styles.darkBackground}>
                <VerticalGradientButton text="Add Table" style={styles.addButton} />
            </TouchableOpacity>



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
        marginBottom: 20
    },
    tableContainer: {
        backgroundColor: theme.cards_background,
        width: 161,
        height: 80,
        marginTop: 10,
        marginRight: 12,
        borderRadius: 10,
        paddingLeft: 7,
    },
    numberTable: {
        fontSize: 50,
        fontWeight: '700',
        textAlignVertical: 'center',
        marginRight: 5,
    },
    textStatus: {
        color: theme.text_icons,
        textAlign: 'right',
        paddingRight: 5,
        fontSize: 17,
        fontWeight: '700',
        paddingBottom: 10,
        paddingTop: 10
    },
    textWaiter: {
        color: theme.text_icons,
        fontSize: 17,
        fontWeight: '300',
        paddingRight: 3
    },
    addButton: {
        color: theme.text_icons,
        width: '90%',
        height: 30,
        borderRadius: 25,
        marginLeft: 20,
        marginBottom: 15,
        textAlign: 'center',
        paddingTop: 2,
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

})