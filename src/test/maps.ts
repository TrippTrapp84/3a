import { InputEnums } from "../lib/enums/enums";
import { makeInputActionSet } from "../lib/input-mapping/input-action";
import { InputMethodMap } from "../lib/input-mapping/input-method-map";

export enum TestActions {
	Action1,
	Action2,
	Action3,
}

export const actions = makeInputActionSet(TestActions);

export const kbmMap = new InputMethodMap(
	InputEnums.Method.KeyboardMouse,
	new Map([
		[actions.Action1, InputEnums.KeyCode.W],
		[actions.Action2, InputEnums.KeyCode.MouseButton1],
		[actions.Action3, InputEnums.KeyCode.MouseMovement],
	]),
);

export const gamepadMap = new InputMethodMap(
	InputEnums.Method.Gamepad,
	new Map([
		[actions.Action1, InputEnums.KeyCode.ButtonA],
		[actions.Action2, InputEnums.KeyCode.Thumbstick1],
		[actions.Action3, InputEnums.KeyCode.ButtonL3],
	]),
);
