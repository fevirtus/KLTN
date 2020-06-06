import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-deck-swiper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { YellowBox } from 'react-native';

import data from '../../data';

const colors = {
    red: '#ec2379',
    blue: '#0070ff',
    gray: '#777777',
    black: '#000000',
    white: '#ffffff',
    green: '#009A31'
}

const Card = ({card}) => (
    <View style={styles.card}>
      <Image source={{uri : card.image}} style={styles.cardImage}/>
    </View>
)

const CardDetails = ({ index }) => (
    <View style={styles.cardDetails}>
      <Text style={styles.title}>{data[index].name}</Text>
      <Text style={styles.price}>{data[index].price}</Text>
    </View>
)

export default function Home() {
    const [index, setIndex] = useState(0)
    const swiperRef = useRef(null)
    const onSwiped = () => {
        setIndex((index + 1) % data.length)
    }

    return (
        <View style={styles.container}>
            <View style={styles.swiperContainer}>
                <Swiper
                cards={data}
                cardIndex={index}
                ref={swiperRef}
                renderCard={card => <Card card={card} />}
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
                            color: colors.red,
                            fontSize: 24,
                            borderColor: colors.red,
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
                            color: colors.green,
                            fontSize: 24,
                            borderColor: colors.green,
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
                            color: colors.blue,
                            fontSize: 24,
                            borderColor: colors.blue,
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
            <View style={styles.bottomContainer}>
                <CardDetails index={index} />
                <View style={styles.bottomButtonsContainer}>
                    <AntDesign.Button 
                        style={styles.iconContainer}
                        name="close"
                        size={50}
                        backgroundColor={'transparent'}
                        underlayColor={'transparent'}
                        activeOpacity={0.3}
                        color={colors.red}
                        onPress={() => swiperRef.current.swipeLeft()}
                    />
                    <AntDesign.Button 
                        style={styles.iconContainer}
                        name="star"
                        size={45}
                        backgroundColor={'transparent'}
                        underlayColor={'transparent'}
                        activeOpacity={0.3}
                        color={colors.blue}
                        onPress={() => swiperRef.current.swipeTop()}
                    />
                    <AntDesign.Button 
                        style={styles.iconContainer}
                        name="heart"
                        size={40}
                        backgroundColor={'transparent'}
                        underlayColor={'transparent'}
                        activeOpacity={0.3}
                        color={colors.green}
                        onPress={() => swiperRef.current.swipeRight()}
                    />
                </View>
            </View>
            <View style={styles.dataContainer}>
                <TouchableOpacity style={styles.contentBox}>
                    <FontAwesome5 name="hands-helping" size={52} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox}>
                    <AntDesign name="filter" size={60} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox}>
                    <AntDesign name="barschart" size={70} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentBox} onPress={() => navigation.navigate('Profile')}>
                    <AntDesign name="profile" size={55} color="black" />
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
        backgroundColor: colors.white
    },
    card: {
        marginTop: -50,
        flex: 0.5,
        borderRadius: 8,
        shadowRadius: 25,
        shadowColor: colors.black,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 0 },
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    cardImage:{
        width: 200,
        flex: 1,
        resizeMode: 'contain'
    },
    swiperContainer: {
        flex: 0.7
    },
    bottomContainer: {
        flex: 0.3
    },
    cardDetails: {
        alignItems: 'center'
    },
    title: {
        fontSize: 24, marginBottom: 10, color: colors.gray
    },
    price: {
        color: colors.blue,
        fontSize: 32,
        fontWeight: '500'
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    iconContainer: {
        borderRadius: 50,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 25,
        shadowColor: colors.black,
    },
    dataContainer: {
        flexDirection: 'row',
        flex: 0.2,
        justifyContent: 'space-evenly'
    },
    contentBox: {
        width: 90,
        height: 90,
        borderWidth: 1,
        borderColor: colors.black,
        alignItems: 'center',
        justifyContent: 'center'
    }
});