import React, { useState, useEffect } from 'react'
import {
    View, Text, Image,
    StyleSheet, Animated,
    Dimensions, TouchableOpacity,
    FlatList
} from 'react-native'
import axios from 'axios'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Container } from '../../../components'
import { color } from '../../../utility';
import { URL_BASE, token } from '../../../api/config';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window')
const SLIDER_WIDTH = Dimensions.get('window').width;

const Ranking = () => {
    const [liked, setLiked] = useState({
        avatar: '',
        name: '',
        likes: ''
    })
    const [matched, setMatched] = useState({
        avatar: '',
        name: '',
        matches: ''
    })
    // Animated state
    const [active, setActive] = useState(0)
    const [translateX, setTranslateX] = useState(new Animated.Value(0))
    const [translateXTabOne, setTranslateXTabOne] = useState(new Animated.Value(0))
    const [translateXTabTwo, setTranslateXTabTwo] = useState(new Animated.Value(width))
    const [translateY, setTranslateY] = useState(-1000)

    const fetchDataLiked = () => {
        axios.get(`${URL_BASE}pets/topLike`, {
            headers: {
                Authorization: token
            },
        }).then(res => {
            let listLike = res.data;
            let first = listLike[0]
            listLike[0] = listLike[1]
            listLike[1] = first
            setLiked(listLike)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    const fetchDataMatched = () => {
        axios.get(`${URL_BASE}pets/topMatch`, {
            headers: {
                Authorization: token
            },
        }).then(res => {
            let listMatch = res.data;
            let firstEl = listMatch[0]
            listMatch[0] = listMatch[1]
            listMatch[1] = firstEl
            setMatched(listMatch)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        handleSlide(active)
        fetchDataLiked()
        fetchDataMatched()
    }, [active])

    const handleSlide = type => {
        Animated.spring(translateX, {
            toValue: type,
            duration: 100
        }).start()
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100
                }).start()
            ])
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100
                }).start()
            ])
        }
    }

    const renderListLiked = (item, index) => {
        return (
            <View>
                {
                    index > 2 ?
                        <View style={styles.content}>
                            <Text style={styles.order}>{index + 1}</Text>
                            <View style={styles.wrapper}>
                                <Image
                                    source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                                    style={styles.img1}
                                />
                                <Text style={styles.name}>{item.name}</Text>
                                <View style={styles.orderNumber}>
                                    <AntDesign name="like1" size={17} color={color.BLUE} />
                                    <Text style={[styles.number, { width: '30%' }]}>{item.likes}</Text>
                                </View>
                            </View>
                        </View> : null
                }
            </View>
        )
    }

    const renderLikeTop3 = (item, index) => {
        return (
            <View style={styles.top3}>
                {
                    index < 3 ?
                        <View>
                            {
                                index === 0
                                    ? <FontAwesome5 name="crown" size={20} color='#ececec' style={styles.top1} />
                                    : index === 1
                                        ? <FontAwesome5 name="crown" size={24} color='#ffe75e' style={styles.top1} />
                                        : <FontAwesome5 name="crown" size={20} color='#ec823a' style={styles.top1} />
                            }
                            <Image
                                source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                                style={index === 1 ? styles.imgTop1 : styles.img23}
                            />
                            <Text style={styles.nameTop}>{item.name}</Text>
                            <View style={styles.orderNumber}>
                                <AntDesign name="like1" size={17} color={color.BLUE} />
                                <Text style={styles.numberTop}>{item.likes}</Text>
                            </View>
                        </View> : null
                }
            </View>
        )
    }

    const renderMatchTop3 = (item, index) => {
        return (
            <View style={styles.top3}>
                {
                    index < 3 ?
                        <View>
                            {
                                index === 0
                                    ? <FontAwesome5 name="crown" size={20} color='#ececec' style={styles.top1} />
                                    : index === 1
                                        ? <FontAwesome5 name="crown" size={24} color='#ffe75e' style={styles.top1} />
                                        : <FontAwesome5 name="crown" size={20} color='#ec823a' style={styles.top1} />
                            }
                            <Image
                                source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                                style={index === 1 ? styles.imgTop1 : styles.img23}
                            />
                            <Text style={styles.nameTop}>{item.name}</Text>
                            <View style={styles.orderNumber}>
                                <AntDesign name="heart" size={17} color={color.GREEN} />
                                <Text style={styles.numberTop}>{item.matches}</Text>
                            </View>
                        </View> : null
                }
            </View>
        )
    }

    const renderListMatch = (item, index) => {
        return (
            <View>
                {
                    index > 2 ?
                        <View style={styles.content}>
                            <Text style={styles.order}>{index + 1}</Text>
                            <View style={styles.wrapper}>
                                <Image
                                    source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                                    style={styles.img1}
                                />
                                <Text style={styles.name}>{item.name}</Text>
                                <View style={styles.orderNumber}>
                                    <AntDesign name="heart" size={17} color={color.GREEN} />
                                    <Text style={styles.number}>{item.matches}</Text>
                                </View>
                            </View>
                        </View> : null
                }
            </View>
        )
    }

    return (
        <Container>
            <View style={styles.tabSliding}>
                <View style={styles.tabContent}>
                    <Animated.View
                        style={[styles.sliding, {
                            left: translateX.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '50%'],
                                extrapolate: 'extend'
                            })
                        }]}
                    />
                    <TouchableOpacity
                        style={styles.tabOne}
                        onPress={() => setActive(0)}
                    >
                        <Text style={{ color: active === 0 ? color.WHITE : color.BLUE }}>Top Matched</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tabTwo}
                        onPress={() => setActive(1)}
                    >
                        <Text style={{ color: active === 1 ? color.WHITE : color.BLUE }}>Top Liked</Text>
                    </TouchableOpacity>
                </View>
                {/* Match */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: translateXTabOne
                                }
                            ]
                        }}
                        onLayout={event => setTranslateY(event.nativeEvent.layout.height)}
                    >
                        <FlatList
                            horizontal={true}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={matched}
                            renderItem={({ item, index }) => {
                                return renderMatchTop3(item, index)
                            }}
                            keyExtractor={(_, index) => index.toString()}
                        />
                        <FlatList
                            data={matched}
                            renderItem={({ item, index }) => {
                                return renderListMatch(item, index)
                            }}
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </Animated.View>
                    {/* Like */}
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: translateXTabTwo
                                },
                                {
                                    translateY: -translateY
                                }
                            ]
                        }}
                    >
                        <FlatList
                            horizontal={true}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={liked}
                            renderItem={({ item, index }) => {
                                return renderLikeTop3(item, index)
                            }}
                            keyExtractor={(_, index) => index.toString()}
                        />
                        <FlatList
                            data={liked}
                            renderItem={({ item, index }) => {
                                return renderListLiked(item, index)
                            }}
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </Animated.View>
                </ScrollView>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    // Tab sliding
    tabSliding: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    tabContent: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
        height: 36,
        position: 'relative'
    },
    sliding: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        top: 0,
        backgroundColor: color.BLUE,
        borderRadius: 20
    },
    tabOne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color.BLUE,
        borderRadius: 20,
        borderRightWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    tabTwo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color.BLUE,
        borderRadius: 20,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    // Content
    content: {
        flexDirection: 'row'
    },
    top3: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        justifyContent: 'flex-end'
    },
    img23: {
        width: 65,
        height: 65,
        borderRadius: 50
    },
    imgTop1: {
        width: 85,
        height: 85,
        borderRadius: 50
    },
    nameTop: {
        alignSelf: 'center',
        color: color.BLACK,
        marginVertical: 4
    },
    numberTop: {
        fontWeight: 'bold',
        marginLeft: 5,
        color: color.PINK
    },
    top1: {
        alignSelf: 'center'
    },
    // Top 4
    order: {
        width: '10%',
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    },
    wrapper: {
        flexDirection: 'row',
        backgroundColor: color.PET_DESCRIPTION,
        marginVertical: 12,
        borderRadius: 35,
        alignItems: 'center',
        width: '90%',
        padding: 10,
        elevation: 4
    },
    img1: {
        width: 50,
        height: 50,
        borderRadius: 30
    },
    name: {
        width: '70%',
        paddingLeft: 15
    },
    number: {
        width: '10%',
        color: color.PINK,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    orderNumber: {
        flexDirection: 'row',
        alignSelf: 'center'
    }
})

export default Ranking