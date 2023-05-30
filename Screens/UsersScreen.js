import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, AspectRatio, Image, Actionsheet, FormControl, Select, useDisclose, Button, AlertDialog, Text, Spinner } from 'native-base';
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable, KeyboardAvoidingView } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import GradientDashboard from './GradientDashboard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';
import GradientButton from './GradientButton';
import DisableGradientButton from './DisableGradientButton';
import GradientIcon from './GradientIcon';
import DeleteGradientButton from './DeleteGradientButton';
import SelectDropdown from 'react-native-select-dropdown';
import AddUserButton from './AddUserButton';
import { database, storage } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
export default function UsersScreen() {
    //IMAGES
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [selectImage, setSelectImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { isOpen, onOpen, onClose } = useDisclose();
    const role = ["Waiter", "Chef"];
    const area = ["Kitchen", "Tables", "Bar"];

    //HOOKS USER DATA
    const [HireDate, setHireDate] = useState("15-05-2023");
    const [Name, setName] = useState("");
    const [Mail, setMail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [UType, setUType] = useState("");
    const [UID, setUID] = useState("");
    const [UArea, setUArea] = useState("");
    const [usersList, setUsersList] = useState([]);
    const voidArray = [];

    const [isOpenSave, setIsOpenSave] = React.useState(false);
    const onCloseSave = () => setIsOpenSave(false);

    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const onCloseDelete = () => setIsOpenDelete(false);

    const [search, setSearch] = useState("Waiter");
    const cancelRef = React.useRef(null);

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();

        const getUsers = database.ref('Users/');
        getUsers.on('value', snapshot => {
            const data = snapshot.val();
            setUsersList(voidArray);
            if (data !== null) {
                Object.values(data).map((user) => {
                    setUsersList((oldArray) => [...oldArray, user]);
                });
            }
        });
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });


        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }
    //FILTRADO
    let resultadoBusqueda = [];
    if (!search) {
        resultadoBusqueda = usersList;
    } else {
        resultadoBusqueda = usersList.filter((dato) =>
            dato.UType.toLowerCase().includes(search.toLowerCase()))
        //setPendingOrders(resultadoBusqueda.length);
    }

    const updateData = () => {
        database.ref('Users/' + UID).update({
            Name,
            Mail,
            UID,
            UType,
            UArea
        }).then((result) => {
            if(selectImage){
                uploadImage(UID)
            }else{  
                setLoading(false);
                onClose()
                onCloseSave()
            }
        });
    }
    const deleteData = () => {
        database.ref('Users/' + UID).set(null).then((result) => {
            onClose()
            onCloseDelete()
        });
    }
    function setModifyData(name, email, uid, utype, area) {
        setName(name);
        setMail(email);
        setUID(uid);
        setUType(utype);
        setUArea(area);
    }

    const uploadImage = async (uid) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        })
        const ref = storage.ref().child(`profile-pics/${uid}.jpg`)
        const snapshot = ref.put(blob)
        setImage(null);
        setSelectImage(null);
        setLoading(false);
        onClose()
        onCloseSave()
        /*snapshot.on(storage.TaskEvent.STATE_CHANGED,
            () => {
                setUploading(true)
            },
            (error) => {
                setUploading(false)
                console.log(error)
                blob.close()
                return
            },
            () => {
                snapshot.snapshot.ref.getDownloadURL().then((url) => {
                    setUploading(false)
                    console.log("Download URL: ", url)
                    setImage(url)
                    blob.close()
                    return url
                })
            }
        )*/
    }


    return (
        <>
            <ScrollView backgroundColor={theme.background_color}>
                <View style={styles.container}>
                    <HStack alignItems={'center'} width={'100%'}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <GradientIcon name="arrow-left" size={30} />
                        </TouchableOpacity>
                        <VerticalGradientText text="Users" style={styles.titleScreen} />
                    </HStack>

                    <HStack style={styles.categoriesRow}>
                        <TouchableOpacity onPress={() => setSearch("Waiter")}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Text style={styles.categoriesName}> Waiters </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSearch("Chef")}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Text style={styles.categoriesName}> Chefs </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>


                    </HStack>
                    <VStack style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{search} Accounts</Text>
                        {resultadoBusqueda.map((item) => (
                            <TouchableOpacity onPress={() => {
                                setModifyData(item.Name, item.Mail, item.UID, item.UType, item.UArea);
                                onOpen();
                            }} key={item.UID} >
                                <Center style={styles.userContainer}>
                                    <HStack alignItems={'center'}>
                                        <Avatar source={{
                                            uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/profile-pics%2F${item.UID}.jpg?alt=media&token`
                                        }} size={50} />
                                        <VStack flex={1} marginLeft={2}>
                                            <VerticalGradientText style={styles.waiterName} numberOfLines={1} text={item.Name} flex={1} />
                                            <Text style={styles.infoJob}>{item.UType}</Text>
                                        </VStack>
                                    </HStack>
                                    <HStack alignItems={'center'}>
                                        <Text style={styles.contactSubtitle}>Contact: </Text>
                                        <Text style={styles.infoContact}>{item.Mail}</Text>
                                        <HStack justifyContent={'flex-end'} width={'100%'} flex={1}>
                                            <VerticalGradientText text="More..." style={styles.moreText} />
                                        </HStack>
                                    </HStack>
                                </Center>
                            </TouchableOpacity>
                        ))}
                    </VStack>

                </View>

            </ScrollView>
            <AddUserButton />

            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} width="100%">
                    <Actionsheet.Content style={styles.actionSheet}>
                        <VerticalGradientText text={'Modify User'} style={styles.actionSheetTitle} />
                        <TouchableOpacity onPress={() => pickImage()}>
                            {image && <Avatar resizeMode='cover' source={{ uri: image }} alt="Icon of Menu" marginBottom={4} size={20} color={'amber'} />}
                            {!image && <Avatar resizeMode='cover' source={{ 
                                uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/profile-pics%2F${UID}.jpg?alt=media&token` }} alt="Icon of Menu" marginBottom={4} size={20} color={'amber'} />}
                        </TouchableOpacity>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={theme.text_icons}
                            style={styles.textInput}
                            onChangeText={text => setName(text)}
                            value={Name} />
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={theme.text_icons}
                            style={styles.textInput}
                            onChangeText={text => setMail(text)}
                            value={Mail} />

                        <HStack justifyContent={'space-between'} width={'100%'} marginBottom={4}>
                            <SelectDropdown
                                data={area}
                                // defaultValueByIndex={1}
                                defaultValue={UArea}
                                onSelect={(selectedItem, index) => {
                                    setUArea(selectedItem);
                                    console.log(selectedItem)
                                }}
                                defaultButtonText={UArea}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item;
                                }}
                                buttonStyle={styles.dropdown1BtnStyle}
                                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={theme.text_icons} size={18} />;
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdown1DropdownStyle}
                                rowStyle={styles.dropdown1RowStyle}
                                rowTextStyle={styles.dropdown1RowTxtStyle}
                            />
                            <SelectDropdown
                                data={role}
                                // defaultValueByIndex={1}
                                defaultValue={UType}
                                onSelect={(selectedItem, index) => {
                                    setUType(selectedItem);
                                }}
                                defaultButtonText={UType}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item;
                                }}
                                buttonStyle={styles.dropdown1BtnStyle}
                                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={theme.text_icons} size={18} />;
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdown1DropdownStyle}
                                rowStyle={styles.dropdown1RowStyle}
                                rowTextStyle={styles.dropdown1RowTxtStyle}
                            />
                        </HStack>
                        <TouchableOpacity onPress={() => setIsOpenSave(!isOpenSave)}>
                            <VerticalGradientButton text={'Save Changes'} style={styles.saveButton} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsOpenDelete(!isOpenDelete)}>
                            <DeleteGradientButton text={'Delete User'} style={styles.saveButton} />
                        </TouchableOpacity>
                    </Actionsheet.Content>
                </KeyboardAvoidingView>
            </Actionsheet>


            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenSave} onClose={onCloseSave}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="Save" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Save Changes?
                            </Text>
                            {loading &&
                                (<HStack space={2}>
                                    <Text color="#ffffff" fontSize="md">
                                        Uploading data
                                    </Text>
                                    <Spinner color="#ffffff" accessibilityLabel="Loading posts" />
                                </HStack>)}

                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseSave}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={updateData}>
                                    <VerticalGradientButton text="Yes, Save" style={styles.alertButtons} />
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
                            <VerticalGradientText text="Delete" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Delete User?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseDelete}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deleteData}>
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
        marginTop: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: theme.background_color,
    },
    titleScreen: {
        fontSize: 23,
        fontWeight: '700',
        paddingLeft: '50%',
    },
    categoriesContainer: {
        backgroundColor: theme.cards_background,
        width: 150,
        height: 35,
        borderRadius: 30,
    },
    categoriesRow: {
        marginTop: 20,
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 10,
    },
    categoriesName: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: 'bold'
    },
    sectionTitle: {
        color: theme.text_icons,
        fontSize: 21,
        fontWeight: '500',
        textAlign: 'left',
        marginBottom: 10
    },
    sectionContainer: {
        width: '100%',
        padding: 10,
    },
    userContainer: {
        width: '100%',
        paddingRight: 7,
        marginTop: 10,
        backgroundColor: theme.cards_background,
        borderRadius: 10,
        alignItems: 'flex-start',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 7,
    },
    waiterName: {
        color: theme.text_icons,
        fontSize: 18,
        fontWeight: '300',
        width: '100%',
    },
    infoJob: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '400',
        paddingLeft: 4,
        paddingRight: 10,
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
    contactSubtitle: {
        color: theme.text_icons,
        fontSize: 12,
        fontWeight: '500'
    },
    infoContact: {
        color: theme.text_icons,
        fontSize: 12,
        fontWeight: '300'
    },
    moreText: {
        fontSize: 12,
        fontWeight: '300'
    },
    actionSheet: {
        borderTopRadius: 20,
        backgroundColor: theme.cards_background,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%'
    },
    actionSheetTitle: {
        fontSize: 26,
        fontWeight: '500',
        paddingLeft: 20,
        marginBottom: 7,
    },
    avatarImage: {
        backgroundColor: theme.background_color,
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 10,
        fontSize: 14
    },
    selectButtonContainer: {
        borderRadius: 30,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        width: '47%',
        marginBottom: 10,
        height: 30,
    },
    saveButton: {
        color: theme.text_icons,
        width: 320,
        height: 30,
        borderRadius: 25,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 7
    },
    selectButton: {
        width: '100%',
        color: theme.text_icons,
        paddingTop: 0,
        paddingBottom: 0,
        alignContent: 'center'
    },
    dropdown1BtnStyle: {
        width: '47%',
        height: 30,
        backgroundColor: theme.cards_background,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.gray_borderColor,
    },
    dropdown1BtnTxtStyle: {
        color: theme.text_icons,
        textAlign: 'left',
        fontSize: 14
    },
    dropdown1DropdownStyle: {
        backgroundColor: theme.background_color
    },
    dropdown1RowStyle: {
        backgroundColor: theme.cards_background,
        borderBottomColor: theme.gray_borderColor
    },
    dropdown1RowTxtStyle: {
        color: theme.text_icons,
        textAlign: 'left',
        fontSize: 14
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