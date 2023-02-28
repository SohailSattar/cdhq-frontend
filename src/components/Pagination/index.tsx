import { FC } from "react";
import clsx from "clsx";
import { DOTS, usePagination } from "./usePagination";
import classnames from "classnames";
import { useStore } from "../../utils/store";

import "./styles.scss";

export interface Props {
	onPageChange: (value: number) => void;
	totalCount: number;
	siblingCount?: number;
	currentPage: number;
	pageSize: number;
	className?: any;
}

const Pagination: FC<Props> = ({
	onPageChange,
	totalCount,
	siblingCount = 1,
	currentPage,
	pageSize,
	className,
}) => {
	const language = useStore((state) => state.language);

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	if (currentPage === 0 || paginationRange!.length! < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange![paginationRange!.length - 1];
	return (
		<ul
			className={classnames("pagination-container", "pagination-bar", {
				[className]: className,
			})}
		>
			<li
				className={classnames("pagination-item", {
					disabled: currentPage === 1,
				})}
				onClick={onPrevious}
			>
				<div className={clsx("arrow ", language !== "ar" ? "right" : "left")} />
			</li>
			{paginationRange?.map((pageNumber, index) => {
				if (pageNumber === DOTS) {
					return (
						<li className="pagination-item dots" key={index}>
							&#8230;
						</li>
					);
				}

				return (
					<li
						key={index}
						className={classnames("pagination-item", {
							selected: pageNumber === currentPage,
						})}
						onClick={() => onPageChange(pageNumber)}
					>
						{pageNumber}
					</li>
				);
			})}
			<li
				className={classnames("pagination-item", {
					disabled: currentPage === lastPage,
				})}
				onClick={onNext}
			>
				<div className={clsx("arrow ", language !== "ar" ? "left" : "right")} />
			</li>
		</ul>
	);
};

export default Pagination;
