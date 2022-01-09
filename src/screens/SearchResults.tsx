import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, Dimensions, TextInput, Pressable } from 'react-native';
import { apiGetCitiesByName } from '../api/api';
import ItemCitiesWeather from '../components/ItemCitiesWeather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../stacks/HomeStack';


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

type Props = NativeStackScreenProps<StackParams, "SearchResults">

const SearchResults = ({ navigation }: Props) => {
    const [cities, setCities] = useState<Cities[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        apiGetCitiesByName("Cordoba").then(res => {
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
                <FlatList<Cities>
                    data={cities}
                    renderItem={renderItem}
                    keyExtractor={(item: { id: string; }) => item.id}
                />
            </View>
        </View>
    );
}

export default SearchResults;