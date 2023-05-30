import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, AspectRatio, Image, Actionsheet, FormControl, Select, useDisclose, Hidden, CheckIcon, Button, Text, AlertDialog, Input, Spinner, Heading } from 'native-base';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { database, auth, storage } from '../firebase';

import * as ImagePicker from 'expo-image-picker';

////////////////////////////////////////////////////////////////

//Import para validaciones
import { useForm, Controller } from 'react-hook-form';

export default function AddUserButton() {

    /////////// IMAGENES////////////////////////
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
            setSelectImage(true);

        }
    }

    // create bucket storage reference to not yet existing image
    const [uploading, setUploading] = useState(false)
    const reference = storage.ref('menu/image1.jpg');

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

    const { isOpen, onOpen, onClose } = useDisclose();

    const role = ["Waiter", "Chef"];

    const area = ["Kitchen", "Tables", "Bar"];

    const [isOpenSave, setIsOpenSave] = React.useState(false);
    const onCloseSave = () => setIsOpenSave(false);
    const [isOpenImage, setIsOpenImage] = React.useState(false);
    const onCloseImage = () => setIsOpenImage(false);
    const cancelRef = React.useRef(null);

    //HOOKS USER DATA
    const [HireDate, setHireDate] = useState("15-05-2023");
    //const [Name, setName] = useState("");
    //const [Mail, setMail] = useState("");
    //const [userPassword, setUserPassword] = useState("");
    //const [UType, setUType] = useState("");
    const [UID, setUID] = useState("");
    //const [UArea, setUArea] = useState("");

    //
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            Name: '',
            Mail: '',
            Password: '',
            UArea: '',
            UType: '',
        }
    });

    //CREACION DE UN NUEVO USUARIO
    const handleSignUp = (data) => {
            console.log(data);
            setLoading(true)
            auth.createUserWithEmailAndPassword(data.Mail, data.Password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log("Registered with: ", data.Mail);
                    setUID(user.uid)
                    database.ref('Users/' + user.uid).set({
                        Mail: data.Mail,
                        Name: data.Name,
                        UID: user.uid,
                        UType: data.UType,
                        UArea: data.UArea,
                        HireDate
                    }).then((result) => {
                        uploadImage(user.uid)
                    });
                })
                .catch(error => alert(error.message))
    }


    return (
        <>
            <TouchableOpacity onPress={(onOpen)}>
                <View backgroundColor={theme.background_color}>
                    <VerticalGradientButton text="Add new user" style={styles.addButton} />
                </View>
            </TouchableOpacity>


            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} width="100%">
                    <Actionsheet.Content style={styles.actionSheet}>
                        <VerticalGradientText text={'Add User'} style={styles.actionSheetTitle} />
                        <TouchableOpacity onPress={() => pickImage()}>
                            {!selectImage && (<Box style={styles.boxImage}>
                                <GradientIcon name='file-image-plus-outline' size={45} />
                            </Box>)}
                            {image && <Avatar resizeMode='cover' source={{ uri: image }} alt="Icon of Menu" marginBottom={4} size={20} />}
                        </TouchableOpacity>

                        <FormControl isRequired isInvalid={'Name' in errors}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder='Name'
                                        placeholderTextColor={theme.text_icons}
                                        style={styles.textInput}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value} />
                                )}
                                name="Name"
                                rules={{ required: 'Name is required' }}
                                defaultValue=""
                            />
                            <FormControl.ErrorMessage>
                                {errors.Name?.message}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={'Mail' in errors}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder='Email'
                                        placeholderTextColor={theme.text_icons}
                                        style={styles.textInput}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value} />
                                )}
                                name="Mail"
                                rules={{ required: 'Email is required' }}
                                defaultValue=""
                            />
                            <FormControl.ErrorMessage>
                                {errors.Mail?.message}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={'Password' in errors}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder='Password'
                                        placeholderTextColor={theme.text_icons}
                                        style={styles.textInput}
                                        secureTextEntry={true}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value} />
                                )}
                                name="Password"
                                rules={{ required: 'Password is required' }}
                                defaultValue=""
                            />
                            <FormControl.ErrorMessage>
                                {errors.Password?.message}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <HStack width={'100%'}>
                            <FormControl isRequired isInvalid={'UArea' in errors} width={300} style={styles.controlAreaSelect}>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <SelectDropdown
                                            data={area}
                                            // defaultValueByIndex={1}
                                            // defaultValue={'Egypt'}
                                            onSelect={onChange}
                                            defaultButtonText={'Area'}
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
                                    )}
                                    name="UArea"
                                    rules={{ required: 'An area is required' }}
                                    defaultValue=""
                                />
                                <FormControl.ErrorMessage>
                                    {errors.UArea?.message}
                                </FormControl.ErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={'UType' in errors} style={styles.controlRoleSelect} marginBottom={50}>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <SelectDropdown
                                            data={role}
                                            // defaultValueByIndex={1}
                                            // defaultValue={'Egypt'}
                                            onSelect={onChange}
                                            defaultButtonText={'Role'}
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
                                    )}
                                    name="UType"
                                    rules={{ required: 'A role is required' }}
                                    defaultValue=""
                                />
                                <FormControl.ErrorMessage>
                                    {errors.UType?.message}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </HStack>

                        <Center height={77} />

                        <TouchableOpacity onPress={() => setIsOpenSave(!isOpenSave)}>
                            <VerticalGradientButton text={'Save User'} style={styles.saveButton} />
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
                                Save User?
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
                                <TouchableOpacity onPress={handleSubmit(handleSignUp)}>
                                    <VerticalGradientButton text="Yes, Save" style={styles.alertButtons} />
                                </TouchableOpacity>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center >
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
    actionSheet: {
        borderTopRadius: 20,
        backgroundColor: theme.cards_background,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        width: '100%',
    },
    actionSheetTitle: {
        fontSize: 26,
        fontWeight: '500',
        paddingLeft: 20,
        marginBottom: 7,
    },
    boxImage: {
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
        marginTop: 10,
        fontSize: 14
    },
    saveButton: {
        color: theme.text_icons,
        width: 320,
        height: 30,
        borderRadius: 25,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown1BtnStyle: {
        width: '47%',
        height: 30,
        backgroundColor: theme.cards_background,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.gray_borderColor,
        marginTop: 10,
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
    controlAreaSelect: {
        position: 'absolute',
        marginTop: 1,
        marginLeft: 3
    },
    controlRoleSelect: {
        position: 'absolute',
        marginTop: 1,
        marginLeft: 170
    }
})