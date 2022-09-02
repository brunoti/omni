import { AfterResponseHook, BeforeRequestHook, NormalizedOptions } from "ky";
import { toEnumerableObject } from "to-enumerable-object";
import { Merge, Simplify } from "type-fest";

type KyLoggerLog = {};

type KyLoggerOptions = {
  onLog?: (log: KyLoggerLog) => void;
};

type KyLoggerBeforeOptions = Merge<
  KyLoggerOptions,
  {
    shouldReturnRequest?: boolean;
  }
>;

type KyLoggerAfterOptions = Merge<
  KyLoggerOptions,
  {
    shouldReturnResponse?: boolean;
  }
>;

const KyLogger: {
  before: (options?: KyLoggerBeforeOptions) => BeforeRequestHook;
  after: (options?: KyLoggerAfterOptions) => AfterResponseHook;
} = {
  before: ({
    shouldReturnRequest = false,
  }: KyLoggerBeforeOptions = {}): BeforeRequestHook =>
    function (
      request: Request,
      options: Simplify<NormalizedOptions>
    ): void | Request | Response | Promise<void | Request | Response> {
      const copiedRequest = { ...toEnumerableObject(request) };
      console.group(
        `Ky Logger - Request: ${options.method} on ${copiedRequest.url}`
      );
      console.log(
        "Headers:" +
          "\n  " +
          [...copiedRequest.headers.entries()]
            .map(([name, value]) => `${name}: ${value}`)
            .join("\n  ")
      );
      console.log("Body:" + "\n  " + JSON.stringify(options.body, null, 2));
      console.groupEnd();
      if (shouldReturnRequest) {
        return request;
      }
    },
  after: ({
    shouldReturnResponse = false,
  }: KyLoggerAfterOptions = {}): AfterResponseHook =>
    function (
      request: Request,
      options: NormalizedOptions,
      response: Response
    ): void | Response | Promise<void | Response> {
      const copiedRequest = { ...toEnumerableObject(request) };
      const copiedResponse = { ...toEnumerableObject(response) };

      console.group(
        `Ky Logger - Request: ${options.method} on ${copiedRequest.url}`
      );
      console.log(
        "Headers:" +
          "\n  " +
          [...copiedResponse.headers.entries()]
            .map(([name, value]) => `${name}: ${value}`)
            .join("\n  ")
      );
      console.log("Status:" + "\n  " + copiedResponse.status);
      console.log("Body:" + "\n  " + JSON.stringify(options.body, null, 2));
      console.groupEnd();

      if (shouldReturnResponse) {
        return response;
      }
    },
};
