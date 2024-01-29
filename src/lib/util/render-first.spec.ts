/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";

import { RenderFirst } from "./render-first";

export = () => {
	describe("RenderFirst should", () => {
		it("Run callbacks in ascending order", () => {
			let thing = 0;
			let worked1 = false;
			let worked2 = false;
			let worked3 = false;

			RenderFirst.bindAt(1, () => {
				worked1 = thing === 0;
				thing = 1;
			});
			RenderFirst.bindAt(4, () => {
				worked2 = thing === 1;
				thing = 2;
			});
			RenderFirst.bindAt(7, () => {
				worked3 = thing === 2;
				thing = 3;
			});

			RunService.PreRender.Wait();
			RunService.PostSimulation.Wait();

			expect(worked1);
			expect(worked2);
			expect(worked3);
			expect(thing === 3);
		});
	});
};
