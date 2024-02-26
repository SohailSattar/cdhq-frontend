export const BASE_NAME = "/portal";

export const ID = ":id";

export const ROOT = `/`;
export const HOME = `/home`;
export const LOGIN = `/login`;

export const USER = `/user`;
export const USER_DETAIL = `/user/${ID}`;
export const USER_EDIT = `${USER_DETAIL}/edit`;
export const USER_NEW = `${USER}/new`;
export const USER_SEARCH = USER + "/search";

//////////////////////////////////////////////// DEPARTMENT ////////////////////////////////////////////////
export const DEPARTMENT = `/department`;
export const DEPARTMENT_NEW = `${DEPARTMENT}/new`;

export const PROJECT = `/project`;
export const PROJECT_DETAIL = `${PROJECT}/${ID}`;
export const PROJECT_EDIT = `${PROJECT_DETAIL}/edit`;
export const PROJECT_NEW = `${PROJECT}/new`;

export const CHANGE_PASSWORD = `/change-password`;

//////////////////////////////////////////////// CONTENT MANAGEMENT ////////////////////////////////////////////////
export const CONTENT_MANAGEMENT = `/content-management`;

export const CONTENT_MANAGEMENT_LINK_TYPES = `${CONTENT_MANAGEMENT}/link-types`;
export const CONTENT_MANAGEMENT_LINK_TYPES_EDIT = `${CONTENT_MANAGEMENT_LINK_TYPES}/${ID}/edit`;
export const CONTENT_MANAGEMENT_LINK_TYPES_NEW = `${CONTENT_MANAGEMENT_LINK_TYPES}/new`;

export const CONTENT_MANAGEMENT_MENU = `${CONTENT_MANAGEMENT}/menu`;
export const CONTENT_MANAGEMENT_MENU_EDIT = `${CONTENT_MANAGEMENT_MENU}/${ID}/edit`;
export const CONTENT_MANAGEMENT_MENU_NEW = `${CONTENT_MANAGEMENT_MENU}/new`;

export const CONTENT_MANAGEMENT_IMAGE = `${CONTENT_MANAGEMENT}/image`;
export const CONTENT_MANAGEMENT_IMAGE_EDIT = `${CONTENT_MANAGEMENT_IMAGE}/${ID}/edit`;
export const CONTENT_MANAGEMENT_IMAGE_NEW = `${CONTENT_MANAGEMENT_IMAGE}/new`;

export const CONTENT_MANAGEMENT_QR_CODE = `${CONTENT_MANAGEMENT}/qr-code`;
export const CONTENT_MANAGEMENT_QR_CODE_EDIT = `${CONTENT_MANAGEMENT_QR_CODE}/${ID}/edit`;
export const CONTENT_MANAGEMENT_QR_CODE_NEW = `${CONTENT_MANAGEMENT_QR_CODE}/new`;

export const CONTENT_MANAGEMENT_CD_BUILDING = `${CONTENT_MANAGEMENT}/cd-building`;
export const CONTENT_MANAGEMENT_CD_BUILDING_EDIT = `${CONTENT_MANAGEMENT_CD_BUILDING}/${ID}/edit`;
export const CONTENT_MANAGEMENT_CD_BUILDING_NEW = `${CONTENT_MANAGEMENT_CD_BUILDING}/new`;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Projects

// Honors
export const HONORS = `/honors`;
export const HONORS_EDIT = HONORS + "/" + ID + "/edit";
export const HONORS_NEW = HONORS + "/new";

// News
export const NEWS = "/news";
export const NEWS_DETAIL = NEWS + "/" + ID;
export const NEWS_EDIT = NEWS_DETAIL + "/edit";
export const NEWS_NEW = NEWS + "/new";

// Phone Directory
export const PHONE_DIRECTORY = `/phone-directory`;
