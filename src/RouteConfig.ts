export const BASE_NAME = "/portal";

export const ID = ":id";

export const ROOT = `/`;
export const HOME = `/home`;
export const LOGIN = `/login`;
export const DEPARTMENT = `/department`;

export const USER = `/user`;
export const USER_DETAIL = `/user/${ID}`;
export const USER_EDIT = `${USER_DETAIL}/edit`;
export const USER_NEW = `${USER}/new`;
export const USER_SEARCH = USER + "/search";

export const PROJECT = `/project`;
export const PROJECT_DETAIL = `${PROJECT}/${ID}`;
export const PROJECT_EDIT = `${PROJECT_DETAIL}/edit`;
export const PROJECT_NEW = `${PROJECT}/new`;

export const CHANGE_PASSWORD = `/change-password`;

// Settings
export const SETTINGS = "/settings";

export const SETTINGS_MENU = `${SETTINGS}/menu`;
export const SETTINGS_MENU_EDIT = `${SETTINGS_MENU}/${ID}/edit`;
export const SETTINGS_MENU_NEW = `${SETTINGS_MENU}/new`;

export const SETTINGS_LINK_TYPES = `${SETTINGS}/link-types`;
export const SETTINGS_LINK_TYPES_EDIT = `${SETTINGS_LINK_TYPES}/${ID}/edit`;
export const SETTINGS_LINK_TYPES_NEW = `${SETTINGS_LINK_TYPES}/new`;

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

export const PHONE_DIRECTORY = `/phone-directory`;
