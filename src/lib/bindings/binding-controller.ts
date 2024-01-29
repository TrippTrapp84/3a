import { RenderFirst } from "../util/render-first";
import { Binding } from "./bindings";

export class BindingController {
	private bindings = new Array<Binding>();

	constructor() {
		RenderFirst.bindAt(0, () => {
			this.bindings.forEach(b => (b.receivedInput = false));
		});
	}

	public addBinding(binding: Binding): void {
		this.bindings.push(binding);
	}
}

export const bindingController = new BindingController();
