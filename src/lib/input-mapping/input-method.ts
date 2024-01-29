import { RunService, UserInputService } from "@rbxts/services";
import Signal from "@rbxts/signal";

import { BindingInput } from "../bindings/binding-input";
import { InputEnums } from "../enums/enums";
import { RobloxInputMethod3AReverseMap } from "../enums/methods";
import { RobloxInputType3AReverseMap } from "../enums/types";
import { keyCodeFromInputObject, methodFromInputObject } from "../util/io-utils";
import { RenderFirst } from "../util/render-first";
import { InputMethodMap } from "./input-method-map";

export const enum InputMethodMode {
	/**
	 * Input method will be automatically determined by the latest registered input
	 *
	 * This is the default behavior.
	 */
	Dynamic,
	/**
	 * Identical to `Dynamic`, except only inputs with certain selected input
	 * types are registered.
	 */
	DynamicSelective,

	/**
	 * The current input method will not change.
	 *
	 * This is most useful when you want to manually select the input method
	 * for the player. To set an input method, use:
	 * ```lua
	 * Input.setInputMethod(Input.Method.Keyboard)
	 * ```
	 *
	 * If called before the default behavior assigns an input method, the current
	 * method will be `None` and all inputs will be dropped. To mitigate this, you
	 * should always call `Input.setInputMethod` after setting the mode to `Static`
	 */
	Static,
}

export class InputMethodController {
	private currentMethods = new Array<InputEnums.Method>();
	private currentMode = InputMethodMode.Dynamic;

	private queuedMethods = new Array<InputEnums.Method>();

	private methodSelection = new Array<InputEnums.Method>();

	private currentMethodLocked = false;
	private preferredList = new Array<InputEnums.Method>();
	private preferredRegistered = false;

	private selectiveList = new Array<InputEnums.Method>();

	private inputBuffer = new Array<InputObject>();
	private methodMaps = new Map<InputEnums.Method, Array<InputMethodMap>>();

	public readonly inputMethodsChanged = new Signal<(methods: Array<InputEnums.Method>) => void>();

	constructor() {
		UserInputService.InputBegan.Connect((i) => this.onInput(i));
		UserInputService.InputEnded.Connect((i) => this.onInput(i));
		UserInputService.InputChanged.Connect((i) => this.onInput(i));

		RunService.Heartbeat.Connect(() => {
			this.currentMethodLocked = false;
			this.preferredRegistered = false;
		});

		RenderFirst.bindAt(10, () => {
			if (!this.queuedMethods.isEmpty()) {
				this.currentMethods.clear();
				const temp = this.currentMethods;
				this.currentMethods = this.queuedMethods;
				this.queuedMethods = temp;
			}

			this.broadcastInputs();
		});
	}

	private onInput(input: InputObject): void {
		const inputType = RobloxInputType3AReverseMap.get(input.UserInputType);
		if (inputType === undefined) return;

		const inputMethod = RobloxInputMethod3AReverseMap.get(inputType);
		if (inputMethod === undefined) return;

		if (this.updateInputMethod(inputMethod)) {
			this.inputBuffer.push(input);
		}
	}

	/**
	 * Attempts to change the current method based on the incoming input.
	 *
	 * Returns a boolean indicating whether or not the input is valid to
	 * process given the current `InputMethodMode`.
	 */
	private updateInputMethod(method: InputEnums.Method): boolean {
		if (this.currentMode === InputMethodMode.Dynamic) {
			this.queueInputMethod(method);
		} else if (this.currentMode === InputMethodMode.DynamicSelective) {
			if (!this.selectiveList.includes(method)) return false;

			this.queueInputMethod(method);
		} else if (this.currentMode === InputMethodMode.Static) {
			if (!this.currentMethods.includes(method)) return false;
		}

		return true;
	}

	private queueInputMethod(method: InputEnums.Method): void {
		this.queuedMethods.push(method);
	}

	public setInputMethods(methods: Array<InputEnums.Method>): void {
		this.currentMethods = methods;
	}

	private broadcastInputs(): void {
		this.inputBuffer.forEach((io) => {
			const input = new BindingInput(io);

			const method = methodFromInputObject(io);
			if (method === undefined) return;

			/**
			 * None method is a special case, it should be
			 * received in all circumstances, regardless of active method.
			 * This makes it more akin to an `any` method
			 */
			if (method === InputEnums.Method.None) {
				const keyCode = keyCodeFromInputObject(io);

				this.methodMaps.forEach((maps) =>
					maps.forEach(({ map }) => {
						map.forEach((kc, action) => {
							if (!action.isActive()) return;
							if (keyCode !== kc) return;

							action.fireBindings(input);
						});
					}),
				);

				return;
			}

			if (!this.currentMethods.includes(method)) return;

			const maps = this.methodMaps.get(method);
			if (maps === undefined) return;

			const keyCode = keyCodeFromInputObject(io);

			maps.forEach(({ map }) => {
				map.forEach((kc, action) => {
					if (!action.isActive()) return;
					if (keyCode !== kc) return;

					action.fireBindings(input);
				});
			});
		});

		this.inputBuffer.clear();
	}

	public addMethodMap(map: InputMethodMap): void {
		let maps = this.methodMaps.get(map.method);
		if (maps === undefined) {
			maps = [];
			this.methodMaps.set(map.method, maps);
		}

		maps.push(map);
	}
}

export const inputMethodController = new InputMethodController();
