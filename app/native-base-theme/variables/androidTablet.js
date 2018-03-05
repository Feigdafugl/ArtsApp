
import color from 'color';

import { Platform, Dimensions, PixelRatio } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;

export default {
  platformStyle,
  platform,
    // AndroidRipple
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

    // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
    // New Variable
  badgePadding: (platform === 'ios') ? 3 : 0,

    // Button
  btnFontFamily: (platform === 'ios') ? 'System' : 'Roboto_medium',
  btnDisabledBg: '#fff',
  btnDisabledClr: '#fafafa',

    // CheckBox
  CheckboxRadius: (platform === 'ios') ? 13 : 0,
  CheckboxBorderWidth: (platform === 'ios') ? 1 : 2,
  CheckboxPaddingLeft: (platform === 'ios') ? 4 : 2,
  CheckboxPaddingBottom: (platform === 'ios') ? 0 : 5,
  CheckboxIconSize: (platform === 'ios') ? 21 : 14,
  CheckboxIconMarginTop: (platform === 'ios') ? undefined : 1,
  CheckboxFontSize: (platform === 'ios') ? (23 / 0.9) : 18,
  DefaultFontSize: 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

    // New Variable
  get defaultTextColor() {
    return this.textColor;
  },


  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return (platform === 'ios') ? this.fontSizeBase * 1.1 :
        this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },

  buttonPadding: 6,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },


    // Card
  cardDefaultBg: '#fff',


      // Color
  brandPrimary: '#3079B6',
  brandInfo: '#6D9CC2',
  brandSuccess: '#5FBB5A',
  brandDanger: '#d9534f',
  brandWarning: '#F0A00C',
  brandSidebar: '#252932',


    // Font
  fontFamily: (platform === 'ios') ? 'System' : 'Roboto',
  fontSizeBase: 30,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },


    // Footer
  footerHeight: 110,
  footerDefaultBg: '#f3f3f3',


    // FooterTab
  tabBarTextColor: '#3079B6',
  tabBarTextSize: (platform === 'ios') ? 14 : 22,
  activeTab: '#3079B6',
  sTabBarActiveTextColor: '#90CCFF',
  tabBarActiveTextColor: '#90CCFF',
  tabActiveBgColor: (platform === 'ios') ? '#3079B6' : undefined,

    // Tab
  tabDefaultBg: '#F8F8F8',
  topTabBarTextColor: '#6b6b6b',
  topTabBarActiveTextColor: '#3079B6',
  topTabActiveBgColor: (platform === 'ios') ? '#6D9CC2' : undefined,
  topTabBarBorderColor: '#F8F8F8',


    // Header
  toolbarBtnColor: '#3079B6',
  toolbarDefaultBg: '#F8F8F8',
  toolbarHeight: (platform === 'ios') ? 64 : 80,
  toolbarIconSize: (platform === 'ios') ? 20 : 44,
  toolbarSearchIconSize: (platform === 'ios') ? 20 : 23,
  toolbarInputColor: (platform === 'ios') ? '#CECDD2' : '#fff',
  searchBarHeight: (platform === 'ios') ? 30 : 40,
  toolbarInverseBg: '#222',
  toolbarTextColor: '#000',
  toolbarDefaultBorder: '#3079B6',
  get statusBarColor() {
    return color(this.toolbarDefaultBg).darken(0.2).hexString();
  },


    // Icon
  iconFamily: 'Ionicons',
  iconFontSize: (platform === 'ios') ? 24 : 56,
  iconMargin: 7,
  iconHeaderSize: (platform === 'ios') ? 33 : 56,


    // InputGroup
  inputFontSize: 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#5FBB5A',
  inputErrorBorderColor: '#ed2f2f',

  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return '#575757';
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },


    // Line Height
  btnLineHeight: 38,
  lineHeightH1: 64,
  lineHeightH2: 56,
  lineHeightH3: 44,
  iconLineHeight: (platform === 'ios') ? 37 : 60,
  lineHeight: (platform === 'ios') ? 20 : 48,


    // List
  listBorderColor: '#c9c9c9',
  listDividerBg: '#c9c9c9',
  listItemHeight: 90,
  listBtnUnderlayColor: 'rgba(0, 0, 0, 0.05)',

    // Card
  cardBorderColor: '#ccc',

    // Changed Variable
  listItemPadding: (platform === 'ios') ? 10 : 24,

  listNoteColor: '#808080',
  listNoteSize: 26,


    // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',


    // Radio Button
  radioBtnSize: (platform === 'ios') ? 25 : 46,
  radioSelectedColorAndroid: '#3079B6',

    // New Variable
  radioBtnLineHeight: (platform === 'ios') ? 29 : 48,

  radioColor: '#7e7e7e',

  get radioSelectedColor() {
    return color(this.radioColor).darken(0.2).hexString();
  },


    // Spinner
  defaultSpinnerColor: '#5FBB5A',
  inverseSpinnerColor: '#1E3B1D',


    // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 30,
  tabTextColor: '#222222',


    // Text
  textColor: '#000',
  inverseTextColor: '#fff',
  noteFontSize: 28,


    // Title
  titleFontfamily: (platform === 'ios') ? 'System' : 'Roboto_medium',
  titleFontSize: (platform === 'ios') ? 17 : 40,
  subTitleFontSize: (platform === 'ios') ? 12 : 30,
  subtitleColor: '#3079B6',

    // New Variable
  titleFontColor: '#3079B6',


    // Other
  borderRadiusBase: (platform === 'ios') ? 5 : 2,
  borderWidth: (1 / PixelRatio.getPixelSizeForLayoutSize(1)),
  contentPadding: 10,

  get darkenHeader() {
    return color(this.tabBgColor).darken(0.03).hexString();
  },

  dropdownBg: '#000',
  dropdownLinkColor: '#1E3B1D',
  inputLineHeight: 24,
  jumbotronBg: '#C9C9CE',
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

    // New Variable
  inputGroupRoundedBorderRadius: 30,
};
