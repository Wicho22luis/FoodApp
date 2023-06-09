import { Center, HStack, VStack, Image, Text } from 'native-base';
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import theme from './theme';
import DisableGradientButton from './DisableGradientButton';
import GradientIcon from './GradientIcon';
import { database } from '../firebase';
import { useNavigation } from '@react-navigation/native';


export default function BackordersScreen() {

    const orders = [
        { id: '1', dish: 'Meatball and Spaghetti', table: '1', waiter: 'Don Wicho', status: 'not delivered', ordersQuantity: 2 },
        { id: '2', dish: 'Pizza', table: '2', waiter: 'Doña Iran', status: 'delivered', ordersQuantity: 1 },
        { id: '3', dish: 'Cerveza', table: '1', waiter: '', status: 'not delivered', ordersQuantity: 3 },
    ];

    const [deliverList, setDeliverList] = useState([])
    const [deliveredList, setDeliveredList] = useState([])
    const voidArray = [];  
    const navigation = useNavigation();

    const [search, setSearch] = useState("Pasta");

    const [dishName, setDishName] = useState("");
    const [waiterName, setWaiterName] = useState("");
    const [pendingOrders, setPendingOrders] = useState(0);

    useEffect(() => {
        let count = 0;
        const getOrders = database.ref('/');
        getOrders.on('value', snapshot => {
            const data1 = snapshot.val().Menu;
            const data = snapshot.val().Orders;
            setDeliverList(voidArray);
            setDeliveredList(voidArray);
            setPendingOrders(0);
            if (data !== null) {
                Object.values(data).map((order) => {
                    if (order.Status === "Ordered") {
                        count += 1;
                        console.log("CONTADOR: "+count);
                        setDeliverList((oldArray) => [...oldArray, order]);
                    } else if (order.Status === "Delivered" || order.Status === "Served") {
                        setDeliveredList((oldArray) => [...oldArray, order]);
                    }
                });
            }
        });
        
        setPendingOrders(count)
    }, []);


    function getDishData(dishId) {
        console.log(dishId)
        const reference = database.ref('Menu/' + dishId);
        let aux="";
        //EVENTO ESCUCHA QUE SE EJECUTA SOLO UNA VEZ PARA OBTENER EL NOMBRE DESDE LA REFERENCIA DEL USUARIO ACTUAL
        reference.once("value")
            .then(function (snapshot) {
                const data=snapshot.val().Name
                if(data !== null){
                    setDishName(data);
                }
            });
            aux=dishName;
        return aux;
    }

    function getWaiterData(waiterId) {
        console.log(waiterId)
        const reference = database.ref('Users/' + waiterId);
        //EVENTO ESCUCHA QUE SE EJECUTA SOLO UNA VEZ PARA OBTENER EL NOMBRE DESDE LA REFERENCIA DEL USUARIO ACTUAL
        reference.once("value")
            .then(function (snapshot) {
                setWaiterName(snapshot.val().Name);
            });
        return waiterName;
    }


     //FILTRADO
     let resultadoBusqueda = [];
     if (!search) {
         resultadoBusqueda = deliverList;
     } else {
         resultadoBusqueda = deliverList.filter((dato) =>
             dato.Category.toLowerCase().includes(search.toLowerCase()))
             //setPendingOrders(resultadoBusqueda.length);
     }

     
     let resultadoBusqueda1 = [];
     if (!search) {
         resultadoBusqueda1 = deliveredList;
     } else {
         resultadoBusqueda1 = deliveredList.filter((dato) =>
             dato.Category.toLowerCase().includes(search.toLowerCase()))
     }

    return (
        <>
            <ScrollView backgroundColor={theme.background_color}>
                <View style={styles.container}>
                    <HStack alignItems={'center'} width={'100%'}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <GradientIcon name="arrow-left" size={30} />
                        </TouchableOpacity>
                        <VerticalGradientText text="Pending Orders" style={styles.titleScreen} />
                    </HStack>
                    <HStack style={styles.categoriesRow}>
                        <TouchableOpacity onPress={() => setSearch("Drink")}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2FDrink.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    <Text style={styles.categoriesName}> Drinks </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setSearch("Pasta")}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2FPasta.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    <Text style={styles.categoriesName}> Pasta </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>

                        <TouchableOpacity  onPress={() => setSearch("Pizza")}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2FPizza.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    <Text style={styles.categoriesName}> Pizza </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>

                    </HStack>

                    <VStack style={styles.sectionContainer}>

                        <Text style={styles.sectionTitle}>Pending Orders</Text>

                        {resultadoBusqueda.map((item) => (
                            <Center style={styles.orderContainer} key={item.OrderId}>
                                <HStack>
                                    <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                        alt="Icon of Menu" size={85} borderLeftRadius={10} marginRight={2} />

                                    <VStack flex={1} justifyContent={'flex-end'} paddingBottom={2}>
                                        <Text style={styles.dishName} numberOfLines={1}>{item.Name}</Text>
                                        <HStack alignItems={'center'}>
                                            <MaterialCommunityIcons name='table-furniture' color={theme.text_icons} size={20} />
                                            <Text style={styles.infoOrder}>Table:  {item.Table}</Text>
                                            <GradientIcon name="pound" size={20} />
                                            <VerticalGradientText text={item.Quantity} style={styles.dishQuantity} />
                                        </HStack>

                                        <HStack alignItems={'center'}>
                                            <MaterialCommunityIcons name='account' color={theme.text_icons} size={20} />
                                            <Text style={styles.infoOrder}>Waiter:  {item.Waiter}</Text>
                                            <HStack justifyContent={'flex-end'} width={'100%'} flex={1}>
                                                <VerticalGradientButton text="Deliver" style={styles.deliverButton} />
                                            </HStack>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </Center>
                        ))}

                    </VStack>


                    <VStack style={styles.sectionContainer}>

                        <Text style={styles.sectionTitle}>Delivered Orders</Text>
                        {resultadoBusqueda1.map((item) => (
                            <Center style={styles.orderContainer}  key={item.OrderId}>
                                <HStack>
                                    <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                        alt="Icon of Menu" size={85} borderLeftRadius={10} marginRight={2} />

                                    <VStack flex={1} justifyContent={'flex-end'} paddingBottom={2}>
                                        <Text style={styles.dishName} numberOfLines={1}>{item.Name}</Text>
                                        <HStack alignItems={'center'}>
                                            <MaterialCommunityIcons name='table-furniture' color={theme.text_icons} size={20} />
                                            <Text style={styles.infoOrder}>Table:  {item.Table}</Text>
                                            <MaterialCommunityIcons name="pound" size={20} color={theme.disable_light_color} />
                                            <Text style={styles.dishQuantityDeliver}>{item.Quantity} </Text>
                                        </HStack>

                                        <HStack alignItems={'center'}>
                                            <MaterialCommunityIcons name='account' color={theme.text_icons} size={20} />
                                            <Text style={styles.infoOrder}>Waiter:  {item.Waiter}</Text>
                                            <HStack justifyContent={'flex-end'} width={'100%'} flex={1}>

                                                <DisableGradientButton text="Delivered" style={styles.deliverButton} />

                                            </HStack>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </Center>
                        ))}
                    </VStack>

                </View>

            </ScrollView>
            <View backgroundColor={theme.background_color}>
                <VerticalGradientButton text={"Total pending orders: "+pendingOrders} style={styles.totalButton} />
            </View>
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
        paddingLeft: '30%'
    },
    categoriesContainer: {
        backgroundColor: theme.cards_background,
        width: 100,
        height: 45,
        borderRadius: 30,
    },
    categoriesRow: {
        marginTop: 20,
        justifyContent: 'space-evenly',
        width: '100%'
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
    },
    sectionContainer: {
        width: '100%',
        padding: 10,
    },
    orderContainer: {
        width: '100%',
        paddingRight: 7,
        marginTop: 10,
        backgroundColor: theme.cards_background,
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    dishName: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '500',
        width: '100%',
        paddingBottom: 7
    },
    infoOrder: {
        color: theme.text_icons,
        fontSize: 12,
        paddingLeft: 4,
        paddingRight: 10,
    },
    dishQuantity: {
        fontSize: 17,
        fontWeight: '400',
        marginLeft: 3,
    },
    dishQuantityDeliver: {
        fontSize: 17,
        fontWeight: '400',
        marginLeft: 3,
        color: theme.disable_light_color
    },
    deliverButton: {
        color: theme.text_icons,
        fontSize: 14,
        fontWeight: '400',
        height: 20,
        borderRadius: 25,
        alignItems: 'center',
        width: 70,
        textAlign: 'center',
    },
    totalButton: {
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