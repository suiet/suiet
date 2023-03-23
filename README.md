<a href="https://suiet.app"><p align="center">
<img width="480" src="./assets/LogoWithSlogen.png?raw=trueg"/>
</a>

# Suiet, the wallet designed for everyone

> If you want to know how to **install/use** suiet, please visit our offical website [suiet.app](https://suiet.app) or [docs](https://suiet.app/docs)

> **Warning**
> Suiet is current on devnet, we may make break changes before the mainnet of [Sui](sui.io) goes online.

## 🚀 Getting Started

### ⚙️ Prepare the enviroment

1. Make sure you have [nodejs](https://nodejs.org/en/download/) install with [npm](https://docs.npmjs.com/)
2. Clone the suiet main repo

```bash
git clone git@github.com:suiet/suiet.git
```

3. Install the dependencies

```bash
npm install
```

### 🏁 Run app in your browser

Run the following command at the root path of the project

```bash
npm start
```

Then load the extension dist folder `packages/chrome/dist` in Chrome [#detail](https://developer.chrome.com/docs/extensions/mv3/faq/#:~:text=You%20can%20start%20by%20turning,a%20packaged%20extension%2C%20and%20more.)

And you can use the app in your chrome under development mode.

## 🚀 Getting Started (App)

### ⚙️ Prepare the enviroment (App)

First you need to prepare the enviroment for the Chrome Ext, please follow the [Getting Started](#🚀-getting-started) section.

Addtionally, you need to install the dependencies for the app workspace:

> We did not use monorepo for the app workspace (packages/expo) to workaround React Native build, so you need to install the dependencies manually.

```bash
cd packages/expo
npm install
```

### Get development build of the app

You need a development build to run the app in your phone.

We have setup a automatic build in GitHub Actions, you can download the latest build in GitHub Actions page. After you get `.ipa` and `.apk` file in the artifacts, you need to install the app in your phone.

No additional steps is needed for Android to install the `.apk`. But for iOS, you must be a member of Suiet Team to install the `.ipa` because it is accociated with a developer account and certain devices, sorry for the inconvenience.

### (Optional) Build the app yourself

This is an optional step, you can skip this step if you are able to use the automatic build. But if you want to proceed, it is easy to do so because this project is based on [Expo](https://expo.io/).

You need to setup a development environment for Expo, please follow the [Expo documentation](https://docs.expo.io/get-started/installation/).

After you setup the environment, you can build the app with the following command:

```bash
# build for android
$ eas build -p android --local --profile=development
# or for ios
$ eas build -p ios --local --profile=development
```

### 🏁 Run app in your phone

After you get the development build, you can run the app in your phone. Start the development server with the following command:

```bash
cd packages/expo
npm run start
```

Then you can scan the QR code in the terminal with your phone camera.

### 👨‍💻👩‍💻 Develop the app

You can use previous development builds until you add / change native packages. Changes to the JavaScript / TypeScript code will take effect immediately. The develop experience is similar to React Native.

Before you commit your changes, you should test the app on both Android and iOS.
