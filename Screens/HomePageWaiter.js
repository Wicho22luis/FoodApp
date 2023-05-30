import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, AspectRatio, Image, Actionsheet, FormControl, Select, useDisclose, Hidden, CheckIcon, Input, FlatList, AlertDialog, Button, Text } from 'native-base';
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientTextGray from './VerticalGradientTextGray';
import VerticalGradientButton from './VerticalGradientButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';
import GradientButton from './GradientButton';
import GradientText from './GradientText';
import DeleteGradientButton from './DeleteGradientButton';
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native';

export default function HomePageWaiter() {

    const { isOpen, onOpen, onClose } = useDisclose();
    const [isOpenAlert, setIsOpenAlert] = React.useState(false);

    const [isOpenLogout, setIsOpenLogout] = React.useState(false);
    const onCloseLogout = () => setIsOpenLogout(false);

    const onCloseAlert = () => setIsOpenAlert(false);
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedIdTable, setSelectedIdTable] = useState("");
    const cancelRef = React.useRef(null);
    const navigation = useNavigation();
    const [tablesList, setTablesList] = useState([]);
    const voidArray = [];
    const tables = [
        { id: 1, number: 1, status: 'On hold', waiter: 'Don Wicho' },
        { id: 2, number: 2, status: 'On hold', waiter: 'Don Wicho' },
        { id: 3, number: 3, status: 'On hold', waiter: 'Don Wicho' },
        { id: 4, number: 4, status: 'On hold', waiter: 'Don Wicho' },
        { id: 5, number: 5, status: 'On hold', waiter: 'Don Wicho' },
        { id: 6, number: 6, status: 'On hold', waiter: 'Don Wicho' },

    ];
    const [uName, setUName] = useState("")
    const [uType, setUType] = useState()
    const [hireDate, setHireDate] = useState()
    const [uID, setUID] = useState("");
    const [Name, setName] = useState("");
    let name = "";
    const getUserData = auth.onAuthStateChanged(user => {
        if (user) {
            //REFERENCIA A LA BD USANDO EL USER ID ASIGNADO POR FIREBASE
            const reference = database.ref('Users/' + user.uid);
            setUID(user.uid)
            //EVENTO ESCUCHA QUE SE EJECUTA SOLO UNA VEZ PARA OBTENER EL NOMBRE DESDE LA REFERENCIA DEL USUARIO ACTUAL
            reference.once("value")
                .then(function (snapshot) {
                    setUName(snapshot.val().Name);
                    setUType(snapshot.val().UType);
                    setHireDate(snapshot.val().HireDate);
                    name = snapshot.val().Name;
                });
            console.log('Nombre de usuario: ' + uName);
            console.log('TIpo de usuario: ' + uType);
            console.log('Fecha de Contratacion: ' + hireDate);
        }
        return uName;

    });
    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }
    useEffect(() => {
        const getTables = database.ref('Tables/');
        getTables.on('value', snapshot => {
            const data = snapshot.val();
            setTablesList(voidArray);
            if (data !== null) {
                Object.values(data).map((order) => {
                    setTablesList((oldArray) => [...oldArray, order]);
                });
            }
        });
    }, []);

    function serveTable() {
        database.ref('Tables/' + selectedTable).update({
            Waiter: uName,
            Status: "Assigned"
        }).then((result) => {
            console.log("Datos de la mesa actualizados");
            onCloseAlert()
        });
    }


    return (
        <>
            <View style={styles.container}>
                <HStack justifyContent={'space-between'} alignItems={'center'} marginTop={7} marginBottom={2} width={'100%'}>
                    <HStack alignItems={'center'}>
                        <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fmesas.png?alt=media&token=" }} alt="Icon of Tables" size={'16'} />
                        <VerticalGradientText text='Tables' style={styles.titleScreen} />
                    </HStack>
                    <TouchableOpacity onPress={(onOpen)}>
                        <Avatar source={{
                            uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/profile-pics%2F${uID}.jpg?alt=media&token`
                        }} onPress={(onOpen)}></Avatar>
                    </TouchableOpacity>
                </HStack>

                <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                    <Actionsheet.Content style={styles.actionSheet}>
                        <HStack style={styles.rowActionSheet}>
                            <Avatar source={{
                                uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/profile-pics%2F${uID}.jpg?alt=media&token`
                            }} size={100} />
                            <VStack>
                                <GradientText text={uName} style={styles.nameText} />
                                <Text style={styles.jobText}>{uType}</Text>
                            </VStack>
                        </HStack>

                        <Text style={styles.dateText}>Date of hire: {hireDate}</Text>

                        <TouchableOpacity onPress={() => setIsOpenLogout(!isOpenLogout)}>
                            <GradientButton text={'Logout'} style={styles.logOutButton} />
                        </TouchableOpacity>

                    </Actionsheet.Content>
                </Actionsheet>

                <FlatList numColumns={2} data={tablesList} renderItem={({ item }) => {
                    return <>
                        {item.Status === "On Hold" && (
                            <TouchableOpacity onPress={() => {
                                setSelectedTable(item.Name);
                                setSelectedIdTable(item.Id);
                                setIsOpenAlert(!isOpenAlert);
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
                        {item.Status === "Assigned" && item.Waiter === uName && (
                            <TouchableOpacity onPress={() => navigation.navigate("TableDetail",{tableId: item.Id, name: uName})}>
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
                        {item.Status === "Assigned" && item.Waiter !== uName && (
                            <TouchableOpacity  onPress={() => console.log("Waiter not authorized")}>
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

            <TouchableOpacity onPress={() => navigation.navigate('MenuReadOnly')}>
                <View backgroundColor={theme.background_color}>
                    <MaterialCommunityIcons name='silverware' size={19} style={styles.menuIcon} />
                    <VerticalGradientButton text="Menu" style={styles.menuButton} />
                </View>
            </TouchableOpacity>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenAlert} onClose={onCloseAlert}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text={"Table "+selectedIdTable} style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Serve this table?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseAlert}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={serveTable}>
                                    <VerticalGradientButton text="Yes, Serve" style={styles.alertButtons} />
                                </TouchableOpacity>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenLogout} onClose={onCloseLogout}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="Logout" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                You will be returned to the login screen
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseLogout}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSignOut}>
                                    <VerticalGradientButton text="Logout" style={styles.alertButtons} />
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
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: theme.background_color,
    },
    titleScreen: {
        fontSize: 30,
        fontWeight: '400',
        paddingLeft: 10
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
    menuButton: {
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
        paddingLeft: 60,
        paddingRight: 60,
        paddingTop: 20,
        paddingBottom: 20,
    },
    nameText: {
        fontSize: 30,
        fontWeight: '700',
        paddingLeft: 20
    },
    rowActionSheet: {
        paddingBottom: 10
    },
    jobText: {
        color: theme.text_icons,
        fontSize: 20,
        fontWeight: '300',
        paddingLeft: 20
    },
    dateText: {
        color: theme.text_icons,
        textAlign: 'left',
        fontSize: 17,
        fontWeight: '200',
        width: '130%',
        paddingBottom: 17
    },
    logOutButton: {
        color: theme.text_icons,
        width: 300,
        height: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    menuIcon: {
        color: theme.text_icons,
        zIndex: 2,
        position: 'absolute',
        marginLeft: 147,
        marginTop: 4
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
        width: 75
    },
})