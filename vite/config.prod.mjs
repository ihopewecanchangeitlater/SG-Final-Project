import { defineConfig } from "vite";

const phasermsg = () => {
	return {
		name: "phasermsg",
		buildStart() {
			process.stdout.write(`Building for production...\n`);
		},
		buildEnd() {
			const line = "---------------------------------------------------------";
			process.stdout.write(`Done\n`);
		},
	};
};

export default defineConfig({
	base: "/SG-Final-Project/",
	logLevel: "warning",
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					phaser: ["phaser"],
				},
			},
		},
		minify: "terser",
		terserOptions: {
			compress: {
				passes: 2,
			},
			mangle: true,
			format: {
				comments: false,
			},
		},
	},
	server: {
		port: 8080,
	},
	plugins: [phasermsg()],
});
