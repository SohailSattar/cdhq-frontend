import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	DeleteConfirmation,
	Loading,
	PageContainer,
	RedirectButton,
	ShadowedContainer,
	Status,
	UserProjectTable,
} from "../../../components";
import Details from "./containers/Details";

import { getUserDetail } from "../../../api/users/get/getUserDetail";

import { useStore } from "../../../utils/store";
import { APIUpdateUserStatus, APIUserDetail } from "../../../api/users/types";
import { ROLE } from "../../../utils";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { updateUserStatus } from "../../../api/users/update/updateUserStatus";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";

const UserDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

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

		toast.success(
			t("message.userActivated", { framework: "React" }).toString()
		);
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

		toast.error(
			t("message.userDeactivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<div className={styles.userDetail}>
			{isLoading ? (
				<Loading
					text={t("global.loading", { framework: "React" }).toString()}
				/>
			) : (
				<PageContainer
					showEditButton={role === ROLE.SUPERADMIN}
					btnEditUrlLink={`${RoutePath.USER_EDIT.replace(RoutePath.ID, id!)}`}
					showChangeStatusButton={
						role === ROLE.SUPERADMIN && loggedUserId !== user?.id
					}
					currentStatus={status?.id === 7 ? "ACTIVE" : "DEACTIVE"}
					onActivate={activateButtonClickHandler}
					onDectivate={deleteButtonClickHandler}
				>
					<div>
						{(role === ROLE.ADMIN || role === ROLE.SUPERADMIN) && (
							<ShadowedContainer className={styles.btnSection}>
								{
									<div
										className={language !== "ar" ? styles.btn : styles.btnLTR}
									>
										<RedirectButton
											label={t("button.assignProject", { framework: "React" })}
											redirectTo={`${RoutePath.USER}/${id}/project/assign`}
										/>
									</div>
								}
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
				</PageContainer>
			)}
		</div>
	);
};

export default UserDetailPage;
