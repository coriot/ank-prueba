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
	SearchResults: any;
}

const Stack = createNativeStackNavigator<StackParams>();

export default function HomeStack() {
	return (
		<Stack.Navigator initialRouteName='Home'>
			<Stack.Screen
				name='Home'
				component={Home}
			/>
			<Stack.Screen
				name='Details'
				component={Details}
			/>
			<Stack.Screen
				name='SearchResults'
				component={SearchResults}
			/>
		</Stack.Navigator>
	);
}
