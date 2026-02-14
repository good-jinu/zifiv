import { test } from "node:test";
import assert from "node:assert";
import { cn } from "./utils.ts";

test("cn utility function", async (t) => {
	await t.test("merges basic classes correctly", () => {
		assert.strictEqual(cn("a", "b"), "a b");
	});

	await t.test("handles conditional classes", () => {
		assert.strictEqual(cn("a", true && "b", false && "c"), "a b");
	});

	await t.test("handles objects correctly", () => {
		assert.strictEqual(cn({ a: true, b: false }), "a");
	});

	await t.test("handles arrays correctly", () => {
		assert.strictEqual(cn(["a", "b"]), "a b");
	});

	await t.test("merges tailwind classes correctly using twMerge", () => {
		assert.strictEqual(cn("px-2", "px-4"), "px-4");
		assert.strictEqual(cn("text-red-500", "text-blue-500"), "text-blue-500");
	});

	await t.test("handles complex combinations", () => {
		assert.strictEqual(
			cn("base", { "conditional-true": true, "conditional-false": false }, [
				"array-class",
			]),
			"base conditional-true array-class",
		);
	});
});
