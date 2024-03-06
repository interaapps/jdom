// @ts-ignore
const result = await Bun.build({
    entrypoints: ["./main.ts"],
    outdir: "./out",
});

if (!result.success) {
    console.error("Build failed");
    for (const message of result.logs) {
        // Bun will pretty print the message object
        console.error(message);
    }
}