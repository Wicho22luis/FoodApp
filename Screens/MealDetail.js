import { StatusBar } from 'expo-status-bar';
import { Center, HStack, Avatar, VStack, Progress, Box, AspectRatio, Image, AlertDialog, Text, Button } from 'native-base';
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
import GradientBorder2 from './GradientBorder2';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database } from '../firebase';

export default function MealDetail() {
    const [isOpenAdd, setIsOpenAdd] = React.useState(false);
    const onCloseAdd = () => setIsOpenAdd(false);
    const cancelRef = React.useRef(null);

    const navigation = useNavigation();
    const route = useRoute();
    const data = route.params;
    const [id, setId] = useState(data.itemID);
    const [name, setName] = useState(data.dishName);
    const [description, setDescription] = useState(data.dishDescription);
    const [prepTime, setPrepTime] = useState(data.prepTime);
    const [price, setPrice] = useState(data.price);
    const [imageLink, setImageLink] = useState(data.imageLink);
    const [table, setTable] = useState(data.tableId);
    const [uName, setUName] = useState(data.waiterName);
    const [category, setCategory] = useState(data.dishCategory);
    console.log("Origin table ID: "+table)
    console.log("User Name: "+uName)
    const [quantity, setQuantity] = useState(1);


    const addOrder = () => {
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        const orderId = "Order-" + name + table + "-" + date + "-" + month + "-" + year;
        database.ref('Orders/' +orderId).set({
            Category: category,
            ImageLink: imageLink,
            Name: name,
            OrderId: orderId,
            PrepTime: prepTime,
            Price: parseInt(price),
            Quantity: quantity,
            Status: "Pending",
            Table: table,
            Waiter: uName
        }).then((result) => {
            navigation.goBack();
            onCloseAdd();
        });
    }
    return (
        <>
            <ScrollView backgroundColor={theme.background_color}>
                <View style={styles.container}>
                    <HStack alignItems={'center'} width={'100%'}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <GradientIcon name="arrow-left" size={30} />
                        </TouchableOpacity>
                        <VerticalGradientText text="Meal Detail" style={styles.titleScreen} />
                    </HStack>

                    <VStack style={styles.sectionContainer}>
                        <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${imageLink}?alt=media&token=` }}
                            alt="Icon of Menu" size={85} borderTopRadius={10} borderBottomRadius={10} width={'100%'} height={300} />

                        <HStack alignItems={'center'} justifyContent={'space-between'} marginTop={2}>
                            <Text style={styles.nameDish}>{name}</Text>
                            <GradientBorder2 text={`$${price} mxn`} style={styles.priceCont} />
                        </HStack>

                        <HStack alignItems={'center'} marginTop={1}>
                            <VerticalGradientText style={styles.dishTime} text={`${prepTime} min.`} />
                            <GradientIcon name="clock-time-five-outline" size={25} />
                        </HStack>


                        <Text style={styles.textDescription}>{description}</Text>

                    </VStack>

                </View>
            </ScrollView >
            <View backgroundColor={theme.background_color}>
                <HStack height={9} justifyContent={'space-between'} marginBottom={7} marginLeft={7} marginRight={7} style={styles.buttonsContainer}>
                    <GradientBorder2 style={styles.quantityContainer} />
                    <TouchableOpacity onPress={() => setIsOpenAdd(!isOpenAdd)}>
                        <VerticalGradientButton text='Add' style={styles.addButton} />
                    </TouchableOpacity>
                </HStack>

                <HStack width={'41%'} justifyContent={'space-between'} alignItems={'center'} style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setQuantity(quantity - 1)}>
                        <GradientIcon name='minus' size={30} style={styles.plusIcon} />
                    </TouchableOpacity>
                    <Text style={styles.textQuantity}>{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                        <GradientIcon name='plus' size={30} style={styles.minusIcon} />
                    </TouchableOpacity>
                </HStack>
            </View>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenAdd} onClose={onCloseAdd}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="Add" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Add to order?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseAdd}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addOrder()}>
                                    <VerticalGradientButton text="Yes, Add" style={styles.alertButtons} />
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
        textAlign: 'center',
        width: '100%',
        paddingLeft: '30%'
    },
    nameDish: {
        color: theme.text_icons,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
        width: '65%'
    },
    sectionView: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '900'

    },
    sectionContainer: {
        width: '100%',
        padding: 10,
    },
    dishContainer: {
        width: 180,
        height: 170,
        marginTop: 10,
        backgroundColor: theme.cards_background,
        borderRadius: 10,
        alignItems: 'flex-start',
        marginRight: 20
    },
    dishTitle: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '900',
        paddingLeft: 5
    },
    dishAdditionalInfo: {
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    dishTime: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 2,
        marginRight: 7
    },
    textDescription: {
        color: theme.text_icons,
        fontSize: 18,
        fontWeight: '200',
        textAlign: 'justify'
    },
    addButton: {
        color: theme.text_icons,
        width: 130,
        height: 34,
        borderRadius: 25,
        marginBottom: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '700',
        fontSize: 17
    },
    priceCont: {
        margin: 5,
        paddingHorizontal: 3,
        textAlign: "center",
        backgroundColor: theme.cards_background,
        color: theme.text_icons,
        fontSize: 20,
        fontWeight: '900',
        paddingTop: 0,
    },
    quantityContainer: {
        margin: 4,
        paddingHorizontal: 1,
        textAlign: "center",
        backgroundColor: theme.cards_background,
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '500',
        paddingTop: 0,
        width: 145,
    },
    buttonContainer: {
        zIndex: 2,
        position: 'absolute',
        marginTop: 2,
        marginLeft: 35
    },
    textQuantity: {
        color: theme.text_icons,
        fontSize: 20,
        fontWeight: '700'
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