module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Hanya daftarkan plugin yang TIDAK termasuk dalam preset default.
    // Untuk proyek modern, biasanya hanya reanimated.
    'react-native-reanimated/plugin', // Pastikan ini selalu di paling bawah
  ],
};