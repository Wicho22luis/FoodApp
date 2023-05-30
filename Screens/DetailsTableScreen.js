import { StatusBar } from 'expo-status-bar';
import { Center, HStack, VStack, Box, Image, useDisclose, Text, AlertDialog, Button } from 'native-base';
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';
import GradientIcon from './GradientIcon';
import DeleteGradientButton from './DeleteGradientButton';
import GradientBorder from './GradientBorder';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database } from '../firebase';

export default function DetailsTableScreen() {

    const { isOpen, onOpen, onClose } = useDisclose();
    const [isOpenOrder, setIsOpenOrder] = React.useState(false);
    const onCloseOrder = () => setIsOpenOrder(false);
    const [isOpenPay, setIsOpenPay] = React.useState(false);
    const onClosePay = () => setIsOpenPay(false);
    const [isOpenDeliver, setIsOpenDeliver] = React.useState(false);
    const onCloseDeliver = () => setIsOpenDeliver(false);
    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const onCloseDelete = () => setIsOpenDelete(false);
    const cancelRef = React.useRef(null);
    //VARIABLES RECIBIDAS
    const route = useRoute();
    const navigation = useNavigation();
    const tableData = route.params;
    const [table, setTable] = useState(tableData.tableId);
    console.log("Mesa que mas aplauda: " + table);
    const [uName, setUName] = useState(tableData.name);
    const [selectedOrderId, setSelectedOrderId] = useState();
    const pendingOrders = [
        { key: 1, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { key: 2, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
    ];

    const placedOrders = [
        { key: 3, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0', status: 'Ready' },
        { key: 4, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0', status: 'Cooking' },
    ];


    const [preorderList, setPreorderList] = useState([])
    const [orderedList, setOrderedList] = useState([])
    const [pendingCost, setPendingCost] = useState(0);
    const [orderedCost, setOrderedCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const voidArray = [];
    useEffect(() => {
        const getOrders = database.ref('Orders/');
        let totalPendingCost = 0;
        let totalOrderedCost = 0;
        let costo = 0;
        getOrders.on('value', snapshot => {
            const data = snapshot.val();
            setPreorderList(voidArray);
            setOrderedList(voidArray);
            setOrderedCost(0);
            setPendingCost(0);
            costo = 0;
            totalPendingCost = 0;
            totalOrderedCost = 0;
            if (data !== null) {
                Object.values(data).map((order) => {
                    if (order.Status === "Pending") {
                        console.log("MESA:" + table);
                        console.log("DATO:" + order.Table);
                        if (order.Table === table) {
                            costo = order.Price * order.Quantity;
                            setPendingCost(totalPendingCost += costo)
                            setPreorderList((oldArray) => [...oldArray, order]);
                        }
                    } else if (order.Status === "Ordered" || order.Status === "Delivered" || order.Status === "Served") {
                        console.log("MESA:" + table + typeof (table));
                        console.log("DATO:" + order.Table + typeof (order.Table));
                        if (order.Table == table) {
                            costo = order.Price * order.Quantity;
                            setOrderedCost(totalOrderedCost += costo)
                            setOrderedList((oldArray) => [...oldArray, order]);
                        }
                    }
                });
            }
        });
        console.log(preorderList)
        console.log("Total pending cost: " + pendingCost);
        //setPendingCost(totalPendingCost);
        console.log("Total ordered cost: " + orderedCost);
        //setOrderedCost(totalOrderedCost);
        setTotalCost(pendingCost + orderedCost);
        console.log("Total cost: " + totalCost);
    }, []);

    const deleteOrder = () => {
        database.ref('Orders/' + selectedOrderId).set(null).then((result) => {
            onCloseDelete()
        });
    }
    const orderAll = () => {
        preorderList.map((item) => {
            database.ref('Orders/' + item.OrderId).update({
                Status: "Ordered"
            }).then((result) => {
                console.log("Order: " + item.OrderId + " ordered");
                onCloseOrder();
            });
        });
    }
    const payAll = () => {
        database.ref('Tables/Table' + table).update({
            Waiter: "Unassigned",
            Status: "On Hold"
        }).then((result) => {
            orderedList.map((item) => {
                database.ref('Orders/' + item.OrderId).update({
                    Status: "Payed"
                }).then((result) => {
                    onClosePay();
                    navigation.goBack;
                });
            });
          
        });
    }
    const setDishServed = () => {
        database.ref('Orders/' + selectedOrderId).update({
            Status: "Served"
        }).then((result) => {
            onCloseDeliver()
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
                        <VerticalGradientText text={`Table ${table} Orders`} style={styles.titleScreen} />
                    </HStack>
                    <VStack style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Pending Orders</Text>
                        <ScrollView horizontal={true}>
                            <HStack>
                                {preorderList.map((item) => (
                                    <TouchableOpacity onPress={() => {
                                        setIsOpenDelete(!isOpenDelete);
                                        setSelectedOrderId(item.OrderId);
                                    }} key={item.OrderId}>
                                        <Center style={styles.dishContainer} >
                                            <VStack justifyContent={'flex-start'} alignContent={'flex-start'} alignItems={'flex-start'} height={'100%'}>
                                                <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                                    alt="Icon of Menu" size={85} borderTopRadius={10} width={180} height={100} />
                                                <Text style={styles.dishTitle} numberOfLines={1}>{item.Name}</Text>
                                                <HStack style={styles.dishAdditionalInfo}>
                                                    <VStack>
                                                        <HStack alignItems={'center'}>
                                                            <GradientIcon name="clock-time-five-outline" size={15} />
                                                            <Text style={styles.dishTime}>{item.PrepTime + " min."}</Text>
                                                        </HStack>
                                                        <HStack alignItems={'center'}>
                                                            <GradientIcon name="pound" size={15} />
                                                            <Text style={styles.dishTime}>Qty: {item.Quantity}</Text>
                                                        </HStack>
                                                    </VStack>
                                                    <VerticalGradientText text={"$" + item.Price + " mxn"} style={styles.dishPrice} />
                                                </HStack>
                                            </VStack>
                                        </Center>
                                    </TouchableOpacity>
                                ))}
                            </HStack>
                        </ScrollView>
                    </VStack>


                    <VStack style={styles.sectionContainer}>

                        <Text style={styles.sectionTitle}>Placed Orders</Text>
                        <ScrollView horizontal={true}>
                            <HStack>
                                {orderedList.map((item) => (
                                    <Center style={styles.dishContainer} key={item.OrderId} >
                                        <VStack justifyContent={'flex-start'} alignContent={'flex-start'} alignItems={'flex-start'} height={'100%'}>
                                            <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                                alt="Icon of Menu" size={85} borderTopRadius={10} width={180} height={100} />
                                            {item.Status == "Delivered" &&
                                                <>
                                                    <TouchableOpacity style={styles.checkButton} onPress={() => {
                                                        setIsOpenDeliver(!isOpenDeliver);
                                                        setSelectedOrderId(item.OrderId);
                                                    }}>
                                                        <GradientIcon name="check-circle" size={50} />
                                                    </TouchableOpacity>

                                                    <Box style={styles.backgroundCheck}></Box>
                                                </>
                                            }
                                            <Text style={styles.dishTitle} numberOfLines={1}>{item.Name}</Text>
                                            <HStack style={styles.dishAdditionalInfo}>
                                                <VStack>
                                                    <HStack alignItems={'center'} >
                                                        <HStack>
                                                            <GradientIcon name="clock-time-five-outline" size={15} />
                                                            <Text style={styles.dishTime}>{item.PrepTime + " min."}</Text>
                                                        </HStack>
                                                        <HStack>
                                                            <GradientIcon name="pound" size={15} />
                                                            <Text style={styles.dishTime}>Qty: {item.Quantity}</Text>
                                                        </HStack>
                                                    </HStack>
                                                    <HStack justifyContent={'space-between'} width={'95%'}>
                                                        <GradientBorder
                                                            text={item.Status} />
                                                        <VerticalGradientText text={"$" + item.Price + " mxn"} style={styles.dishPrice} />
                                                    </HStack>
                                                </VStack>

                                            </HStack>
                                        </VStack>
                                    </Center>

                                ))}
                            </HStack>
                        </ScrollView>
                    </VStack>

                    <VStack width={'100%'} borderBottomColor={theme.text_icons} borderBottomWidth={1} marginTop={2}>
                        <HStack style={styles.priceContainer}>
                            <Text style={styles.subtotalOrders}>Pending Orders</Text>
                            <Text style={styles.subtotalOrders}>${pendingCost} mxn</Text>
                        </HStack>
                        <HStack style={styles.priceContainer}>
                            <Text style={styles.subtotalOrders}>Placed Orders</Text>
                            <Text style={styles.subtotalOrders}>${orderedCost} mxn</Text>
                        </HStack>
                    </VStack>
                    <HStack style={styles.priceContainer}>
                        <Text style={styles.totalOrders}>Total</Text>
                        <Text style={styles.totalOrders}>${orderedCost + pendingCost} mxn</Text>
                    </HStack>
                </View>
            </ScrollView >
            <View backgroundColor={theme.background_color}>

                <HStack width={'100%'} justifyContent={'space-between'} paddingLeft={5} paddingRight={5}>
                    <TouchableOpacity onPress={() => navigation.navigate('WaiterMenu', { tableId: table, name: uName })}>
                        <VerticalGradientButton text="Add" style={styles.addButton} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsOpenOrder(!isOpenOrder)}>
                        <VerticalGradientButton text="Order" style={styles.addButton} />
                    </TouchableOpacity>
                </HStack>

                <TouchableOpacity onPress={() => setIsOpenPay(!isOpenPay)}>
                    <VerticalGradientButton text="Pay all" style={styles.payButton} />
                    <MaterialCommunityIcons name='currency-usd' size={19} style={styles.priceIcon} />
                </TouchableOpacity>
            </View>


            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenOrder} onClose={onCloseOrder}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text={"Table "+table} style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Place order?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseOrder}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={orderAll}>
                                    <VerticalGradientButton text="Yes, Order" style={styles.alertButtons} />
                                </TouchableOpacity>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenPay} onClose={onClosePay}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text={"Table "+table} style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Pay the bill?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onClosePay}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => payAll()}>
                                    <VerticalGradientButton text="Yes, Pay all" style={styles.alertButtons} />
                                </TouchableOpacity>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>

            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenDeliver} onClose={onCloseDeliver}>
                    <AlertDialog.Content borderColor={theme.gray_borderColor} borderWidth={1}>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header style={styles.colorAlertDialog}>
                            <VerticalGradientText text="Deliver" style={styles.headerAlerDialog} />
                        </AlertDialog.Header>
                        <AlertDialog.Body style={styles.colorAlertDialog}>
                            <Text style={styles.bodyAlerDialog}>
                                Deliver order?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseDeliver}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={setDishServed}>
                                    <VerticalGradientButton text="Yes, Deliver" style={styles.alertButtons} />
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
                                Delete order?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer style={styles.colorAlertDialog}>
                            <Button.Group space={2}>
                                <TouchableOpacity onPress={onCloseDelete}>
                                    <DeleteGradientButton text="Cancel" style={styles.alertButtons} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deleteOrder}>
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
        textAlign: 'center',
        width: '100%',
        paddingLeft: '25%',
    },
    sectionTitle: {
        color: theme.text_icons,
        fontSize: 22,
        fontWeight: '400',
        textAlign: 'left',
        marginTop: 7
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
        fontSize: 10,
        fontWeight: '400',
        marginLeft: 2,
        marginRight: 7
    },
    dishPrice: {
        fontSize: 17,
        fontWeight: '500'
    },
    payButton: {
        color: theme.text_icons,
        width: '90%',
        height: 30,
        borderRadius: 25,
        marginLeft: 20,
        marginBottom: 15,
        textAlign: 'center',
        paddingTop: 2,
    },
    addButton: {
        color: theme.text_icons,
        width: 150,
        height: 30,
        borderRadius: 25,
        marginBottom: 15,
        textAlign: 'center',
        textAlignVertical: 'center'
    }, priceContainer: {
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    subtotalOrders: {
        color: theme.text_icons,
        fontSize: 20,
        fontWeight: '300',
    }, totalOrders: {
        color: theme.text_icons,
        fontWeight: '300',
        fontSize: 25,
        textAlignVertical: 'bottom',
        height: 30
    }, checkButton: {
        zIndex: 3,
        position: 'absolute',
        paddingLeft: 120,
        paddingTop: 55
    }, backgroundCheck: {
        backgroundColor: theme.text_icons,
        width: 40,
        height: 40,
        borderRadius: 50,
        zIndex: 2,
        position: 'absolute',
        marginLeft: 125,
        marginTop: 60
    }, priceIcon: {
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
        width: 80
    },

})