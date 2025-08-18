import React, { useState, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BottomBar from "../../components/BottomBar";
import CalendarHeader from "./components/calendarHeader";
import DailyView from "./components/dailyView";
import MonthlyView from "./components/monthlyView";
import { getTransactions, deleteTransaction, Transaction } from "../../utils/transactionStorage";

export interface DailyData {
  id: string; 
  storeName: string;
  date: Date;
  total: number;
  details: {
    itemName: string;
    itemPrice: number;
  }[];
}


const parseDateString = (dateStr: string | null): Date => {
    if (!dateStr) return new Date();

    const monthMap: { [key: string]: string } = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
        januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
        juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
    };

    const cleanedDateStr = dateStr.toLowerCase().replace(/[,.]/g, '');
    const parts = cleanedDateStr.split(/[\s-/]/); 
    if (parts.length === 3) {
        let [day, month, year] = parts;

        
        if (isNaN(parseInt(month, 10))) {
            month = monthMap[month.substring(0, 3)];
        }

       
        if (month && month.length === 1) month = '0' + month;
        if (day && day.length === 1) day = '0' + day;

      
        if (year && year.length === 2) year = '20' + year;

       
        const dateFormats = [`${year}-${month}-${day}`, `${year}-${day}-${month}`];
        for (const format of dateFormats) {
            const date = new Date(format);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }

    const directParse = new Date(dateStr);
    if (!isNaN(directParse.getTime())) {
        return directParse;
    }

    return new Date(); 
};

const CalendarScreen = () => {
    const [currentView, setCurrentView] = useState<'daily' | 'monthly'>('daily');
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

    const loadData = async () => {
        const data = await getTransactions();
        setAllTransactions(data);
    };

    useFocusEffect(
      React.useCallback(() => {
        loadData();
      }, [])
    );

    const handleDelete = async (idToDelete: string) => {
        await deleteTransaction(idToDelete);
  
        loadData(); 
    };

    const formattedData: DailyData[] = useMemo(() => {
      return allTransactions.map(transaction => ({
        id: transaction.id, 
        storeName: transaction.storeName,
        date: parseDateString(transaction.date), 
        total: parseFloat(transaction.total.replace(/[^0-9,]/g, '').replace(',', '.')) || 0,
        details: transaction.items.map(item => ({
          itemName: item.name,
          itemPrice: item.totalItemPrice || 0,
        })),
      })).sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [allTransactions]);

    const totalExpenses = useMemo(() => {
        return formattedData.reduce((sum, current) => sum + current.total, 0);
    }, [formattedData]);
    
    return (
        <View style={{flex: 1}}>
            <CalendarHeader
              currentView={currentView}
              onViewChange={setCurrentView}
              expenses={totalExpenses}
              income={0}
            />
            <View style={{flex: 1}}>
                <SafeAreaView style={[styles.safeViewArea]}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <View style={[styles.container]}>
                            {formattedData.length === 0 ? (
                                <Text style={styles.emptyText}>Belum ada transaksi.</Text>
                            ) : currentView === 'daily' ? (
                                <View style={[styles.dataContainer]}>
                                    {formattedData.map((data) => (
                                        <DailyView 
                                            key={data.id} 
                                            {...data} 
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <View style={[styles.dataContainer]}>
                                    <MonthlyView date={new Date()} details={formattedData}/>
                                </View>
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
    safeViewArea:{ flex:1, backgroundColor: '#F8CEA8' },
    container:{ alignItems: "center", alignContent: "center" },
    dataContainer:{ width: "90%" },
    emptyText: { marginTop: 50, color: 'grey', fontSize: 16 }
})

export default CalendarScreen;
