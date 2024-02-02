export type Success<InputType> = { [tag: symbol]: InputType, __TAG__: 'Result.Success' }
export type Failure<ErrorType> = { [tag: symbol]: ErrorType, __TAG__: 'Result.Failure' }
export type Result<ErrorType = Error, InputType> =
  | Success<InputType>
  | Failure<ErrorType>


/**
 * Creates an Success result with the given value
 *
 * @param value - The value to return
 * @returns An Success<InputType> result
 */
export function success<InputType>(value: InputType): Success<InputType>

/**
 * Creates a Failure result with the given error
 *
 * @param error - The error to return
 * @returns A Failure<ErrorType> result
 */
export function failure<ErrorType>(error: ErrorType): Failure<ErrorType>

/**
 * Creates a result by trying to execute the given function
 *
 * @param fn - The function to execute
 * @returns A result based on the function's return. If the function throws an
 * error, it will be wrapped in a Failure otherwise an Success with the function's
 * return value.
 */
export function execute<ErrorType = Error, InputType>(
  fn: () => InputType,
): Result<ErrorType, InputType>

/**
 * Returns true if the result is an Success
 *
 * @param result - The result to check
 * @returns True if the result is an Success
 */
export function isSuccess<InputType, ErrorType>(
  result: Result<InputType, ErrorType>,
): result is Success<InputType>

/**
 * Returns true if the result is a Failure
 *
 * @param result - The result to check
 * @returns True if the result is a Failure
 */
export function isFailure<InputType, ErrorType>(
  result: Result<InputType, ErrorType>,
): result is Failure<ErrorType>

/**
 * Verifies if the value is a Result
 *
 * @param value - The value to check
 * @returns True if the value is a Result
 */
export function isResult<ErrorType = Error, InputType>(
  value: Result<ErrorType, InputType>,
): value is Result<ErrorType, InputType>

/**
 * Unwraps the result and returns the value
 *
 * @param result - The result to unwrap
 * @returns The value of the result
 */
export function unwrap<ErrorType, InputType>(
  result: Result<ErrorType, InputType>,
): ErrorType | InputType

/**
 * Unwraps the result and returns the wrapped value if Success. If the result is a
 * Failure, it will throw an error
 *
 * @throws {Error} If the result is a Failure
 *
 * @param result - The result to unwrap
 * @returns The value of the result
 */
export function unwrapUnsafe<ErrorType, InputType>(
  result: Result<ErrorType, InputType>,
): InputType

/**
 * Unwraps the result and returns the value
 *
 * @param result - The result to unwrap
 * @param fallback - The value to return if the result is a Failure
 * @returns The value of the result or the fallback
 */
export function unwrapWithDefault<ErrorType, InputType, FallbackType>(
  result: Result<ErrorType, InputType>,
  fallback: FallbackType,
): InputType | FallbackType

/**
 * Unwraps the result and returns the value
 *
 * @param fallback - The value to return if the result is a Failure
 * @returns A function that takes a result and returns the value based on the result
 */
export function unwrapWithDefault<FallbackType>(
  fallback: FallbackType,
): <ErrorType, InputType>(
  result: Result<ErrorType, InputType>,
) => InputType | FallbackType

/**
 * Maps the value of the result
 *
 * @param result - The result to map
 * @param mapper - The function to map the value
 * @returns The result with the mapped value
 */
export function map<ErrorType, InputType, OutputType>(
  result: Result<ErrorType, InputType>,
  mapper: (input: InputType) => OutputType,
): Result<ErrorType, OutputType>

/**
 * Maps the value of the result
 *
 * @param mapper - The function to map the value
 * @returns A function that takes a result and returns the result with the mapped value
 */
export function map<ErrorType, InputType, OutputType>(
  mapper: (input: InputType) => OutputType,
): (result: Result<ErrorType, InputType>) => Result<ErrorType, OutputType>

/**
 * Maps the value of the result
 *
 * @param result - The result to map
 * @param mapper - The function to map the value
 * @returns The result with the mapped value
 */
export function flatMap<ErrorType, InputType, NewError, NewInput = InputType>(
  result: Result<ErrorType, InputType>,
  mapper: (input: InputType) => Result<NewError, NewInput>,
): Result<NewError, NewInput>

/**
 * Maps the value of the result
 *
 * @param mapper - The function to map the value
 * @returns A function that takes a result and returns the result with the mapped value
 */
export function flatMap<ErrorType, InputType, NewError, NewInput = InputType>(
  mapper: (input: InputType) => Result<NewError, NewInput>,
): (result: Result<ErrorType, InputType>) => Result<NewError, NewInput>

export function mapFailure<ErrorType, InputType, OutputType>(
  result: Result<ErrorType, InputType>,
  mapper: (error: ErrorType) => OutputType,
): Result<OutputType, InputType>

export function mapFailure<ErrorType, InputType, OutputType>(
  mapper: (error: ErrorType) => OutputType,
): (result: Result<ErrorType, InputType>) => Result<OutputType, InputType>

