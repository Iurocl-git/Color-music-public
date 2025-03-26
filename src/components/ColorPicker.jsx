import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: '#ffffff',
      swatchesOnly: false,
      swatchesLast: true,
      swatchesEnabled: true,
      disc: true,
    };
    this.picker = React.createRef();
  }

  onColorChange = (color) => {
    this.setState({ currentColor: color });
  };

  onColorChangeComplete = (color) => {
    console.log('Color change complete:', color);
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ColorPicker
          ref={(ref) => {
            this.picker = ref;
          }}
          color={this.state.currentColor}
          swatchesOnly={this.state.swatchesOnly}
          onColorChange={this.onColorChange}
          onColorChangeComplete={this.onColorChangeComplete}
          thumbSize={40}
          sliderSize={40}
          noSnap
          row={false}
          swatchesLast={this.state.swatchesLast}
          swatches={this.state.swatchesEnabled}
          discrete={this.state.disc}
        />
      </View>
    );
  }
}

export default App;
