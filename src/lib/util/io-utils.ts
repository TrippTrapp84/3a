import { InputEnums } from "../enums/enums";
import { RobloxKeyCode3AReverseMap } from "../enums/keycodes";
import { RobloxInputMethod3AReverseMap } from "../enums/methods";
import { RobloxInputType3AReverseMap } from "../enums/types";

export function methodFromInputObject(io: InputObject): InputEnums.Method | undefined {
	const inputType = RobloxInputType3AReverseMap.get(io.UserInputType);
	if (inputType === undefined) return;

	return RobloxInputMethod3AReverseMap.get(inputType);
}

export function typeFromInputObject(io: InputObject): InputEnums.Type | undefined {
	return RobloxInputType3AReverseMap.get(io.UserInputType);
}

export function keyCodeFromInputObject(io: InputObject): InputEnums.KeyCode | undefined {
	return RobloxKeyCode3AReverseMap.get(io.KeyCode) ?? RobloxKeyCode3AReverseMap.get(io.UserInputType);
}
