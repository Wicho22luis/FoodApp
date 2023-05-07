import React, { useEffect, useState } from 'react'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'


import { Center, HStack, Avatar, VStack, Progress, Box, Image, Actionsheet, useDisclose } from 'native-base';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import GradientText from './GradientText';
import GradientButton from './GradientButton';
import GradientDashboard from './GradientDashboard';
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import theme from './theme';

export default function HomeScreen() {
  const navigation = useNavigation()
  const [listEmployee, setListEmployee] = useState([])


  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }
  const getData = () => {
    var employeesData = database.ref('Empleados/');
    employeesData.on('value', (snapshot) => {
      const data = snapshot.val();
      const empleados = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      console.log(empleados)
      setListEmployee(empleados);
    });

  }

  useEffect(() => {

  })

  function SvgTop() {
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={23}
        height={22}
        fill="none"
      >
        <Path
          fill="url(#a)"
          d="M0 12.222h10.222V0H0v12.222ZM0 22h10.222v-7.333H0V22Zm12.778 0H23V9.778H12.778V22Zm0-22v7.333H23V0H12.778Z"
        />
        <Path
          fill="url(#b)"
          d="M0 12.222h10.222V0H0v12.222ZM0 22h10.222v-7.333H0V22Zm12.778 0H23V9.778H12.778V22Zm0-22v7.333H23V0H12.778Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={11.5}
            x2={11.5}
            y1={0}
            y2={22}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#FFC200" />
            <Stop offset={1} stopColor="#FD7200" stopOpacity={0} />
          </LinearGradient>
          <LinearGradient
            id="b"
            x1={2.148}
            x2={21.06}
            y1={10.904}
            y2={10.904}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#FFC200" />
            <Stop offset={1} stopColor="#FD7200" />
          </LinearGradient>
        </Defs>
      </Svg>
    )

  }

  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <View style={styles.container}>
      <HStack justifyContent={'center'} alignItems={'center'} marginTop={7} marginBottom={7}>
        <SvgTop />
        <GradientText text='Dashboard' style={styles.titleScreen}></GradientText>

        <TouchableOpacity onPress={(onOpen)}>
          <Avatar source={{
            uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          }} onPress={(onOpen)}></Avatar>
        </TouchableOpacity>

        <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
          <Actionsheet.Content style={styles.actionSheet}>
            <HStack style={styles.rowActionSheet}>
              <Avatar source={{
                uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              }} size={100} />
              <VStack>
                <GradientText text={'Iran Mendoza De La Torre'} style={styles.nameText} />
                <Text style={styles.jobText}>Manager</Text>
              </VStack>
            </HStack>

            <Text style={styles.dateText}>Date of hire: 04/03/2023</Text>

            <TouchableOpacity onPress={handleSignOut}>
              <GradientButton text={'Log Out'} style={styles.logOutButton} />
            </TouchableOpacity>

          </Actionsheet.Content>
        </Actionsheet>
      </HStack>


      <GradientDashboard />

      <VStack width={'100%'} paddingLeft={5} paddingRight={5} paddingTop={3}>
        <HStack justifyContent={'space-between'}>
          <TouchableOpacity onPress={() => navigation.navigate('Users')}>
            <Center style={styles.cardIcon}>
              <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fmeseros.png?alt=media&token=" }} alt="Icon of Waiters" size={"20"} />
              <HStack style={styles.textRow}>
                <Text style={styles.textCard}>Users</Text>
                <Text style={styles.numbersCard}>10</Text>
              </HStack>
              <Box style={styles.boxProgress}>
                <Progress bg={theme.background_color} _filledTrack={{
                  bg: theme.primary_color
                }} value={75} mx="1" h={2} />
              </Box>
            </Center>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Center style={styles.cardIcon}>
              <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fmenu.png?alt=media&token=" }} alt="Icon of Menu" size={"20"} />
              <HStack style={styles.textRow}>
                <Text style={styles.textCard}>Menu</Text>
                <Text style={styles.numbersCard}>20</Text>
              </HStack>
              <Box style={styles.boxProgress}>
                <Progress bg={theme.background_color} _filledTrack={{
                  bg: theme.primary_color
                }} value={90} mx="1" h={2} />
              </Box>
            </Center>
          </TouchableOpacity>
        </HStack>

        <HStack justifyContent={'space-between'}>
          <TouchableOpacity onPress={() => navigation.navigate('Backorders')}>
            <Center style={styles.cardIcon}>
              <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fpedidos.png?alt=media&token=" }} alt="Icon of Back Orders" size={"20"} />
              <HStack style={styles.textRow}>
                <Text style={styles.textCard}>Backorders</Text>
                <Text style={styles.numbersCard}>3</Text>
              </HStack>
              <Box style={styles.boxProgress}>
                <Progress bg={theme.background_color} _filledTrack={{
                  bg: theme.primary_color
                }} value={30} mx="1" h={2} />
              </Box>
            </Center>
          </TouchableOpacity>

          <TouchableOpacity>
            <Center style={styles.cardIcon}>
              <Image resizeMode="contain" source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodapp-f2cbb.appspot.com/o/assets%2Fmesas.png?alt=media&token=" }} alt="Icon of Tables" size={"24"} />
              <HStack style={styles.textRow}>
                <Text style={styles.textCard}>Tables</Text>
                <Text style={styles.numbersCard}>10</Text>
              </HStack>
              <Box style={styles.boxProgress}>
                <Progress bg={theme.background_color} _filledTrack={{
                  bg: theme.primary_color
                }} value={70} mx="1" h={2} />
              </Box>
            </Center>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: theme.background_color,
  },
  containerButton: {
    alignItems: 'center',
    width: 300,
    marginTop: 60,
  },
  titleScreen: {
    fontSize: 30,
    fontWeight: '400',
    paddingLeft: 10,
    paddingRight: 90,
  },
  salesContainer: {
    height: 100,
  },
  cardIcon: {
    backgroundColor: theme.cards_background,
    width: 157,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 15,
    height: 170,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingBottom: 20,
    marginLeft: 1,
  },
  textCard: {
    color: theme.text_icons,
    fontSize: 17,
    fontWeight: '700',
    width: '70%'
  },
  numbersCard: {
    color: theme.text_icons,
    fontSize: 20,
    fontWeight: '900',
  },
  textRow: {
    justifyContent: 'space-evenly',
    width: '100%',
    paddingRight: 19,
    marginTop: 5
  },
  boxProgress: {
    width: '90%',
    marginTop: 15
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
  }
})