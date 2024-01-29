import { ReplicatedStorage } from "@rbxts/services";
import TestEZ from "@rbxts/testez";

import { start } from "./test";

// try {
// 	TestEZ.TestBootstrap.run([ReplicatedStorage.Package]); // Run tests
// } catch (e) {}

require(ReplicatedStorage.Package as never);

start();
