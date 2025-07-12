import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState} from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RootStackParamList, ItemDetail } from '../../navigation/types';

type ScanResultScreenRouteProp = RouteProp<RootStackParamList, 'SCANRESULT'>;
const ScanResultScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<ScanResultScreenRouteProp>();
    const {
        rawOcrText: initialRawOcrText,
        extractedDate: initialExtractedDate,
        extractedTotal: initialExtractedTotal,
        extractedItems: initialExtractedItems
    } = route.params;

    const [rawOcrText, setRawOcrText] = useState<string>(initialRawOcrText || '');
    const [editableDate, setEditableDate] = useState(initialExtractedDate || '');
    const [editableTotal, setEditableTotal] = useState(initialExtractedTotal || '');
    const [editableItems, setEditableItems] = useState<ItemDetail[]>(initialExtractedItems || []);
    

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ScrollView>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                {rawOcrText || 'Tidak ada teks uji coba.'}
            </Text>
            <Text style={{ color: 'black', fontSize: 16, marginTop: 10 }}>
                Tanggal: {editableDate || 'N/A'}
            </Text>
            <Text style={{ color: 'black', fontSize: 16 }}>
                Total: {editableTotal || 'N/A'}
            </Text>
            <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Items:</Text>
            {editableItems.length > 0 ? (
                editableItems.map((item, index) => (
                    <Text key={index} style={{ color: 'black', fontSize: 14, marginBottom: 5 }}>
                        - {item.name || ''} (Qty: {item.quantity?.toString() || 'N/A'}, Unit: {item.unitPrice?.toString() || 'N/A'}, Total: {item.totalItemPrice?.toString() || 'N/A'})
                    </Text>
                ))
            ) : (
                <Text style={{ color: 'black', fontSize: 14 }}>Tidak ada item terdeteksi.</Text>
            )}

            </ScrollView>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        color: '#555',
    },
    rawOcrTextDisplay: {
        fontSize: 14,
        color: '#777',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    extractedData: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    extractedItem: {
        fontSize: 14,
        marginBottom: 3,
        color: '#444',
    },
    backButtonText:{
        fontSize: 15
    },


});

export default ScanResultScreen;