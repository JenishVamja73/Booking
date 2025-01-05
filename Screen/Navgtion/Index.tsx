import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import 'react-native-gesture-handler';
import BookingDetails from '../BookingDetails';
import Home from '../Home/Index';
const Stack = createNativeStackNavigator();



const Navgtion = ()=>{
    return(
        <>
       <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />

      </Stack.Navigator>
    </NavigationContainer>
        
        </>
    )
}
export default Navgtion