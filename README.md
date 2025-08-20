
# Waste Scanner

## Description
**Waste Scanner** is a cross-platform app for the [Waste Classification Project](https://github.com/weiss25r/Waste-Classification.git). It consists in a simple front-end to let the user predicting the category of a waste from an image using a Deep Learning model hosted on a server.Users can either pick an image from their device or take a photo directly with the camera, and the app will predict the corresponding waste category which can be:
- plastic
- glass
- metal
- paper
- cardboard
- trash

The app was written using **React Native and Expo** and thus can run on web, Android and iOS. 

## Execution
1. Install dependencies

   ```bash
   npm install
   ```

2. Copy  ```config-example.js ```, rename it as  ```config.js ``` and set your server IP in the API_URL field.

3. Start the app

   ```bash
   npx expo start
   ```

4. Start the API on the server as described in [Waste Classification Project](https://github.com/weiss25r/Waste-Classification.git)

To run the app on mobile devices, you can use [Expo Go](https://expo.dev/go) or make a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

# Tech stack
- **Frontend:** React Native, Expo  
- **Backend:** FastAPI  
- **Model:** MobileNetV3 Large

## Tested environment
The app was tested on Android and Web, using a **Raspberry Pi 4** as server for prediction. 

## Screenshots
| <img src="./docs/screenshots/1.jpg" width="500"/> | <img src="./docs/screenshots/2.jpg" width="500"/> |
|---------------------------------------------------|---------------------------------------------------|
| <img src="./docs/screenshots/3.jpg" width="500"/> | <img src="./docs/screenshots/4.jpg" width="500"/> |

