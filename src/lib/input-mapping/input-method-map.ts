import { InputEnums } from "../enums/enums";
import { InputAction } from "./input-action";
import { inputMethodController } from "./input-method";

export class InputMethodMap {
	constructor(
		public readonly method: InputEnums.Method,
		public readonly map: Map<InputAction, InputEnums.KeyCode>,
	) {
		map.forEach((kc, action) => action.addKey(kc));

		inputMethodController.addMethodMap(this);
	}
}
