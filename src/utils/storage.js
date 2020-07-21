// import { AsyncStorage } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

const FB = 'FAVORITE_BOARD';

// export function createFB() {
export const createFB = async () => {
    console.log('createFB')
    getStorage(FB, 
        (result) => {
            try {
                if (result !== null) {
                  // We have data!!
                  console.log('FB data: ' + result)
                } else {
                  AsyncStorage.setItem( 
                    FB, '{board:[]}'
                  );
                  console.log('FB created')
                }
              } catch (error) {
                // Error retrieving data
                console.log('createFB error: ' + error);
              }
        }
    )
}

export const AddFB = async ({item}) => {
    const value = {
        boardName : item.row.boardName,
        narration : item.row.narration,
        path : item.row.path
    }

    getStorage(FB, (result) => {
        try {
            if (result !== null) {
                let detail = JSON.parse(result)
                detail.board.push(value)
                AsyncStorage.setItem(
                    FB, JSON.stringify(detail)
                )
            } else {
                let detail = {board:[]}
                detail.board.push(value)
                AsyncStorage.setItem(
                    FB, JSON.stringify(detail)
                );
            }
        } catch (error) {
            // Error saving data
            console.log('async storage setitem error: ' + error)
        }
    })
}

export const getFB = async (callback) => {
    console.log('getFB')
    getStorage(FB, callback)
}

export const removeFB = async ({item}, callback) => {
    getStorage(FB, (result) => {
        try {
            if (result !== null) {
                let detail = JSON.parse(result)
                delete detail.board[item.key]
                detail.board = detail.board.sort()
                detail.board.pop()
                AsyncStorage.setItem(
                    FB, JSON.stringify(detail)
                )
                callback()
            } 
        } catch (error) {
            // Error saving data
            console.log('async storage setitem error: ' + error)
        }
    })
}

export const clearAll = async () => {
    console.log('clearAll')
    try {
        AsyncStorage.clear(
            (error) => {
                console.log('clear error: ', + error)
            }
        )
    }catch (error) {
        // Error retrieving data
        console.log(error);
    }
}

const getStorage = async (key, callback) => {
    console.log('getStorage: ' + key)
    try {
        const value = await AsyncStorage.getItem(FB);
        callback(value)
      } catch (error) {
        // Error retrieving data
        console.log('getStorage error: ' + error);
      }
}