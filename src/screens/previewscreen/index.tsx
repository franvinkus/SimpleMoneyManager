import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RootStackParamList } from '../../navigation/types';
import { NativeGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/nativeGesture';

const PreviewScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const {photoPath} = route.params as {photoPath: string};

    return (
        <View style={[styles.container]}>
            <TouchableOpacity onPress={() => Navigate.navigate("Camera")} style={[styles.backButton]}>
                <Text style={[styles.backText]}>Back</Text>
            </TouchableOpacity>
            {photoPath && (
            <Image source={{uri: 'file://' + photoPath}} style={[styles.image]}/>
            )}
            <TouchableOpacity style={styles.acceptButton} onPress={() =>Navigate.navigate("OCR", {photoPath})}>
                <Text style={{ color: 'white' }}>✔️</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
    backText:{
        fontSize: 15
    },
    image:{
        flex:1,
        width: "100%",
    },
    acceptButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        alignSelf: 'center',
        padding: 20,
        backgroundColor: '#000000aa',
        borderRadius: 40,
    },

});

export default PreviewScreen;