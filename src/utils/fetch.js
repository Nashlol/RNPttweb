import DOMParser from 'react-native-html-parser';

export async function getPttHotBoardList() {
    try {
      const response =  fetch('https://www.ptt.cc/bbs/index.html');
      const html = response.text();
      const parser = new DOMParser.DOMParser();
      const parsed = parser.parseFromString(html, 'text/html');
      const boardList = parsed.getElementsByClassName('b-ent');
      console.log("boardList length: " + boardList.length);
      return boardList;
    }
    catch (error) {
      console.error(error);
    }
  }