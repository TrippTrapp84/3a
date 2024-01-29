import { Types } from "./types";

export enum Methods {
	KeyboardMouse,
	Gamepad,
	Touchscreen,

	/** @hidden */
	None,
}

export const RobloxInputMethod3AMap = {
	[Methods.KeyboardMouse]: [Types.Keyboard, Types.Mouse],
	[Methods.Gamepad]: [Types.Gamepad],
	[Methods.Touchscreen]: [Types.Touch, Types.DeviceMovement],
	[Methods.None]: [Types.None],
} satisfies Record<Methods, Array<Types>>;

export const RobloxInputMethod3AReverseMap = new Map<Types, Methods>();

for (const [k, v] of pairs(RobloxInputMethod3AMap)) {
	v.forEach(it => RobloxInputMethod3AReverseMap.set(it, k));
}
