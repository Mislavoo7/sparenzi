import {HR} from '../locales/hr.json';
import {EN} from '../locales/en.json';
import {DE} from '../locales/de.json';
import config from './config';

export function t(keys) {
  //let language = global.language; 
  //let language = config.locale; 
  let language = config.locale;
  if (global.language) {
    language = global.language.toUpperCase() || config.locale; 
  }

  const allLanguages = {HR, EN, DE};
  let keysAsArray = keys.split(".");

  // translatedString is a string that user can see
  let translatedString = digInObj(allLanguages[language], keysAsArray);

  return translatedString;
}

function digInObj(obj, keysAsArray) {
  var currentKey = keysAsArray.shift();
  let remainingKeys = keysAsArray;

  if (remainingKeys.length > 0) {
    // if the result of this iteration is obj
    // and there are more remainingKeys to seek in 
    // repeat!
    return digInObj(obj[currentKey], remainingKeys)
  } else {
    // when there are no more remainingKeys the 
    // result should be a string
    return obj[currentKey]
  }
}


const languages = [
  { code: 'en', label: 'English' },
  { code: 'hr', label: 'Hrvatski' },
  { code: 'de', label: 'Deutsch' }
];

export default languages;
