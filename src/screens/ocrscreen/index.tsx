import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState} from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { recognizeReceiptText } from '../../utils/ocrUtils';


const OcrScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const {photoPath} = route.params as {photoPath: string};

    const [resultText, setResultText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleOCR = async () => {
        setIsLoading(true);
        setResultText(null); // Clear previous result
        try {
            const mlKitResult = await recognizeReceiptText(photoPath);
            setResultText(mlKitResult);
        } catch (error) {
            Alert.alert('OCR Gagal', `Terjadi kesalahan saat memproses gambar: ${(error as Error).message}`);
            setResultText('Terjadi kesalahan saat memproses gambar.');
        } finally {
        setIsLoading(false);
        }
    };

    return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => Navigate.navigate('Camera')}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {photoPath && (
        <Image
          source={{ uri: 'file://' + photoPath }}
          style={styles.image}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleOCR} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Memproses...' : 'Scan dengan OCR'}
        </Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 10 }} />}

      {resultText && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{resultText}</Text>
        </View>
      )}
    </View>
  );
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
    button: {
        backgroundColor: '#F8CEA8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    resultBox: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    resultText: {
        color: 'white',
        fontSize: 14,
    },

});

export default OcrScreen;