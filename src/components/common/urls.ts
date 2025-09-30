const LIVE = false;

const SITEURL = 'https://bookadzonebackend.onrender.com/';
const LIVEURL = LIVE ? SITEURL : 'http://localhost:5000/';
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = '68ad8844bfdf0cec7f623bc2';




const API = {
  // Agency endpoints
  addAgency: `${ROOTURL}agencies/`,
  listAgency: `${ROOTURL}agencies/`,
  getAgency: `${ROOTURL}agencies/`, // Usage: getAgency + id
  updateAgency: `${ROOTURL}agencies/`, // Usage: updateAgency + id
  deleteAgency: `${ROOTURL}agencies/softDelete/`, // Usage: deleteAgency + id
  toggleStatusAgency: `${ROOTURL}agencies/toggleStatus/`, // Usage: toggleStatusAgency + id
  trashAgencyList: `${ROOTURL}agencies/trash`,
  restoreAgency: `${ROOTURL}agencies/restore/`, // Usage: restoreAgency + id
  permanentDeleteAgency: `${ROOTURL}agencies/permanentDelete/`, // Usage: permanentDeleteAgency + id

  // FAQ endpoints
  addfaq: `${ROOTURL}faqs/`,
  listfaq: `${ROOTURL}faqs/`,
  getFaq: `${ROOTURL}faqs/getFaqById/`,
  updatefaq: `${ROOTURL}faqs/updateFaq/`,
  deletefaq: `${ROOTURL}faqs/softDeleteFaq/`,
  toggleStatusfaq: `${ROOTURL}faqs/togglestatus/`,
  trashfaqlist: `${ROOTURL}faqs/trash`,
  restorefaq: `${ROOTURL}faqs/restore/`,
  permanentDeletefaq: `${ROOTURL}faqs/permanentDelete/`,
  
    // NewsLetter endpoints
  addNewsLetter: `${ROOTURL}newsletters/`,
  listNewsLetter: `${ROOTURL}newsLetters/`,
  getNewsLetter: `${ROOTURL}newsletters/getNewsLetterById/`,
  updateNewsLetter: `${ROOTURL}newsletters/updateNewsLetter/`,
  deleteNewsLetter: `${ROOTURL}newsletters/softDeleteNewsLetter/`,
  toggleStatusNewsLetter: `${ROOTURL}newsletters/togglestatus/`,
  trashNewsLetterList: `${ROOTURL}newsletters/trash`,
  restoreNewsLetter: `${ROOTURL}newsletters/restore/`,
  permanentDeleteNewsLetter: `${ROOTURL}newsletters/permanentDelete/`,

// Footer endpoints
  addfooterinfo: `${ROOTURL}footerinfo/`,
  listfooterinfo: `${ROOTURL}footerinfo/`,
  getfooterinfobyid: `${ROOTURL}footerinfo/getfooterinfoById/`,
  updatefooterinfo: `${ROOTURL}footerinfo/updatefooterinfo/`,
  deletefooterinfo: `${ROOTURL}footerinfo/softDeletefooterinfo/`,
  toggleStatusfooterinfo: `${ROOTURL}footerinfo/togglestatus/`,
  trashfooterinfolist: `${ROOTURL}footerinfo/trash`,
  restorefooterinfo: `${ROOTURL}footerinfo/restore/`,
  permanentDeletefooterinfo: `${ROOTURL}footerinfo/permanentDelete/`,

  // Config endpoints
  addconfig: `${ROOTURL}configs/`,
  listconfig: `${ROOTURL}configs/`,
  getConfig: `${ROOTURL}configs/getConfigById/`,
  updateconfig: `${ROOTURL}configs/updateConfig/`,
  deleteconfig: `${ROOTURL}configs/softDeleteConfig/`,
  toggleStatusconfig: `${ROOTURL}configs/togglestatus/`,
  trashconfiglist: `${ROOTURL}configs/trash`,
  restoreconfig: `${ROOTURL}configs/restore/`,
  permanentDeleteconfig: `${ROOTURL}configs/permanentDelete/`,

  //Banner Management endpoints
  getBanner: `${ROOTURL}banners/`,
  updateBanner: `${ROOTURL}banners/`,

  // Auth endpoints
  login: `${ROOTURL}auth/login`,
  refresh: `${ROOTURL}auth/refresh`,

  // Template Images
  templateImage:`${ROOTURL}editer/image`
};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
