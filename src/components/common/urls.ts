const LIVE = false;

const SITEURL = 'https://bookadzonebackend.onrender.com/';
const LIVEURL = LIVE ? SITEURL : 'http://localhost:5001/';
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

  // Auth endpoints
  login: `${ROOTURL}auth/login`,
  refresh: `${ROOTURL}auth/refresh`,

  //BlogCategory endpoints
  addBlogCategory:`${ROOTURL}blogCategory/`,
  listBlogCategory:`${ROOTURL}blogCategory/`,
  getBlogCategory:`${ROOTURL}blogCategory/getblogCategoryById/`,
  updateBlogCategory:`${ROOTURL}blogCategory/updateblogCategory/`,
  deleteBlogCategory:`${ROOTURL}blogCategory/softDeleteblogCategory/`,
  toggleStatusBlogCategory:`${ROOTURL}blogCategory/togglestatus/`,
  trashBlogCategoryList:`${ROOTURL}blogCategory/trash`,
  restoreBlogCategory:`${ROOTURL}blogCategory/restore/`,
  permanentDeleteBlogCategory:`${ROOTURL}blogCategory/permanentDelete/`

};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
