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
}

const parameters = {
  // Параметры управления LED
  [enumParameters.Brightness]: { name: "Яркость", min: 0, max: 200 },
  [enumParameters.ChangeSpeed]: {
    name: "Скорость смены цвета",
    min: 0,
    max: 300,
  },
  [enumParameters.FlickerSpeed]: {
    name: "Частота затухания",
    min: 0,
    max: 200,
  },
  [enumParameters.RainbowSpeed]: {
    name: "Скорость перемещения радуги",
    min: 0,
    max: 200,
  },
  [enumParameters.WaveWidth]: { name: "Ширина радуги", min: 0, max: 300 },
  [enumParameters.StrobeFrequency]: {
    name: "Частота стробоскопа",
    min: 0,
    max: 200,
  },

  // Параметры звука
  [enumParameters.Sensitivity]: {
    name: "Чувствительность звука",
    min: 50,
    max: 150,
  },
  [enumParameters.PulseDecay]: {
    name: "Затухание (Pulse Decay)",
    min: 0,
    max: 100,
  },
  [enumParameters.LedStart]: { name: "Начало ленты", min: 0, max: 150 },
  [enumParameters.SensitivityLOW]: {
    name: "Чувствительность LOW",
    min: 50,
    max: 150,
  },
  [enumParameters.SensitivityMID]: {
    name: "Чувствительность MID",
    min: 50,
    max: 150,
  },
  [enumParameters.SensitivityHIGH]: {
    name: "Чувствительность HIGH",
    min: 50,
    max: 150,
  },
};

export { parameters, enumParameters };
