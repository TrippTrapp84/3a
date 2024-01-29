import { InputEnums } from "../enums/enums";
import {
	keyCodeFromInputObject,
	methodFromInputObject,
	typeFromInputObject,
} from "../util/io-utils";

export class BindingInput {
	public method: InputEnums.Method;
	public type: InputEnums.Type;
	public keyCode: InputEnums.KeyCode;

	public state: InputEnums.State;

	public position: Vector3;
	public delta;

	constructor(io: InputObject) {
		this.method = methodFromInputObject(io) ?? InputEnums.Method.None;
		this.type = typeFromInputObject(io) ?? InputEnums.Type.None;
		this.keyCode = keyCodeFromInputObject(io) ?? InputEnums.KeyCode.Unknown;

		this.state = io.UserInputState;

		this.position = io.Position;
		this.delta = io.Delta;
	}
}
