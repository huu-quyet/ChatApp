import React from "react";

const CircleLoading = (): JSX.Element => {
	return (
		<div className="w-full h-[90%] bg-gray-300 relative z-10">
			<span className="w-8 h-8 animate-spin border-4 border-primary relative top-1/2 left-1/2 rounded-t-full rounded-b-full border-l-transparent inline-block z-20"></span>
		</div>
	);
};

export default CircleLoading;
