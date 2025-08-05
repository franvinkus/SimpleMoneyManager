import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Directions } from "react-native-gesture-handler";


const CalendarHeader = () => {
    const [currentCalendar, setCurrentCalendar] = useState<'daily' | 'monthly'>("daily");

    const handleDaily = () =>{
        setCurrentCalendar('daily');
    }

    const handleMonthly = () =>
        setCurrentCalendar('monthly');

    return (
        <View style={styles.mainBackground}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                onPress={handleDaily}
                style={[styles.tabButton,
                    currentCalendar === 'daily' && styles.activeTab
                ]}
                >
                    <Text style={[styles.tabText,
                    currentCalendar === 'daily' && styles.activeTabText
                    ]}
                    >
                        Daily
                    </Text>
                </TouchableOpacity>
                
                <View style={[styles.border]}></View>

                <TouchableOpacity
                onPress={handleMonthly}
                style={[styles.tabButton,
                    currentCalendar === 'monthly' && styles.activeTab
                ]}
                >
                    <Text style={[styles.tabText,
                    currentCalendar === 'monthly' && styles.activeTabText
                    ]}
                    >
                        Monthly
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.summaries]}>
                <View style={{flexDirection: "column", alignItems:"center", justifyContent: "center"}}>
                    <Text style={{color:"green"}}>Income: </Text>
                    <Text style={{color:"white"}}> Rp XXX</Text>
                </View>
                <View style={{flexDirection: "column", alignItems:"center", justifyContent: "center"}}>
                    <Text style={{color:"red"}}>Expenses: </Text>
                    <Text style={{color:"white"}}> Rp YYY</Text>
                </View>
                <View style={{flexDirection: "column", alignItems:"center", justifyContent: "center"}}>
                    <Text style={{color:"white"}}>Total: </Text>
                    <Text style={{color:"white"}}> Rp ZZZ</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainBackground:{
        backgroundColor: 'black',
        paddingVertical: 20,
    },
    tabContainer:{
        flexDirection: "row",
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop: 10,
    },
    tabButton:{

    },
    activeTab:{
        
    },
    tabText:{
        fontSize: 20,
        fontStyle: "italic",
    },
    activeTabText:{
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    border:{
        borderRightWidth: 4,
        borderColor: '#989898aa',
    },
    summaries:{
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-evenly"
    }

})

export default CalendarHeader;