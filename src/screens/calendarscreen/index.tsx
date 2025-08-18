import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import BottomBar from "../../components/BottomBar";
import CalendarHeader from "./components/calendarHeader";
import { RootStackParamList } from "../../navigation/types";
import DailyView from "./components/dailyView";
import MonthlyView from "./components/monthlyView";

const CalendarScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [currentView, setCurrentView] = useState<'daily' | 'monthly'>('daily');

    const handleViewChange = (view: 'daily' | 'monthly') => {
        setCurrentView(view);
    };
    
    const dummyDailyData = [
      {
        date: new Date('2025-08-11T10:00:00'), // Tanggal 11 Agustus 2025
        total: 125000,
        details: [
            { itemName: "Makan Siang", itemPrice: 50000 },
            { itemName: "Kopi", itemPrice: 25000 },
            { itemName: "Transportasi", itemPrice: 50000 },
        ]
      },
      {
        date: new Date('2025-08-10T14:30:00'), // Tanggal 10 Agustus 2025
        total: 75000,
        details: [
            { itemName: "Belanja Bulanan", itemPrice: 75000 },
        ]
      },
      {
        date: new Date('2025-08-09T20:15:00'), // Tanggal 9 Agustus 2025
        total: 20000,
        details: [
            { itemName: "Jajan", itemPrice: 20000 },
        ]
      }
    ];

    const dummyMonthlyData = {
        date: new Date('2025-08-01'), // Cukup tanggal 1 untuk mewakili bulan
        details: dummyDailyData, // Gunakan data harian yang sudah ada
    };
    
    return (
        <View style={{flex: 1}}>
            <CalendarHeader
            currentView={currentView}
            onViewChange={handleViewChange}
            />
            <View style={{flex: 1}}>
                <SafeAreaView style={[styles.safeViewArea]}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                            <View style={[styles.container]}>
                                {currentView === 'daily' ? (
                                    <ScrollView style={[styles.dataContainer]}>
                                        {dummyDailyData.map((data, index) => (
                                            <DailyView key={index} {...data}/>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <ScrollView style={[styles.dataContainer]}>
                                        <MonthlyView  date={dummyMonthlyData.date} details={dummyMonthlyData.details}/>
                                    </ScrollView>
                                )}
                            </View>
                    </ScrollView>
                </SafeAreaView>
            </View> 
            <BottomBar/>
        </View>
    );
}

const styles = StyleSheet.create({
    safeViewArea:{
        flex:1,
        backgroundColor: '#F8CEA8', 
    },
    container:{
        alignItems: "center",
        alignContent: "center",
    },
    backButton: {
        padding: 20,
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 10,
        top: 40, 
        borderRadius: 15,
        left: 20,
    },
    backText: {
        fontSize: 15,
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
    dataContainer:{
        width: "90%",
    }
})

export default CalendarScreen;