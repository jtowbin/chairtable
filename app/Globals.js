/**
 * App's global constant values
 */

module.exports = {
  /**
   * Keys used for local storage
   */
  STORAGE_KEY_TUTORIAL_IS_VIEWED: 'tutorial_is_viewed',
  STORAGE_KEY_LOGGED_IN: 'logged_in',

  /**
   * Database tables
   */
  FIREBASE_TBL_DISPLAYS: 'user_displays',
  FIREBASE_TBL_REVIEWS: 'user_reviews',
  FIREBASE_TBL_USERS: 'users',
  FIREBASE_TBL_USERS_FAVORITES: 'favorites',
  FIREBASE_TBL_DISPLAYS_LOCATIONS: 'user_displays_locations',
  
  /**
   * Acess tokens
   */
  MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoiZnJpZmViIiwiYSI6ImNqYXR6NWZrZDFybTQyd3BoeTkzdnZiOWUifQ.3VEaucL01Hj4Lf7nHAwJgw',

  /**
   * Settings
   */
  REVIEW_MAX_CHAR_LENGTH: 200,
  MAP_DEFAULT_ZOOM_LEVEL: 12,
  MAP_MIN_ZOOM_LEVEL : 8,
  MAP_MAX_ZOOM_LEVEL : 18,

  /**
   * Strings
   */
  TEXT_DISPLAY_ADD_TITLE_REQUIRED: 'Please fill in display\'s title.',
  TEXT_DISPLAY_ADD_IMAGES_REQUIRED : 'Please upload at least one image.',
  TEXT_LOGIN_EMAIL_REQUIRED : 'Please enter the email address.',
  TEXT_LOGIN_EMAIL_INVALID : 'The email address is invalid.',
  TEXT_LOGIN_PASSWORD_REQUIRED : 'Please enter the password.',
  TEXT_LOGIN_ACCOUNT_DISABLED : 'Your account is disabled.',
  TEXT_LOGIN_ACCOUNT_NOT_FOUND : 'The login credentials you provided are invalid.',
  TEXT_REGISTER_USER_ALREADY_EXISTS : 'You already have an account. Please login.',
  TEXT_REGISTER_EMAIL_ALREADY_USED_WITH_PASSWORD : 'You already created an account using this email.',
  TEXT_REGISTER_EMAIL_ALREADY_USED_FOR_FACEBOOK : 'Your email address was already used to login using Facebook. Before setting up your password, you have to login using your Facebook account.',
  TEXT_REGISTER_FIRST_NAME_REQUIRED : 'Please enter your first name.',
  TEXT_REGISTER_LAST_NAME_REQUIRED : 'Please enter your last name.',
  TEXT_REGISTER_BIRTHDATE_REQUIRED : 'Please choose your birthdate.',
  TEXT_REGISTER_PASSWORD_TOO_SHORT : 'The password should be at least 6 characters long.',
  TEXT_REGISTER_PASSWORDS_DIFFERENT : 'The passwords don\'t match.',
};
