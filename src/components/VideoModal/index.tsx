import { FC } from "react";
import ReactPlayer from "react-player";
import Modal from "../Modal";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	selectedPath: string;
}

const VideoModal: FC<Props> = ({ isOpen, onClose, selectedPath }) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<ReactPlayer
				url={selectedPath}
				playing={true}
				width="100%"
				height="600px"
				controls={true}
			/>
		</Modal>
	);
};

export default VideoModal;
