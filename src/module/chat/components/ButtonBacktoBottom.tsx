import { ArrowCircleDownIcon } from "@heroicons/react/outline";
import React from "react";

const ButtonBackToBottom = ({
	handleBackToBottom,
}: {
	handleBackToBottom: any;
}) => {
	return (
		<div
			onClick={handleBackToBottom}
			className="w-10 h-10 text-primary shadow-sm hover:-translate-y-1 hover:shadow-md cursor-pointer rounded-full absolute bottom-20 left-[50%] translate-x-[-50%]"
		>
			<ArrowCircleDownIcon className="w-full h-full rounded-full" />
		</div>
	);
};

export default ButtonBackToBottom;
