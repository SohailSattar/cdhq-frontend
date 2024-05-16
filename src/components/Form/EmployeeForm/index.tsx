import _ from "lodash/fp";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	Button,
	Checkbox,
	Dropdown,
	Hr,
	IEmployeeFormInputs,
	ShadowedContainer,
	TextBox,
} from "../..";

import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";
import { getRanks } from "../../../api/ranks/get/getRanks";
import { getClasses } from "../../../api/classes/get/getClasses";
import { getContractTypes } from "../../../api/contractType/get/getContractTypes";
import { getProfessions } from "../../../api/professions/get/getProfessions";
import { getCountries } from "../../../api/countries/get/getCountries";
import { getNationalServices } from "../../../api/nationalServices/get/getNationalServices";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import { getEmployeeStatuses } from "../../../api/employees/get/getEmployeeStatuses";
import { getProfessionalTrainings } from "../../../api/professionalTraining/get/getProfessionalTrainings";
import { getWorkModes } from "../../../api/works/get/getWorkModes";
import { getWorkGroups } from "../../../api/works/get/getWorkGroups";
import { APIEmployeeDetail } from "../../../api/employees/types";
import { getSignaturesList } from "../../../api/signaturesList/get/getSignaturesList";
import { getMilitaryTrained } from "../../../api/militaryTrained/get/getMilitraryTrained";
import { getMilitaryWear } from "../../../api/militaryWear/get/getMilitaryWear";
import { getQualifications } from "../../../api/qualifications/get/getQualifications";
import { getGenders } from "../../../api/genders/get/getGenders";
import { getMaritalStatuses } from "../../../api/maritalStatus/get/getMaritalStatuses";
import { getReligions } from "../../../api/religions/get/getReligions";
import { getSpecialNeeds } from "../../../api/specialNeeds/get/getSpecialNeeds";
import { getHealthStatuses } from "../../../api/healthStatuses/get/getHealthStatuses";
import { getBloodTypes } from "../../../api/bloodTypes/get/getBloodTypes";
import DatePicker from "../../DatePicker";
import { getMoiJobCategories } from "../../../api/moi/get/getMoiJobCategories";

import styles from "./styles.module.scss";
import { useCallback } from "react";
import { Id, getFullPath } from "../../../utils";
import { getMoiActJobs } from "../../../api/moi/get/getMoiActJobs";
import { APIActualJobMOI } from "../../../api/moi/types";
import { getAssignedJobs } from "../../../api/assignedJobs/get/getAssignedJobs";
import { ErrorMessage } from "@hookform/error-message";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { Project } from "../../../data/projects";
import clsx from "clsx";

// Define an interface for dropdown options
interface DropdownOptions {
	classes: DropdownOption[];
	ranks: DropdownOption[];
	contractTypes: DropdownOption[];
	professions: DropdownOption[];
	countries: DropdownOption[];
	nationalServices: DropdownOption[];
	statuses: DropdownOption[];
	departments: DropdownOption[];
	section: DropdownOption[];
	professionalTraining: DropdownOption[];
	workMode: DropdownOption[];
	workGroup: DropdownOption[];
	signaturesLists: DropdownOption[];
	jobCategoryMoi: DropdownOption[];
	assignedJobs: DropdownOption[];
	militaryTrained: DropdownOption[];
	militaryUniform: DropdownOption[];
	qualifications: DropdownOption[];
	genders: DropdownOption[];
	maritalStatuses: DropdownOption[];
	religions: DropdownOption[];
	specialNeeds: DropdownOption[];
	healthStatuses: DropdownOption[];
	bloodTypes: DropdownOption[];
}

interface Props {
	data?: APIEmployeeDetail;
	actionButtonText: string;
	onSubmit: (data: IEmployeeFormInputs) => void;
	onImageUpload?: (image: File) => void;
	serverErrors?: string[];
	canUpdate?: boolean;
}

const EmployeeForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
	serverErrors = [],
	canUpdate = false,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);
	const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
		classes: [],
		ranks: [],
		contractTypes: [],
		professions: [],
		countries: [],
		nationalServices: [],
		statuses: [],
		departments: [],
		section: [],
		professionalTraining: [],
		workMode: [],
		workGroup: [],
		signaturesLists: [],
		jobCategoryMoi: [],
		assignedJobs: [],
		militaryTrained: [],
		militaryUniform: [],
		qualifications: [],
		genders: [],
		maritalStatuses: [],
		religions: [],
		specialNeeds: [],
		healthStatuses: [],
		bloodTypes: [],
	});

	const [actJobMoiOptions, setActJobMoiOptions] = useState<DropdownOption[]>(
		[]
	);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IEmployeeFormInputs>({ criteriaMode: "all" });

	const fetchData = useCallback(async () => {
		try {
			const [
				classes,
				ranks,
				contractTypes,
				professions,
				countries,
				nationalServices,
				statuses,
				departments,
				section,
				professionalTraining,
				workMode,
				workGroup,
				signaturesLists,
				jobCategoryMoi,
				assignedJobs,
				militaryTrained,
				militaryUniform,
				qualifications,
				genders,
				maritalStatuses,
				religions,
				specialNeeds,
				healthStatuses,
				bloodTypes,
			] = await Promise.all([
				getClasses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.logPre} - ${
							language !== "ar" ? item.name : item.nameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getRanks().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getContractTypes().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getProfessions().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getCountries().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getNationalServices().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getEmployeeStatuses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.id} - ${
							language !== "ar" ? item.name : item.nameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getDepartmentsByProject(Project.Employees).then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.id} - ${
							language !== "ar" ? item.name : item.nameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getCategorizedDepartments().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.id} - ${
							language !== "ar" ? item.fullName : item.fullNameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getProfessionalTrainings().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getWorkModes().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getWorkGroups().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getSignaturesList().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMoiJobCategories().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getAssignedJobs().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMilitaryTrained().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMilitaryWear().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getQualifications().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getGenders().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMaritalStatuses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getReligions().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getSpecialNeeds().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getHealthStatuses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getBloodTypes().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				// Add other dropdown options requests here
			]);

			setDropdownOptions({
				classes,
				ranks,
				contractTypes,
				professions,
				countries,
				nationalServices,
				statuses,
				departments,
				section,
				professionalTraining,
				workMode,
				workGroup,
				signaturesLists,
				jobCategoryMoi,
				assignedJobs,
				militaryTrained,
				militaryUniform,
				qualifications,
				genders,
				maritalStatuses,
				religions,
				specialNeeds,
				healthStatuses,
				bloodTypes,
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [language]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const fetchActJobMoi = useMemo(
		() => async (categoryId: Id) => {
			const { data: list } = await getMoiActJobs(categoryId);
			if (list) {
				setActJobMoiOptions(
					list?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		},
		[language]
	);

	useEffect(() => {
		if (data) {
			const { actJobMOI } = data;
			fetchActJobMoi(actJobMOI.groupId);
		}
	}, [data, fetchActJobMoi]);

	useEffect(() => {
		if (data) {
			const { actJobMOI } = data;
			const selectedActJobMoi = actJobMoiOptions.find(
				(x) => x.value === actJobMOI?.id
			);
			setValue("actJob", selectedActJobMoi!);
		}
	}, [actJobMoiOptions, data, setValue]);

	useEffect(() => {
		register("employeeNo", {
			required: t("error.form.required.employeeNo", {
				framework: "React",
			}).toString(),
			pattern: {
				value: /\d+/,
				message: t("error.form.pattern.employeeNo", {
					framework: "React",
				}).toString(),
			},
		});

		// Employee Name
		register("name", {
			required: t("error.form.required.nameArabic", {
				framework: "React",
			}).toString(),
			pattern: {
				value: /[\u0621-\u064As]+$/,
				message: t("error.form.pattern.nameArabic", {
					framework: "React",
				}).toString(),
			},
		});

		// Employee Name [English]
		register("nameEnglish", {
			required: t("error.form.required.nameEnglish", {
				framework: "React",
			}).toString(),
		});

		// Class
		register("class", {
			required: t("error.form.required.class", {
				framework: "React",
			}).toString(),
		});

		// Hiring Date
		register("hireDate", {
			required: t("error.form.required.hireDate", {
				framework: "React",
			}).toString(),
		});

		// Joining Date
		register("joinDate", {
			required: t("error.form.required.joinDate", {
				framework: "React",
			}).toString(),
		});

		// Rank
		register("rank", {
			required: t("error.form.required.rank", {
				framework: "React",
			}).toString(),
		});

		// Contract Type
		register("contractType", {
			required: t("error.form.required.contractType", {
				framework: "React",
			}).toString(),
		});

		// Profession
		register("profession", {
			required: t("error.form.required.profession", {
				framework: "React",
			}).toString(),
		});

		// Nationality
		register("nationality", {
			required: t("error.form.required.nationality", {
				framework: "React",
			}).toString(),
		});

		// National Service
		register("nationalService", {
			required: t("error.form.required.nationalService", {
				framework: "React",
			}).toString(),
		});

		// Employee Status
		register("status", {
			required: t("error.form.required.empStatus", {
				framework: "React",
			}).toString(),
		});

		// Status Date
		register("statusDate", {
			required: t("error.form.required.statusDate", {
				framework: "React",
			}).toString(),
		});

		// Military Card Expiry Date
		register("militaryCardExpiryDate", {
			required: t("error.form.required.milCardExpDate", {
				framework: "React",
			}).toString(),
		});

		//////////////////////////////////////

		// Workplace
		register("department", {
			required: t("error.form.required.workplace", {
				framework: "React",
			}).toString(),
		});

		// Work Location
		register("section", {
			required: t("error.form.required.workLocation", {
				framework: "React",
			}).toString(),
		});
		// Professional Training
		register("professionalTraining", {
			required: t("error.form.required.trainingCourse", {
				framework: "React",
			}).toString(),
		});

		// Work Mode
		register("workMode", {
			required: t("error.form.required.workMode", {
				framework: "React",
			}).toString(),
		});

		// Work Group
		register("workGroup", {
			required: t("error.form.required.workGroup", {
				framework: "React",
			}).toString(),
		});

		// SignatureList
		register("signList", {
			required: t("error.form.required.signList", {
				framework: "React",
			}).toString(),
		});

		// Actual Job MOI
		register("actJob", {
			required: t("error.form.required.actJob", {
				framework: "React",
			}).toString(),
		});

		// Assigned Job
		register("assignedJob", {
			required: t("error.form.required.assignedJob", {
				framework: "React",
			}).toString(),
		});

		// Military Trained
		register("militaryTrained", {
			required: t("error.form.required.militaryTrain", {
				framework: "React",
			}).toString(),
		});

		// Military Uniform
		register("militaryWear", {
			required: t("error.form.required.militaryWear", {
				framework: "React",
			}).toString(),
		});

		// Qualification
		register("qualification", {
			required: t("error.form.required.qualification", {
				framework: "React",
			}).toString(),
		});

		// // Degree Date
		// register("degreeDate", {
		// 	required: t("error.form.required.degreeDate", {
		// 		framework: "React",
		// 	}).toString(),
		// });

		// // Degree Name
		// register("degreeName", {
		// 	required: t("error.form.required.degreeName", {
		// 		framework: "React",
		// 	}).toString(),
		// });

		// Degree Country
		register("degreeCountry", {
			required: t("error.form.required.degreeCountry", {
				framework: "React",
			}).toString(),
		});

		//////////////////////////////////////

		// Phone
		register("phone", {
			required: t("error.form.required.phone", {
				framework: "React",
			}).toString(),
		});

		//////////////////////////////////////

		// Gender
		register("gender", {
			required: t("error.form.required.gender", {
				framework: "React",
			}).toString(),
		});

		// Marital Status
		register("maritalStatus", {
			required: t("error.form.required.maritalStatus", {
				framework: "React",
			}).toString(),
		});

		// Religion
		register("religion", {
			required: t("error.form.required.religion", {
				framework: "React",
			}).toString(),
		});

		// Date of Birth
		register("birthDate", {
			required: t("error.form.required.dob", {
				framework: "React",
			}).toString(),
		});

		// Special Needs
		register("specialNeed", {
			required: t("error.form.required.specialNeeds", {
				framework: "React",
			}).toString(),
		});

		// Health Status
		register("healthStatus", {
			required: t("error.form.required.healthStatus", {
				framework: "React",
			}).toString(),
		});

		// // Passport No
		// register("passportNo", {
		// 	required: t("error.form.required.passportNo", {
		// 		framework: "React",
		// 	}).toString(),
		// });

		// Emirates Id No
		register("emiratesIdNo", {
			required: t("error.form.required.emiratesIdNo", {
				framework: "React",
			}).toString(),
		});

		// Unified Id No
		register("uidNo", {
			required: t("error.form.required.uidNo", {
				framework: "React",
			}).toString(),
		});

		// // Last Medical Test Date
		// register("lastMedicalTestDate", {
		// 	required: t("error.form.required.lastMedTestDate", {
		// 		framework: "React",
		// 	}).toString(),
		// });

		// Blood Type
		register("bloodType", {
			required: t("error.form.required.bloodType", {
				framework: "React",
			}).toString(),
		});

		// Emergency Call Name
		register("emergencyCallName", {
			required: t("error.form.required.emergencyCallName", {
				framework: "React",
			}).toString(),
		});

		// Emergency Call Relation
		register("emergencyCallRelation", {
			required: t("error.form.required.emergencyCallRelation", {
				framework: "React",
			}).toString(),
		});

		// Emergency Call Phone
		register("emergencyCallPhone", {
			required: t("error.form.required.emergencyCallPhone", {
				framework: "React",
			}).toString(),
		});

		// Emergency Call Address
		register("emergencyCallAddress", {
			required: t("error.form.required.emergencyCallAddress", {
				framework: "React",
			}).toString(),
		});

		if (data) {
			const {
				photo,
				employeeNo,
				name,
				nameEnglish,
				class: recruiter,
				hireDate,
				joinDate,
				rank,
				contractType,
				profession,
				nationality,
				nationalService,
				nationalServiceGroup,
				status,
				statusDetail,
				statusDate,
				militaryCardExpiryDate,
				department,
				section,
				isWorkLocationManager,
				professionalTraining,
				workMode,
				workGroup,
				signList,
				actJobMOI,
				assignedJob,
				additionalJob,
				previousExperienceYear,
				previousExperienceMonth,
				previousExperienceDay,
				militaryTrain,
				militaryWear,
				qualification,
				degreeDate,
				degreeName,
				degreeCountry,
				universityName,
				residenceEmirate,
				residenceCity,
				residenceArea,
				phone,
				phone2,
				phoneOffice,
				emailLan,
				emailNet,
				gender,
				maritalStatus,
				religion,
				birthDate,
				birthPlace,
				specialNeed,
				healthStatus,
				passportNo,
				familyBookNo,
				emiratesIdNo,
				uidNo,
				districtNo,
				districtName,
				lastMedicalTestDate,
				bloodType,
				height,
				weight,
				notes,
				emergencyCallName,
				emergencyCallRelation,
				emergencyCallPhone,
				emergencyCallAddress,
				emergencyOtherName,
				emergencyOtherRelation,
				emergencyOtherPhone,
				emergencyOtherAddress,
			} = data;

			setValue("photo", photo!);
			setValue("employeeNo", employeeNo!);
			setValue("name", name!);
			setValue("nameEnglish", nameEnglish!);

			const selectedClass = dropdownOptions.classes.find(
				(x: { value: any }) => x.value === recruiter?.id!
			);
			setValue("class", selectedClass!);

			setValue("hireDate", hireDate!);
			setValue("joinDate", joinDate!);

			const selectedRank = dropdownOptions.ranks.find(
				(x: { value: any }) => x.value === rank?.id!
			);
			setValue("rank", selectedRank!);

			const selectedContract = dropdownOptions.contractTypes.find(
				(x: { value: any }) => x.value === contractType?.id!
			);
			setValue("contractType", selectedContract!);

			const selectedProfession = dropdownOptions.professions.find(
				(x: { value: any }) => x.value === profession?.id!
			);
			setValue("profession", selectedProfession!);

			const selectedaNationality = dropdownOptions.countries.find(
				(x: { value: any }) => x.value === nationality?.id!
			);
			setValue("nationality", selectedaNationality!);

			const selectedNationalService = dropdownOptions.nationalServices.find(
				(x: { value: any }) => x.value === nationalService?.id!
			);
			setValue("nationalService", selectedNationalService!);
			setValue("nationalServiceGroup", nationalServiceGroup! || "");

			const selectedStatus = dropdownOptions.statuses.find(
				(x: { value: any }) => x.value === status?.id!
			);
			setValue("status", selectedStatus!);

			setValue("statusDetails", statusDetail);
			setValue("statusDate", statusDate!);

			setValue("militaryCardExpiryDate", militaryCardExpiryDate);

			const selectedDepartment = dropdownOptions.departments.find(
				(x: { value: any }) => x.value === department?.id!
			);
			setValue("department", selectedDepartment!);

			const selectedSection = dropdownOptions.section.find(
				(x: { value: any }) => x.value === section?.id!
			);
			setValue("section", selectedSection!);

			setValue("isWorkLocationManager", isWorkLocationManager);

			const selectedProfessionTraining =
				dropdownOptions.professionalTraining.find(
					(x: { value: any }) => x.value === professionalTraining?.id!
				);
			setValue("professionalTraining", selectedProfessionTraining!);

			const selectedWorkMode = dropdownOptions.workMode.find(
				(x: { value: any }) => x.value === workMode?.id!
			);
			setValue("workMode", selectedWorkMode!);

			const selectedWorkGroup = dropdownOptions.workGroup.find(
				(x: { value: any }) => x.value === workGroup?.id!
			);
			setValue("workGroup", selectedWorkGroup!);

			const selectedSignList = dropdownOptions.signaturesLists.find(
				(x: { value: any }) => x.value === signList?.id!
			);
			setValue("signList", selectedSignList!);

			const selectedjobCatMoi = dropdownOptions.jobCategoryMoi.find(
				(x) => x.value === actJobMOI.groupId
			);
			setValue("jobCatMoi", selectedjobCatMoi!);

			const selectedAssignedJob = dropdownOptions.assignedJobs.find(
				(x: { value: any }) => x.value === assignedJob?.id!
			);
			setValue("assignedJob", selectedAssignedJob!);

			setValue("additionalJob", additionalJob!);
			setValue("previousExperienceYear", previousExperienceYear! || "0");
			setValue("previousExperienceMonth", previousExperienceMonth! || "0");
			setValue("previousExperienceDay", previousExperienceDay! || "0");

			const selectedMilitaryTrained = dropdownOptions.militaryTrained.find(
				(x: { value: any }) => x.value === militaryTrain?.id!
			);
			setValue("militaryTrained", selectedMilitaryTrained!);

			const selectedMilitaryWear = dropdownOptions.militaryUniform.find(
				(x: { value: any }) => x.value === militaryWear?.id!
			);
			setValue("militaryWear", selectedMilitaryWear!);

			//////////////////////////////////////
			const selectedQualification = dropdownOptions.qualifications.find(
				(x: { value: any }) => x.value === qualification?.id!
			);
			setValue("qualification", selectedQualification!);

			setValue("degreeDate", degreeDate!);
			setValue("degreeName", degreeName!);

			const selectedDegreeCountry = dropdownOptions.countries.find(
				(x: { value: any }) => x.value === degreeCountry?.id!
			);
			setValue("degreeCountry", selectedDegreeCountry!);

			setValue("universityName", universityName! || "");

			////////////////////////////////////////
			setValue("residenceEmirate", residenceEmirate! || "");
			setValue("residenceCity", residenceCity! || "");
			setValue("residenceArea", residenceArea! || "");
			setValue("phone", phone! || "");
			setValue("phone2", phone2! || "");
			setValue("phoneOffice", phoneOffice! || "");
			setValue("emailLan", emailLan! || "");
			setValue("emailNet", emailNet! || "");
			////////////////////////////////////////
			const selectedGender = dropdownOptions.genders.find(
				(x: { value: any }) => x.value === gender?.id!
			);
			setValue("gender", selectedGender!);

			const selectedMaritalStatus = dropdownOptions.maritalStatuses.find(
				(x: { value: any }) => x.value === maritalStatus?.id!
			);
			setValue("maritalStatus", selectedMaritalStatus!);

			const selectedReligion = dropdownOptions.religions.find(
				(x: { value: any }) => x.value === religion?.id!
			);
			setValue("religion", selectedReligion!);

			setValue("birthDate", birthDate! || "");
			setValue("birthPlace", birthPlace! || "");

			const selectedSpecialNeed = dropdownOptions.specialNeeds.find(
				(x: { value: any }) => x.value === specialNeed?.id!
			);
			setValue("specialNeed", selectedSpecialNeed!);

			const selectedHealthStatus = dropdownOptions.healthStatuses.find(
				(x: { value: any }) => x.value === healthStatus?.id!
			);
			setValue("healthStatus", selectedHealthStatus!);

			setValue("passportNo", passportNo!);
			setValue("familyBookNo", familyBookNo!);
			setValue("emiratesIdNo", emiratesIdNo!);
			setValue("uidNo", uidNo!);
			setValue("districtNo", districtNo);
			setValue("districtName", districtName);
			setValue("lastMedicalTestDate", lastMedicalTestDate!);

			const selectedBloodType = dropdownOptions.bloodTypes.find(
				(x: { value: any }) => x.value === bloodType?.id!
			);
			setValue("bloodType", selectedBloodType!);

			setValue("height", height!);
			setValue("weight", weight!);
			setValue("notes", notes! || "");
			////////////////////////////////////////
			setValue("emergencyCallName", emergencyCallName! || "");
			setValue("emergencyCallRelation", emergencyCallRelation!);
			setValue("emergencyCallPhone", emergencyCallPhone! || "");
			setValue("emergencyCallAddress", emergencyCallAddress! || "");

			setValue("emergencyOtherName", emergencyOtherName! || "");
			setValue("emergencyOtherRelation", emergencyOtherRelation! || "");
			setValue("emergencyOtherPhone", emergencyOtherPhone! || "");
			setValue("emergencyOtherAddress", emergencyOtherAddress! || "");
		}
	}, [
		data,
		dropdownOptions.assignedJobs,
		dropdownOptions.bloodTypes,
		dropdownOptions.classes,
		dropdownOptions.contractTypes,
		dropdownOptions.countries,
		dropdownOptions.departments,
		dropdownOptions.genders,
		dropdownOptions.healthStatuses,
		dropdownOptions.jobCategoryMoi,
		dropdownOptions.maritalStatuses,
		dropdownOptions.militaryTrained,
		dropdownOptions.militaryUniform,
		dropdownOptions.nationalServices,
		dropdownOptions.professionalTraining,
		dropdownOptions.professions,
		dropdownOptions.qualifications,
		dropdownOptions.ranks,
		dropdownOptions.religions,
		dropdownOptions.section,
		dropdownOptions.signaturesLists,
		dropdownOptions.specialNeeds,
		dropdownOptions.statuses,
		dropdownOptions.workGroup,
		dropdownOptions.workMode,
		language,
		register,
		setValue,
		t,
	]);

	// const handleChange = (fieldName: any, value: any) => {
	// 	setFormData((prevData) => ({
	// 		...prevData,
	// 		[fieldName]: value,
	// 	}));
	// };

	////////////////////////////////////
	const jobCategoryMoiChangeHandler = async (option: DropdownOption) => {
		setValue("jobCatMoi", option);
		if (option) {
			setValue("jobCatMoi", option);
			await fetchActJobMoi(option.value);
		}
	};

	const submitHandler = (values: IEmployeeFormInputs) => {
		onSubmit(values);
	};

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			setHideUploadButton(false);
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("photo", x);
		}
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		setHideUploadButton(true);
		onImageUpload(image!)!;
	};

	return (
		<form onSubmit={handleSubmit(submitHandler)}>
			<div className={styles.empForm}>
				<div className={styles.row}>
					<div>
						<ShadowedContainer
							className={
								language !== "ar"
									? styles.thumbnailContainer
									: styles.thumbnailContainerLTR
							}>
							<h4>{t("employee.photo", { framework: "React" })}</h4>
							{/* <ImageUploader/> */}
							<div>
								<Controller
									render={({ field: { value, onChange } }) =>
										value ? (
											<ShadowedContainer>
												<img
													src={value}
													alt=""
													className={styles.image}
												/>
											</ShadowedContainer>
										) : (
											<></>
										)
									}
									name="photo"
									control={control}
									defaultValue={""}
								/>
							</div>
							{canUpdate && (
								<div className={styles.browse}>
									<input
										type="file"
										name="thumbnail"
										onChange={imageChangeHandler}
										accept="image/*"
									/>
								</div>
							)}
							{!hideUploadButton && (
								<div className={styles.uploadSection}>
									<Button
										type="button"
										onClick={imageUpdateHandler}>
										{t("button.update", { framework: "React" })}
									</Button>
								</div>
							)}
						</ShadowedContainer>
					</div>
					<div>
						<ShadowedContainer className={clsx(styles.basic)}>
							<div className={styles.row}>
								<div className={styles.field}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<TextBox
												type="text"
												label={t("employee.militaryNo", { framework: "React" })}
												value={value}
												onChange={onChange}
												className={styles.txtBox}
												disabled={!canUpdate}
											/>
										)}
										name="employeeNo"
										control={control}
										defaultValue={""}
									/>
								</div>
								<div className={styles.field}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<TextBox
												type="text"
												label={t("global.name", { framework: "React" })}
												value={value}
												onChange={onChange}
												disabled={!canUpdate}
											/>
										)}
										name="name"
										control={control}
										defaultValue={""}
									/>
								</div>
								<div className={styles.field}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<TextBox
												type="text"
												label={t("global.nameEnglish", { framework: "React" })}
												value={value}
												onChange={onChange}
												disabled={!canUpdate}
											/>
										)}
										name="nameEnglish"
										control={control}
										defaultValue={""}
									/>
								</div>
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("class.name", { framework: "React" })}
												options={dropdownOptions.classes}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="class"
										control={control}
									/>
								</div>
							</div>
							<div className={styles.row}>
								<div className={styles.field}>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												date={value}
												onChange={onChange}
												labeltext={t("employee.hireDate", {
													framework: "React",
												})}
												disabled={!canUpdate}
											/>
										)}
										name="hireDate"
										control={control}
										defaultValue={new Date().toISOString()}
									/>
								</div>
								<div className={styles.field}>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												date={value}
												onChange={onChange}
												labeltext={t("employee.joinDate", {
													framework: "React",
												})}
												disabled={!canUpdate}
											/>
										)}
										name="joinDate"
										control={control}
										defaultValue={new Date().toISOString()}
									/>
								</div>
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("rank.name", { framework: "React" })}
												options={dropdownOptions.ranks}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="rank"
										control={control}
									/>
								</div>
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("employee.contractType", {
													framework: "React",
												})}
												options={dropdownOptions.contractTypes}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="contractType"
										control={control}
									/>
								</div>
							</div>
							<div className={styles.row}>
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("employee.profession", { framework: "React" })}
												options={dropdownOptions.professions}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="profession"
										control={control}
									/>
								</div>
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("employee.nationality", {
													framework: "React",
												})}
												options={dropdownOptions.countries}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="nationality"
										control={control}
									/>
								</div>{" "}
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("employee.nationalService", {
													framework: "React",
												})}
												options={dropdownOptions.nationalServices}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="nationalService"
										control={control}
									/>
								</div>{" "}
								<div className={styles.field}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<TextBox
												type="text"
												label={t("employee.nationalServiceGroup", {
													framework: "React",
												})}
												value={value}
												onChange={onChange}
												disabled={!canUpdate}
											/>
										)}
										name="nationalServiceGroup"
										control={control}
										defaultValue={""}
									/>
								</div>
							</div>
							<div className={styles.row}>
								<div className={styles.ddlField}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<Dropdown
												label={t("employee.status", { framework: "React" })}
												options={dropdownOptions.statuses}
												onSelect={onChange}
												value={value}
												disabled={!canUpdate}
											/>
										)}
										name="status"
										control={control}
									/>
								</div>
								<div className={styles.field}>
									<Controller
										render={({ field: { value, onChange } }) => (
											<TextBox
												type="text"
												label={t("employee.statusDetail", {
													framework: "React",
												})}
												value={value || ""}
												onChange={onChange}
												disabled={!canUpdate}
											/>
										)}
										name="statusDetails"
										control={control}
									/>
								</div>
								<div className={styles.field}>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												date={value}
												onChange={onChange}
												labeltext={t("employee.statusDate", {
													framework: "React",
												})}
												disabled={!canUpdate}
											/>
										)}
										name="statusDate"
										control={control}
										defaultValue={new Date().toISOString()}
									/>
								</div>
								<div className={styles.field}>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												date={value}
												onChange={onChange}
												labeltext={t("employee.milCardExpDate", {
													framework: "React",
												})}
												disabled={!canUpdate}
											/>
										)}
										name="militaryCardExpiryDate"
										control={control}
										defaultValue={new Date().toISOString()}
									/>
								</div>
							</div>
						</ShadowedContainer>
					</div>
				</div>
				<ShadowedContainer className={styles.basic}>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.workplace", { framework: "React" })}
										options={dropdownOptions.departments}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="department"
								control={control}
							/>
						</div>

						<div className={clsx(styles.field, styles.checkbox)}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Checkbox
										label={t("employee.isManager", { framework: "React" })}
										checked={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="isWorkLocationManager"
								control={control}
								defaultValue={false}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.workLocation", {
											framework: "React",
										})}
										options={dropdownOptions.section}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="section"
								control={control}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.professionalTraining", {
											framework: "React",
										})}
										options={dropdownOptions.professionalTraining}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="professionalTraining"
								control={control}
							/>
						</div>

						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.workMode", { framework: "React" })}
										options={dropdownOptions.workMode}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="workMode"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.workGroup", { framework: "React" })}
										options={dropdownOptions.workGroup}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="workGroup"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.signList", { framework: "React" })}
										options={dropdownOptions.signaturesLists}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="signList"
								control={control}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.jobCatMoi", {
											framework: "React",
										})}
										options={dropdownOptions.jobCategoryMoi}
										onSelect={jobCategoryMoiChangeHandler}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="jobCatMoi"
								control={control}
							/>
						</div>

						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.actJob", { framework: "React" })}
										options={actJobMoiOptions}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="actJob"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.assignedJob", { framework: "React" })}
										options={dropdownOptions.assignedJobs}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="assignedJob"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.additionalJob", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="additionalJob"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<div className={styles.exp}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("employee.expYear", {
												framework: "React",
											})}
											value={value}
											onChange={onChange}
											disabled={!canUpdate}
										/>
									)}
									name="previousExperienceYear"
									control={control}
									defaultValue={"0"}
								/>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("employee.expMonth", {
												framework: "React",
											})}
											value={value}
											onChange={onChange}
											disabled={!canUpdate}
										/>
									)}
									name="previousExperienceMonth"
									control={control}
									defaultValue={"0"}
								/>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("employee.expDay", {
												framework: "React",
											})}
											value={value}
											onChange={onChange}
											disabled={!canUpdate}
										/>
									)}
									name="previousExperienceDay"
									control={control}
									defaultValue={"0"}
								/>
							</div>
						</div>{" "}
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.militaryTrained", {
											framework: "React",
										})}
										options={dropdownOptions.militaryTrained}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="militaryTrained"
								control={control}
							/>
						</div>{" "}
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.militaryUniform", {
											framework: "React",
										})}
										options={dropdownOptions.militaryUniform}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="militaryWear"
								control={control}
							/>
						</div>
					</div>
				</ShadowedContainer>

				<ShadowedContainer className={styles.basic}>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({
									field: { value, onChange },
								}: {
									field: { value: any; onChange: any };
								}) => (
									<Dropdown
										label={t("employee.academicQualification", {
											framework: "React",
										})}
										options={dropdownOptions.qualifications}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="qualification"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<DatePicker
										date={value}
										onChange={onChange}
										labeltext={t("employee.academicQualificationDate", {
											framework: "React",
										})}
										disabled={!canUpdate}
									/>
								)}
								name="degreeDate"
								control={control}
							/>
						</div>{" "}
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.qualificationName", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="degreeName"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.qualificationCountry", {
											framework: "React",
										})}
										options={dropdownOptions.countries}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="degreeCountry"
								control={control}
							/>
						</div>
					</div>{" "}
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.universityName", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="universityName"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
				<ShadowedContainer className={styles.basic}>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("emirate.name", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="residenceEmirate"
								control={control}
								defaultValue={""}
							/>
						</div>{" "}
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("common.city", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="residenceCity"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("common.area", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="residenceArea"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.phone", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="phone"
								control={control}
								defaultValue={""}
							/>
						</div>{" "}
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.phone2", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="phone2"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("user.phoneOffice", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="phoneOffice"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>{" "}
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emailLan", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emailLan"
								control={control}
								defaultValue={""}
							/>
						</div>{" "}
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emailNet", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emailNet"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
				<ShadowedContainer className={styles.basic}>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.gender", {
											framework: "React",
										})}
										options={dropdownOptions.genders}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="gender"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.maritalStatus", {
											framework: "React",
										})}
										options={dropdownOptions.maritalStatuses}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="maritalStatus"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.religion", {
											framework: "React",
										})}
										options={dropdownOptions.religions}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="religion"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<DatePicker
										date={value || new Date()}
										onChange={onChange}
										labeltext={t("employee.dob", {
											framework: "React",
										})}
										disabled={!canUpdate}
									/>
								)}
								name="birthDate"
								control={control}
								defaultValue={new Date().toISOString()}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.birthPlace", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="birthPlace"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.specialNeeds", {
											framework: "React",
										})}
										options={dropdownOptions.specialNeeds}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="specialNeed"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.healthStatus", {
											framework: "React",
										})}
										options={dropdownOptions.healthStatuses}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="healthStatus"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.passportNo", {
											framework: "React",
										})}
										value={value || ""}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="passportNo"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.familyBook", {
											framework: "React",
										})}
										value={value || ""}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="familyBookNo"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.eid", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emiratesIdNo"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.uid", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="uidNo"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.districtNo", {
											framework: "React",
										})}
										value={value || ""}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="districtNo"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.districtName", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="districtName"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<DatePicker
										date={value}
										onChange={onChange}
										labeltext={t("employee.lastMedTestDate", {
											framework: "React",
										})}
										disabled={!canUpdate}
									/>
								)}
								name="lastMedicalTestDate"
								control={control}
								defaultValue={new Date().toISOString()}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.bloodType", {
											framework: "React",
										})}
										options={dropdownOptions.bloodTypes}
										onSelect={onChange}
										value={value}
										disabled={!canUpdate}
									/>
								)}
								name="bloodType"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.height", {
											framework: "React",
										})}
										value={value || ""}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="height"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.weight", {
											framework: "React",
										})}
										value={value || ""}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="weight"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.notes", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="notes"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
				<ShadowedContainer className={styles.basic}>
					<h4 className={styles.heading}>
						{t("employee.emergency.heading", {
							framework: "React",
						})}
					</h4>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.name", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyCallName"
								control={control}
								defaultValue={""}
							/>
						</div>{" "}
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.relation", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyCallRelation"
								control={control}
								defaultValue={""}
							/>
						</div>{" "}
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.phone", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyCallPhone"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.address", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyCallAddress"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>{" "}
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.name", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyOtherName"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.relation", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyOtherRelation"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.phone2", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyOtherPhone"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.emergency.address", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
										disabled={!canUpdate}
									/>
								)}
								name="emergencyOtherAddress"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
				<div>
					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							<ErrorMessage
								errors={errors}
								name="employeeNo"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="name"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="nameEnglish"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="class"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="hireDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="joinDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="rank"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="contractType"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="profession"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="nationality"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="nationalService"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="status"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="statusDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="militaryCardExpiryDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="department"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="section"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="professionalTraining"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="workMode"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="workGroup"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="signList"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="actJob"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="assignedJob"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="militaryTrained"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="militaryWear"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="qualification"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							{/* <ErrorMessage
								errors={errors}
								name="degreeDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/> */}
							{/* <ErrorMessage
								errors={errors}
								name="degreeName"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/> */}
							<ErrorMessage
								errors={errors}
								name="degreeCountry"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="phone"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="gender"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="maritalStatus"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="religion"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="birthDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							{/* <ErrorMessage
								errors={errors}
								name="birthPlace"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/> */}
							<ErrorMessage
								errors={errors}
								name="specialNeeds"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="healthStatus"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							{/* <ErrorMessage
								errors={errors}
								name="passportNo"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/> */}
							<ErrorMessage
								errors={errors}
								name="emiratesIdNo"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="uidNo"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							{/* <ErrorMessage
								errors={errors}
								name="lastMedicalTestDate"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/> */}
							<ErrorMessage
								errors={errors}
								name="bloodType"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="emergencyCallName"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="emergencyCallRelation"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="emergencyCallPhone"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="emergencyCallAddress"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							{/* Photo */}
							<ErrorMessage
								errors={errors}
								name="imageName"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
						</ShadowedContainer>
					)}
				</div>
				{canUpdate && (
					<ShadowedContainer className={styles.row}>
						<div className={styles.actions}>
							<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
								<Button type="submit">{actionButtonText}</Button>
							</div>
						</div>
					</ShadowedContainer>
				)}
			</div>
		</form>
	);
};

export default EmployeeForm;
