const LIVE = false;

const SITEURL = 'https://example.com/';
const LIVEURL = LIVE ? SITEURL : 'http://localhost:5000/';
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = '68ad8844bfdf0cec7f623bc2';




const API = {

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



  // Category endpoints
  addcategory: `${ROOTURL}categorys/`,
  listcategory: `${ROOTURL}categorys/`,
  getcategory: `${ROOTURL}categorys/getcategoryById/`,
  updatecategory: `${ROOTURL}categorys/updatecategory/`,
  deletecategory: `${ROOTURL}categorys/softDeletecategory/`,
  toggleStatuscategory: `${ROOTURL}categorys/togglestatus/`,
  trashcategorylist: `${ROOTURL}categorys/trash`,
  restorecategory: `${ROOTURL}categorys/restore/`,
  permanentDeletecategory: `${ROOTURL}categorys/permanentDelete/`,

  // Auth endpoints
  login: `${ROOTURL}auth/login`,
  refresh: `${ROOTURL}auth/refresh`,

};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;