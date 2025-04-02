const enum enumParameters {
  // Параметры управления LED
  Brightness = 7,
  ChangeSpeed = 1,
  FlickerSpeed = 5,
  RainbowSpeed = 3,
  WaveWidth = 4,
  StrobeFrequency = 6,

  // Параметры звука
  Sensitivity = 0,
  PulseDecay = 2,
  LedStart = 8,
  SensitivityLOW = 9,
  SensitivityMID = 10,
  SensitivityHIGH = 11,

  // Drops
  MaxDrops = 12,
  DropSpeed = 13,
  DropInterval = 14,
  CenterZone = 15,
  DropWidth = 16,
  FadeStyle = 17,
  AudioTrashHold = 18,
}

const parameters = {
  // LED Control Parameters
  [enumParameters.Brightness]: { name: "Brightness", min: 0, max: 200 },
  [enumParameters.ChangeSpeed]: {
    name: "Color Change Speed", // Speed at which colors transition
    min: 0,
    max: 300,
  },
  [enumParameters.FlickerSpeed]: {
    name: "Fade Speed", // How quickly LEDs fade in/out (often related to flicker effects)
    min: 0,
    max: 200,
  },
  [enumParameters.RainbowSpeed]: {
    name: "Rainbow Speed", // Speed of the rainbow effect movement
    min: 0,
    max: 200,
  },
  [enumParameters.WaveWidth]: { name: "Rainbow Width", min: 0, max: 300 }, // Width of the rainbow wave
  [enumParameters.StrobeFrequency]: {
    name: "Strobe Frequency", // Frequency of the strobe effect
    min: 0,
    max: 200,
  },

  // Audio Parameters
  [enumParameters.Sensitivity]: {
    name: "Audio Sensitivity", // General sensitivity to sound input
    min: 50,
    max: 150,
  },
  [enumParameters.PulseDecay]: {
    name: "Pulse Decay", // How quickly the light effect decays after a sound pulse
    min: 0,
    max: 100,
  },
  [enumParameters.LedStart]: { name: "LED Strip Start", min: 0, max: 150 }, // Starting point on the LED strip
  [enumParameters.SensitivityLOW]: {
    name: "Sensitivity LOW", // Sensitivity for low frequencies
    min: 50,
    max: 150,
  },
  [enumParameters.SensitivityMID]: {
    name: "Sensitivity MID", // Sensitivity for mid frequencies
    min: 50,
    max: 150,
  },
  [enumParameters.SensitivityHIGH]: {
    name: "Sensitivity HIGH", // Sensitivity for high frequencies
    min: 50,
    max: 150,
  },
  [enumParameters.MaxDrops]: {
    name: 'Max Drops', // Maximum number of concurrent 'raindrops'
    min: 1,
    max: 30,
  },
  [enumParameters.DropSpeed]: {
    name: 'Drop Speed', // Speed at which 'raindrops' fall
    min: 0.01,
    max: 1,
  },
  [enumParameters.DropInterval]: {
    name: 'Drop Interval (ms)', // Time between new 'raindrops' appearing
    min: 10,
    max: 1000,
  },
  [enumParameters.CenterZone]: {
    name: 'Center Zone', // Size or influence of the central zone
    min: 0,
    max: 100,
  },
  [enumParameters.DropWidth]: {
    name: 'Drop Length', // Length/size of each 'raindrop'
    min: 1,
    max: 20,
  },
  [enumParameters.FadeStyle]: {
    name: 'Fade Style', // The curve/style used for fading effects
    options: [
      { id: 0, name: 'Linear' },      // Linear fade
      { id: 1, name: 'Quadratic' },   // Squared/Quadratic fade curve
      { id: 2, name: 'Square Root' }, // Square root fade curve
    ],
  },
  [enumParameters.AudioTrashHold]: { // Note: Likely a typo, should be "Threshold"
    name: 'Audio Threshold', // Minimum audio level to trigger an effect
    min: 1,
    max: 4000, // This max value seems high for a typical threshold, ensure it's correct
  },
};

export { parameters, enumParameters };
