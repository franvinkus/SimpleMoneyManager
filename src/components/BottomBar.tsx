import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import ButtonBottomBar from './ButtonBottomBar';
import OCR_icon from '../assets/icons/OCR-icon.png';
import Calendar from '../assets/icons/Calendar.png';
import { useModal } from '../context/modalContext';
import AddMoneyIcon from '../assets/icons/AddMoneyIcon.png'

const BottomBar = () => {
    const navigation = useNavigation();
    const { requestAddMoneyModal } = useModal(); 

    const handleAddMoneyPress = () => {
        requestAddMoneyModal();
    };
    return (
        <View style={{height: 90, backgroundColor: "black"}}>
            <View style={[styles.container]}>
                <View style={[styles.buttonRow]}>
                    <ButtonBottomBar screen='Splash' icon={Calendar}/>
                    <ButtonBottomBar screen='Camera' icon={OCR_icon}/>
                    <TouchableOpacity onPress={handleAddMoneyPress}>
                        {/* Ganti dengan icon atau teks yang relevan */}
                        <Image source={AddMoneyIcon} style={{width: 75, height: 80, borderRadius: 15, marginLeft: 10}}/>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop:15,
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

