import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
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

const SearchResults = ({ navigation, route }: Props) => {
    const [cities, setCities] = useState<Cities[] | null>(null);
    const [loading, setLoading] = useState(true);

 

    useEffect(() => {
        setLoading(true)
        let unmount = apiGetCitiesByName(route.params.citySearch).then(res => {
            if (!res.error) {
                if (res.data.data.getCityByName) {
                    res.data.data.getCityByName.urlIcon = `http://openweathermap.org/img/wn/${res.data.data.getCityByName.weather.summary.icon}@2x.png`
                    setCities([res.data.data.getCityByName]);
                }
                setLoading(false)
            } else {
                Alert.alert("Ocurrió un error al cargar los datos");
                setLoading(false)
            }
        })

        return () => {
            unmount;
        }

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
        <View style={styles.container}>
            {!loading ? 
                <View style={{ marginTop: 20 }}>
                    {cities?.length ? <FlatList<Cities>
                        data={cities}
                        renderItem={renderItem}
                        keyExtractor={(item: { id: string; }) => item.id}
                    /> :
                        <Text style={styles.textResult}>Sin resultados</Text>}
                </View> :
                <View style={{marginTop:20}}>
                    <ActivityIndicator size={50} color="white" />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ 
        backgroundColor: '#6998AB', 
        flex: 1 
    },
    textResult: { textAlign: 'center', color: 'white', fontSize: 20 }

});

export default SearchResults;