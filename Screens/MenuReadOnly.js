import { Center, HStack, VStack, Image, useDisclose } from 'native-base';
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import VerticalGradientButton from './VerticalGradientButton';
import { useNavigation } from '@react-navigation/native';
import theme from './theme';
import GradientIcon from './GradientIcon';
import { database } from '../firebase';

export default function MenuScreen() {
    const navigation = useNavigation();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [menu, setMenu] = useState([])
    const [drinks, setDrinks] = useState([])
    const [pizzas, setPizzas] = useState([])
    const dishes = [
        { id: 1, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 2, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
    ];
    const voidArray = [];
    useEffect(() => {
        const getMenu = database.ref('Menu/');
        getMenu.on('value', snapshot => {
            const data = snapshot.val();
            setMenu(voidArray);
            setDrinks(voidArray);
            setPizzas(voidArray);
            if (data !== null) {
                Object.values(data).map((dish) => {
                    if (dish.Category === "Pasta") {
                        setMenu((oldArray) => [...oldArray, dish]);
                    } else if (dish.Category === "Drink") {
                        setDrinks((oldArray) => [...oldArray, dish]);
                    } else if (dish.Category === "Pizza") {
                        setPizzas((oldArray) => [...oldArray, dish]);
                    }
                });
            }
        });
        console.log(menu)
    }, []);


    return (
        <>
            <ScrollView style={styles.darkBackground}>
                <View style={styles.container}>
                    <HStack alignItems={'center'} width={'100%'}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <GradientIcon name="arrow-left" size={30} />
                        </TouchableOpacity>
                        <VerticalGradientText text="Menu" style={styles.titleScreen} />
                    </HStack>
                    <HStack style={styles.categoriesRow}>
                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: "Drink" })}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2FDrink.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    <Text style={styles.categoriesName}> Drinks </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: "Pasta" })}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2FPasta.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    <Text style={styles.categoriesName}> Pasta </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: "Pizza" })}>
                            <Center style={styles.categoriesContainer}>
                                <HStack alignItems={'center'}>
                                    <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2FPizza.png?alt=media&token=" }} alt="Icon of Menu" size={"7"} />
                                    <Text style={styles.categoriesName}> Pizza </Text>
                                </HStack>
                            </Center>
                        </TouchableOpacity>
                    </HStack>


                    <VStack style={styles.sectionContainer}>
                        <HStack justifyContent={'space-between'} alignItems={'flex-end'}>
                            <Text style={styles.sectionTitle}>Pasta</Text>
                        </HStack>

                        <ScrollView horizontal={true}>
                            <HStack>
                                {menu.map((item) => (
                                    <TouchableOpacity key={item.Id}
                                        onPress={() => navigation.navigate('EditDish', { itemID: item.Id, dishName: item.Name, dishDescription: item.Description, prepTime: item.PrepTime, price: item.Price, imageLink: item.ImageLink, dishCategory: item.Category })}>
                                        <Center style={styles.dishContainer} >
                                            <VStack justifyContent={'flex-start'} alignContent={'flex-start'} alignItems={'flex-start'} height={'100%'}>
                                                <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                                    alt="Icon of Menu" size={85} borderTopRadius={10} width={180} height={100} />
                                                <Text style={styles.dishTitle} numberOfLines={1}>{item.Name}</Text>
                                                <Text style={styles.dishDescription} numberOfLines={2}>{item.Description}</Text>
                                                <HStack style={styles.dishAdditionalInfo}>
                                                    <HStack alignItems={'center'}>
                                                        <GradientIcon name="clock-time-five-outline" size={15} />
                                                        <Text style={styles.dishTime}>{item.PrepTime + ' min'}</Text>
                                                    </HStack>
                                                    <VerticalGradientText text={item.Price + ' mxn'} style={styles.dishPrice} />
                                                </HStack>
                                            </VStack>
                                        </Center>
                                    </TouchableOpacity>
                                ))}

                            </HStack>
                        </ScrollView>
                    </VStack>


                    <VStack style={styles.sectionContainer}>
                        <HStack justifyContent={'space-between'} alignItems={'flex-end'}>
                            <Text style={styles.sectionTitle}>Drinks</Text>
                        </HStack>

                        <ScrollView horizontal={true}>
                            <HStack>
                                {drinks.map((item) => (
                                    <TouchableOpacity key={item.Id} onPress={() => navigation.navigate('EditDish', { itemID: item.Id, dishName: item.Name, dishDescription: item.Description, prepTime: item.PrepTime, price: item.Price, imageLink: item.ImageLink, dishCategory: item.Category })}>
                                        <Center style={styles.dishContainer} >
                                            <VStack justifyContent={'flex-start'} alignContent={'flex-start'} alignItems={'flex-start'} height={'100%'}>
                                                <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                                    alt="Icon of Menu" size={85} borderTopRadius={10} width={180} height={100} />
                                                <Text style={styles.dishTitle} numberOfLines={1}>{item.Name}</Text>
                                                <Text style={styles.dishDescription} numberOfLines={2}>{item.Description}</Text>
                                                <HStack style={styles.dishAdditionalInfo}>
                                                    <HStack alignItems={'center'}>
                                                        <GradientIcon name="clock-time-five-outline" size={15} />
                                                        <Text style={styles.dishTime}>{item.PrepTime + ' min'}</Text>
                                                    </HStack>
                                                    <VerticalGradientText text={item.Price + ' mxn'} style={styles.dishPrice} />
                                                </HStack>
                                            </VStack>
                                        </Center>
                                    </TouchableOpacity>
                                ))}
                            </HStack>
                        </ScrollView>
                    </VStack>


                    <VStack style={styles.sectionContainer}>
                        <HStack justifyContent={'space-between'} alignItems={'flex-end'}>
                            <Text style={styles.sectionTitle}>Pizza</Text>
                        </HStack>

                        <ScrollView horizontal={true}>
                            <HStack>
                                {pizzas.map((item) => (
                                    <TouchableOpacity key={item.Id} onPress={() => navigation.navigate('EditDish', { itemID: item.Id, dishName: item.Name, dishDescription: item.Description, prepTime: item.PrepTime, price: item.Price, imageLink: item.ImageLink, dishCategory: item.Category })}>
                                        <Center style={styles.dishContainer} >
                                            <VStack justifyContent={'flex-start'} alignContent={'flex-start'} alignItems={'flex-start'} height={'100%'}>
                                                <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                                    alt="Icon of Menu" size={85} borderTopRadius={10} width={180} height={100} />
                                                <Text style={styles.dishTitle} numberOfLines={1}>{item.Name}</Text>
                                                <Text style={styles.dishDescription} numberOfLines={2}>{item.Description}</Text>
                                                <HStack style={styles.dishAdditionalInfo}>
                                                    <HStack alignItems={'center'}>
                                                        <GradientIcon name="clock-time-five-outline" size={15} />
                                                        <Text style={styles.dishTime}>{item.PrepTime + ' min'}</Text>
                                                    </HStack>
                                                    <VerticalGradientText text={item.Price + ' mxn'} style={styles.dishPrice} />
                                                </HStack>
                                            </VStack>
                                        </Center>
                                    </TouchableOpacity>
                                ))}
                            </HStack>
                        </ScrollView>
                    </VStack>

                </View>


            </ScrollView >

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
        paddingLeft: '50%'
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
        width: '100%',
        marginBottom: 10,
    },
    categoriesName: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: 'bold'
    },
    searchContainer: {
        backgroundColor: theme.cards_background,
        borderWidth: 1,
        borderRadius: 30,
        marginTop: 20,
        paddingLeft: 10,
        height: 35,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10

    },
    searchInput: {
        color: theme.text_icons,
        width: '90%'
    },
    sectionTitle: {
        color: theme.text_icons,
        fontSize: 25,
        fontWeight: '900',
        textAlign: 'left',
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
        height: 180,
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
    dishDescription: {
        color: theme.text_icons,
        fontSize: 11,
        fontWeight: '300',
        paddingLeft: 5,
    },
    dishAdditionalInfo: {
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 7,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    dishTime: {
        color: theme.text_icons,
        fontSize: 10,
        fontWeight: '400',
        marginLeft: 2
    },
    dishPrice: {
        fontSize: 17,
        fontWeight: '500'
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
    }

})