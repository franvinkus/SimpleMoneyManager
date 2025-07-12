// src/utils/ocrUtils.ts
import firebase from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml-vision';

export const recognizeReceiptText = async (imageUri: string) => {
  if (!imageUri) {
    console.warn("Image URI is empty.");
    return { text: '', blocks: [] }; 
  }

  if (!firebase.apps.length) {
    console.error("Firebase app not initialized!");
    throw new Error("Firebase app not initialized.");
  }

  try {

    const result = await ml().textRecognizerProcessImage(imageUri);

    console.log("OCR Success! Returning the full result object.");

    return result;

  } catch (error) {
    console.error('Error during OCR process:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to recognize text: ${error.message}`);
    } else {
      throw new Error('Failed to recognize text: An unknown error occurred.');
    }
  }
};