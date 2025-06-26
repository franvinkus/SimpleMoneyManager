import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RootStackParamList } from '../../navigation/types';

const CameraScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const camera = useRef<Camera>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices.find(d => d.position === 'back');
    const [photoPath, setPhotoPath] = useState<string | null>(null);


    useEffect(() => {
    const getPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      
      console.log(permission);
      console.log('devices:', devices);
      if (permission === 'granted') {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    };

    getPermission();
  }, []);

  const takePhoto = async () => {
    if (camera.current == null) return;
    const photo = await camera.current.takePhoto({});
    console.log('Photo path:', photo.path);
    setPhotoPath(photo.path);
  };

  if (device == null || !hasPermission) return <Text> Loading camera...</Text>;

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.backButton} onPress={() => Navigate.navigate('Home')}>
                <Text style={[styles.backText]}>Back</Text>
            </TouchableOpacity>

            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                <Text style={{ color: 'white' }}>📸</Text>
            </TouchableOpacity>

            {photoPath && (
              
                <View style={styles.previewContainer}>
                    <Text style={{ color: 'white' }}>Preview:</Text>
                    <TouchableOpacity onPress={() => Navigate.navigate("Preview", {photoPath})}>
                      <Image source={{ uri: 'file://' + photoPath }} style={styles.previewImage} />
                    </TouchableOpacity>  
                </View> 
            )}
    </View>
  );
};

const styles = StyleSheet.create({
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#000000aa',
    borderRadius: 40,
  },
  backButton:{
    padding: 20,
    backgroundColor: '#F8CEA8',
    position: 'absolute',
    zIndex: 10,
    top: 20,
    borderRadius: 15,
    left: 20,
  },
  backText:{
    fontSize: 15,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
});

export default CameraScreen;