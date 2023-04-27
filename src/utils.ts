import { addMinutes } from "date-fns";

export type Id = string | number;

export enum ROLE {
	SUPERADMIN = "SUPERADMIN",
	ADMIN = "ADMIN",
	USER = "USER",
}

export enum DEPARTMENT_TYPE {
	HEADQUARTER = "HEADQUARTER",
	// G
}

export enum REGEX {
	NUMBERS_ONLY = "",
	ENGLISH_ALPHABETS = "",
}

export const compose =
	(...fns: any) =>
	(arg: any) =>
		fns.reduceRight(
			(acc: any, fn: (arg0: any) => any) => (fn ? fn(acc) : acc),
			arg
		);

// export const mergeProps = (
// 	base: any,
// 	props: {
// 		borderRadius?: string;
// 		border?: string;
// 		borderBottom?: string;
// 		height?: string;
// 		display?: string;
// 		color?: string;
// 		zIndex?: number;
// 		fontFamily?: string;
// 		fontSize?: string;
// 		textTransform?: string;
// 		background?: string;
// 		fontWeight?: string;
// 	}
// ) => ({ ...base, ...props });

export const mergeProps = (base: any, props: any) => ({ ...base, ...props });

export const getQueryParams = () =>
	window.location.search
		.replace("?", "")
		.split("&")
		.reduce((r: any, e: string) => {
			r[e.split("=")[0]] = decodeURIComponent(e.split("=")[1]);
			return r;
		}, {});

export const GetNextWorkflowStatus = (code: number) => {
	switch (code) {
		case 7:
			return "GD Check";
		case 5:
			return "HQ Check";
		case 3:
			return "Active";

		default:
			break;
	}
};

export const cookieExpiry = addMinutes(new Date(), 15);

export const getFullPath = (obj: Blob | MediaSource) => {
	return (window.URL || window.webkitURL).createObjectURL(obj);
};

export const rotateRight = (arr: any) => {
	let last = arr.pop();
	arr.unshift(last);
	return arr;
};
