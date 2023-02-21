import create from 'zustand';
import { APILoggedUser, APIPasswordValidity } from '../api/users/types';

export const useStore = create((set: any) => ({
	language: '',
	setLanguage: (language: string) =>
		set((state: any) => ({ ...state, language })),

	//Logged in User
	loggedInUser: {
		userName: '',
		name: '',
		nameEnglish: '',
		role: '',
		id: 0,
	},
	setLoggedInUser: (loggedInUser: APILoggedUser) =>
		set((state: any) => ({ ...state, loggedInUser })),

	//Loggin User Role
	userRole: '',
	setUserRole: (userRole: string) =>
		set((state: any) => ({ ...state, userRole })),

	// Password Validity
	passwordValidity: {
		expiringInDays: 999,
		passwordExpiringOn: new Date(),
		passwordSetOn: new Date(),
	},
	setPasswordValidity: (passwordValidity: APIPasswordValidity) =>
		set((state: any) => ({ ...state, passwordValidity })),
}));
