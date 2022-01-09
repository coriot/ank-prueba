import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { convertKelvinToC } from '../helpers/helpers';
import { List } from 'react-native-paper';
import { Avatar } from 'react-native-paper';


interface CitiesWeather {
    id: string;
    name: string;
    urlIcon: string;
    tempActual: string;
    onPress: (id: string) => void;
}



const ItemCitiesWeather: React.FC<CitiesWeather> = ({id,name,onPress,tempActual,urlIcon}) => {
    return (
        <View style={styles.container}>
            <List.Item
                onPress={() => onPress(id)}
                title={<Text style={styles.cityText}>{name}</Text>}
                left={props => <Avatar.Image style={styles.iconWeather} size={50} source={{ uri: urlIcon }} />}
                right={props => <Text style={styles.rightText}>
                    {convertKelvinToC(tempActual)}°
                </Text>
                }
            />
        </View>
    )
}

export default ItemCitiesWeather;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#9DB2BE',
        margin: 5,
        borderRadius: 10
    },
    rightText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 24,
        color: 'white'
    },
    iconWeather: {
        backgroundColor: 'transparent'
    },
    cityText: {
        color: 'white'
    }
});