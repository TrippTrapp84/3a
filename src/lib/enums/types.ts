export enum Types {
	// Keyboard
	Keyboard,
	Mouse,

	// Mobile
	Touch,
	DeviceMovement,

	Gamepad,
	UX,

	/** @hidden */
	None,
}

export const RobloxInputType3AMap = {
	[Types.Keyboard]: [Enum.UserInputType.Keyboard],
	[Types.Mouse]: [
		Enum.UserInputType.MouseButton1,
		Enum.UserInputType.MouseButton2,
		Enum.UserInputType.MouseButton3,
		Enum.UserInputType.MouseMovement,
		Enum.UserInputType.MouseWheel,
	],
	[Types.Touch]: [Enum.UserInputType.Touch],
	[Types.DeviceMovement]: [Enum.UserInputType.Accelerometer, Enum.UserInputType.Gyro],
	[Types.Gamepad]: [
		Enum.UserInputType.Gamepad1,
		Enum.UserInputType.Gamepad2,
		Enum.UserInputType.Gamepad3,
		Enum.UserInputType.Gamepad4,
		Enum.UserInputType.Gamepad5,
		Enum.UserInputType.Gamepad6,
		Enum.UserInputType.Gamepad7,
		Enum.UserInputType.Gamepad8,
	],
	[Types.UX]: [Enum.UserInputType.TextInput],
	[Types.None]: [Enum.UserInputType.Focus, Enum.UserInputType.None, Enum.UserInputType.InputMethod],
} satisfies Record<Types, Array<Enum.UserInputType>>;

export const RobloxInputType3AReverseMap = new Map<Enum.UserInputType, Types>();

for (const [k, v] of pairs(RobloxInputType3AMap)) {
	v.forEach(it => RobloxInputType3AReverseMap.set(it, k));
}
