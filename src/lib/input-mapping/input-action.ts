import { BindingInput } from "../bindings/binding-input";
import { Binding } from "../bindings/bindings";
import { InputEnums } from "../enums/enums";

export class InputAction {
	private active = false;

	private bindings = new Array<Binding>();

	constructor(
		private readonly name: string,
		private readonly keys = new Array<InputEnums.KeyCode>(),
	) {}

	/** @hidden */
	public addKey(key: InputEnums.KeyCode): void {
		this.keys.push(key);
	}

	public setActive(active: boolean): void {
		this.active = active;
	}

	public isActive(): boolean {
		return this.active;
	}

	public bind(binding: Binding): void {
		this.bindings.push(binding);
	}

	/** @hidden */
	public fireBindings(input: BindingInput): void {
		this.bindings.forEach((b) => {
			const { receiveStates, dropDuplicates, transformers } = b.config;
			if (receiveStates !== undefined && !receiveStates.includes(input.state)) return;
			if (dropDuplicates && b.receivedInput) return;

			if (transformers !== undefined && transformers[input.keyCode] !== undefined) {
				b.fire(transformers[input.keyCode]!(input));
			} else {
				b.fire(input);
			}
		});
	}
}

export function makeInputActionSet<Actions extends Record<number, string>>(
	enums: Actions,
): Record<keyof Actions, InputAction> & { setActive(this: Record<keyof Actions, InputAction>, active: boolean): void } {
	const out = {} as Record<keyof Actions, InputAction> & {
		setActive(this: Record<keyof Actions, InputAction>, active: boolean): void;
	};
	for (const [k, v] of pairs(enums as Record<keyof Actions, number>)) {
		if (!typeIs(k, "string")) continue;

		out[k as never] = new InputAction(k as string, []);
	}

	out.setActive = function (this: Record<keyof Actions, InputAction>, active: boolean) {
		for (const [k, v] of pairs(out)) {
			if (v instanceof InputAction) {
				v.setActive(active);
			}
		}
	};

	return out;
}
