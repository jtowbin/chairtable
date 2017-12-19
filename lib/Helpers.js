Object.defineProperty(exports,"__esModule",{value:true});exports.markTutorialAsViewed=markTutorialAsViewed;exports.tutorialIsViewed=tutorialIsViewed;exports.fbAuth=fbAuth;var _reactNative=require('react-native');var _Globals=require('./Globals.js');var _Globals2=_interopRequireDefault(_Globals);var _reactNativeFbsdk=require('react-native-fbsdk');var _reactNativeFbsdk2=_interopRequireDefault(_reactNativeFbsdk);var _reactNativeFirebase=require('react-native-firebase');var _reactNativeFirebase2=_interopRequireDefault(_reactNativeFirebase);var _reactNativeRouterFlux=require('react-native-router-flux');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function markTutorialAsViewed(){return regeneratorRuntime.async(function markTutorialAsViewed$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;_context.next=3;return regeneratorRuntime.awrap(_reactNative.AsyncStorage.setItem(STORAGE_KEY_TUTORIAL_IS_VIEWED,'1'));case 3:_context.next=7;break;case 5:_context.prev=5;_context.t0=_context['catch'](0);case 7:case'end':return _context.stop();}}},null,this,[[0,5]]);}function tutorialIsViewed(){var tutorialIsViewed,value;return regeneratorRuntime.async(function tutorialIsViewed$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:tutorialIsViewed=false;_context2.prev=1;_context2.next=4;return regeneratorRuntime.awrap(_reactNative.AsyncStorage.getItem(GLOBAL.STORAGE_KEY_TUTORIAL_IS_VIEWED));case 4:value=_context2.sent;if(value!==null){tutorialIsViewed=true;}_context2.next=11;break;case 8:_context2.prev=8;_context2.t0=_context2['catch'](1);console.log('Could not retrieve tutorial_is_viewed value');case 11:return _context2.abrupt('return',tutorialIsViewed);case 12:case'end':return _context2.stop();}}},null,this,[[1,8]]);}function fbAuth(){_reactNativeFbsdk.LoginManager.logInWithReadPermissions(['public_profile','email']).then(function(result){if(result.isCancelled){console.log('Login was cancelled');}else{_reactNativeFbsdk.AccessToken.getCurrentAccessToken().then(function(accessTokenData){var credential=_reactNativeFirebase2.default.auth.FacebookAuthProvider.credential(accessTokenData.accessToken);_reactNativeFirebase2.default.auth().signInWithCredential(credential).then(function(result){var responseDataCallback=function responseDataCallback(error,result){if(error){console.log(error);}else{_reactNativeFirebase2.default.database().ref('users/'+result.id).set({email:result.email,first_name:result.first_name,last_name:result.last_name,profile_picture:result.picture.data.url});_reactNative.AsyncStorage.setItem(_Globals2.default.STORAGE_KEY_TUTORIAL_IS_VIEWED,"1");_reactNative.AsyncStorage.setItem(_Globals2.default.STORAGE_KEY_LOGGED_IN,"1");return _reactNativeRouterFlux.Actions.main({type:'reset'});}};var dataRequest=new _reactNativeFbsdk.GraphRequest('/me',{accessToken:accessTokenData.accessToken.toString(),parameters:{fields:{string:'id, first_name, last_name, email, picture'}}},responseDataCallback);new _reactNativeFbsdk.GraphRequestManager().addRequest(dataRequest).start();},function(error){console.log(error);});});}},function(error){console.log('Some error occured:'+error);});}