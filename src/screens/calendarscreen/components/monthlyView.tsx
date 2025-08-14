import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface dailyProps{
    date: Date,
    total: number,
}

interface monthlyProps{
    date: Date,
    details: dailyProps[]
}

const MonthlyView = ({ date, details }: monthlyProps) => {

    const formattedDateMonthly = date.toLocaleDateString('id-ID', {
      month: 'long',    
      year: 'numeric',  
    });

    const totalMonthly = details.reduce((sum, currentDay) => {
        return sum + currentDay.total;
    }, 0);

    return(
        <View style={[styles.background]}>
            <View style={[styles.container]}>
                <View style={[styles.textHeader]}>
                    <Text style={[styles.textDate]}>{formattedDateMonthly}</Text>
                    <Text style={[styles.textTotal]}>Rp. {totalMonthly.toLocaleString('id-ID')}</Text>
                </View>

                {details.length > 0 ? (
                    details.map((days, index) => {
                        const formattedDateDaily = days.date.toLocaleDateString('id-ID', {
                        day: 'numeric',  
                        month: 'long',    
                        year: 'numeric',  
                        });
                        return (
                        <View key={index} style={[styles.details]}>
                            <Text style={[styles.itemName]}>{formattedDateDaily}: </Text>
                            <Text style={[styles.itemPrice]}>Rp. {days.total.toLocaleString('id-ID')}</Text>
                        </View>
                    )
                    })
                ) : (
                    <View>
                        <Text style={[styles.textHeader]}>Tidak ada detail untuk barang hari ini.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: 'grey',
        padding: 3,
        borderRadius: 5,
        marginTop: 10,
        width: "100%",
    },
    container:{
        padding: 10
    },
    textHeader:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    textDate:{
        color:"white",
    },
    textTotal:{
        color:"white",
        fontStyle:"italic",
    },
    details:{
        flexDirection:"row",
        justifyContent: "space-between",
    },
    itemName:{

    },
    itemPrice:{

    }
});

export default MonthlyView;