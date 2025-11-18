const LIVE = ture;

const SITEURL = 'https://bookadzonebackend.onrender.com/';
const LIVEURL = LIVE ? SITEURL : 'http://localhost:5000/';
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = '68ad8844bfdf0cec7f623bc2';




const API = {
  // Agency endpoints
  addAgency: `${ROOTURL}agencies/`,
  listAgency: `${ROOTURL}agencies/`,
  getAgency: `${ROOTURL}agencies/`,
  updateAgency: `${ROOTURL}agencies/`,
  deleteAgency: `${ROOTURL}agencies/softDelete/`,
  toggleStatusAgency: `${ROOTURL}agencies/toggleStatus/`,
  trashAgencyList: `${ROOTURL}agencies/trash`,
  restoreAgency: `${ROOTURL}agencies/restore/`,
  permanentDeleteAgency: `${ROOTURL}agencies/permanentDelete/`,

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

  // User endpoints
  addUser: `${ROOTURL}users/`,
  listUsers: `${ROOTURL}users/`,
  getUser: `${ROOTURL}users/getUserById/`,
  updateUser: `${ROOTURL}users/updateUser/`,
  deleteUser: `${ROOTURL}users/softDeleteUser/`,
  toggleStatusUser: `${ROOTURL}users/togglestatus/`,
  trashUserList: `${ROOTURL}users/trash`,
  restoreUser: `${ROOTURL}users/restore/`,
  permanentDeleteUser: `${ROOTURL}users/permanentDelete/`,
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
  pagesConfig: `${ROOTURL}configs/pages`,
  // User endpoints
  adduserrole: `${ROOTURL}userrole/`,
  createprivilegetable: `${ROOTURL}userrole/createprivilegetable`,
  listuserrole: `${ROOTURL}userrole/listuserrole`,
  fetchMenus: `${ROOTURL}userrole/fetchmenus`,
  getuserrole: `${ROOTURL}userrole/getuserroleById/`,
  updateuserrole: `${ROOTURL}userrole/updateuserrole/`,
  deleteuserrole: `${ROOTURL}userrole/softDeleteuserrole/`,
  toggleStatususerrole: `${ROOTURL}userrole/togglestatus/`,
  trashuserrolelist: `${ROOTURL}userrole/trash`,
  restoreuserrole: `${ROOTURL}userrole/restore/`,
  permanentDeleteuserrole: `${ROOTURL}userrole/permanentDelete/`,


  // Category endpoints
  addcategory: `${ROOTURL}category/`,
  listcategory: `${ROOTURL}category/`,
  getcategorybyId: `${ROOTURL}category/getcategoryById/`,  // Make sure this matches the backend route
  updatecategory: `${ROOTURL}category/updatecategory/`,
  deletecategory: `${ROOTURL}category/softDeletecategory/`,
  toggleStatuscategory: `${ROOTURL}category/togglestatus/`,  // Fix casing to match backend
  trashcategorylist: `${ROOTURL}category/trash`,  // Remove trailing slash
  restorecategory: `${ROOTURL}category/restore/`,
  permanentDeletecategory: `${ROOTURL}category/permanentDelete/`,

  //Banner Management endpoints
  getBanner: `${ROOTURL}banners/`,
  updateBanner: `${ROOTURL}banners/`,

  // Auth endpoints
  login: `${ROOTURL}auth/login`,
  refresh: `${ROOTURL}auth/refresh`,
  forgotPassword: `${ROOTURL}auth/forgot-password`,
  resetPassword: `${ROOTURL}auth/reset-password`,
  me: `${ROOTURL}auth/me`,


  // Page endpoints
  addPage: `${ROOTURL}pages/`,
  listPage: `${ROOTURL}pages/`,
  getPage: `${ROOTURL}pages/getPageById/`,
  updatePage: `${ROOTURL}pages/updatePage/`,
  deletePage: `${ROOTURL}pages/softDeletePage/`,
  toggleStatusPage: `${ROOTURL}pages/togglestatus/`,
  trashPageList: `${ROOTURL}pages/trash`,
  restorePage: `${ROOTURL}pages/restore/`,
  permanentDeletePage: `${ROOTURL}pages/permanentDelete/`,

  //BlogCategory endpoints
  addBlogCategory: `${ROOTURL}blogCategory/`,
  listBlogCategory: `${ROOTURL}blogCategory/`,
  getBlogCategory: `${ROOTURL}blogCategory/getblogCategoryById/`,
  updateBlogCategory: `${ROOTURL}blogCategory/updateblogCategory/`,
  deleteBlogCategory: `${ROOTURL}blogCategory/softDeleteblogCategory/`,
  toggleStatusBlogCategory: `${ROOTURL}blogCategory/togglestatus/`,
  trashBlogCategoryList: `${ROOTURL}blogCategory/trash`,
  restoreBlogCategory: `${ROOTURL}blogCategory/restore/`,
  permanentDeleteBlogCategory: `${ROOTURL}blogCategory/permanentDelete/`,

  // Profile endpoints
  profile: {
    me: `${ROOTURL}auth/me`,
    update: `${ROOTURL}auth/profile`,
    changePassword: `${ROOTURL}auth/change-password`
  },

  // Template Images
  templateImage: `${ROOTURL}editer/image`
};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
