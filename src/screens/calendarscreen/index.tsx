import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import BottomBar from "../../components/BottomBar";
import CalendarHeader from "./components/calendarHeader";
import { RootStackParamList } from "../../navigation/types";

const CalendarScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    
    return (
        <View style={{flex: 1}}>
            <CalendarHeader/>
            <View style={{flex: 1}}>
                <SafeAreaView style={[styles.safeViewArea]}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                            <View>
                                <Text style={{color: 'black'}}>
                                    This is Calendar
                                </Text>
                            </View>
                            <View style={styles.contentBox}>
                                <Text style={styles.content}>
                                  Di bawah cuma contoh doang biar tau muncul apa gak
                                </Text>
                                <Text style={styles.contentItem}>- View Summary</Text>
                                <Text style={styles.contentItem}>- Add money juga belum</Text>
                                <Text style={styles.contentItem}>- Buat Icon itu gua baru pake apa yang ada di laptop gua</Text>
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
    }
})

export default CalendarScreen;