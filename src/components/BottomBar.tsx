import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import { useModal } from '../context/modalContext';
import ButtonBottomBar from './ButtonBottomBar';
import HomeIcon from '../assets/icons/HomeIcon.png'
import OCRIcon from '../assets/icons/OCRIcon.png'
import Calendar from '../assets/icons/Calendar.png';
import AddMoneyIcon from '../assets/icons/AddMoneyIcon.png'




const BottomBar = () => {
    const navigation = useNavigation();
    const { requestAddMoneyModal } = useModal(); 

    const handleAddMoneyPress = () => {
        requestAddMoneyModal();
    };
    return (
        <View style={{height: 75, backgroundColor: "black"}}>
            <View style={[styles.container]}>
                <View style={[styles.buttonRow]}>
                    <ButtonBottomBar screen='Home' icon={HomeIcon}/>
                    <ButtonBottomBar screen='Calendar' icon={Calendar}/>
                    <ButtonBottomBar screen='Camera' icon={OCRIcon}/>
                    <TouchableOpacity onPress={handleAddMoneyPress}>
                        {/* Ganti dengan icon atau teks yang relevan */}
                        <Image source={AddMoneyIcon} style={{width: 80, height: 87, borderRadius: 15, marginLeft: 10}}/>
                    </TouchableOpacity>
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
        marginLeft: -10
    },

});

export default BottomBar;

