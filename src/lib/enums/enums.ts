import { KeyCodes } from "./keycodes";
import { Methods } from "./methods";
import { Types } from "./types";

type RecordValues<R extends Record<string, unknown>> = R[keyof R];

export namespace InputEnums {
	export enum BindingType {
		Action,
		Axis,
	}

	/**
	 * Input Methods are modes of operation, essentially sets of Input Types that
	 * can be used together.
	 */
	export const Method = Methods;
	export type Method = RecordValues<typeof Method>;

	/**
	 * @enum Type
	 * 3A's custom input types. Events associated with these input types come with additional
	 * middleware, as this enum class is meant to serve as a more friendly and standardized
	 * version of the available input schemes on Roblox.
	 */
	export const Type = Types;
	export type Type = RecordValues<typeof Type>;

	/**
	 * A 3A contained reference to Enum.UserInputState.
	 */
	export const State = Enum.UserInputState;
	export type State = Enum.UserInputState;

	export const KeyCode = KeyCodes;
	export type KeyCode = RecordValues<typeof KeyCode>;
}
