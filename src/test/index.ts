import { ActionBinding } from "../lib/bindings/bindings";
import { actions } from "./maps";

export const start = () => {
	const binding1 = new ActionBinding(actions.Action1);

	binding1.connect((input) => print(input));

	actions.setActive(true);
};
