import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface propsDetail{
    itemName: string,
    itemPrice: number,
}

interface dailyProps{
    date: Date,
    total: number,
    details: propsDetail[]
}

const DailyView = ({ date, total, details }: dailyProps) => {

    const formattedDate = date.toLocaleDateString('id-ID', {
      weekday: 'long', 
      day: 'numeric',  
      month: 'long',    
      year: 'numeric',  
    });

    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',   
      minute: '2-digit', 
    });

    return(
        <View style={[styles.background]}>
            <View style={[styles.container]}>
                <View style={[styles.textHeader]}>
                    <Text style={[styles.textDate]}>{formattedDate}, {formattedTime}</Text>
                    <Text style={[styles.textTotal]}>Rp. {total.toLocaleString('id-ID')}</Text>
                </View>

                {details.length > 0 ? (
                    details.map((item, index) => (
                        <View key={index} style={[styles.details]}>
                            <Text style={[styles.itemName]}>{item.itemName}: </Text>
                            <Text style={[styles.itemPrice]}>Rp. {item.itemPrice.toLocaleString('id-ID')}</Text>
                        </View>
                    ))
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
        width: "75%",
        justifyContent: "space-between"
    },
    itemName:{

    },
    itemPrice:{

    }
});

export default DailyView;