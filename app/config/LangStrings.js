/**
 *  @file AsyncStore.js
 *  @author Kjetil Fossheim
 *  @type {String}
 * Store of all strings used in the app.
 */
// ES6 module syntax
import AsyncStorage from 'react-native';

export default class LangStrings {

  constructor() {
    this.language = 'no';
    this.strings = {
      en:{
        keys: 'Keys',
        exit: 'Press once more for exiting the app.',
        noText: 'text is missing',
        language: 'Language / Språk',
        introText: 'An easier way of species identification',
        no: 'Norsk',
        en: 'English',
        langChoise: 'Choose your language / \n  Velg ditt språk',
        langText: 'The content of each identification key will not change at this moment, this function will be added later. / \n  Innholdet i hver identifikasjonsnøkkel vil ikke endres på dette tidspunktet, vi jobber med denne funksjonen.',
        updateDIA: 'One or more keys might need updating. Do you want to look for updates?',
        acsept: 'Yes',
        author: 'Author: ',
        ok: 'Ok',
        image: 'Images',
        distribution: 'Distribution',
        newObs: 'Save Observation',
        nObs: 'Number of observations nearby: ',
        spInfo: 'Species description',
        species: 'Species',
        coordinate: 'coordinates',
        date: 'Date',
        location: 'Location',
        noObservations: 'You don\'t have any observations registered.',
        myObs: 'My observations',
        newObsAddeed: 'New observation added',
        place: 'Place',
        county: 'County',
        cancel: 'Cancel',
        save: 'Save',
        eliminated: 'Eliminated',
        left: 'Possible remaining',
        leftNotGeo: 'Not found locally',
        leftGeo: 'Found locally',
        reset: 'Reset',
        about: 'About ArtsApp',
        keyInfo: 'Key information',
        updateLocation: 'Update Location',
        updateEx: 'Select the keys you want to update the location for.',
        noLocation: 'Could not find Location, make sure it is turned on.',
        latitude: 'Latitude',
        longitude: 'Longitude',
        selectedKeys: 'The following keys will be updated: ',
        withCoor: 'with the following coordinates:',
        curCoor: 'Get current coordinates',
        update: 'Update',
        needUpdate: 'Update available',
        updateError: 'Something went wrong, try again',
        updateUnavailable: 'It is not possible to add location to the selected key.',
        updateUnavailableError: 'Something went wrong, try again. Or it is not possible to add location to the selected key.',
        updateZeroError: 'There is no observations for the selected key in your area.',
        noNetwork: 'No network, try again.',
        disNoNetwork: 'No network, this feature is only accessible with an internet connection',
        updateSuccess: 'Nearby observations updated.',
        noKey: 'You have not chosen any keys.',
        deleteObs: 'Do you want to delete this observation?',
        deleteObsTitle: 'Delete this observation?',
        onSpLesft: 'You have only one possible left',
        zeroSpLeft: 'There is zero possible left, try changing values or start over.',
        download: 'Download',
        debugMode: 'Enable debugMode',
        debugModeOn: 'DebugMode enabled',
        enableDebug: 'DebugMode enabled by pressing ',
        enableDebug2: ' more times',
        downloading: 'Downloading, this may take some time',
        downloaded: 'Download complete',
        betaKeys: 'Beta keys',
        firstNoNett: 'You are not connected to a network. / \n In order to use ArtsApp, you will have to be online the first time using the application. / \n Du er ikke tilkoblet noe nettverk. / \n For å bruke ArtsApp, må du være online første gang du bruker applikasjonen.',
        noNetWorkTitle: 'No network / Ikke noe nettverk',
        updateKeySuccess: 'Selected keys updated.',
        updateKey: 'Update keys',
        manageKeys: 'Manage keys',
        lookForUpdate: 'Look for updates',
        noKeys: 'There are no updates available.',
        updateKeyText: 'Select the keys you want to update.',
        nationalDistrubution: 'The map shows where in Norway it is expected that the species should be observed',
        regonalDistrubution: 'The map above shows the regional distribution of the species',
        noDistrubution: 'There is no available distribution model for this species.',
        deleteKeyHeader: 'Delete key content',
        deleteKey: 'Do you want to delete the key content? \nThe key will be available for later download, but all image and data are deleted. ',
        longclick: 'Long Click on value for more info',
        goToSp: 'Go to species',
        level: 'Level: ',
        valueInfo: 'Value information',
        irelevant: 'Not applicable choices',
        noKeysDownloaded: 'There is no Keys downloaded. '
      },
      no: {
        keys: 'Nøkler',
        exit: 'Trykk en gang til for å gå ut av applikasjonen',
        noText: 'manglende tekst',
        language: 'Language / Språk',
        introText: 'Enklere artsidentifikasjon',
        no: 'Norsk',
        en: 'English',
        langChoise: 'Choose your language / \n  Velg ditt språk',
        langText: 'The content of each identification key will not change at this moment, this function will be added later. / \n  Innholdet i hver identifikasjonsnøkkel vil ikke endres på dette tidspunktet, vi jobber med denne funksjonen.',
        updateDIA: 'En eller flere nøkler kan være utdatert. Vil du se etter oppdateringer nå?',
        acsept: 'Ja',
        author: 'Forfatter: ',
        ok: 'Ok',
        image: 'Bilder',
        distribution: 'Utbredelse',
        newObs: 'Lagre observasjon',
        nObs: 'Antall observasjoner i nærheten: ',
        spInfo: 'Artsbeskrivelse',
        species: 'Art',
        date: 'Dato',
        coordinate: 'Koordinater',
        location: 'Lokalitet',
        noObservations: 'Du har ingen lagrede observasjoner',
        myObs: 'Mine observasjoner',
        newObsAddeed: 'Ny observasjon lagret',
        place: 'Lokalitet',
        county: 'Fylke',
        cancel: 'Avbryt',
        save: 'Lagre',
        eliminated: 'Eliminerte',
        left: 'Mulige gjenværende',
        leftNotGeo: 'Ikke funnet i nærheten',
        leftGeo: 'Funnet i nærheten',
        reset: 'Nullstill',
        about: 'Om ArtsApp',
        keyInfo: 'Informasjon om nøkkelen',
        updateLocation: 'Oppdater lokalitet',
        updateEx: 'Velg de nøklene du vil oppdatere lokaliteten til',
        noLocation: 'Kunne ikke finne plassering, sørg for at sted er slått på',
        updateUnavailable: 'Det er ikke mulig å legge til lokalitet for valgt nøkkel',
        updateUnavailableError: 'Noe gikk galt, prøv igjen. Eller det er ikke mulig å legge til lokalitet for valgt nøkkel',
        updateZeroError: 'Det er ingen observasjoner for den valgte nøkkelen i ditt område.',
        latitude: 'Breddegrad',
        longitude: 'Lengdegrad',
        selectedKeys: 'Følgende nøkler vil bli oppdatert: ',
        withCoor: 'med påfølgende koordinater: ',
        curCoor: 'Hent koordinater',
        updateError: 'Noe gikk galt, prøv igjen.',
        noNetwork: 'Ingen nettverk, prøv igjen.',
        disNoNetwork: 'Ingen nettverk, denne funksjonen er bare tilgjengelig med en Internett-tilkobling',
        updateSuccess: 'Nærliggende observasjoner oppdatert',
        update: 'Oppdater',
        needUpdate: 'Oppdatering tilgjengelig',
        noKey: 'Du har ikke valgt noen nøkler.',
        deleteObs: 'Vil du slette denne observasjonen?',
        deleteObsTitle: 'Slette observasjonen?',
        onSpLesft: 'Det er bare en mulig igjen.',
        zeroSpLeft: 'Det er ingen mulig igjen, prøv å endre verdier eller start på nytt.',
        download: 'Last ned',
        debugMode: 'Aktiver debugMode',
        debugModeOn: 'DebugMode aktivert',
        enableDebug: 'DebugMode slåes på ved å trykke ',
        enableDebug2: ' ganger til.',
        downloading: 'Laster ned, dette kan ta litt tid.',
        downloaded: 'Nedlasting fullført',
        betaKeys: 'Beta nøkler',
        firstNoNett: 'You are not connected to a network. \n In order to use ArtsApp, you will have to be online the first time using the application. / \n\n Du er ikke tilkoblet noe nettverk. \n For å bruke ArtsApp, må du være online første gang du bruker applikasjonen.',
        noNetWorkTitle: 'No network /\n Ikke noe nettverk',
        updateKeySuccess: 'Valgte nøkler er oppdatert.',
        updateKey: 'Oppdater nøkler',
        manageKeys: 'Administrer nøkler',
        lookForUpdate: 'Se etter oppdateringer',
        noKeys: 'Det er ingen tilgjengelig oppdateringer.',
        updateKeyText: 'Velg de nøklene du vil oppdatere.',
        nationalDistrubution: 'Kartet over viser hvor i Norge det er forventet at arten skal kunne observeres',
        regonalDistrubution: 'Kartet over viser den regionale distribusjonen til arten',
        noDistrubution: 'Det er ingen tilgjengelig utbredelsesmodel for denne arten.',
        deleteKeyHeader: 'Slett nøkkel data',
        deleteKey: 'Vil du slette nøkkelens innhold? \n Nøkkelen vil kunne lastes ned på nytt, men alle data og bilder vil bli slettet.',
        longclick: 'Klikk og hold på verdi for mer informasjon',
        goToSp: 'Gå til art',
        level: 'Nivå: ',
        valueInfo: 'Verdi informasjon',
        irelevant: 'Ikke aktuelle valg',
        noKeysDownloaded: 'Det er ikke noen nøkler nedlastet.',
      }
    };
  }

  /**
   * get strings in set language
   * @param {String} stringName name of string to be returned
   * @return {String}
   */
  getString(stringName) {
    lang = 'en';
    if (typeof this.strings[this.language] !== 'undefined') {
      return  this.strings[this.language][stringName];
    }
    return  this.strings.en[stringName];
  }

  /**
   * get strings in both languages
   * @param {String} stringName name of string to be returned
   * @return {String}
   */
  getComboString(stringName, newLine) {
    if (typeof newLine !== 'undefined') {
      return  this.strings.en[stringName] + ' / \n ' + this.strings.no[stringName];
    }
    return  this.strings.en[stringName] + ' / ' + this.strings.no[stringName];
  }

  /**
   * get all strings in set language
   * @param {String} lang set language
   * @return {Object} Object of strings in language 'lang'.
   */
  getLangStrings(lang) {
    if (typeof lang === 'undefined') {
      return this.strings.no;
    }
    return this.strings[lang];
  }
}
