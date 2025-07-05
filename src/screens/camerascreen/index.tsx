import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// TAMBAHAN: Impor library untuk memilih gambar dari galeri
import { launchImageLibrary } from 'react-native-image-picker';
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
        // MODIFIKASI: Langsung navigasi ke Preview setelah mengambil foto
        Navigate.navigate("Preview", { photoPath: photo.path });
        // setPhotoPath(photo.path); // State ini tidak lagi diperlukan untuk menampilkan preview di sini
    };

    // TAMBAHAN: Fungsi untuk memilih gambar dari galeri
    const handleSelectFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
        }, (response) => {
            if (response.didCancel) {
                console.log('Pengguna membatalkan pemilihan gambar');
            } else if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                if (selectedImage.uri) {
                    // Langsung navigasi ke layar Preview dengan URI gambar yang dipilih
                    // URI dari image-picker sudah dalam format yang bisa langsung dipakai
                    Navigate.navigate("Preview", { photoPath: selectedImage.uri });
                }
            }
        });
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

            {/* MODIFIKASI: Container untuk tombol-tombol di bawah */}
            <View style={styles.buttonContainer}>
                {/* Tombol ambil foto */}
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                    <Text style={{ fontSize: 30 }}>📸</Text>
                </TouchableOpacity>

                {/* TAMBAHAN: Tombol untuk unggah dari galeri */}
                <TouchableOpacity style={styles.galleryButton} onPress={handleSelectFromGallery}>
                    <Text style={{ fontSize: 30 }}>🖼️</Text>
                </TouchableOpacity>
            </View>

            {/* MODIFIKASI: Bagian preview di layar ini bisa dihilangkan karena kita langsung navigasi */}
            {/* {photoPath && (
                <View style={styles.previewContainer}>
                    <Text style={{ color: 'white' }}>Preview:</Text>
                    <TouchableOpacity onPress={() => Navigate.navigate("Preview", { photoPath })}>
                        <Image source={{ uri: 'file://' + photoPath }} style={styles.previewImage} />
                    </TouchableOpacity>
                </View>
            )} */}
        </View>
    );
};

// MODIFIKASI: Penyesuaian style
const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    captureButton: {
        padding: 20,
        backgroundColor: '#000000aa',
        borderRadius: 50, // Dibuat bulat sempurna
    },
    galleryButton: { // Style untuk tombol galeri
        padding: 15,
        backgroundColor: '#000000aa',
        borderRadius: 40,
    },
    backButton: {
        padding: 20,
        backgroundColor: '#F8CEA8',
        position: 'absolute',
        zIndex: 10,
        top: 40, // Posisi disesuaikan
        borderRadius: 15,
        left: 20,
    },
    backText: {
        fontSize: 15,
    },
    // Style preview tidak lagi digunakan di sini
    // previewContainer: { ... },
    // previewImage: { ... },
});

export default CameraScreen;