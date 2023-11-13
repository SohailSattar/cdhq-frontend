import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRemove } from "@fortawesome/free-solid-svg-icons";

import TextBox from "../TextBox";

import styles from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import Button from "../Button";
import ShadowedContainer from "../ShadowedContainer";
import clsx from "clsx";

export interface Props {
	label?: string;
	onClick: (value: string) => void;
	className?: string;
}

const SearchBox: FC<Props> = ({ label, onClick, className }) => {
	const [value, setValue] = useState<string>("");

	const [hideClearButton, setHideClearButton] = useState(true);

	useEffect(() => {
		if (value.length > 0) {
			setHideClearButton(false);
		} else {
			setHideClearButton(true);
		}
	}, [value]);

	const textChangeHandler = (e: any) => {
		setValue(e.target.value);
	};

	const searchButtonClickHandler = () => {
		// if (value) {
		onClick(value);
		// }
	};

	const keyPressHandler = (e: any) => {
		if (e.key === "Enter") {
			// if (value) {
			onClick(value);
			// }
		}
	};

	const clearButtonClickHandler = () => {
		setValue("");
		onClick("");
	};

	return (
		<ShadowedContainer className={clsx(styles.container, className)}>
			<div className={styles.searchBox}>
				<div className={styles.searchIcon}>
					<Button
						withIcon
						onClick={searchButtonClickHandler}
						type="button">
						<FontAwesomeIcon icon={faMagnifyingGlass} />
					</Button>
				</div>
				<TextBox
					type="text"
					label={label}
					onChange={textChangeHandler}
					onKeyDown={keyPressHandler}
					value={value}
				/>
				{!hideClearButton && (
					<div className={styles.clearIcon}>
						<Button
							withIconTransparent
							onClick={clearButtonClickHandler}>
							<FontAwesomeIcon icon={faRemove} />
						</Button>
					</div>
				)}
			</div>
		</ShadowedContainer>
	);
};

export default SearchBox;
