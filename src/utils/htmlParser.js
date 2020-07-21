import DOMParser from 'react-native-html-parser';
const parser = new DOMParser.DOMParser();

export default function htmlParser(html) {
  const parsed = parser.parseFromString(html, 'text/html');

  return parsed;
}