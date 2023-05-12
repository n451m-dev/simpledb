import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Animated, Text } from 'react-native';
import randomColor from 'randomcolor';

const App = () => {
  const [balloon, setBalloon] = useState(null);
  const [score, setScore] = useState(0);

  // create a new balloon and set it as the current balloon
  const createBalloon = () => {
    const newBalloon = {
      id: Math.random(),
      x: Math.random() * 300, // set random x position
      y: new Animated.Value(-50), // set initial y position above the screen as an Animated value
      size: 150, // set random size
      speed: 3, // set fixed falling speed
      color: randomColor(), // set random color
    };
    setBalloon(newBalloon);
  };

  // remove the current balloon
  const removeBalloon = () => {
    setBalloon(null);
  };

  // create a new balloon every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!balloon) {
        createBalloon();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [balloon]);

  // animate the current balloon
  useEffect(() => {
    if (balloon) {
      const animation = Animated.timing(balloon.y, {
        toValue: 700, // set the target y position below the screen
        duration: balloon.speed * 1000, // set the duration based on the speed
        useNativeDriver: true,
      });
      animation.start(() => {
        removeBalloon();
        if(score>0)
        setScore(score - 5); // decrease the score by half when the balloon reaches the bottom without being touched
      });
    }
  }, [balloon, score]);

  // handle balloon touch event
  const handleBalloonTouch = () => {
    if (balloon) {
      balloon.y.stopAnimation(); // stop the current animation
      removeBalloon();
      setScore(score + 10); // increase the score by 10 when a balloon is touched
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      {balloon && (
        <TouchableOpacity onPressIn={handleBalloonTouch}>
          <Animated.View style={{ transform: [{ translateY: balloon.y }], position: 'absolute' }}>
            <Image
              source={require('./assets/balloon.png')}
              style={{ width: balloon.size, height: balloon.size, tintColor: balloon.color }}
            />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
