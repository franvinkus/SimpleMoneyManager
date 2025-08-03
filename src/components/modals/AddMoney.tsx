import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';


interface addMoneyProps{
    isInvisible: boolean;
    onClose: () => void;
    onAddMoney: (amount : number) => void;
}

const AddMoney: React.FC<addMoneyProps> = ({
    isInvisible,
    onClose, 
    onAddMoney
}) => {
     const [amountInput, setAmountInput] = useState('');

    const handleAddMoney = () => {
        const amount = parseFloat(amountInput.replace(/[^0-9]/g, '')); //hapus karakter non number
        if(!isNaN(amount) && amount > 0){
            onAddMoney(amount);
            setAmountInput('');
        }
        onClose();
    }

    const handleCancel = () => {
        setAmountInput('');
        onClose();
    }

    const formatAmount = (text:string) => {
        let cleanedText = text.replace(/[^0-9]/g, '');
        if (cleanedText === '') {
            return ('');
        }
        let num = parseInt(cleanedText, 10);
        return num.toLocaleString('id-ID');
    }

    return (
        <Modal
        animationType='fade'
        transparent={true}
        visible={isInvisible}
        onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Tambah Saldo</Text>
                        <TextInput
                        placeholder='Ketik jumlah'
                        keyboardType='numeric'
                        value={amountInput}
                        onChangeText={text => setAmountInput(formatAmount(text))}
                        autoFocus={true}  
                        style={styles.input}
                        placeholderTextColor={"black"}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text style={{backgroundColor:'red', color:"white", padding: 10, borderRadius: 8}}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddMoney}>
                                <Text style={{backgroundColor:'green', color:"white", padding: 10, borderRadius: 8}}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', 
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'right', 
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        
    },
});

export default AddMoney;