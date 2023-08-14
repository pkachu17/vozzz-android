import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Storage } from "@capacitor/storage";

//function to convert text to speech
export const textToSpeech = async (text: any) => {
  await TextToSpeech.speak({
    text: text,
    lang: "en-US",
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    category: "ambient",
  });
};

//function to check if the user has already logged in
export const checkLogin = async () => {
  const { value } = await Storage.get({ key: "userID" });
  return value;
};

//function to get base64 encoding from url
export const getBase64FromUrl = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return blob;
};