import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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
import { use } from "i18next";
import { getSpecialNeeds } from "../../../api/specialNeeds/get/getSpecialNeeds";
import { getHealthStatuses } from "../../../api/healthStatuses/get/getHealthStatuses";
import { getBloodTypes } from "../../../api/bloodTypes/get/getBloodTypes";
import { getRelatives } from "../../../api/relatives/get/getRelatives";
import DatePicker from "../../DatePicker";
import { getMoiJobCategories } from "../../../api/moi/get/getMoiJobCategories";

import styles from "./styles.module.scss";
import { useCallback } from "react";
import { Id } from "../../../utils";
import { getMoiActJobs } from "../../../api/moi/get/getMoiActJobs";
import { APIActualJobMOI } from "../../../api/moi/types";

interface Props {
	data?: APIEmployeeDetail;
	actionButtonText: string;
	onSubmit: (data: IEmployeeFormInputs) => void;
	onImageUpload?: (image: File) => void;
	serverErrors?: string[];
}

const EmployeeForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
	serverErrors = [],
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
	const [rankOptions, setRankOptions] = useState<DropdownOption[]>([]);
	const [contractTypeOptions, setContractTypeOptions] = useState<
		DropdownOption[]
	>([]);
	const [professionOptions, setProfessionOptions] = useState<DropdownOption[]>(
		[]
	);
	const [countryOptions, setCountryOptions] = useState<DropdownOption[]>([]);
	const [nationalServiceOptions, setNationalServiceOptions] = useState<
		DropdownOption[]
	>([]);
	const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);
	const [professionalTrainingOptions, setProfessionalTrainingOptions] =
		useState<DropdownOption[]>([]);
	const [workModeOptions, setWorkModeOptions] = useState<DropdownOption[]>([]);
	const [workGroupOptions, setWorkGroupOptions] = useState<DropdownOption[]>(
		[]
	);
	const [signaturesListsOptions, setSignaturesListsOptions] = useState<
		DropdownOption[]
	>([]);

	const [jobCategoryMoiOptions, setJobCategoryMoiOptions] = useState<
		DropdownOption[]
	>([]);
	const [actJobMoiOptions, setActJobMoiOptions] = useState<DropdownOption[]>(
		[]
	);

	const [militaryTrainedOptions, setMilitaryTrainedOptions] = useState<
		DropdownOption[]
	>([]);
	const [militaryUniformOptions, setMilitaryUniformOptions] = useState<
		DropdownOption[]
	>([]);

	//////////
	const [qualificationOptions, setQualificationOptions] = useState<
		DropdownOption[]
	>([]);
	//////////
	const [genderOptions, setGenderOptions] = useState<DropdownOption[]>([]);
	const [maritalStatusOptions, setMaritalStatusOptions] = useState<
		DropdownOption[]
	>([]);
	const [religionOptions, setReligionOptions] = useState<DropdownOption[]>([]);
	const [specialNeedOptions, setSpecialNeedOptions] = useState<
		DropdownOption[]
	>([]);
	const [healthStatusOptions, setHealthStatusOptions] = useState<
		DropdownOption[]
	>([]);
	const [bloodTypeOptions, setBloodTypeOptions] = useState<DropdownOption[]>(
		[]
	);
	const [relativeOptions, setRelativeOptions] = useState<DropdownOption[]>([]);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IEmployeeFormInputs>({ criteriaMode: "all" });

	const fetchActJobMoi = useMemo(
		() => async (categoryId: Id) => {
			const { data: list } = await getMoiActJobs(categoryId);
			if (list) {
				setActJobMoiOptions(
					list?.map((d) => {
						return {
							label: d.name,
							value: d.id,
						};
					})
				);
			}
			console.log("check");
		},
		[]
	);

	useEffect(() => {
		if (data) {
			const {
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
				professionalTraining,
				workMode,
				workGroup,
				signList,
				actJobMOI,
				assignedJob,
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
				emergencyOtherContact,
			} = data;
			setValue("employeeNo", employeeNo!);
			setValue("name", name!);
			setValue("nameEnglish", nameEnglish!);

			const selectedClass = classOptions.find(
				(x: { value: any }) => x.value === recruiter?.id!
			);
			setValue("class", selectedClass!);

			setValue("hireDate", hireDate!);
			setValue("joinDate", joinDate!);

			const selectedRank = rankOptions.find(
				(x: { value: any }) => x.value === rank?.id!
			);
			setValue("rank", selectedRank!);

			const selectedContract = contractTypeOptions.find(
				(x: { value: any }) => x.value === contractType?.id!
			);
			setValue("contractType", selectedContract!);

			const selectedProfession = professionOptions.find(
				(x: { value: any }) => x.value === profession?.id!
			);
			setValue("profession", selectedProfession!);

			const selectedaNationality = countryOptions.find(
				(x: { value: any }) => x.value === nationality?.id!
			);
			setValue("nationality", selectedaNationality!);

			const selectedNationalService = nationalServiceOptions.find(
				(x: { value: any }) => x.value === nationalService?.id!
			);
			setValue("nationalService", selectedNationalService!);
			setValue("nationalServiceGroup", nationalServiceGroup! || "");

			const selectedStatus = statusOptions.find(
				(x: { value: any }) => x.value === status?.id!
			);
			setValue("status", selectedStatus!);

			setValue("statusDetails", statusDetail! || "");
			setValue("statusDate", statusDate!);

			setValue("militaryCardExpiryDate", militaryCardExpiryDate);

			const selectedDepartment = departmentOptions.find(
				(x: { value: any }) => x.value === department?.id!
			);
			setValue("department", selectedDepartment!);

			const selectedSection = departmentOptions.find(
				(x: { value: any }) => x.value === section?.id!
			);
			setValue("section", selectedSection!);

			const selectedProfessionTraining = professionalTrainingOptions.find(
				(x: { value: any }) => x.value === professionalTraining?.id!
			);
			setValue("professionalTraining", selectedProfessionTraining!);

			const selectedWorkMode = workModeOptions.find(
				(x: { value: any }) => x.value === workMode?.id!
			);
			setValue("workMode", selectedWorkMode!);

			const selectedWorkGroup = workGroupOptions.find(
				(x: { value: any }) => x.value === workGroup?.id!
			);
			setValue("workGroup", selectedWorkGroup!);

			const selectedSignList = signaturesListsOptions.find(
				(x: { value: any }) => x.value === signList?.id!
			);
			setValue("signList", selectedSignList!);

			const selectedjobCatMoi = jobCategoryMoiOptions.find(
				(x) => x.value === actJobMOI.groupId
			);
			setValue("jobCatMoi", selectedjobCatMoi!);

			const selectedMilitaryTrained = militaryTrainedOptions.find(
				(x: { value: any }) => x.value === militaryTrain?.id!
			);
			setValue("militaryTrained", selectedMilitaryTrained!);

			const selectedMilitaryWear = militaryUniformOptions.find(
				(x: { value: any }) => x.value === militaryWear?.id!
			);
			setValue("militaryWear", selectedMilitaryWear!);

			//////////////////////////////////////
			const selectedQualification = qualificationOptions.find(
				(x: { value: any }) => x.value === qualification?.id!
			);
			setValue("qualification", selectedQualification!);

			setValue("degreeDate", degreeDate! || "");
			setValue("degreeName", degreeName! || "");

			const selectedDegreeCountry = countryOptions.find(
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
			const selectedGender = genderOptions.find(
				(x: { value: any }) => x.value === gender?.id!
			);
			setValue("gender", selectedGender!);

			const selectedMaritalStatus = maritalStatusOptions.find(
				(x: { value: any }) => x.value === maritalStatus?.id!
			);
			setValue("maritalStatus", selectedMaritalStatus!);

			const selectedReligion = religionOptions.find(
				(x: { value: any }) => x.value === religion?.id!
			);
			setValue("religion", selectedReligion!);

			setValue("birthDate", birthDate! || "");
			setValue("birthPlace", birthPlace! || "");

			const selectedSpecialNeed = specialNeedOptions.find(
				(x: { value: any }) => x.value === specialNeed?.id!
			);
			setValue("specialNeed", selectedSpecialNeed!);

			const selectedHealthStatus = healthStatusOptions.find(
				(x: { value: any }) => x.value === healthStatus?.id!
			);
			setValue("healthStatus", selectedHealthStatus!);

			setValue("passportNo", passportNo! || "");
			setValue("familyBookNo", familyBookNo! || "");
			setValue("emiratesIdNo", emiratesIdNo! || "");
			setValue("uidNo", uidNo! || "");
			setValue("districtNo", districtNo! || "");
			setValue("districtName", districtName! || "");
			setValue("lastMedicalTestDate", lastMedicalTestDate!);

			const selectedBloodType = bloodTypeOptions.find(
				(x: { value: any }) => x.value === bloodType?.id!
			);
			setValue("bloodType", selectedBloodType!);

			setValue("height", height! || "");
			setValue("weight", weight! || "");
			setValue("notes", notes! || "");
			////////////////////////////////////////
			setValue("emergencyCallName", emergencyCallName! || "");

			const selectedEmergencyCallRelation = relativeOptions.find(
				(x: { value: any }) => x.value === emergencyCallRelation?.id!
			);
			setValue("emergencyCallRelation", selectedEmergencyCallRelation!);

			setValue("emergencyCallPhone", emergencyCallPhone! || "");
			setValue("emergencyCallAddress", emergencyCallAddress! || "");
			setValue("emergencyOtherContact", emergencyOtherContact! || "");
			console.log("abcbabsb");
		}
	}, [
		bloodTypeOptions,
		classOptions,
		contractTypeOptions,
		countryOptions,
		data,
		departmentOptions,
		genderOptions,
		healthStatusOptions,
		jobCategoryMoiOptions,
		maritalStatusOptions,
		militaryTrainedOptions,
		militaryUniformOptions,
		nationalServiceOptions,
		professionOptions,
		professionalTrainingOptions,
		qualificationOptions,
		rankOptions,
		relativeOptions,
		religionOptions,
		setValue,
		signaturesListsOptions,
		specialNeedOptions,
		statusOptions,
		workGroupOptions,
		workModeOptions,
	]);

	useEffect(() => {
		if (data) {
			const { actJobMOI } = data;
			fetchActJobMoi(actJobMOI.groupId);
			console.log("fetch jobCatMoi");
		}
	}, [data, fetchActJobMoi]);

	useEffect(() => {
		if (data) {
			const { actJobMOI } = data;
			const selectedActJobMoi = actJobMoiOptions.find(
				(x) => x.value === actJobMOI?.id
			);
			setValue("actJob", selectedActJobMoi!);
			console.log("populate jobCatMoi");
		}
	}, [actJobMoiOptions, data, setValue]);

	useEffect(() => {
		const fetchClasses = async () => {
			const { data } = await getClasses();
			if (data) {
				setClassOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchClasses();
	}, [language]);

	useEffect(() => {
		const fetchRanks = async () => {
			const { data } = await getRanks();
			if (data) {
				setRankOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchRanks();
	}, [language]);

	useEffect(() => {
		const fetchContractTypes = async () => {
			const { data } = await getContractTypes();
			if (data) {
				setContractTypeOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchContractTypes();
	}, [language]);

	useEffect(() => {
		const fetchProfessions = async () => {
			const { data } = await getProfessions();
			if (data) {
				setProfessionOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchProfessions();
	}, [language]);

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await getCountries();
			if (data) {
				setCountryOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchCountries();
	}, [language]);

	useEffect(() => {
		const fetchNationalService = async () => {
			const { data } = await getNationalServices();
			if (data) {
				setNationalServiceOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchNationalService();
	}, [language]);

	useEffect(() => {
		const fetchStatus = async () => {
			const { data } = await getEmployeeStatuses();
			if (data) {
				setStatusOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};
		fetchStatus();
	}, [language]);

	useEffect(() => {
		const fetchDepartments = async () => {
			const { data } = await getCategorizedDepartments();
			if (data) {
				setDepartmentOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.fullName : d.fullNameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchDepartments();
	}, [language]);

	useEffect(() => {
		const fetchProfessionalTraining = async () => {
			const { data } = await getProfessionalTrainings();
			if (data) {
				setProfessionalTrainingOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchProfessionalTraining();
	}, [language]);

	useEffect(() => {
		const fetchWorkMode = async () => {
			const { data } = await getWorkModes();
			if (data) {
				setWorkModeOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchWorkMode();
	}, [language]);

	useEffect(() => {
		const fetchWorkGroup = async () => {
			const { data } = await getWorkGroups();
			if (data) {
				setWorkGroupOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchWorkGroup();
	}, [language]);

	useEffect(() => {
		const fetchSignaturesLists = async () => {
			const { data } = await getSignaturesList();
			if (data) {
				setSignaturesListsOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchSignaturesLists();
	}, [language]);

	useEffect(() => {
		const fetchJobCategoryMoi = async () => {
			const { data } = await getMoiJobCategories();
			if (data) {
				setJobCategoryMoiOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchJobCategoryMoi();
	}, [language]);

	useEffect(() => {
		const fetchMilitraryTrained = async () => {
			const { data } = await getMilitaryTrained();
			if (data) {
				setMilitaryTrainedOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchMilitraryTrained();
	}, [language]);

	useEffect(() => {
		const fetchMilitraryUniform = async () => {
			const { data } = await getMilitaryWear();
			if (data) {
				setMilitaryUniformOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchMilitraryUniform();
	}, [language]);

	////////////////////////////////////

	useEffect(() => {
		const fetchQualification = async () => {
			const { data } = await getQualifications();
			if (data) {
				setQualificationOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchQualification();
	}, [language]);

	////////////////////////////////////

	useEffect(() => {
		const fetchGenders = async () => {
			const { data } = await getGenders();
			if (data) {
				setGenderOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchGenders();
	}, [language]);

	useEffect(() => {
		const fetchMaritalStatus = async () => {
			const { data } = await getMaritalStatuses();
			if (data) {
				setMaritalStatusOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchMaritalStatus();
	}, [language]);

	useEffect(() => {
		const fetchReligions = async () => {
			const { data } = await getReligions();
			if (data) {
				setReligionOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchReligions();
	}, [language]);

	useEffect(() => {
		const fetchSpecialNeeds = async () => {
			const { data } = await getSpecialNeeds();
			if (data) {
				setSpecialNeedOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchSpecialNeeds();
	}, [language]);

	useEffect(() => {
		const fetchHealthStatus = async () => {
			const { data } = await getHealthStatuses();
			if (data) {
				setHealthStatusOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchHealthStatus();
	}, [language]);

	useEffect(() => {
		const fetchBloodType = async () => {
			const { data } = await getBloodTypes();
			if (data) {
				setBloodTypeOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchBloodType();
	}, [language]);

	useEffect(() => {
		const fetchRelatives = async () => {
			const { data } = await getRelatives();
			if (data) {
				setRelativeOptions(
					data?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchRelatives();
	}, [language]);

	////////////////////////////////////
	const jobCategoryMoiChangeHandler = async (option: DropdownOption) => {
		setValue("jobCatMoi", option);
		if (option) {
			setValue("jobCatMoi", option);
			// setValue("actJob", null);
			await fetchActJobMoi(option.value);
			console.log("adasa");
		}
	};

	return (
		<form>
			<div className={styles.empForm}>
				<div className={styles.row}>
					<ShadowedContainer className={styles.basic}>
						<div className={styles.row}>
							<div className={styles.field}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("employee.militaryNo", { framework: "React" })}
											value={value}
											onChange={onChange}
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
											options={classOptions}
											onSelect={onChange}
											value={value}
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
											setDate={onChange}
											labelText={t("employee.hireDate", {
												framework: "React",
											})}
										/>
									)}
									name="hireDate"
									control={control}
								/>
							</div>
							<div className={styles.field}>
								<Controller
									render={({ field: { onChange, value } }) => (
										<DatePicker
											date={value}
											setDate={onChange}
											labelText={t("employee.joinDate", {
												framework: "React",
											})}
										/>
									)}
									name="joinDate"
									control={control}
								/>
							</div>
							<div className={styles.ddlField}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<Dropdown
											label={t("rank.name", { framework: "React" })}
											options={rankOptions}
											onSelect={onChange}
											value={value}
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
											label={t("employee.contractType", { framework: "React" })}
											options={contractTypeOptions}
											onSelect={onChange}
											value={value}
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
											options={professionOptions}
											onSelect={onChange}
											value={value}
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
											label={t("employee.nationality", { framework: "React" })}
											options={countryOptions}
											onSelect={onChange}
											value={value}
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
											options={nationalServiceOptions}
											onSelect={onChange}
											value={value}
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
											options={statusOptions}
											onSelect={onChange}
											value={value}
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
											value={value}
											onChange={onChange}
										/>
									)}
									name="statusDetails"
									control={control}
									defaultValue={""}
								/>
							</div>
							<div className={styles.field}>
								<Controller
									render={({ field: { onChange, value } }) => (
										<DatePicker
											date={value}
											setDate={onChange}
											labelText={t("employee.statusDate", {
												framework: "React",
											})}
										/>
									)}
									name="statusDate"
									control={control}
								/>
							</div>
							<div className={styles.field}>
								<Controller
									render={({ field: { onChange, value } }) => (
										<DatePicker
											date={value}
											setDate={onChange}
											labelText={t("employee.milCardExpDate", {
												framework: "React",
											})}
										/>
									)}
									name="militaryCardExpiryDate"
									control={control}
								/>
							</div>
						</div>
					</ShadowedContainer>
				</div>
				<Hr />
				{/* <div className={styles.row}> */}
				<ShadowedContainer className={styles.basic}>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.workplace", { framework: "React" })}
										options={departmentOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="department"
								control={control}
							/>
						</div>

						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.workLocation", {
											framework: "React",
										})}
										options={departmentOptions}
										onSelect={onChange}
										value={value}
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
										options={professionalTrainingOptions}
										onSelect={onChange}
										value={value}
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
										options={workModeOptions}
										onSelect={onChange}
										value={value}
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
										options={workGroupOptions}
										onSelect={onChange}
										value={value}
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
										options={signaturesListsOptions}
										onSelect={onChange}
										value={value}
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
										options={jobCategoryMoiOptions}
										onSelect={jobCategoryMoiChangeHandler}
										value={value}
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
										options={contractTypeOptions}
										onSelect={onChange}
										value={value}
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
									/>
								)}
								name="additionalJob"
								control={control}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.additionalJob", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
									/>
								)}
								name="additionalJob"
								control={control}
							/>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.additionalJob", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
									/>
								)}
								name="additionalJob"
								control={control}
							/>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("employee.additionalJob", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
									/>
								)}
								name="additionalJob"
								control={control}
							/>
						</div>{" "}
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.militaryTrained", {
											framework: "React",
										})}
										options={militaryTrainedOptions}
										onSelect={onChange}
										value={value}
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
										options={militaryUniformOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="militaryWear"
								control={control}
							/>
						</div>
					</div>
				</ShadowedContainer>
				{/* </div> */}
				<Hr />
				{/* <div className={styles.row}> */}
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
										options={qualificationOptions}
										onSelect={onChange}
										value={value}
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
										setDate={onChange}
										labelText={t("employee.academicQualificationDate", {
											framework: "React",
										})}
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
										options={countryOptions}
										onSelect={onChange}
										value={value}
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
									/>
								)}
								name="universityName"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>

				<Hr />
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
										label={t("employee.area", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
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
									/>
								)}
								name="emailNet"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
				<Hr />
				<ShadowedContainer className={styles.basic}>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.gender", {
											framework: "React",
										})}
										options={genderOptions}
										onSelect={onChange}
										value={value}
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
										options={maritalStatusOptions}
										onSelect={onChange}
										value={value}
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
										options={religionOptions}
										onSelect={onChange}
										value={value}
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
										date={value}
										setDate={onChange}
										labelText={t("employee.dob", {
											framework: "React",
										})}
									/>
								)}
								name="birthDate"
								control={control}
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
										options={specialNeedOptions}
										onSelect={onChange}
										value={value}
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
										options={healthStatusOptions}
										onSelect={onChange}
										value={value}
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
										value={value}
										onChange={onChange}
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
										value={value}
										onChange={onChange}
									/>
								)}
								name="familyBookNo"
								control={control}
								defaultValue={""}
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
										value={value}
										onChange={onChange}
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
										setDate={onChange}
										labelText={t("employee.lastMedTestDate", {
											framework: "React",
										})}
									/>
								)}
								name="lastMedicalTestDate"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.bloodType", {
											framework: "React",
										})}
										options={bloodTypeOptions}
										onSelect={onChange}
										value={value}
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
										value={value}
										onChange={onChange}
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
										value={value}
										onChange={onChange}
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
									/>
								)}
								name="notes"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
				<Hr />
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
									/>
								)}
								name="emergencyCallName"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("employee.emergency.relation", {
											framework: "React",
										})}
										options={relativeOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="emergencyCallRelation"
								control={control}
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
									/>
								)}
								name="emergencyCallPhone"
								control={control}
								defaultValue={""}
							/>
						</div>{" "}
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
									/>
								)}
								name="emergencyOtherContact"
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
										label={t("employee.emergency.address", {
											framework: "React",
										})}
										value={value}
										onChange={onChange}
									/>
								)}
								name="emergencyCallAddress"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
				</ShadowedContainer>
			</div>
		</form>
	);
};

export default EmployeeForm;
