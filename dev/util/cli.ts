import ReadLine from "readline";

const rl = ReadLine.createInterface({
	input: process.stdin,
	output: process.stdout
})

async function prompt(message: string = ''): Promise<string>
{
	return await new Promise((resolve) => {
		process.stdout.write(message);
		rl.question(message, (input) => resolve(input));
	});
}

declare type LOGGERS = "INFO" | "WARN" | "ERROR";
function send(logtype: LOGGERS, message: string = '') : void
{
	console.log('[%s] %s', logtype, message);
}

export {
	prompt,
	send
}