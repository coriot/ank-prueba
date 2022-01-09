import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, Dimensions, TextInput, Pressable } from 'react-native';
import { apiGetCities } from '../api/api';
import { citiesArray } from '../constant';
import ItemCitiesWeather from '../components/ItemCitiesWeather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../stacks/HomeStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


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

    //const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    useEffect(() => {
        setLoading(true)
        apiGetCities(citiesArray).then(res => {
            if (!res.error) {
                res.data.data.getCityById.forEach((item: { urlIcon: string, weather: { summary: { icon: string } } }) => {
                    item.urlIcon = `http://openweathermap.org/img/wn/${item.weather.summary.icon}@2x.png`
                })
                console.log(res.data.data.getCityById)
                setCities(res.data.data.getCityById);
                setLoading(false)
            } else {
                Alert.alert("Ocurrió un error al cargar los datos");
                setLoading(false)
            }

        })

    }, []);



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
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
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
                        />
                        <Pressable onPress={()=> navigation.navigate('SearchResults')} style={{ 
                                                                                    justifyContent: 'center', 
                                                                                    alignItems:'center',
                                                                                    borderRadius:10 ,
                                                                                    height:40,
                                                                                    width:40, 
                                                                                    backgroundColor:'#7c8d96'}}>
                            <MaterialCommunityIcons
                                name='magnify'
                                color={'white'}
                                size={30}
                            />
                        </Pressable>
                         
                    </View>
                </View>
                <FlatList<Cities>
                    data={cities}
                    renderItem={renderItem}
                    keyExtractor={(item: { id: string; }) => item.id}
                />
            </View>
        </View>
    );
}

export default Home;