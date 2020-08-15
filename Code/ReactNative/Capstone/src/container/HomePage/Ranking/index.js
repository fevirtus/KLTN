import React, { useState, useEffect } from 'react'
import {
    View, Text, Image,
    StyleSheet, Animated,
    Dimensions, TouchableOpacity,
    FlatList
} from 'react-native'
import axios from 'axios'
import { Container } from '../../../components'
import { color } from '../../../utility';
import { URL_BASE, token } from '../../../api/config';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window')
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

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
            setLiked(res.data)
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
            setMatched(res.data)
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
            <View style={styles.content}>
                {
                    index + 1 === 1

                        ? <View style={styles.w}><View style={styles.number1}>
                            <Text>1</Text>
                        </View></View>
                        : <Text style={styles.order}>{index + 1}</Text>
                }
                <View style={styles.wrapper}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                        style={styles.img1}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.number}>{item.likes}</Text>
                </View>
            </View>
        )
    }

    const renderListMatch = (item, index) => {
        return (
            <View style={styles.content}>
                {
                    index + 1 === 1

                        ? <View style={styles.w}><View style={styles.number1}>
                            <Text>1</Text>
                        </View></View>
                        : <Text style={styles.order}>{index + 1}</Text>
                }
                <View style={styles.wrapper}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                        style={styles.img1}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.number}>{item.matches}</Text>
                </View>
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
        borderRadius: 4
    },
    tabOne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color.BLUE,
        borderRadius: 4,
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
        borderRadius: 4,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    // Content
    content: {
        flexDirection: 'row'
    },
    order: {
        width: '10%',
        alignSelf: 'center',
        fontSize: 15
    },
    w: {
        width: '10%',
        flexDirection: 'row'
    },
    number1: {
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: color.WHITE,
        alignSelf: 'center',
        alignItems: 'center'
    },
    wrapper: {
        flexDirection: 'row',
        backgroundColor: color.LIGHT_PINK,
        marginVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '90%'
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
        color: color.PINK
    }
})

export default Ranking