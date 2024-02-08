import { Merge } from 'type-fest'
import type { Task } from './task'
import type { Result } from './result'

export type TaskResult<FailureType, SuccessType> = Task<
	Result<FailureType, SuccessType>
>

export function map<FailureType, SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
	mapper: (success: SuccessType) => SuccessType,
): TaskResult<FailureType, SuccessType>

export function map<FailureType, SuccessType>(
	mapper: (success: SuccessType) => SuccessType,
): <FailureType>(
	task: TaskResult<FailureType, SuccessType>,
) => TaskResult<FailureType, SuccessType>

export function mapFailure<FailureType, SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
	mapper: (failure: FailureType) => FailureType,
): TaskResult<FailureType, SuccessType>

export function mapFailure<FailureType, SuccessType>(
	mapper: (failure: FailureType) => FailureType,
): <SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
) => TaskResult<FailureType, SuccessType>

export function mapBoth<FailureType, SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
	mapper: (success: SuccessType) => SuccessType,
	failureMapper: (failure: FailureType) => FailureType,
): TaskResult<FailureType, SuccessType>

export function mapBoth<FailureType, SuccessType>(
	mapper: (success: SuccessType) => SuccessType,
	failureMapper: (failure: FailureType) => FailureType,
): <SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
) => TaskResult<FailureType, SuccessType>

export function create<FailureType, SuccessType>(
	fn: () => Promise<SuccessType>,
): TaskResult<FailureType, SuccessType>

export function tap<FailureType, SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
	tapper: (success: SuccessType) => SuccessType,
): TaskResult<FailureType, SuccessType>

export function tap<FailureType, SuccessType>(
	tapper: (success: SuccessType) => SuccessType,
): <FailureType>(
	task: TaskResult<FailureType, SuccessType>,
) => TaskResult<FailureType, SuccessType>

export function tapFailure<FailureType, SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
	tapper: (failure: FailureType) => FailureType,
): TaskResult<FailureType, SuccessType>

export function tapFailure<FailureType, SuccessType>(
	tapper: (failure: FailureType) => FailureType,
): <SuccessType>(
	task: TaskResult<FailureType, SuccessType>,
) => TaskResult<FailureType, SuccessType>
