import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-deck-swiper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import { YellowBox } from 'react-native';
import { color } from '../../utility';
import { useSelector } from 'react-redux';

import data from '../../../data';

const Card = ({card, index}) => (
    <View style={styles.card}>
        <View>
            <Image source={{uri: card.image}} style={styles.cardImage}/>
        </View>
        <View style={styles.cardDetails}>
            <Text style={styles.title}>{data[index].name}</Text>
            <Text style={styles.description}>{data[index].description}</Text>
        </View>
    </View>
)

const Home = ({ navigation }) => {
    const [index, setIndex] = useState(0)
    const hide = useSelector(state => state.home.isHideSwiper)
    const swiperRef = useRef(null)
    const onSwiped = () => {
        setIndex((index + 1) % data.length)
    }
    
    return (
        <View style={styles.container}>
            { hide ? 
                (<View style={styles.container}>
                    <Text>Nothing to see here!</Text>
                </View>) : 
                (<View style={styles.container}>
                    <View style={styles.swiperContainer}>
                        <Swiper
                            cards={data}
                            cardIndex={index}
                            renderCard={(card, index) => <Card card={card} index={index}/>}
                            ref={swiperRef}
                            onSwiped={onSwiped}
                            stackSize={2} 
                            disableBottomSwipe
                            animateOverlayLabelsOpacity	
                            infinite
                            backgroundColor={'transparent'}
                            overlayLabels={{
                                left: {
                                    title: 'NOPE',
                                    style: {
                                        label: {
                                            backgroundColor: 'transparent',
                                            color: color.RED,
                                            fontSize: 24,
                                            borderColor: color.RED,
                                            borderWidth: 3
                                        },
                                        wrapper: {
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-start',
                                            marginTop: -35,
                                            marginLeft: -20
                                        }
                                    }
                                },
                                right: {
                                    title: 'LIKE',
                                    style: {
                                        label: {
                                            backgroundColor: 'transparent',
                                            color: color.GREEN,
                                            fontSize: 24,
                                            borderColor: color.GREEN,
                                            borderWidth: 3
                                        },
                                        wrapper: {
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-start',
                                            marginTop: -35,
                                            marginLeft: 20
                                        }
                                    }
                                },
                                top: {
                                    title: 'SUPER LIKE',
                                    style: {
                                        label: {
                                            backgroundColor: 'transparent',
                                            color: color.BLUE,
                                            fontSize: 24,
                                            borderColor: color.BLUE,
                                            borderWidth: 3
                                        },
                                        wrapper: {
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: -60
                                        }
                                    }
                                }
                            }}
                        />
                    </View>
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity style={styles.iconContainer}>
                            <AntDesign 
                                name="close"
                                size={45}
                                backgroundColor={'transparent'}
                                underlayColor={'transparent'}
                                activeOpacity={0.3}
                                color={color.RED}
                                onPress={() => swiperRef.current.swipeLeft()}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconContainer}>
                            <AntDesign
                                name="star"
                                size={43}
                                backgroundColor={'transparent'}
                                underlayColor={'transparent'}
                                activeOpacity={0.3}
                                color={color.BLUE}
                                onPress={() => swiperRef.current.swipeTop()}
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.iconContainer}>
                            <AntDesign
                                name="heart"
                                size={40}
                                backgroundColor={'transparent'}
                                underlayColor={'transparent'}
                                activeOpacity={0.3}
                                color={color.GREEN}
                                onPress={() => swiperRef.current.swipeRight()}
                            />
                        </TouchableOpacity>  
                    </View>
                </View>)             
            }   
              
            <View style={styles.dataContainer}>
                <TouchableOpacity style={styles.contentBox}>
                    <FontAwesome5 name="hands-helping" size={38} color={color.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox} onPress={() => navigation.navigate('Chat')}>
                    <Entypo name="chat" size={40} color={color.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox} onPress={() => navigation.navigate('Profile')}>
                    <FontAwesome name="user" size={42} color={color.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox} onPress={() => navigation.navigate('Filter')}>
                    <AntDesign name="barschart" size={45} color={color.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox}>
                    <AntDesign 
                        name="setting" 
                        size={40} 
                        color={color.WHITE} 
                        onPress={() => navigation.navigate('Setting')} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`', 
                        'Animated.event now requires a second argument for options']);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.WHITE
    },
    card: {
        marginTop: -50,
        borderRadius: 5,
        flex: 0.65,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.WHITE
    },
    cardImage:{
        width: 300,
        flex: 0.7,
        resizeMode: 'contain'
    },
    swiperContainer: {
        flex: 1
    },
    cardDetails: {
        alignItems: 'center'
    },
    title: {
        fontSize: 26, 
        marginBottom: 10, 
        color: color.BLACK
    },
    description: {
        color: color.GRAY_BUTTON,
        fontSize: 22
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    iconContainer: {
        borderRadius: 50,
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 65,
        height: 65  
    },
    dataContainer: {
        flexDirection: 'row',
        flex: 0.2,
        justifyContent: 'space-evenly',
        paddingTop: 10
    },
    contentBox: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.PINK
    }
});

export default Home;