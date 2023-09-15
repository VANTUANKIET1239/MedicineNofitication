import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'medicine-z',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "GoogleAuth":{
        "scopes":["profile","email"],
        "serverClientId": "328359127603-mq86l3909h5sft95nesfsqa7oful1063.apps.googleusercontent.com",
        "forceCodeForRefreshToken": true
    }
  }
};

export default config;
