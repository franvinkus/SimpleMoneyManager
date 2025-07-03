// src/utils/ocrUtils.ts
import firebase from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml-vision';


export const recognizeReceiptText = async (imageUri: string) => {
  if (!imageUri) {
    console.warn("Image URI is empty.");
    return "";
  }

  // Pastikan Firebase app diinisialisasi sebelum mencoba menggunakan ML Kit
  if (!firebase.apps.length) {
    console.error("Firebase app not initialized when recognizeReceiptText was called!");
    throw new Error("Firebase app not initialized. Please ensure firebase.initializeApp() is called.");
  }

  try {
    // Panggil fungsi ml() untuk mendapatkan instance ML Vision
    // Biarkan TypeScript menginfer tipe 'result' secara otomatis
    const result = await ml().textRecognizerProcessImage(imageUri); 

    let extractedText = '';

    // TypeScript seharusnya bisa menginfer tipe 'block' dan 'line' dari 'result'
    result.blocks.forEach(block => {
      block.lines.forEach(line => {
        extractedText += line.text + '\n';
      });
    });

    console.log("OCR Success! Recognized Text:", extractedText);
    return extractedText;

  } catch (error) {
    console.error('Error during OCR process:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to recognize text: ${error.message}`);
    } else if (typeof error === 'string') {
      throw new Error(`Failed to recognize text: ${error}`);
    } else {
      throw new Error('Failed to recognize text: An unknown error occurred.');
    }
  }
};