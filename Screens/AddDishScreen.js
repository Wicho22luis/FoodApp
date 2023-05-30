import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, Image, FormControl, Select, useDisclose, Hidden, CheckIcon, Input, AlertDialog, Button, Spinner } from 'native-base';
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import theme from './theme';
import GradientIcon from './GradientIcon';
import SelectDropdown from 'react-native-select-dropdown';
import { database, storage } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DeleteGradientButton from './DeleteGradientButton';
import * as ImagePicker from 'expo-image-picker';
//Import para validaciones
import { useForm, Controller } from 'react-hook-form';

export default function AddDishScreen() {

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

    const category = ["Pasta", "Pizza", "Drink"];
    //const [Name, setName] = useState("");
    //const [Description, setDescription] = useState("");
    //const [PrepTime, setPrepTime] = useState("");
    //const [Price, setPrice] = useState("");
    //const [Category, setCategory] = useState("");
    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            time: undefined,
            price: undefined,
            category: '',
            description: '',
        }
    });

    const [isOpenSave, setIsOpenSave] = React.useState(false);
    const onCloseSave = () => setIsOpenSave(false);
    const cancelRef = React.useRef(null);

    const uploadImage = async (imageId) => {
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
        const ref = storage.ref().child(`menu/${imageId}`)
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

    const uploadData = (data) => {
        setLoading(true)
        const imageId = data.name + data.price + ".jpg";
        const imageLink = imageId.replace(' ', '');
        database.ref('Menu/' + data.name + data.price).set({
            Name: data.name,
            Description: data.description,
            PrepTime: data.time,
            Price: data.price,
            Category: data.category,
            ImageLink: imageLink,
            Id: data.name + data.price
        }).then((result) => {
            uploadImage(imageLink)
        });
    }

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <VerticalGradientText text="Add Dish to Menu" style={styles.titleScreen} />
                    <FormControl isRequired isInvalid={'name' in errors} padding={0}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Dish Name'
                                    placeholderTextColor={theme.text_icons}
                                    style={styles.textInput}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value} />
                            )}
                            name="name"
                            rules={{ required: 'Name is required', minLength: 3 }}
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage>
                            {errors.name?.message}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={'time' in errors} padding={0}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Preparation Time'
                                    placeholderTextColor={theme.text_icons}
                                    style={styles.textInput}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    keyboardType='numeric' />
                            )}
                            name="time"
                            rules={{ required: 'Preparation time is required', min: 1 }}
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage>
                            {errors.time?.type === 'required'
                                ? errors.time?.message
                                : errors.time?.type === 'min' ?? 'Under age'}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <HStack width={'100%'}>
                        <FormControl isRequired isInvalid={'price' in errors}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder='Price'
                                        placeholderTextColor={theme.text_icons}
                                        style={styles.priceInput}
                                        keyboardType='numeric'
                                        onChangeText={onChange}
                                    />
                                )}
                                name="price"
                                rules={{ required: 'Price is required', minLength: 3 }}
                                defaultValue=""
                            />
                            <FormControl.ErrorMessage>
                                {errors.price?.message}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={'category' in errors} style={styles.controlCategorySelect}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <SelectDropdown
                                        data={category}
                                        // defaultValueByIndex={1}
                                        // defaultValue={'Egypt'}
                                        onSelect={onChange}
                                        defaultButtonText={'Category'}
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
                                name="category"
                                rules={{ required: 'A category is required' }}
                                defaultValue=""
                            />
                            <FormControl.ErrorMessage>
                                {errors.category?.message}
                            </FormControl.ErrorMessage>
                        </FormControl>
                    </HStack>

                    <Center height={5} />

                    <FormControl isRequired isInvalid={'description' in errors}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Dish Description...'
                                    placeholderTextColor={theme.text_icons}
                                    style={styles.descriptionTextInput}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    multiline
                                />
                            )}
                            name="description"
                            rules={{ required: 'Description is required' }}
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage>
                            {errors.description?.message}
                        </FormControl.ErrorMessage>
                    </FormControl>

                    <Center style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => pickImage()}>
                            {!selectImage && (<GradientIcon name='file-image-plus-outline' size={45} />)}
                            {image && <Image resizeMode='cover' source={{ uri: image }} alt="Icon of Menu" style={{ flex: 1 }} size={500} borderRadius={10} />}
                        </TouchableOpacity>
                    </Center>
                </View >
            </ScrollView>


            <TouchableOpacity style={styles.darkBackground} onPress={() => setIsOpenSave(!isOpenSave)}>
                <VerticalGradientButton text="Save" style={styles.saveButton} />
            </TouchableOpacity>


            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenSave} onClose={onCloseSave}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="Save" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Save Dish?
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
                                <TouchableOpacity onPress={handleSubmit(uploadData)}>
                                    <VerticalGradientButton text="Yes, Save" style={styles.alertButtons} />
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
        paddingLeft: '22%'
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
        marginTop: 15
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
        marginTop: 15
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
        marginTop: 15,
        textAlignVertical: 'top'
    },
    imageContainer: {
        width: '100%',
        height: 335,
        backgroundColor: 'transparent',
        color: theme.text_icons,
        borderColor: theme.gray_borderColor,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15,
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
    dropdown1BtnStyle: {
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
    controlCategorySelect: {
        position: 'absolute',
        marginTop: 15,
        marginLeft: 180
    }


})