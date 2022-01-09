import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, Alert } from 'react-native';
import { StackParams } from '../stacks/HomeStack';
import { convertKelvinToC } from '../helpers/helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { citiesArray } from '../constant';

let { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<StackParams, "Details">

const Details = ({ route }: Props) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { item } = route.params;
    
    const getFavorites = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favorites')
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            // error reading value
        }
    }
    const addFavorites = async (value: string) => {

        try {
            let favArr = await getFavorites();
            favArr.push(value)
            const jsonValue = JSON.stringify(favArr)
            await AsyncStorage.setItem('favorites', jsonValue)
            getVerifFavorites()
            Alert.alert("Atención","Se agregó a favoritos")
        } catch (e) {
            // saving error
        }
    }

    const removeFavorite = async (value: string) => {
        try {
            let favArr = await getFavorites();
            const deleted = favArr.filter((item: string) => item != value);
            const jsonValue = JSON.stringify(deleted)
            await AsyncStorage.setItem('favorites', jsonValue)
            getVerifFavorites()
            Alert.alert("Atención","Se eliminó de favoritos")
        } catch (e) {
            // saving error
        }
    }


    /* Verifico si la ciudad estpa en favoritos */
    function getVerifFavorites(){
        getFavorites().then(favArr => {
            setIsFavorite(favArr.includes(item.id))
        });
    }

    useEffect(() => {
        let unmount = getVerifFavorites();

        return () => {
            unmount;
        }

    }, []);


    return (
        <View style={{ alignItems: 'center', backgroundColor: '#6998AB', flex: 1 }}>

            <View style={{ padding: 10, flexDirection: 'row', backgroundColor: '#B1D0E0', width: width * 0.95, height: height * 0.2, marginTop: 20, borderRadius: 10 }}>

                <View style={styles.box}>
                    <Text style={styles.subText}>{item.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 60, fontWeight: '800' }}>{convertKelvinToC(item.weather.temperature.actual)}°</Text>
                        <Image style={{ resizeMode: 'contain', width: 80, height: 80 }} source={{ uri: item.urlIcon }} />
                    </View>
                    <Text style={{ fontSize: 16 }}>{item.weather.summary.description}</Text>
                </View>

            </View>

            <View style={styles.cardContainerSub}>
                <View style={styles.box}>
                    <Text style={{ fontSize: 16 }}>ST: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <MaterialCommunityIcons
                            name='thermometer'
                            color={'black'}
                            size={20}
                        />
                        <Text style={styles.subText}>{convertKelvinToC(item.weather.temperature.feelsLike)}°</Text>
                    </View>
                </View>
                <View style={[styles.box, { borderLeftWidth: 1, borderRightWidth: 1 }]}>
                    <Text style={{ fontSize: 16 }}>MIN: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <MaterialCommunityIcons
                            name='thermometer'
                            color={'black'}
                            size={20}
                        />
                        <Text style={{ fontSize: 16 }}>{convertKelvinToC(item.weather.temperature.min)}°</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <Text style={{ fontSize: 16 }}>MAX: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <MaterialCommunityIcons
                            name='thermometer'
                            color={'black'}
                            size={20}
                        />
                        <Text style={{ fontSize: 16 }}>{convertKelvinToC(item.weather.temperature.max)}°</Text>
                    </View>
                </View>

            </View>
            <View style={styles.cardContainerSub}>
                <View style={styles.box}>
                    <Text style={{ fontSize: 16 }}>Humedad: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <MaterialCommunityIcons
                            name='water-percent'
                            color={'black'}
                            size={20}
                        />
                        <Text style={styles.subText}>{item.weather.clouds.humidity}%</Text>
                    </View>
                </View>
                <View style={[styles.box, { borderLeftWidth: 1, borderRightWidth: 1 }]}>
                    <Text style={{ fontSize: 16 }}>Viento: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <MaterialCommunityIcons
                            name='weather-windy'
                            color={'black'}
                            size={20}
                        />
                        <Text style={{ fontSize: 16 }}>{item.weather.wind.speed} km/h</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <Text style={{ fontSize: 16 }}>Visibilidad: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <MaterialCommunityIcons
                            name='eye'
                            color={'black'}
                            size={20}
                        />
                        <Text style={{ fontSize: 16 }}>{item.weather.clouds.visibility} m</Text>
                    </View>
                </View>

            </View>
            {!citiesArray.includes(item.id) ?
                <Button color={'white'} onPress={() => {
                    if (isFavorite) {
                        console.log("aca")
                        removeFavorite(item.id)
                    } else {
                        addFavorites(item.id)
                    }
                }
                }   >
                    {!isFavorite ? 'Agregar a Favoritos' : 'Eliminar de Favoritos'}
                </Button>
                : null}

        </View>
    );
}

const styles = StyleSheet.create({
    subText: {
        fontSize: 16,
        fontWeight: '800'
    },
    cardContainer: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#B1D0E0',
        width: width * 0.95,
        height: height * 0.2,
        marginTop: 20, borderRadius: 10
    },
    cardContainerSub: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#B1D0E0',
        width: width * 0.95,
        height: height * 0.15,
        marginTop: 20, borderRadius: 10
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default Details;