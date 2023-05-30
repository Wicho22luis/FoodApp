import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, AspectRatio, Image, FormControl, Select, useDisclose, Hidden, CheckIcon, Input, FlatList, AlertDialog, Text, Button } from 'native-base';
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import GradientDashboard from './GradientDashboard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';
import GradientButton from './GradientButton';
import DisableGradientButton from './DisableGradientButton';
import GradientIcon from './GradientIcon';
import DeleteGradientButton from './DeleteGradientButton';
import VerticalGradientTextGray from './VerticalGradientTextGray';
import { database } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function TableScreen() {

    const [tablesList, setTablesList] = useState([]);
    const [tableId, setTableId] = useState("");
    const voidArray = [];
    const { isOpen, onOpen, onClose } = useDisclose();

    const tables = [
        { id: 1, number: 1, status: 'On hold', waiter: 'Don Wicho' },
        { id: 2, number: 2, status: 'On hold', waiter: 'Don Wicho' },
        { id: 3, number: 3, status: 'On hold', waiter: 'Don Wicho' },
        { id: 4, number: 4, status: 'On hold', waiter: 'Don Wicho' },
        { id: 5, number: 5, status: 'On hold', waiter: 'Don Wicho' },
        { id: 6, number: 6, status: 'On hold', waiter: 'Don Wicho' },

    ];
    const navigation = useNavigation();
    const [isOpenAdd, setIsOpenAdd] = React.useState(false);
    const onCloseAdd = () => setIsOpenAdd(false);

    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const onCloseDelete = () => setIsOpenDelete(false);
    const [tableCount, setTableCount] = useState(0);
    const cancelRef = React.useRef(null);

    useEffect(() => {
        let count = 0;
        const getTables = database.ref('Tables/');
        getTables.on('value', snapshot => {
            const data = snapshot.val();
            setTablesList(voidArray);
            if (data !== null) {
                Object.values(data).map((table) => {
                    count += 1;
                    setTablesList((oldArray) => [...oldArray, table]);
                });
            }
        });
        
        setTableCount(count)
        console.log(count);
    }, []);
    
    const createNewTable = () =>{
        let newId = tableCount+1;
        database.ref('Tables/Table' + newId).set({
            Id: newId,
            Name: "Table"+newId,
            Status: "On Hold",
            Waiter: "Unassigned"
        }).then((result) => {
            onCloseAdd()
            setTableCount(tableCount+1);
        });
    }

    const deteleTable = () => {
        database.ref('Tables/Table' + tableId).set(null).then((result) => {
            onCloseDelete()
        });
    }

    return (
        <>
            <View style={styles.container}>
                <HStack alignItems={'center'} width={'100%'} marginBottom={5}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <GradientIcon name="arrow-left" size={30} />
                    </TouchableOpacity>
                    <VerticalGradientText text="Tables" style={styles.titleScreen} />
                </HStack>

                <FlatList numColumns={2} data={tablesList} renderItem={({ item }) => {
                    return <>
                    {item.Status === "On Hold" && (
                        <TouchableOpacity  onPress={() => {
                            setIsOpenDelete(!isOpenDelete);
                            setTableId(item.Id);
                            }}>
                        <Center style={styles.tableContainer} justifyContent={'flex-start'}>
                            <HStack alignItems={'center'} width={'100%'}>
                                <VerticalGradientText text={item.Id} style={styles.numberTable} />
                                <VStack>
                                    <Text style={styles.textStatus}>{item.Status}</Text>
                                    <HStack width={120} justifyContent={'flex-end'} alignItems={'center'} >
                                        <Text style={styles.textWaiter}>{item.Waiter}</Text>
                                        <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fmenu.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Center>
                    </TouchableOpacity>
                    )}
                    {item.Status === "Assigned" && (
                        <TouchableOpacity onPress={() => {
                            setIsOpenDelete(!isOpenDelete);
                            setTableId(item.Id);
                            }}>
                        <Center style={styles.tableContainer} justifyContent={'flex-start'}>
                            <HStack alignItems={'center'} width={'100%'}>
                                <VerticalGradientTextGray text={item.Id} style={styles.numberTable} />
                                <VStack>
                                    <Text style={styles.textStatusGray}>{item.Status}</Text>
                                    <HStack width={120} justifyContent={'flex-end'} alignItems={'center'} >
                                        <Text style={styles.textWaiter}>{item.Waiter}</Text>
                                        <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fserved.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Center>
                    </TouchableOpacity>
                    )}
                    </>
                }} />
            </View>

            <TouchableOpacity onPress={() => setIsOpenAdd(!isOpenAdd)}>
                <View backgroundColor={theme.background_color}>
                    <VerticalGradientButton text="Add Table" style={styles.addButton} />
                </View>
            </TouchableOpacity>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenAdd} onClose={onCloseAdd}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="New Table" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Add New Table?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseAdd}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={createNewTable}>
                                    <VerticalGradientButton text="Yes, Add" style={styles.alertButtons} />
                                </TouchableOpacity>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenDelete} onClose={onCloseDelete}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="Delete Table" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Delete Table {tableId}?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseDelete}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deteleTable}>
                                    <VerticalGradientButton text="Yes, Delete" style={styles.alertButtons} />
                                </TouchableOpacity>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>

        </>
    );
}

const styles = StyleSheet.create({
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
        paddingLeft: '47%'
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
    textStatusGray: {
        color: "#797979",
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
    colorAlertDialog: {
        backgroundColor: theme.cards_background,
        borderColor: 'transparent'
    },
    headerAlerDialog: {
        fontSize: 25,
        fontWeight: '700',
    },
    bodyAlerDialog: {
        color: theme.text_icons,
        fontSize: 22,
        fontWeight: '300',
    },
    alertButtons: {
        color: theme.text_icons,
        height: 30,
        borderRadius: 25,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 80
    },

})