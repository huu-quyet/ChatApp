/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const color = require("./src/utils/types/color/colors");
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		container: {
			center: true,
		},

		fontFamily: {
			sans: ["Nunito", "sans-serif"],
		},

		extend: {
			colors: color.colors,
			screens: {
				lg: "968px",
				ssm: "320px",
			},
		},
	},
	plugins: [],
};
