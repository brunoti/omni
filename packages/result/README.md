
# @exelcia/result

Result as in the way it should be. Trying to bring an exceptionless approach to your code.

## How to use

Imagine you have a function that could fail. For example, you want to divide two numbers.

```typescript
function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b
}
```

The error could be unexpected. And you would need to handle it with a try catch block, which sucks. Result cames with the solution. Take a look:

```typescript
import { pipe } from '@excelsia/pipe';
import * as R from '@excelsia/result';

function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Fail('Cannot divide by zero');
    }
    return a / b
}

const divideTenBy = (by: number) => pipe(
    R.execute(() => divide(10, by)),
    R.map((result) => result * 2),
    R.flatMap((result) => R.execute(() => divide(result, 2))),
    R.mapFail((error) => error.message),
    R.match({
        onOk: (value) => ({
            error: false,
            value,
            message: 'Success! Your final value is: ' + value,
        }),
        onFail: (error) => ({
            error: true,
            message: `Something went wrong: ${error}`,
        })
    })
)

console.log(divideTenBy(2)) // Success! Your final value is: 10
console.log(divideTenBy(0)) // Something went wrong: Cannot divide by zero
```

## **About the Author**

Hi, I'm **bop**, a software engineer who loves to learn and create new stuff. Connect with me to stay updated on what I'm doing and my projects.

🌐 **Website:** [bop.systems](https://bop.systems)
📧 **Email:** [brunooliveira37@hotmail.com](mailto:brunooliveira37@hotmail.com)

📱 **Social Media:**
  - [Twitter](https://twitter.com/original_bop)
  - [LinkedIn](https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/)
  - [GitHub](https://github.com/brunoti)
  - [dev.to](https://dev.to/bop)

*You can also [buy me a coffee](https://www.buymeacoffee.com/bopdev) to support me, if you like what I do*
