import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RootStackParamList } from '../../navigation/types';


const ScanResultScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const {resultText} = route.params as {resultText: string};
    

    return (
        <View style={[styles.container]}>
            <View style={[styles.titleContainer]}>
                <Text style={[styles.title]}>
                    Hasil Scan OCR:
                </Text>
            </View>
            <View style={[styles.resultContainer]}>
                <Text style={styles.resultText}>{resultText}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8CEA8',
        justifyContent: "center",
    },
    backButton:{
        zIndex: 10,
        position: 'absolute',
        padding: 20,
        backgroundColor: "#F8CEA8",
        top: 20,
        borderRadius: 10,
        left: 20,
    },
    titleContainer:{
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        color: "black",
    },
    resultContainer: {
        borderWidth: 3,
        borderColor: "black",
        padding: 10,
    },
    resultText: {
        color: 'black',
        fontSize: 16,
    },


});

export default ScanResultScreen;