import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import BottomBar from "../../components/BottomBar";
import { useModal } from '../../context/modalContext';
import AddMoney from '../../components/modals/AddMoney';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BALANCE_STORAGE_KEY = 'user_initial_balance';
const HomeScreen = () => {
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const {
    isAddMoneyModalRequested,
    onAddMoneyModalClose,
    onAddMoneyModalSubmit,
    registerAddMoneyHandler,
    unregisterAddMoneyHandler
  } = useModal();

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedAmount = await AsyncStorage.getItem(BALANCE_STORAGE_KEY);
        if (storedAmount != null) {
          setInitialAmount(parseFloat(storedAmount));
        }
      }
      catch (error) {
        console.error('Failed to load initial balance from AsyncStorage:', error);
      }
    }

    loadBalance();
  }, []);

  const saveAmount = async (amount: number) => {
    try {
      await AsyncStorage.setItem(BALANCE_STORAGE_KEY, amount.toString());
      console.log("berhasil save", amount);
    }
    catch (error) {
      console.log("error tidak bisa save", error);
    }
  }

  const handleAddMoney = useCallback((amount: number) => {
    setInitialAmount(prevAmount => {
      const newAmount = prevAmount + amount;
      saveAmount(newAmount);
      Alert.alert("Saldo berhasil ditambah", `saldo anda sekarang: Rp ${newAmount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      return newAmount;
    })
  }, []);

  useEffect(() => {
    registerAddMoneyHandler(handleAddMoney);

    return () => {
      unregisterAddMoneyHandler(handleAddMoney);
    };
  }, [handleAddMoney, registerAddMoneyHandler, unregisterAddMoneyHandler]);


  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.title}>Welcome to MaNey</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.netBalanceTitle}>Net Balance</Text>
              <Text style={styles.netBalanceAmount}>
                Rp {initialAmount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.content}>
                fitur yang harus dibentuk
              </Text>
              <Text style={styles.contentItem}>- Scan Resi (Fitur OCR) kameranya udh jadi, bisa langsung test aja, hasilnya juga masih preview itu nanti gua mau lanjut</Text>
              <Text style={styles.contentItem}>- View Summary</Text>
              <Text style={styles.contentItem}>- Add money juga belum</Text>
              <Text style={styles.contentItem}>- Buat Icon itu gua baru pake apa yang ada di laptop gua</Text>
            </View>
          </View>
        </ScrollView>

        {isAddMoneyModalRequested && (
          <AddMoney
            isInvisible={true}
            onClose={onAddMoneyModalClose}
            onAddMoney={onAddMoneyModalSubmit}
          />
        )}

      </SafeAreaView>
      <BottomBar />
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
  },
  balanceContainer: {
    backgroundColor: '#FFEACF',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
    marginTop: 20,
    width: '100%',
  },
  netBalanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textAlign: 'left',
  },
  netBalanceAmount: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default HomeScreen;