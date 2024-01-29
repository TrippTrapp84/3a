import { InputEnums } from "../enums/enums";
import { InputAction } from "../input-mapping/input-action";
import { bindingController } from "./binding-controller";
import { BindingInput } from "./binding-input";

interface BindingArgs {
	/** Indicates if we'd like to drop all but the latest input which triggered this binding. Defaults to false.
	 *
	 * For example, if both KeyCode.E and KeyCode.ButtonL1 are mapped to this inputAction, and both are pressed
	 * in the same frame, only one of those inputs will be propagated through this actionBinding if dropDuplicates is set to true.
	 *
	 * The dropped input is arbitrary
	 */
	dropDuplicates?: boolean;

	/**
	 * A list of all the UserInputStates we would like to receive from this input action. If this is undefined, all states will be propagated
	 */
	receiveStates?: Array<InputEnums.State>;

	/** If data standardization is needed, e.g. you have two differing input types that you need to reconcile, you can
	 * supply a transformer for each input type here. Generally this will not be needed, as 3A will perform its own
	 * set of data transformations to get each set of similar inputs to match as closely as possible, assuming you use
	 * the built-in input types.
	 */
	transformers?: Partial<Record<InputEnums.KeyCode, (input: BindingInput) => BindingInput>>;
}

class BindingConnection {
	private connected = false;

	constructor(
		private binding: Binding,
		/** @hidden */
		public readonly callback: (input: BindingInput) => void,
	) {}

	public disconnect(): void {
		this.binding.disconnect(this);
	}
}

/** @hidden */
export class Binding {
	private inputBuffer = new Array<BindingInput>();

	private connections = new Array<BindingConnection>();

	/** @hidden */
	public receivedInput = false;

	constructor(
		public readonly action: InputAction,
		public readonly config: BindingArgs = {},
	) {
		action.bind(this);
		bindingController.addBinding(this);
	}

	public connect(callback: (input: BindingInput) => void): BindingConnection {
		const con = new BindingConnection(this, callback);

		this.connections.push(con);
		return con;
	}

	/** @hidden */
	public disconnect(connection: BindingConnection): void {
		this.connections.unorderedRemove(this.connections.indexOf(connection));
	}

	public fire(input: BindingInput): void {
		this.connections.forEach(c => c.callback(input));
	}
}

export class ActionBinding extends Binding {}
export class AxisBinding extends Binding {}
