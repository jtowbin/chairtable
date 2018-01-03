/**
 * App's global styles
 */
import {StyleSheet} from 'react-native';

module.exports = StyleSheet.create({

registerContainer: {
  flex: 1,
  justifyContent: 'center',
  width: 315
},
registerLabelText: {
  marginBottom: 20,
  fontFamily: 'Avenir-Heavy',
  fontSize: 16
},
inputContainer : {
  flexDirection: 'row',
  alignItems: 'center',
  height: 64,
  backgroundColor: '#FBFAFF'
},
inputIcon : {
  position: 'absolute',
  zIndex: 1,
  left: 22,
  width: 13,
  height: 14
},
inputText : {
  flex: 1,
  marginRight: 22,
  paddingLeft: 44 + 13,
  height: 64,
  color: '#5F5D70',
  fontFamily: 'Avenir-Heavy'
},

});