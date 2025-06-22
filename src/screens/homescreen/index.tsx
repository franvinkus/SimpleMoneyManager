import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import BottomBar from "../../components/BottomBar";

const HomeScreen = () => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.title}>Selamat Datang di Beranda!</Text>
            <Text style={styles.subtitle}>Ini adalah halaman utama aplikasi Anda.</Text>
            {/* Di sini Anda akan menaruh UI dan fungsionalitas utama aplikasi money manager Anda */}
            <View style={styles.contentBox}>
              <Text style={styles.content}>
                Mulai kelola keuangan Anda. Anda bisa menambahkan fitur seperti:
              </Text>
              <Text style={styles.contentItem}>- Scan Resi (Fitur OCR Anda)</Text>
              <Text style={styles.contentItem}>- Daftar Transaksi</Text>
              <Text style={styles.contentItem}>- Kategori Pengeluaran</Text>
              <Text style={styles.contentItem}>- Ringkasan Keuangan</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomBar/>
    </View>
    
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8CEA8', // Latar belakang Home Screen
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Pusatkan konten secara vertikal
    alignItems: 'center',     // Pusatkan konten secara horizontal
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#263238',
  },
  subtitle: {
    fontSize: 18,
    color: '#455a64',
    textAlign: 'center',
    marginBottom: 30,
  },
  contentBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    fontSize: 16,
    color: '#546e7a',
    marginBottom: 10,
  },
  contentItem: {
    fontSize: 14,
    color: '#78909c',
    marginBottom: 5,
    marginLeft: 10,
  }
});

export default HomeScreen;