import { RunService } from "@rbxts/services";

const buffer = new Array<RenderFirstBinding>();

class RenderFirstBinding {
	constructor(public readonly priority: number, public callback: Callback) {}

	public unbind(): void {
		buffer.remove(buffer.indexOf(this));
	}
}

RunService.BindToRenderStep("3A_BindRenderFirstBuffer", Enum.RenderPriority.First.Value, () => {
	buffer.forEach(({ callback }) => callback());
});

function searchBinary(priority: number): number {
	if (buffer.size() === 0) return 0;

	let up = buffer.size() - 1;
	let low = 0;

	while (up !== low) {
		const center = math.floor((up + low) / 2);
		if (buffer[center].priority < priority) {
			low = center;
		} else {
			up = center;
		}
	}

	return up;
}

export namespace RenderFirst {
	export function bindAt(priority: number, callback: Callback): RenderFirstBinding {
		const binding = new RenderFirstBinding(priority, callback);

		const ind = searchBinary(priority);
		buffer.insert(ind, binding);

		return binding;
	}
}
