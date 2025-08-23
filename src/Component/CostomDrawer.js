
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';




const CostomDrawer = (props) => {
    // console.log('draweprops=====>', props)
    // const navigation = useNavigation();
    // console.log('draweprops=====>', props.navigation)
    const logoutUser = () => {
        props.LogoutTrigger();
        props.navigation.closeDrawer()
    }

    const sideBardata = [
        { key: 'Home', icon: require('../Assets/Images/home.png'), nav: 'mainTab', type: 'tab' },
        // { key: 'Services', icon: require('../Assets/Images/household.png'), nav: "Services", type: 'stack' },
        { key: 'Comercial', icon: require('../Assets/Images/building.png'), nav: "Commercial", type: 'stack' },
        { key: 'Recidential', icon: require('../Assets/Images/residential.png'), nav: "Recidential", type: 'stack' },
        { key: 'Contact us', icon: require('../Assets/Images/Icon-awesome-headphones-alt.png'), nav: "Contactus", type: 'stack' },
        { key: 'Pay Later', icon: require('../Assets/Images/hand.png'), nav: "PayLater", type: 'stack' },
        { key: 'Book Appointment Now', icon: require('../Assets/Images/calendar.png'), nav: "BookAppointment", type: 'stack' },
    ]

    const onPressMenu = (item) => {
        props.navigation.closeDrawer()
        if (item.type === 'tab') {
            props.navigation.navigate('main', { screen: item.nav })
        } else {
            if (item.nav == 'Commercial') {
                props.navigation.push('Services', { cat_ID: 11, pageId: 350 })
            } else if (item.nav == 'Recidential') {
                props.navigation.push('Services', { cat_ID: 12, pageId: 24 })
            } else {
                props.navigation.push(item.nav)
            }

        }
    }

    return (
        <LinearGradient colors={['#4A82DF', '#064CBE']} style={{ flex: 1, marginTop: 0 }}>
            <DrawerContentScrollView {...props} style={{ paddingTop: 0 }}>
                <View style={{ position: 'relative', paddingTop: 0 }}>
                    <ImageBackground source={require('../Assets/Images/drawer-header.png')} resizeMode='stretch' style={{ height: 100, justifyContent: 'center', paddingHorizontal: 20, marginTop: -10 }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Avatar.Image size={70} source={require('../Assets/Images/avatar.png')} />
                            <View style={{ justifyContent: 'center', paddingHorizontal: 15 }}>
                                <Text style={{ color: "#fff", opacity: 0.8 }}>Welcome to</Text>
                                <Text style={{ color: "#fff", fontFamily: 'OpenSans-Bold' }}>One America Window</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <TouchableOpacity
                        style={{ position: 'absolute', right: 10, top: 0 }}
                        onPress={() => { props.navigation.closeDrawer() }}>
                        <FontAwesome5
                            name='times'
                            color={'#fff'}
                            size={16}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    {sideBardata.map((item, index) => (
                        <TouchableOpacity key={index} style={Styles.menuBtn} onPress={() => { onPressMenu(item) }}>
                            <Image source={item.icon} style={{ height: 20, width: 20, marginLeft: 10 }} />
                            <Text style={{ marginLeft: 15, fontSize: 16, color: '#fff', fontFamily: 'OpenSans-SemiBold', opacity: 0.8 }}>{item.key}</Text>
                        </TouchableOpacity>
                    ))
                    }
                </View>
                {/* <DrawerItemList {...props} /> */}

            </DrawerContentScrollView>
            <View >
                <View style={{ padding: 20, borderBottomColor: 'lightgrey', borderBottomWidth: 1, opacity: 0.8, }}>
                    <TouchableOpacity style={{ marginBottom: 10 }}>
                        <Text style={{ color: '#fff', fontFamily: 'OpenSans-Medium' }}>Terms of Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginBottom: 10, }}>
                        <Text style={{ color: '#fff', fontFamily: 'OpenSans-Medium' }}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ padding: 20, opacity: 0.8 }}>
                    <Text style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>Follow us</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 30, width: '40%' }}>
                            <TouchableOpacity>
                                <FontAwesome5
                                    name='facebook-f'
                                    color={'#fff'}
                                    size={16}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <FontAwesome5
                                    name='twitter'
                                    color={'#fff'}
                                    size={16}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <FontAwesome5
                                    name='linkedin-in'
                                    color={'#fff'}
                                    size={16}
                                />
                            </TouchableOpacity>

                        </View>
                        {/* <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Text style={{ color: 'lightgray', fontSize: 12 }}>v1.01.9</Text>
                        </View> */}

                    </View>

                </View>
            </View>
        </LinearGradient>
    )
}

const Styles = StyleSheet.create({
    submit: {
        marginTop: 20,
        textAlign: 'center',
        width: 90
    },
    submitText: {
        paddingTop: 5,
        paddingBottom: 5,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 14
    },
    menuBtn: {
        flexDirection: 'row', height: 50, justifyContent: 'flex-start', alignItems: 'center', padding: 10, borderBottomColor: 'lightgrey', borderBottomWidth: 1, opacity: 0.8,
    }
})



export default CostomDrawer
