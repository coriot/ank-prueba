import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Details from '../screens/Details';
import SearchResults from '../screens/SearchResults';

export type StackParams = {
	Home : any;
	Details : {
		item: any;
	};
	SearchResults: {
		citySearch: string;
	};
}

const Stack = createNativeStackNavigator<StackParams>();

export default function HomeStack() {
	function headerOptions(title:string){
		const header = {
			title:title,
			headerStyle: {
				backgroundColor: '#406882',
			},
			headerTintColor: '#fff'
		}

		return header;
	}
	

	return (
		<Stack.Navigator initialRouteName='Home'>
			<Stack.Screen
				name='Home'
				component={Home}
				options={headerOptions("GrapthQL ANK Clima")}
				
			/>
			<Stack.Screen
				name='Details'
				component={Details}
				options={headerOptions("Detalles")}
			/>
			<Stack.Screen
				name='SearchResults'
				component={SearchResults}
				options={headerOptions("Buscar")}
			/>
		</Stack.Navigator>
	);
}
