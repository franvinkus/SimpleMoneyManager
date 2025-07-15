import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { recognizeReceiptText } from '../../utils/ocrUtils';
import { parseReceiptText } from '../../utils/receiptParser';

interface TextElement {
  text: string;
  boundingBox: [number, number, number, number]; 
}
interface TextLine {
  elements: TextElement[];
}
interface TextBlock {
  lines: TextLine[];
}

const OcrScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { photoPath } = route.params as { photoPath: string };

    const [isLoading, setIsLoading] = useState(false);
    const [ocrError, setOcrError] = useState<string | null>(null);
    const [rawOcrText, setRawOcrText] = useState<string>(''); //teks OCR mentah

    const handleOCR = async () => {
        setIsLoading(true);
        setResultText(null);
        try {
            const mlKitResult = await recognizeReceiptText(photoPath);

            if (mlKitResult && mlKitResult.blocks && mlKitResult.blocks.length > 0) {

                const allElements: TextElement[] = [];
                for (const block of mlKitResult.blocks) {
                    for (const line of block.lines) {
                        allElements.push(...(line.elements || []));
                    }
                }
                const groupedLines = new Map<number, TextElement[]>();
                const Y_TOLERANCE = 10; 

                allElements.forEach(element => {
                    const yPos = element.boundingBox[1];
                    let foundGroup = false;
                    for (const key of groupedLines.keys()) {
                        if (Math.abs(key - yPos) < Y_TOLERANCE) {
                            groupedLines.get(key)?.push(element);
                            foundGroup = true;
                            break;
                        }
                    }
                    if (!foundGroup) {
                        groupedLines.set(yPos, [element]);
                    }
                });

                const sortedLines = Array.from(groupedLines.entries())
                    .sort((a, b) => a[0] - b[0])
                    .map(([, elements]) =>
                        elements
                            .sort((a, b) => a.boundingBox[0] - b.boundingBox[0]) 
                            .map(el => el.text)
                            .join(' ')
                    );

                const reconstructedText = sortedLines.join('\n');
                setResultText(reconstructedText);

            } else {
                setResultText(mlKitResult.text || 'Tidak ada teks yang dapat dideteksi.');
            }
        } catch (error) {
            Alert.alert('OCR Gagal', `Terjadi kesalahan: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);

        }

        // --- Logika Ekstraksi Item Detil ---
        let inItemsSection = false;
        const extractedItemsTemp: ItemDetail[] = [];

        // Keywords yang MENUTUP bagian item
        const itemEndKeywords = ["SUBTOTAL", "TOTAL", "PAJAK", "DISKON", "DISCOUNT", "GRAND TOTAL", "KEMBALIAN", "PEMBAYARAN", "TERIMA KASIH", "THANK YOU", "DEBIT BCA"];

        // Regex untuk mengenali baris yang mungkin merupakan QTY dan Nama Item (misal: "1 Bread Butter Pudding")
        // Baris ini biasanya dimulai dengan angka (kuantitas) diikuti nama
        const itemDescriptionPattern = /^\s*(\d+)\s+([a-zA-Z0-9\s.,'&\-]+)\s*$/;

        // Regex untuk mengenali baris yang mungkin hanya HARGA
        const justPricePattern = /^\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)\s*$/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length === 0) continue;
            const lowerCaseLine = line.toLowerCase();

            // Kriteria untuk memulai bagian item: Setelah tanggal dan sebelum subtotal
            if (!inItemsSection) {
                if (lowerCaseLine.includes("may") && lowerCaseLine.includes("19") && i < lines.length - 1) { // Setelah tanggal
                    // Cek apakah baris berikutnya terlihat seperti item
                    if (lines[i+1].trim().match(/^\d+\s+[a-zA-Z]/)) { // Jika baris berikutnya dimulai dengan angka dan huruf
                        inItemsSection = true;
                        continue; // Lewati baris ini (tanggal)
                    }
                }
            }
            
            if (inItemsSection) {
                // Kriteria untuk mengakhiri bagian item
                if (itemEndKeywords.some(keyword => lowerCaseLine.includes(keyword.toLowerCase())) ||
                    /^(-|=|_|\*)+$/.test(line) // Baris pemisah
                ) {
                    inItemsSection = false;
                    break; // Keluar dari loop item
                }

                // --- Proses Item (QTY dan Nama di satu baris, Harga di baris berikutnya) ---
                const itemMatch = line.match(itemDescriptionPattern);
                
                if (itemMatch && itemMatch[1] && itemMatch[2]) {
                    // Ini adalah baris deskripsi item (misal "1 Bread Butter Pudding")
                    let currentItem: ItemDetail = {
                        name: itemMatch[2].replace(/\s+/g, ' ').trim(), // Nama item
                        quantity: parseInt(itemMatch[1], 10), // Kuantitas
                        rawLine: line
                    };

                    // Coba cek baris berikutnya untuk harga
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i+1].trim();
                        const priceMatch = nextLine.match(justPricePattern);
                        if (priceMatch && priceMatch[1]) {
                            // Ini adalah baris harga (misal "11,500")
                            let cleanedPrice = priceMatch[1].replace(/,/g, '.');
                            if (cleanedPrice.includes('.') && cleanedPrice.indexOf('.') < cleanedPrice.length - 3) {
                                cleanedPrice = cleanedPrice.replace(/\./g, '');
                            }
                            currentItem.unitPrice = parseFloat(cleanedPrice);
                            currentItem.totalItemPrice = (currentItem.quantity || 1) * (currentItem.unitPrice || 0); // Hitung total item price

                            extractedItemsTemp.push(currentItem);
                            i++; // Lompat ke baris berikutnya karena sudah diproses
                            continue; // Lanjut ke iterasi berikutnya
                        }
                    }
                    // Jika tidak ada harga di baris berikutnya, tetap tambahkan item ini
                    extractedItemsTemp.push(currentItem);

                } else {
                    // FILTER BARIS YANG JELAS BUKAN ITEM, MESKI inItemsSection = true
                    // Misalnya, nomor transaksi, nama kasir, iklan, dll.
                    const isIrrelevantNoise = /(Check No|POS|Winda Apriani|Thank You|Please Come Again|Debit BCA|CLOSED|Penbel|Anda gratis)/i.test(line);
                    const isNumericOnly = /^\d+$/.test(line); // Hanya angka

                    if (!isIrrelevantNoise && !isNumericOnly && line.length > 5) { // Pastikan baris cukup panjang dan bukan hanya angka
                        // Ini bisa jadi baris yang tidak cocok pola tapi masih item (misal nama panjang)
                        // Atau bisa jadi error OCR. Perlu hati-hati.
                        // Untuk sementara, kita abaikan yang tidak cocok pola di atas,
                        // karena fokus kita adalah pada item yang memiliki QTY/Nama/Harga.
                    }
                }
            }
        }
        extractedItems = extractedItemsTemp;

        return { date: extractedDate, total: extractedTotal, items: extractedItems };
    };

    const handleAccept = () => {
        if (!resultText) return;
        const parsedData = parseReceiptText(resultText);
        Navigate.navigate("SCANRESULT", {
            rawOcrText: resultText,
            storeName: parsedData.storeName,
            extractedDate: parsedData.date,
            extractedTotal: parsedData.total,
            extractedItems: parsedData.items,
        });
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => Navigate.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {photoPath && (
          <Image source={{ uri: 'file://' + photoPath }} style={styles.image} resizeMode="contain" />
        )}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOCR} disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Memproses...' : 'Scan Struk Ini'}
            </Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />}
          {resultText && (
            <ScrollView style={styles.resultScrollView}>
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>Hasil Teks OCR:</Text>
                <Text style={styles.resultText}>{resultText}</Text>
                <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                  <Text style={{ color: 'white', fontSize: 24 }}>✔️</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', justifyContent: 'space-between' },
    backButton:{ zIndex: 10, position: 'absolute', padding: 20, backgroundColor: "rgba(248, 206, 168, 0.8)", top: 40, borderRadius: 10, left: 20 },
    backText:{ fontSize: 15, fontWeight: 'bold' },
    image:{ flex: 1, width: "100%", height: "60%" },
    bottomContainer: { padding: 20, backgroundColor: '#1c1c1c', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    button: { backgroundColor: '#F8CEA8', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { fontSize: 18, fontWeight: '600', color: '#333' },
    resultScrollView: { maxHeight: 200, marginTop: 20 },
    resultBox: { backgroundColor: '#2a2a2a', padding: 15, borderRadius: 10 },
    resultTitle: { color: '#F8CEA8', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    resultText: { color: 'white', fontSize: 14, fontFamily: 'monospace' },
    acceptButton: { position: 'absolute', bottom: 15, right: 15, padding: 15, backgroundColor: '#000000aa', borderRadius: 30 },

});

export default OcrScreen;