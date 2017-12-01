import Globals from './Globals.js';

export async function markTutorialAsViewed() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TUTORIAL_IS_VIEWED, '1');
  } catch (error) {
    // Error saving data
  }
}

export async function tutorialIsViewed() {
  let tutorialIsViewed = false;

  try {
    const value = await AsyncStorage.getItem(GLOBAL.STORAGE_KEY_TUTORIAL_IS_VIEWED);

    if (value !== null){
      tutorialIsViewed = true;
    }
  } catch (error) {
    console.log('Could not retrieve tutorial_is_viewed value');
  }

  return tutorialIsViewed;
}
