import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import ButtonBottomBar from './ButtonBottomBar';
import CatIcon from '../assets/icons/CatIcon.png';



const BottomBar = () => {
    const navigation = useNavigation();
    return (
        <View style={{height: 75, backgroundColor: "black"}}>
            <View style={[styles.container]}>
                <View style={[styles.buttonRow]}>
                    <ButtonBottomBar screen='Splash' icon={CatIcon}/>
                    <ButtonBottomBar screen='Camera' icon={CatIcon}/>
                    <ButtonBottomBar screen='Splash' icon={CatIcon}/>
                </View>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

});

export default BottomBar;