export function onFailure<ErrorType, InputType, OutputType>(
  result: Result<ErrorType, InputType>,
  handler: (error: ErrorType) => OutputType,
): Result<OutputType, InputType>

export function onFailure<ErrorType, OutputType>(
  handler: (error: ErrorType) => OutputType,
): (result: Result<ErrorType, InputType>) => Result<OutputType, InputType>

export function match<ErrorType, InputType, OutputType>(
  result: Result<ErrorType, InputType>,
  handlers: {
    onFailure: (error: ErrorType) => OutputType,
    onSuccess: (input: InputType) => OutputType,
  }
): OutputType

export function match<ErrorType, InputType, OutputType>(
  handlers: {
    onFailure: (error: ErrorType) => OutputType,
    onSuccess: (input: InputType) => OutputType,
  }
): (result: Result<ErrorType, InputType>) => OutputType

/**
 * Maps the value of the result or returns the default value if the result is a failure
 *
 * @param result - The result to map
 * @param mapper - The function to map the value
 * @param defaultValue - The value to return if the result is a failure
 * @returns The result with the mapped value or the default value
 */
export function mapWithDefault<ErrorType, InputType, OutputType>(
  result: Result<ErrorType, InputType>,
  mapper: (input: InputType) => OutputType,
  defaultValue: OutputType,
): OutputType

/**
 * Maps the value of the result or returns the default value if the result is a failure
 *
 * @param mapper - The function to map the value
 * @param defaultValue - The value to return if the result is a failure
 * @returns A function that takes a result and returns the result with the mapped value or the default value
 */
export function mapWithDefault<ErrorType, InputType, OutputType>(
  mapper: (input: InputType) => OutputType,
  defaultValue: OutputType,
): (result: Result<ErrorType, InputType>) => OutputType

/**
 * Ensures that the returned result is Success by returning the provided result if
 * it's already [Success], or by falling back to the default value, which will
 * be wrapped in the Success constructor, if the provided result is an Error.
 *
 * @param result - The result to return
 * @param defaultValue - The value to return if the result is a failure
 * @returns If the result is Success, the result, otherwise an Success with the default value
 */
export function recover<ErrorType, InputType, DefaultValueType = InputType>(
  result: Result<ErrorType, InputType>,
  defaultValue: DefaultValueType,
): Result<ErrorType, DefaultValueType>

/**
 * Ensures that the returned result is Success by returning the provided result if
 * it's already [Success], or by falling back to the default value, which will
 * be wrapped in the Success constructor, if the provided result is an Error.
 *
 * @param defaultValue - The result to return
 * @returns A function that takes a result and returns: the same value if its Success, otherwise an Success with the default value
 */
export function recover<ErrorType, InputType, DefaultValueType = InputType>(
  defaultValue: DefaultValueType
): (result: Result<ErrorType, InputType>) => Result<ErrorType, DefaultValueType>


/**
 * Taps the result if it's Success returns the result
 *
 * @param result - The result to tap
 * @param fn - The function to tap
 * @returns The result
 */
export function tap<ErrorType, InputType>(
  result: Result<ErrorType, InputType>,
  fn: (input: InputType) => void
): Result<ErrorType, InputType>

/**
 * Taps the result if it's Success returns the result
 *
 * @param fn - The function to tap
 * @returns A function that takes a result and returns the result
 */
export function tap<ErrorType, InputType>(
  fn: (input: InputType) => void
): (result: Result<ErrorType, InputType>) => Result<ErrorType, InputType>

/**
 * Taps the result if it's Failure returns the result
 *
 * @param result - The result to tap
 * @param fn - The function to tap
 */
export function tapFailure<ErrorType, InputType>(
  result: Result<ErrorType, InputType>,
  fn: (error: ErrorType) => void
): Result<ErrorType, InputType>

/**
 * Taps the result if it's Failure returns the result
 *
 * @param fn - The function to tap
 * @returns A function that takes a result and returns the result
 */
export function tapFailure<ErrorType, InputType>(
  fn: (error: ErrorType) => void
): (result: Result<ErrorType, InputType>) => Result<ErrorType, InputType>

/**
  * Unwraps the result if its Success but returns null if it's Failure
  *
  * @param result - The result to unwrap
  * @returns The value of the result or null if it's a Failure
  */
export function toNullable<ErrorType, InputType>(
  result: Result<ErrorType, InputType>
): InputType | null

/**
  * Unwraps the result if its Success but returns undefined if it's Failure
  *
  * @param result - The result to unwrap
  * @returns The value of the result or undefined if it's a Failure
  */
export function toUndefined<ErrorType, InputType>(
  result: Result<ErrorType, InputType>
): InputType | undefined

export function filter<ErrorType, InputType, OutputType = ErrorType>(
  result: Result<ErrorType, InputType>,
  predicate: (input: InputType) => boolean,
  failureValue: OutputType
): Result<OutputType, InputType>

export function filter<ErrorType, InputType, OutputType = ErrorType>(
  predicate: (input: InputType) => boolean,
  failureValue: OutputType
): (result: Result<ErrorType, InputType>) => Result<OutputType, InputType>
