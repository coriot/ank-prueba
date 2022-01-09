import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, Dimensions, TextInput, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { apiGetCities } from '../api/api';
import { citiesArray } from '../constant';
import ItemCitiesWeather from '../components/ItemCitiesWeather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../stacks/HomeStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


let { width, height } = Dimensions.get('window');

interface Cities {
    id: string;
    name: string;
    urlIcon: string;
    weather: {
        temperature: { actual: string };
    };
}

interface ItemCity {
    name: string,
    urlIcon: string,
    id: string,
    weather: {
        temperature: {
            actual: string,
            min: string,
            max: string,
            feelsLike: string

        }
    }
}

type Props = NativeStackScreenProps<StackParams, "Home">


const Home = ({ navigation }: Props) => {
    const [cities, setCities] = useState<Cities[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [citySearch, onCitySearch] = useState("");

    const getFavorites = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favorites')
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            // error reading value
        }
    }

    async function getAllData() {
        const favorites = await getFavorites();
        const allCities = citiesArray.concat(favorites)
        let res = await apiGetCities(allCities)
        if (!res.error) {
            if (res.data.data.getCityById) {
                res.data.data.getCityById.forEach((item: { urlIcon: string, weather: { summary: { icon: string } } }) => {
                    item.urlIcon = `http://openweathermap.org/img/wn/${item.weather.summary.icon}@2x.png`
                })


                setCities(res.data.data.getCityById);
            }

            setLoading(false)
        } else {
            Alert.alert("Ocurrió un error al cargar los datos");
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        const unmount = navigation.addListener('focus', () => {
            getAllData();
          });
        return () => {
            unmount;
        }

    }, [navigation]);



    const renderItem = ({ item }: { item: ItemCity }) => {
        return (
            <ItemCitiesWeather
                onPress={() => navigation.navigate("Details", { item })}
                name={item.name}
                urlIcon={item.urlIcon}
                id={item.id}
                tempActual={item.weather.temperature.actual}
            />
        )
    }

    return (
        <View style={{ backgroundColor: '#6998AB', flex: 1 }}>
            <View style={{ marginTop: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop:20 }}>
                    <View style={{
                        backgroundColor: '#9DB2BE',
                        width: width * 0.97,
                        height: 50,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10
                    }}>

                        <TextInput
                            style={{
                                marginRight: 10,
                                borderRadius: 10,
                                backgroundColor: 'white',
                                height: 40,
                                flex: 1,
                                justifyContent: 'center',
                            }}
                            placeholder='Buscar...'
                            onChangeText={onCitySearch}
                        />
                        <Pressable onPress={() => navigation.navigate('SearchResults', { citySearch })}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 40,
                                width: 40,
                                backgroundColor: '#7c8d96'
                            }}
                        >
                            <MaterialCommunityIcons
                                name='magnify'
                                color={'white'}
                                size={30}
                            />
                        </Pressable>

                    </View>
                </View>
                {!loading ?
                    <View style={{ marginTop: 0, height:height*0.8 }}>
                        {cities?.length ? <FlatList<Cities>
                            data={cities}
                            renderItem={renderItem}
                            keyExtractor={(item: { id: string; }) => item.id}
                            refreshControl={
                                <RefreshControl
                                  refreshing={loading}
                                  onRefresh={getAllData}
                                />
                            }
                        /> :
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>Sin resultados</Text>}
                    </View> :
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator size={50} color="white" />
                    </View>
                }
            </View>
        </View>
    );
}

export default Home;