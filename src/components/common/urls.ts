// import { FaToggleOn } from "react-icons/fa";

const LIVE = false;

const SITEURL = 'https://bookadzonebackend.onrender.com/';
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

  // Auth endpoints
  login: `${ROOTURL}auth/login`,
  refresh: `${ROOTURL}auth/refresh`,

  //BlogCategory endpoints
  addBlogCategory:`${ROOTURL}blogs/`,
  listBlogCategory:`${ROOTURL}blogs/`,
  getBlogCategory:`${ROOTURL}blogs/getblogByID/`,
  updateBlogCategory:`${ROOTURL}blogs/updateblog/`,
  deleteBlogCategory:`${ROOTURL}blogs/softdeleteblog/`,
  toggleStatusBlogCategory:`${ROOTURL}blogs/togglestatus/`,
  trashBlogCategoryList:`${ROOTURL}blogs/trash`,
  restoreBlogCategory:`${ROOTURL}blogs/restore/`,
  permanentDeleteBlogCategory:`${ROOTURL}blogs/permanentDelete/`

};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
