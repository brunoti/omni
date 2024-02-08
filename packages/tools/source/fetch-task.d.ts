export function of<FailureType = HttpError, SuccessType = Response>(
	request: Parameters<Window['fetch']>[0],
): TaskResult<FailureType, SuccessType>

export declare class HttpError<T = unknown> extends Error {
	public response: Response
	public request: Request
	constructor(response: Response, request: Request)
	json(): Promise<T>
}
