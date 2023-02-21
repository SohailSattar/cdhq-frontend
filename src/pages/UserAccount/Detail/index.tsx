import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
	Button,
	DeleteConfirmation,
	Loading,
	ShadowedContainer,
	Status,
	UserProjectTable,
} from "../../../components";
import Details from "./containers/Details";

import { getUserDetail } from "../../../api/users/get/getUserDetail";

import * as RoutePath from "../../../RouteConfig";

import { toast } from "react-toastify";
import { useStore } from "../../../utils/store";
import { APIUpdateUserStatus, APIUserDetail } from "../../../api/users/types";
import { ROLE } from "../../../utils";

import styles from "./styles.module.scss";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { updateUserStatus } from "../../../api/users/update/updateUserStatus";

const UserDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const language = useStore((state) => state.language);
	const { id: loggedUserId, role } = useStore((state) => state.loggedInUser);

	const [isLoading, setIsLoading] = useState(true);

	const [user, setUser] = useState<APIUserDetail>();

	const [status, setStatus] = useState<APIActiveStatus>();

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			const { data } = await getUserDetail(id!);

			if (data) {
				setUser(data);
				setStatus(data.activeStatus);
			} else {
				navigate(RoutePath.USER);
			}
		};

		fetchData();

		setIsLoading(false);
	}, [id, loggedUserId, navigate, role]);

	const editClickHandler = () => {
		navigate(`${RoutePath.USER}/${id}/edit`);
	};

	const assignProjectClickHandler = () => {
		navigate(`${RoutePath.USER}/${id}/project/assign`);
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const activateButtonClickHandler = async () => {
		const statusCode = 7;

		const params: APIUpdateUserStatus = {
			userId: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateUserStatus(params);
		if (data) {
			const { data: status } = await getActiveStatus(statusCode);

			if (status) {
				setStatus(status);
			}
		}

		toast.success(t("message.userActivated", { framework: "React" }));
		setShowModal(false);
	};

	const deleteConfirmationClickHandler = async () => {
		const statusCode = 8;

		const params: APIUpdateUserStatus = {
			userId: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateUserStatus(params);

		if (data) {
			const { data: status } = await getActiveStatus(statusCode);
			if (status) {
				setStatus(status);
			}
		}

		toast.error(t("message.userDeactivated", { framework: "React" }));
		setShowModal(false);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<div className={styles.userDetail}>
			{isLoading ? (
				<Loading text={t("global.loading", { framework: "React" })} />
			) : (
				<div>
					{role !== ROLE.USER && (
						<ShadowedContainer className={styles.btnSection}>
							{role === ROLE.SUPERADMIN && (
								<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
									<Button onClick={editClickHandler}>
										{t("button.edit", { framework: "React" })}
									</Button>
								</div>
							)}

							<>
								{(role === ROLE.ADMIN || role === ROLE.SUPERADMIN) && (
									<div
										className={language !== "ar" ? styles.btn : styles.btnLTR}
									>
										<Button onClick={assignProjectClickHandler}>
											{t("button.assignProject", { framework: "React" })}
										</Button>
									</div>
								)}
								{role === ROLE.SUPERADMIN && loggedUserId !== user?.id && (
									<div
										className={language !== "ar" ? styles.btn : styles.btnLTR}
									>
										{status?.id === 7 ? (
											<Button onClick={deleteButtonClickHandler} isCritical>
												{t("button.deactivate", { framework: "React" })}
											</Button>
										) : (
											<Button onClick={activateButtonClickHandler}>
												{t("button.activate", { framework: "React" })}
											</Button>
										)}
									</div>
								)}
							</>
						</ShadowedContainer>
					)}

					<Status status={status!} />
					<ShadowedContainer>
						<Details user={user!} />
					</ShadowedContainer>

					<UserProjectTable id={id!} />

					<DeleteConfirmation
						isOpen={showModal}
						onYesClick={deleteConfirmationClickHandler}
						onCancelClick={deleteCancelHandler}
					/>
				</div>
			)}
		</div>
	);
};

export default UserDetailPage;
