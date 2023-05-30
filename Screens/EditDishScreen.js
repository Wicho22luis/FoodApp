import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, Actionsheet, Select, useDisclose, Image,Hidden, CheckIcon, Input, Button, AlertDialog } from 'native-base';
import React, { useRef, useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import theme from './theme';
import GradientIcon from './GradientIcon';
import DeleteGradientButton from './DeleteGradientButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database, storage } from '../firebase';
import * as ImagePicker from 'expo-image-picker';

export default function EditDishScreen() {

    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [selectImage, setSelectImage] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
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

    const updateImage = async () => {
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
        const ref = storage.ref().child(`menu/${ImageLink}`)
        const snapshot = ref.put(blob)
        setImage(null);
        setSelectImage(null);
        setLoading(false);
        onCloseSave();
        setLoading(false);
        navigation.goBack();
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


    const category = ["Pasta", "Pizza", "Drinks"];

    const [isOpenSave, setIsOpenSave] = useState(false);
    const onCloseSave = () => setIsOpenSave(false);

    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const onCloseDelete = () => setIsOpenDelete(false);

    const cancelRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclose();
    const navigation = useNavigation();
    const route = useRoute();
    const dishData = route.params;
    //HOOKS PARA LOS DATOS DEL PLATILLO
    //EL ERROR ESTA AQUIIII
    const [Name, setName] = useState(dishData.dishName);
    const [Description, setDescription] = useState(dishData.dishDescription);
    const [PrepTime, setPrepTime] = useState(dishData.prepTime);
    const [Price, setPrice] = useState(dishData.price);
    const [Category, setCategory] = useState(dishData.dishCategory);
    const [Id, setId] = useState(dishData.itemID);
    const [ImageLink, setImageLink] = useState(dishData.imageLink);
    console.log(ImageLink);

    const updateData = () => {
        database.ref('Menu/' + Id).update({
            Name,
            Description,
            PrepTime,
            Price,
            Category,
            Id
        }).then((result) => {
            if(selectImage){
                updateImage();
            }else{
                setLoading(false);
                onCloseSave();
                setLoading(false);
                navigation.goBack();
            }
        });
    }

    const deleteData = () => {
        database.ref('Menu/' + Id).set(null).then((result) => {
            navigation.goBack()
        });
    }
    return (
        <>
            <View style={styles.container}>
                <VerticalGradientText text="Edit Dish Information" style={styles.titleScreen} />
                <TextInput
                    placeholder='Dish Name'
                    placeholderTextColor={theme.text_icons}
                    style={styles.textInput}
                    onChangeText={text => setName(text)}
                    value={Name} />

                <TextInput
                    placeholder='Preparation Time'
                    placeholderTextColor={theme.text_icons}
                    style={styles.textInput}
                    value={PrepTime}
                    keyboardType='numeric'
                    onChangeText={text => setPrepTime(text)} />


                <HStack justifyContent={'space-between'} width={'100%'}>
                    <TextInput
                        placeholder='Price'
                        placeholderTextColor={theme.text_icons}
                        style={styles.priceInput}
                        value={Price}
                        keyboardType='numeric'
                        onChangeText={text => setPrice(text)}
                    />
                    <SelectDropdown
                        data={category}
                        // defaultValueByIndex={1}
                        defaultValue={Category}
                        onSelect={(selectedItem, index) => {
                            setCategory(selectedItem);
                        }}
                        defaultButtonText={Category}
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

                <TextInput
                    placeholder='Dish Description...'
                    placeholderTextColor={theme.text_icons}
                    style={styles.descriptionTextInput}
                    value={Description}
                    onChangeText={text => setDescription(text)}
                    multiline />


                <TouchableOpacity onPress={() => pickImage()}>
                    <Center style={styles.imageContainer}>
                        {image && <Image resizeMode='cover' source={{ uri: image }} alt="Icon of Menu" style={{ flex: 1 }} size={500} borderRadius={10} />}
                        {!image && <Image resizeMode='cover' source={{ 
                                uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${ImageLink}?alt=media&token=` }} alt="Icon of Menu" style={{ flex: 1 }} size={500} borderRadius={10} />}
                        
                    </Center>
                </TouchableOpacity>
            </View >

            <HStack style={[styles.buttonsContainer, styles.darkBackground]}>
                <TouchableOpacity onPress={() => setIsOpenSave(!isOpenSave)}>
                    <VerticalGradientButton text="Save Changes" style={styles.actionButton} />
                </TouchableOpacity>

                <TouchableOpacity onPress={(() => setIsOpenDelete(!isOpenDelete))}>
                    <DeleteGradientButton text="Delete Dish" style={styles.actionButton} />
                </TouchableOpacity>
            </HStack>


            <Center style={styles.darkBackground}>
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
                                Delete Dish?
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
        paddingTop: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: theme.background_color,
    },
    darkBackground: {
        backgroundColor: theme.background_color
    },
    titleScreen: {
        fontSize: 23,
        fontWeight: '700',
        paddingLeft: '15%'
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
        width: 335,
        height: 335,
        backgroundColor: 'transparent',
        color: theme.text_icons,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 10,
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
    }, dropdown1BtnStyle: {
        width: '47%',
        height: 30,
        backgroundColor: theme.background_color,
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