export type Task<ValueType> = () => Promise<ValueType>

export function map<ValueType>(
	task: Task<ValueType>,
	mapper: (value: ValueType) => ValueType,
): Task<ValueType>
export function map<ValueType>(
	mapper: (value: ValueType) => ValueType,
): <ValueType>(task: Task<ValueType>) => Task<ValueType>

export function flatMap<ValueType>(
	task: Task<ValueType>,
	mapper: (value: ValueType) => Task<ValueType>,
): Task<ValueType>
export function flatMap<ValueType>(
	mapper: (value: ValueType) => Task<ValueType>,
): <ValueType>(task: Task<ValueType>) => Task<ValueType>

export function tap<ValueType>(
	task: Task<ValueType>,
	fn: (value: ValueType) => void,
): Task<ValueType>
export function tap<ValueType>(
	fn: (value: ValueType) => void,
): <ValueType>(task: Task<ValueType>) => Task<ValueType>

export function create<ValueType>(fn: () => Promise<ValueType>): Task<ValueType>
