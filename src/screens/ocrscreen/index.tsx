import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState} from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList, ItemDetail } from '../../navigation/types';
import { recognizeReceiptText } from '../../utils/ocrUtils';


const OcrScreen = () => {
    const Navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const {photoPath} = route.params as {photoPath: string};

    const [isLoading, setIsLoading] = useState(false);
    const [ocrError, setOcrError] = useState<string | null>(null);
    const [rawOcrText, setRawOcrText] = useState<string>(''); //teks OCR mentah

    // State untuk data yang sudah diekstrak
    const [extractedDate, setExtractedDate] = useState<string>('');
    const [extractedTotal, setExtractedTotal] = useState<string>('');
    const [extractedItems, setExtractedItems] = useState<ItemDetail[]>([]);


     const extractDataFromReceipt = (text: string) => {
        let extractedDate = '';
        let extractedTotal = '';
        let extractedItems: ItemDetail[] = [];

        const lines = text.split('\n');

        // --- Ekstraksi Total ---
        const moneyPatternPure = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/g; 

        let bestTotalCandidateValue: number = 0; 
        let bestTotalCandidateRaw: string = ''; 

        //Keyword
        const totalKeywords = ["total", "subtotal", "amount due", "grand total", "jumlah"]; 
        const negativeTotalKeywords = [
            "kembalian", "discount", "diskon", "hemat", "bayar", "tunai", "dpp", "ppn", "pajak", "voucher",
            "debit bca", "credit card", "cash", "cashier", "thank you", "please come again", "closed",
            "tuna i", "tuna i :" // Tambahkan variasi OCR error jika perlu, seperti "tunai :"
        ];

        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            const lowerCaseLine = line.toLowerCase();

            // Check for negative keywords
            const containsNegativeKeyword = negativeTotalKeywords.some(keyword => lowerCaseLine.includes(keyword)); 
            const containsValidTotalKeyword = totalKeywords.some(keyword => lowerCaseLine.includes(keyword)); 
            
            console.log(`[Total Extraction] Processing Line ${i}: "${line}"`);
            console.log(`  -> Lowercased: "${lowerCaseLine}"`);
            console.log(`  -> Contains Negative Keyword: ${containsNegativeKeyword}`);
            console.log(`  -> Contains Valid Total Keyword: ${containsValidTotalKeyword}`);
            console.log(`  -> Will Skip: ${containsNegativeKeyword && !containsValidTotalKeyword}`);

            if (containsNegativeKeyword && !containsValidTotalKeyword) {
                console.log(`  -> SKIPPING line ${i} due to negative keyword.`);
                continue; // Skip this line entirely
            }

            // Bagian ini akan mencari angka di baris yang TIDAK dilewati oleh filter di atas
            const lineMoneyMatches = [...line.matchAll(moneyPatternPure)];

            if (lineMoneyMatches.length === 0) {
                continue;
            }

            const numbersInLine = lineMoneyMatches.map(m => {
                let rawNum = m[1];
                rawNum = rawNum.replace(/,/g, ''); 
                if (rawNum.includes('.') && rawNum.indexOf('.') < rawNum.length - 3) {
                    rawNum = rawNum.replace(/\./g, '');
                } else if (rawNum.includes(',')) {
                    rawNum = rawNum.replace(/,/g, '.');
                }
                return parseFloat(rawNum);
            }).filter(n => !isNaN(n) && n > 0); 

            if (numbersInLine.length > 0) {
                const largestInLine = Math.max(...numbersInLine);

                if (containsValidTotalKeyword) { // Baris ini mengandung kata kunci total yang valid
                    if (largestInLine > bestTotalCandidateValue) {
                        bestTotalCandidateValue = largestInLine;
                        bestTotalCandidateRaw = largestInLine.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        // Opsional: break jika total sangat kuat
                        // if ((lowerCaseLine.includes("total") || lowerCaseLine.includes("grand total")) && largestInLine >= 10000) break;
                    }
                } else if (i >= lines.length - 7) { // 7 baris terakhir, tidak ada keyword total valid
                    if (largestInLine > bestTotalCandidateValue && largestInLine >= 1000) { 
                        bestTotalCandidateValue = largestInLine;
                        bestTotalCandidateRaw = largestInLine.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                }
            }
        }
        extractedTotal = bestTotalCandidateRaw;

        // --- Ekstraksi Tanggal ---
        const fullDateRegex = /\b(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4}\s+\d{1,2}:\d{2}:\d{2})\b/i;
        const numericDateRegex = /\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\b/;

        let dateMatch = text.match(fullDateRegex);
        if (dateMatch && dateMatch[1]) {
            extractedDate = dateMatch[1];
        } else {
            dateMatch = text.match(numericDateRegex);
            if (dateMatch && dateMatch[1]) {
                extractedDate = dateMatch[1];
            } else {
                extractedDate = '';
            }
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


  useEffect(() => {
        const performOcrAndPostProcessing = async () => {
            if (!photoPath) {
                setOcrError("Tidak ada foto untuk diproses.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setOcrError(null);
            try {
                // LANGKAH 1: Lakukan OCR untuk mendapatkan teks mentah
                const mlKitResult = await recognizeReceiptText(photoPath);
                setRawOcrText(mlKitResult);

                // LANGKAH 2: Lakukan Post-Processing (ekstraksi data) dari teks mentah
                const { date, total, items } = extractDataFromReceipt(mlKitResult);

                // LANGKAH 3: Set state lokal untuk tampilan preview di OcrScreen (opsional, jika Anda ingin user melihat preview dulu)
                setExtractedDate(date);
                setExtractedTotal(total);
                setExtractedItems(items);

                // LANGKAH 4: Navigasi ke SCANRESULT dengan semua data yang sudah diekstrak
                Navigate.navigate('SCANRESULT', {
                    rawOcrText: mlKitResult || '', 
                    extractedDate: date || '',     
                    extractedTotal: total || '',
                    extractedItems: items || [],
                });

            } catch (error) {
                console.error('Error during OCR or post-processing:', error);
                setOcrError(`Gagal memproses gambar: ${(error as Error).message}`);
            } finally {
                setIsLoading(false);
            }
        };

        performOcrAndPostProcessing();
    }, [photoPath]); // Jalankan efek ini saat photoPath berubah


    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => Navigate.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {photoPath && (
          <Image
            source={{ uri: 'file://' + photoPath }}
            style={styles.image}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backButton:{
        zIndex: 10,
        position: 'absolute',
        padding: 20,
        backgroundColor: "#F8CEA8",
        top: 20,
        borderRadius: 10,
        left: 20,
    },
    backText:{
        fontSize: 15
    },
    image:{
        flex:1,
        width: "100%",
    },
    button: {
        backgroundColor: '#F8CEA8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    resultBox: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    resultText: {
        color: 'white',
        fontSize: 14,
    },
    acceptButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        alignSelf: 'center',
        padding: 20,
        backgroundColor: '#000000aa',
        borderRadius: 40,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    },
    overlayText: {
        color: 'white',
        marginTop: 10,
        fontSize: 18,
        textAlign: 'center',
    },
    errorTextOverlay: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#F8CEA8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    resultDisplayBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%', // Batasi tinggi box hasil
        zIndex: 50,
    },
    resultDisplayTextTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultDisplayTextScroll: {
        maxHeight: 150, // Tinggi scrollable area untuk teks mentah
    },
    resultDisplayText: {
        color: '#eee',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    extractedSummary: {
        color: '#F8CEA8', // Warna cerah untuk summary
        fontSize: 16,
        marginTop: 15,
        fontWeight: 'bold',
    },
    useResultButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    useResultButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default OcrScreen;