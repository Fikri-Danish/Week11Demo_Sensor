import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import { SafeAreaProvider, initialWindowMetrics, SafeAreaView } from 'react-native-safe-area-context';
//Import expo-sensors
import { Accelerometer, Gyroscope, Magnetometer, Barometer} from 'expo-sensors';
import { Audio } from 'expo-av';

export default function App() {
  const [{x, y, z}, setAccData] = useState({x:0, y:0, z:0});
  const [{ x: gx, y: gy, z: gz }, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [{ x: mx, y: my, z: mz }, setMagData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription5, setSubscription5] = useState(null);
  const [{pressure, relativeAltitude}, setBaroData] = useState({pressure:0, relativeAltitude:0});
  const [mySound, setMySound] = useState();

  const toggleListener = () => {
    subscription5 ? unsubscribe() : subscribe();
  };

  const subscribe = () => {
    setSubscription5(Barometer.addListener(setBaroData));
  };

  const unsubscribe = () => {
    subscription5 && subscription5.remove();
    setSubscription5(null);
  };


  async function playSound() {
    const soundfile = require('./short1.wav');
    const { sound } = await Audio.Sound.createAsync(soundfile);
    setMySound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
      const subscription = Accelerometer.addListener(setAccData);
      Gyroscope.setUpdateInterval(100);
      const subscription2 = Gyroscope.addListener(setGyroData);
      Magnetometer.setUpdateInterval(500);
      const subscription3 = Magnetometer.addListener(setMagData);
      Barometer.setUpdateInterval(100);
      const subscription4 = Barometer.addListener(setBaroData);

      return () => {
        subscription.remove();
        subscription2.remove();
        subscription3.remove();
        subscription4.remove();
      };
    }
    ,[]);

  useEffect(() => {
    return mySound
      ? () => {
        console.log('Unloading Sound');
        mySound.unloadAsync();
      }
      : undefined;
  }, [mySound]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView>
        <StatusBar hidden={true} />
        <Text>Accelerometer</Text>
        <Text>x: {x}</Text>
        <Text>y: {y}</Text>
        <Text>z: {z}</Text>

        <Text>Gryoscope</Text>
        <Text>x: {gx}</Text>
        <Text>y: {gy}</Text>
        <Text>z: {gz}</Text>

        <Text>Magnetometer</Text>
        <Text>x: {mx}</Text>
        <Text>y: {my}</Text>
        <Text>z: {mz}</Text>

        <Text>Barometer: Listener {subscription5 ? 'ACTIVE' : 'INACTIVE'}</Text>
        <TouchableOpacity onPress={toggleListener} style={styles.button}>
          <Text>Toggle listener</Text>
        </TouchableOpacity>
        <Text>Pressure: {pressure}</Text>
        <Text>Relative Altitude: {relativeAltitude}</Text>

        <Button title="Play Sound" onPress={()=>{
          playSound();
        }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 15,
  },
})