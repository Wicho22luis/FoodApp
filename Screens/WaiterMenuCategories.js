import { Center, HStack, VStack, Image, FlatList } from 'native-base';
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import VerticalGradientText from './VerticalGradientText';
import theme from './theme';
import GradientIcon from './GradientIcon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database } from '../firebase';

export default function WaiterMenuCategories() {
    const navigation = useNavigation();
    const route = useRoute();
    const [menu, setMenu] = useState([])
    const voidArray = [];
    const [search, setSearch] = useState("");

    const dishes = [
        { id: 1, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 2, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 3, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 4, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 5, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 6, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 7, dishName: 'Meatball and Spaghetti', description: 'The perfect hearty spaghetti bake with boerewors meatballs and a burst of flavour from the chakalaka.', preparationTime: '20 min', price: '$150.00mxn', picture: 'https://th.bing.com/th/id/R.5cb6132dc72fab1d1aabcbbc8dd9d21f?rik=nIlC7fv1F89I8Q&riu=http%3a%2f%2fmysticislandscasino.com%2fwp-content%2fuploads%2fClassic-Italian-Meatballs.jpg&ehk=%2b%2b52DpK%2blJoCVwj2uJe8GxVY8oq5hj38qyxWKWX0qfE%3d&risl=&pid=ImgRaw&r=0' },
    ];
    //RECEPCION DEL DATO DE LA PANTALLA ANTERIOR PARA EL FILTRADO POR CATEGORIA
    const category = route.params.category;
    const data=route.params;
    const [table, setTable] = useState(data.tableId);
    const [uName, setUName] = useState(data.WaiterName);
    //OBTENCION DE DATOS DE LA BD
    useEffect(() => {
        const getMenu = database.ref('Menu/');
        getMenu.on('value', snapshot => {
            const data = snapshot.val();
            setMenu(voidArray);
            if (data !== null) {
                Object.values(data).map((dish) => {
                    if (dish.Category === category) {
                        setMenu((oldArray) => [...oldArray, dish]);
                    }
                });
            }
        });
        console.log(menu)
    }, []);

    //FILTRADO
    let resultadoBusqueda = [];
    if (!search) {
        resultadoBusqueda = menu;
    } else {
        resultadoBusqueda = menu.filter((dato) =>
            dato.Name.toLowerCase().includes(search.toLowerCase()))
    }

    return (
        <>
            <View style={styles.container}>
                <HStack alignItems={'center'} width={'100%'}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <GradientIcon name="arrow-left" size={30} />
                    </TouchableOpacity>
                    <VerticalGradientText text={category} style={styles.titleScreen} />
                </HStack>
                <HStack style={styles.searchContainer}>
                    <TextInput placeholder='Search' placeholderTextColor={theme.text_icons} style={styles.searchInput} onChangeText={text => setSearch(text)}></TextInput>
                    <TouchableOpacity>
                        <GradientIcon name="magnify" size={27} />
                    </TouchableOpacity>
                </HStack>



                <FlatList numColumns={2} data={resultadoBusqueda} renderItem={({ item }) => {
                    return <TouchableOpacity onPress={() => navigation.navigate('MealDetail', {
                        itemID: item.Id,
                        dishName: item.Name,
                        dishDescription: item.Description,
                        prepTime: item.PrepTime, 
                        price: item.Price,
                        imageLink: item.ImageLink,
                        dishCategory: item.Category,
                        tableId: table,
                        waiterName:uName
                    })}>
                        <Center style={styles.dishContainer} >
                            <VStack justifyContent={'flex-start'} alignContent={'flex-start'} alignItems={'flex-start'} height={'100%'}>
                                <Image resizeMode="cover" source={{ uri: `https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/menu%2F${item.ImageLink}?alt=media&token=` }}
                                    alt="Icon of Menu" size={85} borderTopRadius={10} width={180} height={100} />
                                <Text style={styles.dishTitle} numberOfLines={2}>{item.Name}</Text>
                                <Text style={styles.dishDescription} numberOfLines={3}>{item.Description}</Text>
                                <HStack style={styles.dishAdditionalInfo}>
                                    <HStack alignItems={'center'}>
                                        <GradientIcon name="clock-time-five-outline" size={15} />
                                        <Text style={styles.dishTime}>{item.PrepTime+" min."}</Text>
                                    </HStack>
                                    <VerticalGradientText text={"$"+item.Price+" mxn"} style={styles.dishPrice} />
                                </HStack>
                            </VStack>
                        </Center>
                    </TouchableOpacity>
                }} />

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
        paddingLeft: '50%'
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
    dishContainer: {
        width: 163,
        height: 210,
        marginTop: 10,
        backgroundColor: theme.cards_background,
        borderRadius: 10,
        alignItems: 'flex-start',
        marginRight: 12
    },
    dishTitle: {
        color: theme.text_icons,
        fontSize: 15,
        fontWeight: '900',
        paddingLeft: 5,
        paddingRight: 3
    },
    dishDescription: {
        color: theme.text_icons,
        fontSize: 11,
        fontWeight: '300',
        paddingLeft: 5,
        paddingRight: 2
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
})