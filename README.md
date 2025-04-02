# 🎶 Color Music App

**Color Music App** is a cross-platform mobile application developed using TypeScript, React Native, and Expo. It integrates real-time audio capture, WebSocket communication, and dynamic LED visualization synchronized with sound frequencies.

---

## 🎯 Project Goal

To create an immersive LED control experience, where users can select static colors, activate animation modes, or enable audio-reactive visuals powered by FFT frequency data.

---

## ⚙️ Technologies Used

- **TypeScript**
- **React Native + Expo SDK 52**
- **Zustand** for state management
- **WebSocket** for communication with ESP32
- **Tailwind CSS (NativeWind)** for styling
- **Custom native module**: [`expo-audio-capture`](https://github.com/Iurocl-git/expo-audio-capture)
- **ESP32 Firmware**: [`colormusic-esp32`](https://github.com/Iurocl-git/colormusic-esp32.git)

---

## 🚀 Features

### 🎨 Manual LED Control
- Choose colors via color wheel
- Apply predefined presets
- Adjust brightness and transition speed

### 🎵 Music Mode
- Capture real-time audio (via `expo-audio-capture`)
- Convert to FFT data (low/mid/high)
- Map to lighting zones on LED strips
- Adjustable sensitivity per band

### 🌈 LED Animation Modes
- Static
- Flicker
- Rainbow
- Strobe
- Raindrop
- Zones (1, 3, 5)
- Rainbow Line

### 📡 ESP32 Integration
- Uses WebSocket/UDP to control a physical LED strip
- Custom firmware repository: [`colormusic-esp32`](https://github.com/Iurocl-git/colormusic-esp32.git)

---

## 🧩 Project Structure

```
src/
├── app/              # UI Screens (Manual, Music Mode)
├── components/       # Reusable UI components
├── constants/        # Enums for parameters & modes
├── scripts/
│   ├── AudioCapture.ts
│   └── web_socket.ts
├── store/            # Global state (Zustand)
└── App.tsx
```

---

## 🧠 Custom Native Module

This app uses a native module for capturing system audio on Android:

**Repository:** [`expo-audio-capture`](https://github.com/Iurocl-git/expo-audio-capture)

Install via GitHub in your `package.json`:
```json
"expo-audio-capture": "git+https://github.com/Iurocl-git/expo-audio-capture.git"
```

> Requires Android 10+ and `expo-dev-client`

---

## 💻 How to Run

```bash
git clone https://github.com/Iurocl-git/ColorMusic.git
cd ColorMusic
npm install
npx expo run:android
```

> Remember to accept microphone and screen recording permissions

---

## 🖼️ Adding Media

Place screenshots, screen recordings, or GIFs into a `/media` folder:

```md
## 🔥 Demo
![ColorMusic Demo](media/demo.gif)

## 📸 Screenshot
![App Screenshot](media/screenshot1.png)
```

GitHub will automatically render these if they’re committed with the repo.

---

## 🤝 Contributing

1. Fork this repository
2. Create a new feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

> ✅ Free to use, modify, and distribute **for non-commercial purposes**.
> ❌ Commercial use is **prohibited** without prior written permission.

Full license: [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)

