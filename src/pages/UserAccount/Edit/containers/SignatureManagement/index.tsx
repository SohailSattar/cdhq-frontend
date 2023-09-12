import { FC, useCallback, useEffect, useState } from "react";
import {
	APIEmployeeSignature,
	APIUpdateEmployeeSignature,
} from "../../../../../api/employees/types";
import {
	IEmployeeSignatureFormInputs,
	SignatureForm,
} from "../../../../../components";
import { Id } from "../../../../../utils";
import { getEmployeeSignature } from "../../../../../api/employees/get/getEmployeeSignature";
import { updateEmployeeSignature } from "../../../../../api/employees/update/updateEmployeeSignature";

interface Props {
	// employeeId: string;
	data: APIEmployeeSignature;
	onSubmit: (data: IEmployeeSignatureFormInputs) => void;
}

const SignatureManagement: FC<Props> = ({ data, onSubmit }) => {
	// const [signature, setSignature] = useState<APIEmployeeSignature>();

	// const fetchSignature = useCallback(async () => {
	// 	const { data } = await getEmployeeSignature(employeeId);
	// 	if (data) {
	// 		setSignature(data);
	// 		console.log(data);
	// 	}
	// }, [employeeId]);

	// useEffect(() => {
	// 	if (employeeId) {
	// 		fetchSignature();
	// 	}
	// }, [employeeId, fetchSignature]);

	return (
		<>
			<SignatureForm
				data={data}
				onSubmit={onSubmit}
			/>
		</>
	);
};

export default SignatureManagement;
