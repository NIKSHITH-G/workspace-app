/**
 * Static seed — no API calls. Hardcoded Python content for all 12 sessions.
 * Run: npx tsx scripts/seed-python-static.ts
 */

import path from "node:path"
import { PrismaClient } from "../lib/generated/prisma/client"

type Concept = {
  name: string
  orderIndex: number
  prerequisites: string[]
  explanation: string
  flashcardFront: string
  flashcardBack: string
}

type Session = {
  index: number
  title: string
  cheatSheet: string
  concepts: Concept[]
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION DATA
// ─────────────────────────────────────────────────────────────────────────────

const SESSIONS: Session[] = [
  // ── SESSION 1 ─────────────────────────────────────────────────────────────
  {
    index: 1,
    title: "Variables, Types and Assignment in Python",
    cheatSheet: `## Variables, Types and Assignment

**Variable Assignment**
Bind a name to a value with \`=\`. Python is dynamically typed — the type is attached to the value, not the name.
\`\`\`python
x = 42
name = "Ada"
pi = 3.14
\`\`\`
💡 A variable is just a label pointing to an object in memory.

**Numeric Types: int and float**
\`int\` is arbitrary-precision. \`float\` is IEEE-754 double. Division \`/\` always returns float; \`//\` is floor division.
\`\`\`python
5 / 2   # 2.5  (float)
5 // 2  # 2    (int)
5 % 2   # 1    (modulo)
\`\`\`
⚠️ \`0.1 + 0.2 != 0.3\` — floating-point representation error.

**String Type**
Immutable sequence of Unicode characters. Use \`"\` or \`'\`. f-strings interpolate expressions.
\`\`\`python
s = "hello"
print(f"Length: {len(s)}, upper: {s.upper()}")
\`\`\`
⚠️ Strings can't be changed in place — every "modification" creates a new string.

**Boolean Type**
\`True\` and \`False\` are the only booleans. They subclass \`int\` (\`True == 1\`, \`False == 0\`).
\`\`\`python
print(True + True)   # 2
print(bool(0))       # False
print(bool(""))      # False
\`\`\`

**Type Conversion**
\`int()\`, \`float()\`, \`str()\`, \`bool()\` convert between types explicitly.
\`\`\`python
int("42")    # 42
float("3.14") # 3.14
str(100)     # "100"
\`\`\`
⚠️ \`int("3.14")\` raises \`ValueError\` — convert to float first.

**Multiple and Augmented Assignment**
\`\`\`python
a, b, c = 1, 2, 3    # tuple unpacking
a, b = b, a           # swap without temp variable
x += 5                # x = x + 5
\`\`\``,
    concepts: [
      {
        name: "Variable Assignment",
        orderIndex: 0,
        prerequisites: [],
        explanation: `**Variable assignment** binds a name to an object in memory using the \`=\` operator. Python is **dynamically typed** — the type belongs to the object, not the variable name, so the same name can point to different types at different times.

\`\`\`python
x = 10          # x points to an integer object
x = "hello"     # now x points to a string object
y = x           # y and x point to the same object
\`\`\`

Every assignment creates or rebinds a reference. Python never copies an object on assignment — both \`x\` and \`y\` above reference the same string object.

⚠️ \`=\` is not equality — it's assignment. Equality is tested with \`==\`.`,
        flashcardFront: "If you write `y = x` and then `x = 99`, what is the value of `y`?",
        flashcardBack: "y still holds the original value that x pointed to before the reassignment. In Python, `y = x` copies the *reference*, not the object. When you then write `x = 99`, you rebind the name `x` to a new integer object — `y` is unaffected and still points to the old value. This is why Python assignment is better described as \"name binding\" than \"variable copying\".",
      },
      {
        name: "Numeric Types: int and float",
        orderIndex: 1,
        prerequisites: ["Variable Assignment"],
        explanation: `Python has two primary numeric types. **int** has arbitrary precision — it never overflows. **float** is a 64-bit IEEE-754 double, which gives ~15 significant decimal digits.

\`\`\`python
big = 10 ** 100         # perfectly fine int
ratio = 7 / 2           # 3.5  — always float
floor = 7 // 2          # 3    — floor division
remainder = 7 % 2       # 1    — modulo
power = 2 ** 8          # 256
\`\`\`

The \`//\` operator always rounds toward negative infinity, not toward zero: \`-7 // 2\` is \`-4\`, not \`-3\`.

⚠️ Floats cannot represent most decimal fractions exactly: \`0.1 + 0.2 == 0.30000000000000004\`. Use the \`decimal\` module for financial calculations.`,
        flashcardFront: "Why does `0.1 + 0.2 != 0.3` in Python, and how do you work around it?",
        flashcardBack: "Floats are stored in binary (IEEE-754), and 0.1 and 0.2 cannot be represented exactly in base-2 — they are infinitely repeating fractions in binary, so they are stored as close approximations. Adding those approximations compounds the error. Workarounds: use `round(0.1 + 0.2, 10)` for display, use `math.isclose(a, b)` for comparisons, or use `decimal.Decimal` for exact decimal arithmetic.",
      },
      {
        name: "String Type",
        orderIndex: 2,
        prerequisites: ["Variable Assignment"],
        explanation: `A **string** (\`str\`) is an immutable sequence of Unicode characters. Strings can be delimited with \`'\`, \`"\`, or triple quotes for multi-line text. **f-strings** (prefix \`f\`) embed expressions directly.

\`\`\`python
name = "Ada"
greeting = f"Hello, {name}! She has {len(name)} letters."
multi = """Line one
Line two"""
\`\`\`

Key built-in operations: \`len(s)\`, \`s.upper()\`, \`s.lower()\`, \`s.strip()\`, \`s.split()\`, \`s.replace()\`, \`"x" in s\`.

⚠️ Strings are **immutable** — you cannot change a character in place. \`s[0] = "A"\` raises a \`TypeError\`. Every string operation returns a *new* string.`,
        flashcardFront: "What does it mean that strings are immutable, and what is the practical consequence when building a string in a loop?",
        flashcardBack: "Immutable means no part of the string object can be changed after creation. Every operation like `+`, `.replace()`, or `.upper()` returns a brand-new string object. The practical consequence: concatenating strings in a loop with `s += piece` is O(n²) because each iteration creates a new copy. The correct approach is to collect pieces in a list and join at the end: `''.join(parts)` — which is O(n).",
      },
      {
        name: "Boolean Type",
        orderIndex: 3,
        prerequisites: ["Variable Assignment"],
        explanation: `**Boolean** (\`bool\`) has exactly two values: \`True\` and \`False\`. Booleans are a subclass of \`int\` — \`True == 1\` and \`False == 0\`, so they can participate in arithmetic.

\`\`\`python
print(True + True)      # 2
print(True * 5)         # 5
print(bool(0))          # False
print(bool([]))         # False  — empty container
print(bool("hello"))    # True   — non-empty string
\`\`\`

**Truthy** values: any non-zero number, non-empty string, non-empty container. **Falsy** values: \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`None\`, \`False\`.

⚠️ \`bool\` inheriting from \`int\` means \`isinstance(True, int)\` is \`True\` — don't use \`type(x) == int\` if you want to exclude booleans.`,
        flashcardFront: "Without running it, what does `sum([True, False, True, True])` return, and why?",
        flashcardBack: "It returns `3`. Because `bool` is a subclass of `int`, `True` has the integer value `1` and `False` has the value `0`. `sum()` treats them as ordinary integers. This is a useful idiom for counting truthy values in a collection: `sum(x > 0 for x in values)` counts how many positives exist.",
      },
      {
        name: "Type Conversion",
        orderIndex: 4,
        prerequisites: ["Numeric Types: int and float", "String Type", "Boolean Type"],
        explanation: `Python provides built-in functions for **explicit type conversion** (casting): \`int()\`, \`float()\`, \`str()\`, \`bool()\`. This is distinct from *implicit* coercion, which Python rarely does.

\`\`\`python
int("42")         # 42
int(3.9)          # 3  — truncates toward zero, does NOT round
float("3.14")     # 3.14
str(100)          # "100"
bool(0)           # False
bool("0")         # True  — non-empty string!
\`\`\`

\`input()\` always returns a string, so numeric input must be converted:
\`\`\`python
age = int(input("Enter age: "))
\`\`\`

⚠️ \`int("3.14")\` raises \`ValueError\`. To convert a float-string to int, do \`int(float("3.14"))\`.`,
        flashcardFront: "What is the difference between `int(3.9)` and `round(3.9)` in Python?",
        flashcardBack: "`int(3.9)` **truncates toward zero** — it simply discards the decimal part, giving `3`. `round(3.9)` rounds to the nearest integer using \"round half to even\" (banker's rounding), giving `4`. For `int(-3.9)` the result is `-3` (toward zero), while `round(-3.9)` gives `-4` (toward negative infinity). The distinction matters when you need true rounding vs. floor-like truncation.",
      },
      {
        name: "Multiple and Augmented Assignment",
        orderIndex: 5,
        prerequisites: ["Variable Assignment"],
        explanation: `Python supports **multiple assignment** (tuple unpacking) and **augmented assignment operators** for concise expressions.

\`\`\`python
# Multiple assignment
a, b, c = 1, 2, 3
first, *rest = [10, 20, 30, 40]   # first=10, rest=[20,30,40]

# Swap without a temporary variable
a, b = b, a

# Augmented assignment
x = 5
x += 3    # x = 8
x *= 2    # x = 16
x //= 3   # x = 5
\`\`\`

The swap \`a, b = b, a\` works because Python evaluates the entire right-hand side as a tuple before unpacking, so the old values are captured before any rebinding occurs.

⚠️ Augmented assignment on immutable types (like strings) creates a new object — it does not mutate in place.`,
        flashcardFront: "Why does `a, b = b, a` correctly swap two variables without a temporary variable?",
        flashcardBack: "Python evaluates the entire right-hand side expression before performing any assignment. `b, a` on the right creates a tuple of the *current* values of b and a. Only after that tuple is fully constructed does Python unpack and rebind the names on the left. So the old values are preserved in the intermediate tuple during the swap, making a temporary variable unnecessary. This is pure tuple packing/unpacking, not a special swap operator.",
      },
    ],
  },

  // ── SESSION 2 ─────────────────────────────────────────────────────────────
  {
    index: 2,
    title: "Booleans, Conditionals and Loops",
    cheatSheet: `## Booleans, Conditionals and Loops

**Comparison Operators**
Return \`True\` or \`False\`. Chainable: \`1 < x < 10\`.
\`\`\`python
==  !=  <  >  <=  >=   is   is not   in   not in
\`\`\`
⚠️ Use \`==\` for value equality, \`is\` for identity (same object in memory).

**Logical Operators**
\`and\`, \`or\`, \`not\`. Short-circuit: \`and\` stops at first falsy, \`or\` stops at first truthy.
\`\`\`python
x = None
name = x or "default"   # "default"  — or returns the actual value, not True/False
\`\`\`

**if / elif / else**
\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
\`\`\`

**while Loop**
Runs while condition is truthy. Use \`break\` to exit, \`continue\` to skip to next iteration.
\`\`\`python
n = 1
while n < 100:
    n *= 2
\`\`\`

**for Loop**
Iterates over any iterable. \`range(start, stop, step)\` generates integers.
\`\`\`python
for i in range(0, 10, 2):   # 0 2 4 6 8
    print(i)
for item in ["a", "b", "c"]:
    print(item)
\`\`\`
💡 \`enumerate(iterable)\` gives (index, value) pairs. \`zip(a, b)\` pairs two iterables.`,
    concepts: [
      {
        name: "Comparison Operators",
        orderIndex: 0,
        prerequisites: [],
        explanation: `**Comparison operators** evaluate a relationship between two values and return a boolean. Python allows **chaining** comparisons in a natural mathematical style.

\`\`\`python
x = 5
print(x == 5)       # True  — value equality
print(x != 3)       # True
print(1 < x < 10)   # True  — chained: means 1<x AND x<10
a = [1, 2]
b = [1, 2]
print(a == b)       # True  — same contents
print(a is b)       # False — different objects in memory
\`\`\`

The \`in\` and \`not in\` operators test membership: \`3 in [1, 2, 3]\` is \`True\`.

⚠️ Never use \`is\` to compare integers or strings in general — Python caches small integers (-5 to 256) and interned strings, so \`is\` may return \`True\` unexpectedly, but this is an implementation detail, not a guarantee.`,
        flashcardFront: "When should you use `is` instead of `==`, and why is `x is None` the correct idiom?",
        flashcardBack: "`is` tests **object identity** — whether two names point to the exact same object in memory. `==` tests **value equality** — whether two objects have equal contents. `x is None` is correct because `None` is a singleton in Python — there is only ever one `None` object. Using `x == None` works but is slower and can be broken if an object defines a custom `__eq__` that returns something unexpected.",
      },
      {
        name: "Logical Operators and Short-Circuit Evaluation",
        orderIndex: 1,
        prerequisites: ["Comparison Operators"],
        explanation: `Python's **logical operators** (\`and\`, \`or\`, \`not\`) use **short-circuit evaluation** and return one of the operands, not necessarily \`True\` or \`False\`.

\`\`\`python
# and returns first falsy value, or the last value if all truthy
0 and 99        # 0    (short-circuits at 0)
"a" and "b"     # "b"  (both truthy, returns last)

# or returns first truthy value, or the last value if all falsy
None or "fallback"   # "fallback"
"value" or "default" # "value"

# Practical use: default values
name = user_input or "Anonymous"
\`\`\`

⚠️ \`not\` always returns \`True\` or \`False\`, unlike \`and\`/\`or\`. \`not 0\` is \`True\`.`,
        flashcardFront: "What does `result = a and b` actually return — always True or False, or something else?",
        flashcardBack: "`and` returns one of its operands, not necessarily a boolean. If `a` is falsy, it returns `a` without evaluating `b`. If `a` is truthy, it returns `b` (whatever `b` is). So `0 and 'hello'` returns `0`, and `'hi' and 'world'` returns `'world'`. This is called short-circuit evaluation and it's used extensively for patterns like `result = config and config.get('key')`.",
      },
      {
        name: "if / elif / else Statements",
        orderIndex: 2,
        prerequisites: ["Comparison Operators", "Logical Operators and Short-Circuit Evaluation"],
        explanation: `**Conditional statements** execute different blocks based on boolean conditions. Python uses indentation (4 spaces by convention) to define blocks — there are no braces.

\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "F"
\`\`\`

Python also has a **conditional expression** (ternary) for inline use:
\`\`\`python
label = "pass" if score >= 50 else "fail"
\`\`\`

⚠️ \`elif\` is short for "else if" — once a branch matches, subsequent branches are skipped entirely, even if their conditions would also be true.`,
        flashcardFront: "Why doesn't Python have a `switch` statement, and what is the idiomatic replacement in modern Python?",
        flashcardBack: "Python didn't have a switch/case until Python 3.10, which introduced `match`/`case` (structural pattern matching). Before that, the idiomatic replacement was a dictionary dispatch: map keys to functions or values and look up the key. For example: `handlers = {'add': add_fn, 'sub': sub_fn}; handlers[op]()`. This is often more flexible than a switch because it treats behaviour as data. Python 3.10+ `match` goes further, supporting destructuring, guards, and type matching.",
      },
      {
        name: "while Loop",
        orderIndex: 3,
        prerequisites: ["if / elif / else Statements"],
        explanation: `A **while loop** repeats its body as long as the condition is truthy. Use it when the number of iterations is not known in advance.

\`\`\`python
n = 1
while n < 1000:
    n *= 2
print(n)   # 1024

# Sentinel loop pattern
while True:
    data = input("Enter value (q to quit): ")
    if data == "q":
        break
    process(data)
\`\`\`

\`break\` exits the loop immediately. \`continue\` skips the rest of the current iteration and re-checks the condition. A \`while\` loop can have an \`else\` clause that runs only if the loop exited normally (not via \`break\`).

⚠️ Forgetting to update the loop variable causes an **infinite loop**. Always ensure the condition can become \`False\`.`,
        flashcardFront: "What does the `else` clause on a `while` loop do, and when would you use it?",
        flashcardBack: "The `else` clause runs when the loop condition becomes `False` naturally — it does NOT run if the loop exited via `break`. This is useful for search patterns: loop through items, `break` when found, and use `else` to handle the \"not found\" case cleanly without a flag variable. Example: `while ...: if found: break` then `else: print('not found')`. It's a rarely-known but elegant Python feature.",
      },
      {
        name: "for Loop and range()",
        orderIndex: 4,
        prerequisites: ["while Loop"],
        explanation: `A **for loop** iterates over any **iterable** — lists, strings, ranges, files, generators. \`range(start, stop, step)\` produces a lazy sequence of integers.

\`\`\`python
for i in range(5):          # 0 1 2 3 4
    print(i)

for i in range(2, 10, 2):   # 2 4 6 8
    print(i)

for char in "hello":        # h e l l o
    print(char)

# enumerate gives (index, value)
for i, val in enumerate(["a", "b", "c"]):
    print(i, val)           # 0 a, 1 b, 2 c
\`\`\`

⚠️ \`range(stop)\` stops *before* \`stop\` — \`range(5)\` gives 0–4, not 0–5. Never mutate a list while iterating over it with \`for\`.`,
        flashcardFront: "Why is iterating with `for item in my_list` preferred over `for i in range(len(my_list))`?",
        flashcardBack: "Direct iteration `for item in my_list` is cleaner, less error-prone, and works on any iterable (not just indexable sequences). The index-based approach requires `len()` and bracket access, introduces an extra variable, and fails on non-indexable iterables like generators. When you need both the index and value, use `enumerate(my_list)` rather than `range(len(...))`. Pythonic code iterates over objects directly; reach for indices only when you genuinely need them.",
      },
      {
        name: "break, continue and Loop else",
        orderIndex: 5,
        prerequisites: ["for Loop and range()", "while Loop"],
        explanation: `**\`break\`** immediately exits the innermost loop. **\`continue\`** skips the rest of the current iteration and moves to the next. The **\`else\`** clause on a loop executes only when the loop completes without hitting \`break\`.

\`\`\`python
# Find first even number
for n in [1, 3, 4, 7]:
    if n % 2 == 0:
        print(f"Found: {n}")
        break
else:
    print("No even number found")

# Skip negatives
for x in [3, -1, 4, -1, 5]:
    if x < 0:
        continue
    print(x)    # 3 4 5
\`\`\`

⚠️ \`break\` and \`continue\` only affect the **innermost** loop. To exit nested loops you need a flag variable, a function return, or Python 3.11+ \`ExceptionGroup\` tricks.`,
        flashcardFront: "How does the `for/else` construct eliminate the need for a 'found' flag variable?",
        flashcardBack: "Traditionally you'd write `found = False`, loop, set `found = True` on match, then check `if not found` after. The `else` clause replaces this: it runs only if the loop finished without `break`, which is exactly the \"not found\" condition. The code expresses intent directly — `else` means \"the loop exhausted all items without breaking\". This makes the search-or-fallback pattern more readable and removes a boolean that exists only to communicate between the loop and the code after it.",
      },
    ],
  },

  // ── SESSION 3 ─────────────────────────────────────────────────────────────
  {
    index: 3,
    title: "Strings, Lists and Iteration",
    cheatSheet: `## Strings, Lists and Iteration

**String Indexing and Slicing**
Zero-indexed. Negative indices count from the end. Slices are \`[start:stop:step]\`.
\`\`\`python
s = "Python"
s[0]      # 'P'
s[-1]     # 'n'
s[1:4]    # 'yth'
s[::-1]   # 'nohtyP'  (reverse)
\`\`\`

**Common String Methods**
\`\`\`python
" hello ".strip()           # "hello"
"a,b,c".split(",")          # ["a","b","c"]
",".join(["a","b","c"])     # "a,b,c"
"hello".replace("l","r")   # "herro"
"Hello".lower() / .upper()
"hello".startswith("he")   # True
\`\`\`

**List Basics**
Ordered, mutable, zero-indexed. Can hold mixed types.
\`\`\`python
nums = [1, 2, 3]
nums.append(4)      # [1,2,3,4]
nums.insert(0, 0)   # [0,1,2,3,4]
nums.pop()          # removes and returns 4
nums.remove(2)      # removes first occurrence of 2
nums.sort()
\`\`\`

**f-strings**
\`\`\`python
name, score = "Ada", 97.5
print(f"{name} scored {score:.1f}")   # Ada scored 97.5
print(f"{2**10 = }")                  # 2**10 = 1024  (debug format)
\`\`\`
💡 Use \`!r\` to get the \`repr\` inside an f-string: \`f"{val!r}"\`.`,
    concepts: [
      {
        name: "String Indexing and Slicing",
        orderIndex: 0,
        prerequisites: [],
        explanation: `Strings are **zero-indexed** sequences. A **slice** \`s[start:stop:step]\` extracts a substring without modifying the original.

\`\`\`python
s = "Python"
print(s[0])       # 'P'   — first character
print(s[-1])      # 'n'   — last character
print(s[1:4])     # 'yth' — indices 1,2,3 (stop is exclusive)
print(s[::2])     # 'Pto' — every second character
print(s[::-1])    # 'nohtyP' — reversed
\`\`\`

Omitting \`start\` defaults to 0; omitting \`stop\` defaults to the end. Slicing never raises an \`IndexError\` — out-of-range slices are silently clamped.

⚠️ \`s[i]\` raises \`IndexError\` if \`i\` is out of range, but \`s[i:j]\` never does — \`"abc"[10:20]\` returns \`""\`.`,
        flashcardFront: "What does `s[1:-1]` return, and what does it mean conceptually?",
        flashcardBack: "`s[1:-1]` returns the string with the first and last characters removed. Index `1` starts after the first character; `-1` as the stop means \"up to but not including the last character\" (since -1 is the index of the last char, and stop is exclusive). This idiom is commonly used to strip surrounding delimiters, e.g. removing quotes from `'\"hello\"'` → `'hello'`.",
      },
      {
        name: "String Methods",
        orderIndex: 1,
        prerequisites: ["String Indexing and Slicing"],
        explanation: `String methods always **return a new string** — they never modify the original (strings are immutable). Key methods:

\`\`\`python
s = "  Hello, World!  "
s.strip()                  # "Hello, World!"  — removes whitespace
s.lower() / s.upper()      # case conversion
s.replace("World", "Ada")  # "  Hello, Ada!  "
s.split(", ")              # ["  Hello", "World!  "]
", ".join(["a","b","c"])   # "a, b, c"
s.startswith("  Hello")    # True
s.find("World")            # 9  (index) or -1 if not found
\`\`\`

\`split()\` with no argument splits on any whitespace and removes empty strings — useful for parsing user input.

⚠️ \`s.find("x")\` returns \`-1\` on failure, not \`None\`. \`s.index("x")\` raises \`ValueError\` instead — choose based on whether not finding is an error.`,
        flashcardFront: "Why does `s.replace('l', 'r')` return a new string instead of modifying `s`, even though lists have an in-place `list.sort()`?",
        flashcardBack: "Strings are **immutable** in Python — their content cannot be changed after creation. This is a deliberate design choice that makes strings safe to use as dictionary keys, allows Python to intern (cache) repeated string literals, and prevents aliasing bugs. Because no mutation is possible, string methods must return new objects. Lists are mutable by design (they're containers whose contents are expected to change), so methods like `sort()` operate in place to avoid unnecessary copies.",
      },
      {
        name: "Lists: Creation, Indexing and Slicing",
        orderIndex: 2,
        prerequisites: ["String Indexing and Slicing"],
        explanation: `A **list** is an ordered, **mutable** sequence that can hold items of any type. Lists support the same indexing and slicing syntax as strings.

\`\`\`python
nums = [3, 1, 4, 1, 5, 9]
nums[0]       # 3
nums[-1]      # 9
nums[1:4]     # [1, 4, 1]  — a new list (shallow copy of slice)
nums[::2]     # [3, 4, 5]

# Lists can hold mixed types
mixed = [1, "two", 3.0, True, [4, 5]]
\`\`\`

Assigning to a slice replaces that range: \`nums[1:3] = [10, 20, 30]\` replaces indices 1 and 2 with three new items.

⚠️ A slice like \`nums[1:3]\` creates a **shallow copy** of that range — modifying the slice doesn't affect the original, but nested mutable objects are still shared.`,
        flashcardFront: "If `b = a[:]`, are `a` and `b` the same list? What happens if `a` contains nested lists?",
        flashcardBack: "`a[:]` creates a **shallow copy** — `b` is a new list object, so `b is a` is `False` and appending to `b` does not affect `a`. However, shallow copy means the elements themselves are not copied — both lists contain references to the same objects. If `a` contains a nested list, `a[0]` and `b[0]` point to the *same* nested list, so mutating `b[0].append(99)` will also appear in `a[0]`. Use `copy.deepcopy()` for a fully independent copy.",
      },
      {
        name: "List Methods",
        orderIndex: 3,
        prerequisites: ["Lists: Creation, Indexing and Slicing"],
        explanation: `List methods mutate the list **in place** and mostly return \`None\` (unlike string methods which return new objects).

\`\`\`python
nums = [3, 1, 4, 1, 5]
nums.append(9)          # [3,1,4,1,5,9]  — add to end
nums.insert(0, 0)       # [0,3,1,4,1,5,9] — insert at index
nums.pop()              # removes & returns 9
nums.pop(0)             # removes & returns 0
nums.remove(1)          # removes first occurrence of 1
nums.sort()             # sorts in place, returns None
nums.reverse()          # reverses in place
sorted(nums)            # returns a NEW sorted list
nums.index(4)           # index of first occurrence of 4
nums.count(1)           # number of occurrences of 1
\`\`\`

⚠️ \`nums.sort()\` returns \`None\`, not the sorted list. A common mistake: \`nums = nums.sort()\` sets \`nums\` to \`None\`.`,
        flashcardFront: "What is the difference between `list.sort()` and `sorted(list)`, and when would you choose each?",
        flashcardBack: "`list.sort()` sorts the list **in place** and returns `None` — it modifies the original. `sorted(iterable)` returns a **new sorted list** and works on any iterable (not just lists). Choose `list.sort()` when you own the list and want to save memory (no copy). Choose `sorted()` when you need to keep the original order, when you're sorting a non-list iterable, or when you want to chain the result: `for item in sorted(data):`.",
      },
      {
        name: "f-strings and String Formatting",
        orderIndex: 4,
        prerequisites: ["String Methods"],
        explanation: `**f-strings** (formatted string literals, prefix \`f\`) embed Python expressions inside \`{}\`. They evaluate at runtime and are the fastest formatting method.

\`\`\`python
name = "Ada"
score = 97.5
print(f"Name: {name}, Score: {score:.2f}")
# Name: Ada, Score: 97.50

# Expressions and conversions
print(f"{2 ** 10}")          # 1024
print(f"{name!r}")           # 'Ada'  — repr()
print(f"{score:.0%}")        # 98%    — percentage
print(f"{'left':<10}|")      # 'left      |'  — left-align in 10 chars
print(f"{score = }")         # score = 97.5   — debug format (Python 3.8+)
\`\`\`

⚠️ f-strings are evaluated **immediately** where they appear. You cannot define an f-string as a template to be filled in later — use \`str.format()\` or a template string for deferred formatting.`,
        flashcardFront: "Why can't you store an f-string as a reusable template, and what should you use instead?",
        flashcardBack: "f-strings are evaluated the moment Python encounters them — they look up variable names from the current scope immediately. So `template = f'Hello, {name}'` captures the current value of `name`, not a placeholder for future values. For reusable templates, use `str.format()` with named placeholders: `template = 'Hello, {name}'` then `template.format(name='Ada')`, or use `string.Template` for simpler substitution. f-strings are fastest for one-shot formatting; `str.format()` is better for template reuse.",
      },
      {
        name: "Iterating over Sequences with enumerate and zip",
        orderIndex: 5,
        prerequisites: ["for Loop and range()", "Lists: Creation, Indexing and Slicing"],
        explanation: `Two built-ins make iteration over sequences more expressive: **\`enumerate\`** and **\`zip\`**.

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# enumerate: (index, value) pairs
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
# 0: apple  1: banana  2: cherry

# enumerate with a start value
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# zip: pairs elements from two iterables
scores = [85, 92, 78]
for fruit, score in zip(fruits, scores):
    print(f"{fruit}: {score}")
\`\`\`

\`zip\` stops at the shortest iterable. Use \`itertools.zip_longest\` to fill missing values.

⚠️ Avoid \`for i in range(len(lst))\` when you need both index and value — use \`enumerate\` instead.`,
        flashcardFront: "What happens when you `zip` two lists of different lengths, and how do you get all elements from both?",
        flashcardBack: "`zip` stops at the end of the **shorter** iterable — excess elements from the longer iterable are silently discarded. To get all elements and fill gaps with a default value, use `itertools.zip_longest(a, b, fillvalue=None)`. Knowing this matters when combining data from two sources that might not be aligned: always verify lengths match, or explicitly handle the mismatch with `zip_longest`.",
      },
    ],
  },

  // ── SESSION 4 ─────────────────────────────────────────────────────────────
  {
    index: 4,
    title: "Functions and Scoping",
    cheatSheet: `## Functions and Scoping

**Defining Functions**
\`\`\`python
def greet(name, greeting="Hello"):
    """Return a greeting string."""
    return f"{greeting}, {name}!"
\`\`\`
💡 Always define before calling. Functions are first-class objects.

**Parameters and Arguments**
\`\`\`python
def f(pos, /, normal, *, kw_only):   # / and * as separators
    pass
f(1, 2, kw_only=3)

def variadic(*args, **kwargs):        # *args: tuple, **kwargs: dict
    print(args, kwargs)
variadic(1, 2, x=3)   # (1,2) {'x':3}
\`\`\`

**Return Values**
Return multiple values as a tuple: \`return x, y\` → unpack with \`a, b = f()\`.
A function with no \`return\` returns \`None\`.

**LEGB Scope Rule**
Python resolves names in order: **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in.
\`\`\`python
x = "global"
def outer():
    x = "enclosing"
    def inner():
        print(x)    # "enclosing"  — LEGB: L empty, finds E
    inner()
\`\`\`
⚠️ To modify a global inside a function, declare \`global x\`. To modify enclosing, use \`nonlocal x\`.

**Docstrings**
First statement in a function body, triple-quoted. Accessed via \`help(f)\` or \`f.__doc__\`.`,
    concepts: [
      {
        name: "Defining Functions with def",
        orderIndex: 0,
        prerequisites: [],
        explanation: `A **function** is a reusable block of code defined with \`def\`. Functions are **first-class objects** in Python — they can be assigned to variables, passed as arguments, and returned from other functions.

\`\`\`python
def square(x):
    return x ** 2

result = square(5)   # 25
f = square           # f is now another name for the same function
print(f(4))          # 16

# Functions with no return statement return None
def greet(name):
    print(f"Hello, {name}")

val = greet("Ada")   # prints, but val is None
\`\`\`

A \`return\` statement ends the function and sends a value back. Without it, Python implicitly returns \`None\`.

⚠️ Defining a function does not execute it — it creates a function object. Call it with \`()\`.`,
        flashcardFront: "Since functions are first-class objects in Python, what can you do with a function that you can't do in languages where functions aren't first-class?",
        flashcardBack: "First-class means a function can be stored in a variable, put in a list or dictionary, passed as an argument to another function, and returned as the result of a function. This enables: passing callbacks (`sorted(data, key=my_fn)`), storing dispatch tables (`{'add': add_fn}`), writing decorators (functions that wrap other functions), and building higher-order functions like `map` and `filter`. Languages without first-class functions must work around this with objects or interfaces.",
      },
      {
        name: "Parameters, Arguments and Default Values",
        orderIndex: 1,
        prerequisites: ["Defining Functions with def"],
        explanation: `**Parameters** are the names listed in the function definition; **arguments** are the values passed at call time. Python supports positional arguments, keyword arguments, and **default values**.

\`\`\`python
def power(base, exponent=2):
    return base ** exponent

power(3)          # 9   — exponent uses default
power(3, 3)       # 27  — positional
power(3, exponent=4)  # 81 — keyword argument
power(exponent=3, base=2)  # 8 — keyword, any order
\`\`\`

⚠️ **Never use a mutable default value** (like a list or dict):
\`\`\`python
# BUG: the list is shared across all calls
def append_to(item, lst=[]):
    lst.append(item)
    return lst
# Use None as default instead:
def append_to(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\``,
        flashcardFront: "Why is `def f(x, data=[])` a bug, and what is the correct pattern?",
        flashcardBack: "Default argument values are evaluated **once** when the `def` statement is executed, not each time the function is called. A mutable default like `[]` is created once and then shared across all calls that don't pass `data`. So the second call sees the list mutated by the first call. The fix is to use `None` as the default sentinel and create a fresh object inside the function: `if data is None: data = []`. This is one of Python's most common gotchas.",
      },
      {
        name: "Return Values and Multiple Returns",
        orderIndex: 2,
        prerequisites: ["Defining Functions with def"],
        explanation: `A function can **return multiple values** using tuple packing — Python implicitly wraps them in a tuple which can then be unpacked by the caller.

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)   # returns a tuple

lo, hi = min_max([3, 1, 4, 1, 5, 9])   # unpack
print(lo, hi)   # 1 9

# Caller can also receive as a single tuple
result = min_max([3, 1, 4])
print(result)       # (1, 4)
print(result[0])    # 1
\`\`\`

\`return\` without a value, or falling off the end of the function body, returns \`None\`. Always document what a function returns in its docstring.

⚠️ A function that sometimes returns a value and sometimes returns \`None\` implicitly is a common source of \`AttributeError\` bugs.`,
        flashcardFront: "How does Python let a function return multiple values, and what type does the caller actually receive?",
        flashcardBack: "Python uses **tuple packing** — `return x, y` is syntactic sugar for `return (x, y)`. The caller receives a single tuple. When you write `a, b = f()`, tuple unpacking extracts both values into separate names. You can also receive the tuple as-is with `result = f()` and access `result[0]`, `result[1]`. This is not a special language feature for multiple returns — it's just tuple packing and unpacking applied to function return.",
      },
      {
        name: "Variable Scope and the LEGB Rule",
        orderIndex: 3,
        prerequisites: ["Defining Functions with def"],
        explanation: `Python resolves names using the **LEGB** rule: **L**ocal → **E**nclosing function → **G**lobal (module) → **B**uilt-in.

\`\`\`python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        print(x)      # finds "enclosing" (E before G)
    inner()

def modify_global():
    global x          # declare intent to use global x
    x = "changed"

def modify_enclosing():
    count = 0
    def increment():
        nonlocal count  # modify the enclosing variable
        count += 1
    increment()
    return count
\`\`\`

⚠️ Without \`global\` or \`nonlocal\`, assignment inside a function *always* creates a new local variable, even if a same-named global exists.`,
        flashcardFront: "Why does the following code raise an `UnboundLocalError`: `x = 1; def f(): print(x); x = 2; f()`?",
        flashcardBack: "Python decides at *compile time* whether a name is local by scanning the entire function body for assignments. Because `x = 2` appears anywhere in `f()`, Python marks `x` as local throughout the entire function — even the `print(x)` line before the assignment. When `print(x)` runs, the local `x` hasn't been assigned yet, hence `UnboundLocalError`. The fix is either to remove the local assignment, or to add `global x` at the top of the function.",
      },
      {
        name: "*args and **kwargs",
        orderIndex: 4,
        prerequisites: ["Parameters, Arguments and Default Values"],
        explanation: `**\`*args\`** collects extra positional arguments into a tuple. **\`**kwargs\`** collects extra keyword arguments into a dict. Together they make functions that accept any arguments.

\`\`\`python
def log(*args, **kwargs):
    print("args:", args)
    print("kwargs:", kwargs)

log(1, 2, "three", sep=",", end="!")
# args: (1, 2, 'three')
# kwargs: {'sep': ',', 'end': '!'}

# Unpacking at call site
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
add(*nums)          # same as add(1, 2, 3)
d = {"a":1,"b":2,"c":3}
add(**d)            # same as add(a=1, b=2, c=3)
\`\`\`

⚠️ The names \`args\` and \`kwargs\` are conventions — what matters is the \`*\` and \`**\` syntax.`,
        flashcardFront: "What is the difference between using `*args` in a function *definition* versus using `*iterable` in a function *call*?",
        flashcardBack: "In a **definition**, `*args` means \"collect all remaining positional arguments into a tuple named args\". In a **call**, `*iterable` means \"unpack this iterable and spread its elements as separate positional arguments\". They're opposites: definition packs, call unpacks. Similarly, `**kwargs` in a definition collects keyword arguments into a dict, while `**dict` in a call unpacks the dict into keyword arguments. This symmetry lets you capture and forward arguments generically: `def wrapper(*args, **kwargs): return original(*args, **kwargs)`.",
      },
      {
        name: "Docstrings",
        orderIndex: 5,
        prerequisites: ["Defining Functions with def", "Return Values and Multiple Returns"],
        explanation: `A **docstring** is a string literal as the first statement in a function (or class, or module) body. Python stores it as \`__doc__\` and tools like \`help()\` display it.

\`\`\`python
def clamp(value, low, high):
    """Return value clamped to the range [low, high].

    Args:
        value: The number to clamp.
        low: The minimum allowed value.
        high: The maximum allowed value.

    Returns:
        float: The clamped value.

    Raises:
        ValueError: If low > high.
    """
    if low > high:
        raise ValueError(f"low ({low}) must be <= high ({high})")
    return max(low, min(value, high))

help(clamp)       # displays the docstring
clamp.__doc__     # raw string access
\`\`\`

⚠️ Docstrings are not comments — they survive at runtime and are accessible programmatically by documentation tools and IDEs.`,
        flashcardFront: "What makes a docstring different from a regular comment, and why does it matter?",
        flashcardBack: "A docstring is a string *object* stored as `function.__doc__` at runtime — it's part of the function, not discarded by the parser like a `#` comment. This means `help(f)`, IDEs, Sphinx, and other tools can read it programmatically to generate documentation, show tooltips, and build API references. Comments only exist in source code. A well-written docstring becomes live documentation: always visible in the REPL, always available to introspection — comments are gone the moment the file is compiled.",
      },
    ],
  },

  // ── SESSION 5 ─────────────────────────────────────────────────────────────
  {
    index: 5,
    title: "Mutable and Immutable Objects",
    cheatSheet: `## Mutable and Immutable Objects

**Mutability at a Glance**
| Mutable | Immutable |
|---------|-----------|
| list, dict, set | int, float, str, tuple, frozenset |

**Object Identity vs Equality**
\`\`\`python
a = [1, 2]
b = [1, 2]
a == b    # True  — same contents
a is b    # False — different objects
id(a) == id(b)   # False
\`\`\`

**Aliasing**
\`\`\`python
a = [1, 2, 3]
b = a             # b is an ALIAS — same object
b.append(4)
print(a)          # [1, 2, 3, 4]  ← a changed!
\`\`\`

**Shallow vs Deep Copy**
\`\`\`python
import copy
a = [[1, 2], [3, 4]]
b = a.copy()            # shallow: nested lists still shared
c = copy.deepcopy(a)    # deep: fully independent
b[0].append(99)
print(a[0])   # [1, 2, 99]  ← a affected by b
print(c[0])   # [1, 2]      ← c fully independent
\`\`\`

⚠️ Tuples are immutable containers, but if they contain mutable objects, those objects can still be mutated.
\`\`\`python
t = ([1, 2], [3, 4])
t[0].append(99)   # works! t[0] is still the same list object
\`\`\``,
    concepts: [
      {
        name: "Mutability in Python",
        orderIndex: 0,
        prerequisites: [],
        explanation: `**Mutability** determines whether an object's contents can change after creation. In Python every variable is a reference to an object, and the object itself carries the type.

**Mutable**: \`list\`, \`dict\`, \`set\`, and user-defined class instances by default.
**Immutable**: \`int\`, \`float\`, \`str\`, \`tuple\`, \`frozenset\`, \`bytes\`.

\`\`\`python
# Immutable — cannot change the string
s = "hello"
# s[0] = "H"   → TypeError

# Mutable — can change the list in place
lst = [1, 2, 3]
lst[0] = 99     # works — [99, 2, 3]
lst.append(4)   # works — [99, 2, 3, 4]
\`\`\`

Immutability has a critical consequence: immutable objects can be used as **dictionary keys** and **set elements**; mutable objects cannot.

⚠️ Reassigning a variable (\`x = 5\`) is not mutation — it just rebinds the name. Mutation means changing the object the name points to.`,
        flashcardFront: "Why can tuples be used as dictionary keys but lists cannot?",
        flashcardBack: "Dictionary keys must be **hashable** — Python computes a hash value for each key to find its bucket quickly. The hash of an object must remain stable for its lifetime. Immutable objects like tuples have a stable hash because their contents can't change. Lists are mutable — their contents could change after being inserted as a key, which would corrupt the dictionary structure (the key would be in the wrong bucket). Python enforces this by raising `TypeError: unhashable type: 'list'` when you try to use a list as a key.",
      },
      {
        name: "Object Identity with id() and is",
        orderIndex: 1,
        prerequisites: ["Mutability in Python"],
        explanation: `Every Python object has a unique **identity** (its memory address), accessible via \`id()\`. The \`is\` operator compares identity, not value.

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True  — same contents
print(a is b)   # False — different objects
print(a is c)   # True  — same object

print(id(a))    # e.g. 140234567
print(id(c))    # same number as id(a)
\`\`\`

Python **caches** small integers (-5 to 256) and interned strings, so \`is\` may return \`True\` for these even when they appear to be separate:
\`\`\`python
x = 256; y = 256
x is y   # True  — cached
x = 1000; y = 1000
x is y   # may be False
\`\`\`

⚠️ Relying on this caching behaviour in production code is an implementation detail — never use \`is\` to compare integers or strings except for \`None\`, \`True\`, and \`False\`.`,
        flashcardFront: "What is the difference between `a == b` and `a is b`, and when should you use each?",
        flashcardBack: "`==` calls `__eq__` and tests **value equality** — whether two objects represent the same data. `is` tests **identity** — whether two names point to the exact same object in memory. Use `==` for comparing values (numbers, strings, lists). Use `is` only for singletons: `x is None`, `x is True`, `x is False`. Never use `is` to compare arbitrary integers or strings — Python's caching makes it unreliable as a value comparison.",
      },
      {
        name: "Variable Aliasing",
        orderIndex: 2,
        prerequisites: ["Object Identity with id() and is"],
        explanation: `**Aliasing** occurs when two or more variable names point to the same mutable object. Mutating through one name is immediately visible through all other aliases.

\`\`\`python
a = [1, 2, 3]
b = a           # b is an alias for the same list

b.append(4)
print(a)        # [1, 2, 3, 4] — a also changed!
print(a is b)   # True

# Functions receive aliases, not copies
def double_first(lst):
    lst[0] *= 2   # mutates the caller's list

nums = [5, 6, 7]
double_first(nums)
print(nums)     # [10, 6, 7]
\`\`\`

To avoid aliasing, make an explicit copy before passing or assigning a mutable object.

⚠️ Aliasing is intentional in many cases (efficiency), but unintentional aliasing in functions that modify their arguments is a common bug.`,
        flashcardFront: "When you pass a list to a Python function and the function appends to it, does the caller's list change? Why?",
        flashcardBack: "Yes, the caller's list changes. Python passes **object references**, not copies. The function parameter is an alias pointing to the same list object as the caller's variable. Any in-place mutation (`append`, `pop`, index assignment) through the parameter is visible to the caller. This is sometimes called \"pass by object reference\" — you can't rebind the caller's name (assigning `lst = []` only rebinds the local parameter), but you can mutate the object through it. To protect against this, pass `lst[:]` or `list(lst)` to send a copy.",
      },
      {
        name: "Shallow Copy",
        orderIndex: 3,
        prerequisites: ["Variable Aliasing"],
        explanation: `A **shallow copy** creates a new container object but fills it with **references to the same elements** as the original. The top-level container is independent, but nested objects are still shared.

\`\`\`python
a = [[1, 2], [3, 4]]

# Three equivalent ways to shallow-copy a list:
b = a.copy()
b = a[:]
b = list(a)

b.append([5, 6])   # only b changes — a is unaffected
print(a)           # [[1,2],[3,4]]

b[0].append(99)    # mutates the shared nested list!
print(a[0])        # [1, 2, 99] — a is affected!
\`\`\`

A shallow copy is sufficient when your list contains only immutable elements (ints, strings, tuples), because those can't be mutated anyway.

⚠️ Shallow copy has O(n) cost for the outer container only. For deeply nested structures you need \`copy.deepcopy\`.`,
        flashcardFront: "When is a shallow copy sufficient, and when do you need a deep copy?",
        flashcardBack: "A shallow copy is sufficient when the container holds only **immutable** objects (ints, strings, tuples) — since they can't be mutated, sharing references is safe. You need a deep copy when the container holds **mutable** objects (lists, dicts, other custom objects) and you need the copy to be fully independent. The rule: if any element of your collection is mutable and you plan to modify it, use `copy.deepcopy()`. Deep copy is more expensive — O(n) for the whole object graph — so don't use it unnecessarily.",
      },
      {
        name: "Deep Copy with the copy Module",
        orderIndex: 4,
        prerequisites: ["Shallow Copy"],
        explanation: `**\`copy.deepcopy()\`** creates a completely independent clone of an object and all objects reachable from it. Mutations to the copy do not affect the original at any level.

\`\`\`python
import copy

original = {"a": [1, 2, 3], "b": {"nested": True}}
shallow = original.copy()
deep = copy.deepcopy(original)

original["a"].append(99)

print(shallow["a"])   # [1, 2, 3, 99] — shared reference
print(deep["a"])      # [1, 2, 3]     — fully independent
\`\`\`

\`deepcopy\` handles circular references automatically using a memo dict that tracks already-copied objects.

⚠️ Deep copy can be **much slower** for large nested structures. For performance-sensitive code, consider restructuring your data to avoid deep mutation, or use immutable data types (tuples, frozensets) to make shallow copies safe.`,
        flashcardFront: "Why does `copy.deepcopy()` need a memo dictionary internally, and what problem does it solve?",
        flashcardBack: "Deepcopy uses a memo dict (`{id(original_obj): copied_obj}`) to track every object it has already copied. Without it, an object that appears multiple times in a structure would be copied multiple times — breaking the internal sharing structure. Worse, **circular references** (`a` contains `b` which references back to `a`) would cause infinite recursion. The memo dict ensures each object is copied exactly once, and subsequent references to the same original object map to the same copy, preserving the graph structure.",
      },
    ],
  },

  // ── SESSION 6 ─────────────────────────────────────────────────────────────
  {
    index: 6,
    title: "File I/O and Context Managers",
    cheatSheet: `## File I/O and Context Managers

**Opening Files**
\`\`\`python
f = open("data.txt", "r")   # "r"=read, "w"=write, "a"=append, "rb"=binary
\`\`\`
Always close files. Use \`with\` to do it automatically.

**Context Managers (with statement)** ← prefer this always
\`\`\`python
with open("data.txt", "r") as f:
    content = f.read()        # read entire file as string
# File is closed automatically here, even on exception
\`\`\`

**Reading**
\`\`\`python
with open("data.txt") as f:
    lines = f.readlines()     # list of strings with \\n
    for line in f:            # memory-efficient iteration
        process(line.strip())
\`\`\`

**Writing**
\`\`\`python
with open("out.txt", "w") as f:   # "w" truncates existing file
    f.write("Hello\\n")
    f.writelines(["line1\\n", "line2\\n"])
\`\`\`
⚠️ \`"w"\` destroys existing content. Use \`"a"\` to append.

**CSV Files**
\`\`\`python
import csv
with open("data.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])
\`\`\`

**pathlib (modern path handling)**
\`\`\`python
from pathlib import Path
p = Path("data") / "file.txt"   # OS-safe join
p.exists()  p.read_text()  p.write_text("hi")  p.suffix  p.stem
\`\`\``,
    concepts: [
      {
        name: "Opening and Closing Files",
        orderIndex: 0,
        prerequisites: [],
        explanation: `**\`open(filename, mode)\`** returns a **file object**. The mode determines access type: \`"r"\` (read, default), \`"w"\` (write, truncates), \`"a"\` (append), \`"x"\` (create new, fail if exists), \`"b"\` (binary suffix).

\`\`\`python
f = open("notes.txt", "r")
content = f.read()
f.close()    # must close to flush buffers and release OS handle
\`\`\`

Failing to close a file leaks a **file descriptor** — the OS has a limit on how many can be open simultaneously. On some systems, data written to a file may not be flushed to disk until \`close()\` is called.

⚠️ If an exception occurs between \`open()\` and \`close()\`, the file is never closed. Always use the \`with\` statement instead of manually calling \`close()\`.`,
        flashcardFront: "What goes wrong if you open a file with `'w'` mode when the file already exists?",
        flashcardBack: "Mode `'w'` **truncates** the file immediately upon opening — all existing content is destroyed, even before you write a single byte. If you want to add to an existing file, use `'a'` (append). If you want to fail safely when a file already exists (e.g., to avoid overwriting), use `'x'` (exclusive creation) which raises `FileExistsError` if the file is present. Always choose the mode deliberately — `'w'` is a common source of accidental data loss.",
      },
      {
        name: "Context Managers and the with Statement",
        orderIndex: 1,
        prerequisites: ["Opening and Closing Files"],
        explanation: `The **\`with\` statement** is the correct way to work with resources like files. It guarantees the resource is released even if an exception occurs inside the block.

\`\`\`python
# Equivalent to try/finally with explicit close
with open("data.txt", "r") as f:
    content = f.read()
# f is closed here, guaranteed

# Multiple resources in one with
with open("input.txt") as src, open("output.txt", "w") as dst:
    dst.write(src.read().upper())
\`\`\`

The \`with\` statement works with any **context manager** — any object implementing \`__enter__\` and \`__exit__\`. Beyond files: database connections, locks, network sockets, \`tempfile\`, \`decimal.localcontext\`.

⚠️ After the \`with\` block exits, the file object is closed. Reading from it raises \`ValueError: I/O operation on closed file\`.`,
        flashcardFront: "What protocol makes an object usable as a context manager, and how does Python guarantee cleanup?",
        flashcardBack: "An object is a context manager if it implements `__enter__` and `__exit__` methods. The `with` statement calls `__enter__` on entry (its return value is bound to the `as` variable) and always calls `__exit__` on exit — even if an exception is raised. `__exit__` receives exception info and can suppress it by returning `True`. This protocol ensures cleanup (closing files, releasing locks) happens reliably without the programmer having to write `try/finally` blocks manually.",
      },
      {
        name: "Reading Files",
        orderIndex: 2,
        prerequisites: ["Context Managers and the with Statement"],
        explanation: `Three main patterns for reading file content, each with different memory implications:

\`\`\`python
with open("data.txt") as f:
    # 1. Read entire file into one string (small files only)
    content = f.read()

    # 2. Read all lines into a list
    lines = f.readlines()   # includes \\n at end of each line
    lines = [line.strip() for line in f.readlines()]

    # 3. Iterate line by line (memory efficient for large files)
    for line in f:
        process(line.rstrip("\\n"))
\`\`\`

After reading to the end, the file pointer is at EOF — calling \`read()\` again returns \`""\`. Use \`f.seek(0)\` to rewind.

⚠️ \`f.readlines()\` loads the entire file into memory. For files larger than available RAM, iterate line by line.`,
        flashcardFront: "For a 10 GB log file, which reading strategy should you use and why?",
        flashcardBack: "Iterate line by line with `for line in f:`. This reads one line at a time into memory — O(line_length) space — regardless of how large the file is. `f.read()` would try to load all 10 GB into RAM at once, likely causing a `MemoryError` or severe swapping. `f.readlines()` has the same problem. Python's file objects are iterators: `for line in f` calls `readline()` internally on each iteration, keeping memory use constant.",
      },
      {
        name: "Writing Files",
        orderIndex: 3,
        prerequisites: ["Context Managers and the with Statement"],
        explanation: `Writing requires opening with mode \`"w"\` (overwrite) or \`"a"\` (append). Use \`f.write(str)\` for a single string or \`f.writelines(iterable)\` for multiple strings.

\`\`\`python
lines = ["Alice,90\\n", "Bob,85\\n", "Carol,92\\n"]

with open("scores.txt", "w") as f:
    f.writelines(lines)     # writes each string; no automatic \\n added

# Append mode — adds to end of file
with open("scores.txt", "a") as f:
    f.write("Dave,88\\n")

# Write numbers — must convert to string
with open("out.txt", "w") as f:
    for n in range(5):
        f.write(str(n) + "\\n")
\`\`\`

⚠️ \`f.write()\` does **not** add a newline automatically. \`f.writelines()\` also does not — your strings must already contain \`"\\n"\` if you want line breaks.`,
        flashcardFront: "You write data to a file but the file is empty when you inspect it. What is the most likely cause?",
        flashcardBack: "The file was likely not closed before inspecting it. File writes are **buffered** — Python holds data in an in-memory buffer and flushes it to disk when the buffer fills or when the file is closed. If the program crashed or the file was read before `close()` (or exiting a `with` block), the buffer may not have been flushed. Solutions: use `with` so the file is always closed, call `f.flush()` explicitly after writing, or open with `buffering=1` (line-buffered) for text files.",
      },
      {
        name: "CSV Files with the csv Module",
        orderIndex: 4,
        prerequisites: ["Reading Files", "Writing Files"],
        explanation: `The \`csv\` module handles the edge cases of CSV parsing (quoted fields, embedded commas, newlines within fields) that naive \`split(",")\` gets wrong.

\`\`\`python
import csv

# Reading with DictReader (column names from header row)
with open("students.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])

# Writing with DictWriter
fields = ["name", "score"]
with open("out.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerow({"name": "Ada", "score": 97})
\`\`\`

⚠️ Always open CSV files with \`newline=""\` on all platforms — the \`csv\` module handles its own line endings. Without it, you may get blank rows on Windows.`,
        flashcardFront: "Why is `line.split(',')` not reliable for parsing CSV, and what does the csv module handle that split doesn't?",
        flashcardBack: "CSV fields can contain commas if the field is quoted: `\"Smith, John\",42` — `split(',')` would incorrectly split this into three fields. Fields can also contain embedded newlines (within quotes), and quote characters themselves can be escaped. The `csv` module implements the full RFC 4180 specification, handling quoted fields, escaped quotes, custom delimiters, and different line endings correctly. Always use the `csv` module (or a library like `pandas`) for real CSV data — `split(',')` is only safe for toy data you fully control.",
      },
      {
        name: "Path Handling with pathlib",
        orderIndex: 5,
        prerequisites: ["Opening and Closing Files"],
        explanation: `**\`pathlib.Path\`** provides an object-oriented, OS-independent API for file paths, replacing string-based \`os.path\` operations.

\`\`\`python
from pathlib import Path

p = Path("data") / "reports" / "2024.csv"   # OS-safe join
print(p.name)        # "2024.csv"
print(p.stem)        # "2024"
print(p.suffix)      # ".csv"
print(p.parent)      # data/reports

p.exists()           # True/False
p.is_file()
p.is_dir()

# Read/write convenience
text = p.read_text(encoding="utf-8")
p.write_text("new content")

# List all Python files in a directory
for py_file in Path(".").glob("**/*.py"):
    print(py_file)
\`\`\`

⚠️ \`Path\` objects are not strings — pass \`str(p)\` or use \`Path\` consistently throughout. Most modern libraries accept \`Path\` objects directly.`,
        flashcardFront: "What does `Path('data') / 'file.txt'` do, and why is this better than string concatenation for file paths?",
        flashcardBack: "The `/` operator on `Path` objects calls `Path.__truediv__`, which uses the OS-appropriate separator — backslash on Windows, forward slash on Unix — automatically. String concatenation like `'data' + '/' + 'file.txt'` hardcodes the separator and breaks on other platforms. `pathlib` also normalises paths (removes `.` components, collapses `//`) and provides a rich API (`.exists()`, `.glob()`, `.read_text()`) that removes the need to import and chain multiple `os.path` functions.",
      },
    ],
  },

  // ── SESSION 7 ─────────────────────────────────────────────────────────────
  {
    index: 7,
    title: "Modules and Packages",
    cheatSheet: `## Modules and Packages

**Importing**
\`\`\`python
import math                    # access as math.sqrt()
from math import sqrt, pi      # import specific names
from math import sqrt as sq    # alias
import numpy as np             # conventional alias
\`\`\`

**Standard Library Highlights**
| Module | Use |
|--------|-----|
| \`math\` | sqrt, log, trig, constants |
| \`random\` | random numbers, shuffle, choice |
| \`os\` | file system, environment variables |
| \`sys\` | interpreter state, argv, path |
| \`datetime\` | dates and times |
| \`collections\` | Counter, defaultdict, deque |
| \`itertools\` | combinatorics, infinite iterators |

**Creating a Module**
Any \`.py\` file is a module. Import by filename (without \`.py\`).
\`\`\`python
# mymath.py
def add(a, b): return a + b

# main.py
import mymath
mymath.add(1, 2)
\`\`\`

**The \`__name__\` Guard**
\`\`\`python
if __name__ == "__main__":
    main()   # only runs when executed directly, not when imported
\`\`\`

**pip**
\`\`\`bash
pip install numpy pandas
pip list
pip freeze > requirements.txt
pip install -r requirements.txt
\`\`\`
💡 Use a virtual environment: \`python -m venv .venv && source .venv/bin/activate\``,
    concepts: [
      {
        name: "import Statement and Module System",
        orderIndex: 0,
        prerequisites: [],
        explanation: `A **module** is any \`.py\` file. Python's import system makes its contents available in your namespace. There are three main import styles:

\`\`\`python
import math               # namespace access: math.sqrt(4)
from math import sqrt     # direct name: sqrt(4)
from math import sqrt as sq  # alias: sq(4)
from math import *        # import everything (avoid in production)
\`\`\`

When you \`import module\`, Python:
1. Checks \`sys.modules\` cache — returns immediately if already imported.
2. Searches \`sys.path\` (current dir, PYTHONPATH, standard lib, site-packages).
3. Compiles the \`.py\` to bytecode (\`.pyc\`) and caches it.
4. Executes the module's top-level code once.

⚠️ \`from module import *\` pollutes your namespace and makes it hard to know where names come from — reserve it for interactive sessions.`,
        flashcardFront: "If you `import math` in two different files in the same program, does Python execute `math.py` twice?",
        flashcardBack: "No. Python caches imported modules in `sys.modules`. The first `import math` executes the module and stores the result. Subsequent `import math` in any other file retrieves the cached module object — the module's top-level code runs only once per interpreter session. This means module-level state (globals, class definitions) is shared across all importers. It also means circular imports can partially succeed — a module may be in `sys.modules` before it's fully initialised.",
      },
      {
        name: "Standard Library Overview",
        orderIndex: 1,
        prerequisites: ["import Statement and Module System"],
        explanation: `Python's **standard library** ships with the interpreter — no installation needed. Key modules for AI/data work:

\`\`\`python
import math
math.sqrt(16)          # 4.0
math.log(math.e)       # 1.0
math.ceil(3.2)         # 4

import random
random.random()        # float in [0.0, 1.0)
random.choice([1,2,3]) # random element
random.shuffle(lst)    # in-place shuffle

from collections import Counter, defaultdict
Counter("abracadabra")  # Counter({'a':5,'b':2,'r':2,'c':1,'d':1})

import itertools
list(itertools.combinations([1,2,3], 2))  # [(1,2),(1,3),(2,3)]
\`\`\`

⚠️ Don't name your own files after standard library modules (\`math.py\`, \`random.py\`) — it shadows the built-in and causes confusing \`ImportError\`s.`,
        flashcardFront: "What does `collections.Counter` do and when would you reach for it over a regular dict?",
        flashcardBack: "`Counter` is a dict subclass that counts hashable objects. Pass it an iterable and it returns a dict-like object mapping each element to its count. Use it instead of manually writing `counts[x] = counts.get(x, 0) + 1` loops. It also provides `most_common(n)` for the top-n elements, supports arithmetic (`+`, `-` between counters), and initialises missing keys to 0 rather than raising `KeyError`. It's the standard tool for frequency analysis, histogram building, and multiset operations.",
      },
      {
        name: "Creating Custom Modules",
        orderIndex: 2,
        prerequisites: ["import Statement and Module System"],
        explanation: `Any \`.py\` file in Python's module search path is importable as a module. A **package** is a directory containing an \`__init__.py\` file.

\`\`\`python
# File: myutils/stats.py
def mean(data):
    return sum(data) / len(data)

def variance(data):
    m = mean(data)
    return sum((x - m)**2 for x in data) / len(data)

# File: main.py
from myutils.stats import mean, variance
print(mean([1, 2, 3, 4, 5]))   # 3.0
\`\`\`

Module-level variables are initialised once when the module is first imported. Use \`__all__ = ["mean", "variance"]\` to control what \`from module import *\` exports.

⚠️ In Python 3.3+ packages don't require \`__init__.py\` (namespace packages), but having one is still conventional and lets you run package-level init code.`,
        flashcardFront: "What is `__all__` in a module, and what does it control?",
        flashcardBack: "`__all__` is a list of strings naming the public API of a module. It has one specific effect: it controls what names are exported when someone does `from module import *`. Without `__all__`, `import *` imports everything not prefixed with `_`. With `__all__`, only the listed names are exported. It's also a convention signal to readers about what the module's public interface is. It does NOT prevent explicit imports like `from module import _private` — it only affects `import *`.",
      },
      {
        name: "The __name__ Guard",
        orderIndex: 3,
        prerequisites: ["Creating Custom Modules"],
        explanation: `Every Python module has a \`__name__\` attribute. When a file is **run directly**, \`__name__\` is set to \`"__main__"\`. When it is **imported**, \`__name__\` is the module's filename (without \`.py\`).

\`\`\`python
# utils.py
def compute(x):
    return x ** 2

if __name__ == "__main__":
    # Only runs when executing: python utils.py
    # Does NOT run when: import utils
    print(compute(5))
\`\`\`

This guard lets a file serve two roles:
1. A **library** — importable, provides functions.
2. A **script** — runnable directly for testing or CLI use.

⚠️ Without the guard, test/demo code at module level runs every time the module is imported — slowing startup and potentially causing side effects in production.`,
        flashcardFront: "Why does code under `if __name__ == '__main__':` not run when the module is imported?",
        flashcardBack: "Python sets `__name__` to `'__main__'` only for the file that was passed directly to the interpreter (`python myfile.py`). When a file is imported, Python sets its `__name__` to the module name (e.g., `'myfile'`). The `if __name__ == '__main__':` condition is therefore `False` during import, so the code block is skipped. This is how the same file can contain both reusable library code (always available) and script-specific behaviour (only runs when executed directly).",
      },
      {
        name: "pip and Virtual Environments",
        orderIndex: 4,
        prerequisites: ["import Statement and Module System"],
        explanation: `**pip** is Python's package installer, downloading from PyPI. **Virtual environments** isolate project dependencies so projects don't interfere with each other.

\`\`\`bash
# Install packages
pip install numpy pandas matplotlib

# Freeze and restore
pip freeze > requirements.txt
pip install -r requirements.txt

# Virtual environment workflow
python -m venv .venv          # create
source .venv/bin/activate     # activate (Mac/Linux)
.venv\\Scripts\\activate       # activate (Windows)
pip install numpy             # installs only into this env
deactivate                    # exit
\`\`\`

\`\`\`python
import sys
print(sys.executable)   # path to the active Python interpreter
\`\`\`

⚠️ Never install packages with \`sudo pip install\` into the system Python — it can break system tools. Always use a virtual environment for project work.`,
        flashcardFront: "Why should you use a virtual environment for every Python project instead of installing packages globally?",
        flashcardBack: "Installing globally means all projects share the same packages. Project A needs `numpy==1.21` but Project B needs `numpy==2.0` — they can't coexist in one global environment. Virtual environments create isolated Python installations per project. Each has its own `site-packages` directory, its own pip, and its own interpreter. Activating one doesn't affect others. This also makes `requirements.txt` reliable: it captures exactly what the project needs, not a superset of everything you've ever installed.",
      },
    ],
  },

  // ── SESSION 8 ─────────────────────────────────────────────────────────────
  {
    index: 8,
    title: "Object-Oriented Programming: Classes",
    cheatSheet: `## OOP: Classes

**Defining a Class**
\`\`\`python
class Dog:
    species = "Canis lupus"      # class attribute (shared)

    def __init__(self, name, age):
        self.name = name          # instance attribute (per object)
        self.age = age

    def bark(self):
        return f"{self.name} says woof!"

    def __str__(self):
        return f"Dog({self.name}, {self.age})"

    def __repr__(self):
        return f"Dog(name={self.name!r}, age={self.age!r})"

rex = Dog("Rex", 3)
print(rex.bark())    # Rex says woof!
print(str(rex))      # Dog(Rex, 3)
\`\`\`

**Class vs Instance Attributes**
\`\`\`python
Dog.species         # class attribute — shared by all instances
rex.name            # instance attribute — belongs to rex only
rex.species         # resolves to class attribute (no instance override)
\`\`\`
⚠️ Assigning to \`instance.class_attr\` creates a new instance attribute that shadows the class attribute — it does not modify the class attribute.

**@property Decorator**
\`\`\`python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return 3.14159 * self.radius ** 2

c = Circle(5)
c.area   # 78.54... — accessed like an attribute, no ()
\`\`\``,
    concepts: [
      {
        name: "Class Definition and Instantiation",
        orderIndex: 0,
        prerequisites: [],
        explanation: `A **class** is a blueprint for creating objects. **Instantiation** creates an object (instance) from the class by calling it like a function.

\`\`\`python
class Point:
    pass    # minimal valid class

p = Point()     # instantiation
print(type(p))  # <class '__main__.Point'>
print(isinstance(p, Point))  # True

class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

r = Rectangle(4, 5)
print(r.area())   # 20
\`\`\`

Each call to \`Rectangle(...)\` creates a **new, independent object**. The class itself is also an object — \`type(Rectangle)\` is \`type\`.

⚠️ Class names use **PascalCase** by convention (\`MyClass\`, not \`my_class\`).`,
        flashcardFront: "What happens step-by-step when you call `Rectangle(4, 5)` in Python?",
        flashcardBack: "Python calls `Rectangle.__call__(4, 5)`, which internally calls `Rectangle.__new__(Rectangle)` to allocate a new empty instance, then calls `instance.__init__(4, 5)` on that new instance to initialise its attributes. `__new__` is rarely overridden; `__init__` is where you do setup. The fully initialised instance is then returned to the caller. So `Rectangle(4, 5)` is syntactic sugar for `type.__call__(Rectangle, 4, 5)` under the hood.",
      },
      {
        name: "The __init__ Constructor and self",
        orderIndex: 1,
        prerequisites: ["Class Definition and Instantiation"],
        explanation: `**\`__init__\`** is called automatically after a new instance is created. Its job is to initialise **instance attributes**. **\`self\`** is the first parameter of every instance method — it refers to the instance being operated on.

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner       # creates instance attribute
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount

    def __str__(self):
        return f"{self.owner}: £{self.balance:.2f}"

acc = BankAccount("Ada")
acc.deposit(100)
print(acc)   # Ada: £100.00
\`\`\`

\`self\` is not a keyword — it's a convention. Python passes the instance automatically as the first argument when you call \`acc.deposit(100)\`.

⚠️ Forgetting \`self.\` before an attribute creates a local variable that disappears when the method returns, not an attribute on the object.`,
        flashcardFront: "Why does Python require `self` as the first parameter of instance methods when other languages (like Java) don't?",
        flashcardBack: "In Python, `acc.deposit(100)` is exactly equivalent to `BankAccount.deposit(acc, 100)`. Python translates method calls on instances into calls on the class with the instance prepended — `self` is that prepended argument. Making it explicit is a deliberate design choice: it makes the receiver (the object being acted on) always visible in the method signature, and it means methods are just regular functions stored in a class dict. Other OO languages hide this receiver in a built-in `this` keyword; Python makes the mechanism transparent.",
      },
      {
        name: "Instance Attributes vs Class Attributes",
        orderIndex: 2,
        prerequisites: ["The __init__ Constructor and self"],
        explanation: `**Instance attributes** belong to individual objects. **Class attributes** are shared by all instances and accessed on the class itself.

\`\`\`python
class Dog:
    species = "Canis lupus"   # class attribute

    def __init__(self, name):
        self.name = name      # instance attribute

fido = Dog("Fido")
rex = Dog("Rex")

print(fido.species)     # "Canis lupus" — from class
print(Dog.species)      # "Canis lupus" — same object

Dog.species = "Canis"   # changes for ALL instances
print(rex.species)      # "Canis"

rex.species = "Wolf"    # creates instance attribute on rex only
print(fido.species)     # "Canis" — class attr unchanged
print(rex.species)      # "Wolf"  — instance attr shadows class attr
\`\`\`

⚠️ Using a **mutable** class attribute (like a list) is dangerous — all instances share it and mutations to it through one instance affect all others.`,
        flashcardFront: "You define `count = 0` as a class attribute. When you do `self.count += 1` in a method, does the class attribute change?",
        flashcardBack: "No. `self.count += 1` is `self.count = self.count + 1`. The right side reads the class attribute (since no instance attribute exists yet), adds 1, then assigns to `self.count` — creating a **new instance attribute** that shadows the class attribute. After this, `ClassName.count` is still 0; only `instance.count` is 1. To actually increment the class attribute, use `ClassName.count += 1` or `self.__class__.count += 1`.",
      },
      {
        name: "__str__ and __repr__",
        orderIndex: 3,
        prerequisites: ["The __init__ Constructor and self"],
        explanation: `**Special methods** (dunder methods) define how instances behave with built-in functions and operators. \`__str__\` defines the human-readable string; \`__repr__\` defines the developer/debug representation.

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"        # for print()

    def __repr__(self):
        return f"Vector({self.x!r}, {self.y!r})"  # for repr()

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

v = Vector(1, 2)
print(str(v))   # (1, 2)
print(repr(v))  # Vector(1, 2)
v2 = v + Vector(3, 4)
print(v2)       # (4, 6)
\`\`\`

⚠️ If only \`__repr__\` is defined, Python uses it for both \`str()\` and \`repr()\`. If only \`__str__\` is defined, \`repr()\` falls back to the default \`<ClassName object at 0x...>\`.`,
        flashcardFront: "What is the practical difference between `__str__` and `__repr__`, and which one should you always define?",
        flashcardBack: "`__repr__` should return an **unambiguous** string, ideally one that could be pasted into Python to recreate the object: `Vector(1, 2)`. `__str__` should return a **readable** string for end users: `(1, 2)`. Always define `__repr__` first — if only one method is defined, Python falls back to `__repr__` for both `str()` and `repr()`. `__repr__` is essential for debugging: it's shown in the REPL, in container representations (`[repr(x) for x in items]`), and in error messages.",
      },
      {
        name: "@property Decorator",
        orderIndex: 4,
        prerequisites: ["Instance Attributes vs Class Attributes"],
        explanation: `The **\`@property\`** decorator lets you define a method that is accessed like an attribute — no parentheses. This enables computed attributes and controlled access without changing the caller's API.

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius    # convention: _ means "internal"

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

t = Temperature(100)
print(t.fahrenheit)   # 212.0  — computed, no ()
t.celsius = 0         # calls the setter
\`\`\`

⚠️ Start with plain attributes. Only add \`@property\` when you need validation, computation, or want to make an attribute read-only.`,
        flashcardFront: "Why use `@property` instead of a regular `get_value()` method?",
        flashcardBack: "`@property` lets callers use attribute syntax (`obj.value`) while the class secretly runs a method — enabling computed values and validation without changing the public API. If you start with a plain attribute `obj.value` and later need to add validation, switching to `@property` requires no changes in calling code. A `get_value()` method, by contrast, forces callers to use `obj.get_value()` forever. Python's convention is to start with public attributes and upgrade to properties only when behaviour is needed — this is cleaner than Java-style getters/setters from the start.",
      },
    ],
  },

  // ── SESSION 9 ─────────────────────────────────────────────────────────────
  {
    index: 9,
    title: "OOP: Inheritance and Polymorphism",
    cheatSheet: `## OOP: Inheritance and Polymorphism

**Basic Inheritance**
\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        raise NotImplementedError

class Dog(Animal):          # Dog inherits from Animal
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

animals = [Dog("Rex"), Cat("Whiskers")]
for a in animals:
    print(a.speak())   # polymorphic call
\`\`\`

**super()**
\`\`\`python
class LoudDog(Dog):
    def speak(self):
        return super().speak().upper()   # reuse parent method

LoudDog("Bolt").speak()   # "WOOF!"
\`\`\`

**isinstance and issubclass**
\`\`\`python
isinstance(rex, Dog)     # True
isinstance(rex, Animal)  # True  — inheritance chain
issubclass(Dog, Animal)  # True
\`\`\`

**Abstract Base Classes**
\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

# Shape()  → TypeError: can't instantiate abstract class
\`\`\``,
    concepts: [
      {
        name: "Class Inheritance",
        orderIndex: 0,
        prerequisites: [],
        explanation: `**Inheritance** lets a child class acquire the attributes and methods of a parent class, enabling code reuse and an "is-a" relationship.

\`\`\`python
class Vehicle:
    def __init__(self, make, speed):
        self.make = make
        self.speed = speed

    def describe(self):
        return f"{self.make} going {self.speed} km/h"

class Car(Vehicle):     # Car inherits from Vehicle
    def __init__(self, make, speed, doors):
        super().__init__(make, speed)  # initialise parent
        self.doors = doors

    def describe(self):
        return super().describe() + f", {self.doors} doors"

c = Car("Toyota", 120, 4)
print(c.describe())   # Toyota going 120 km/h, 4 doors
\`\`\`

Python uses **single inheritance** by default, but supports multiple inheritance. Every class implicitly inherits from \`object\`.

⚠️ Inheritance models "is-a" relationships. If the relationship is "has-a", use **composition** instead (store the object as an attribute).`,
        flashcardFront: "When should you choose inheritance over composition, and what is the key question to ask?",
        flashcardBack: "Ask: \"Is a [Child] a type of [Parent]?\" If yes, inheritance is appropriate (a `Dog` is an `Animal`). If the relationship is \"has a\" or \"uses a\", prefer composition (a `Car` has an `Engine` — it doesn't inherit from `Engine`). Composition is generally more flexible: you can swap out the composed object at runtime, whereas inheritance is fixed at class-definition time. Over-using inheritance creates deep, fragile hierarchies. The principle: favour composition over inheritance unless the is-a relationship is clear and stable.",
      },
      {
        name: "super() Function",
        orderIndex: 1,
        prerequisites: ["Class Inheritance"],
        explanation: `**\`super()\`** returns a proxy that delegates method calls to the next class in the **Method Resolution Order (MRO)** — typically the parent class. It is the correct way to call parent methods without hardcoding the parent class name.

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # calls Animal.__init__
        self.breed = breed

class ServiceDog(Dog):
    def __init__(self, name, breed, task):
        super().__init__(name, breed)  # calls Dog.__init__, which calls Animal
        self.task = task

sd = ServiceDog("Buddy", "Labrador", "Guide")
print(sd.name, sd.breed, sd.task)
\`\`\`

⚠️ Always call \`super().__init__()\` in your child \`__init__\` if the parent sets up attributes you need. Forgetting it means parent attributes are never created.`,
        flashcardFront: "Why use `super().__init__()` instead of `ParentClass.__init__(self)`?",
        flashcardBack: "`super()` respects the MRO — the order Python uses to resolve method calls in inheritance chains, especially in multiple inheritance. Hardcoding `ParentClass.__init__(self)` bypasses MRO and can cause grandparent `__init__` to be called multiple times (or not at all) in diamond inheritance. `super()` in Python 3 is also cleaner: it knows the current class and instance automatically without needing arguments. The general rule: always use `super()` — it's the only correct approach when multiple inheritance or deep hierarchies are involved.",
      },
      {
        name: "Method Overriding and Polymorphism",
        orderIndex: 2,
        prerequisites: ["Class Inheritance"],
        explanation: `**Method overriding** lets a child class provide its own implementation of a method defined in the parent. **Polymorphism** means different object types respond to the same method call in type-specific ways.

\`\`\`python
class Shape:
    def area(self):
        return 0.0

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Rectangle(Shape):
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

shapes = [Circle(5), Rectangle(3, 4), Circle(1)]

# Polymorphic: same call, different behaviour per type
total = sum(s.area() for s in shapes)
print(f"Total area: {total:.2f}")   # 87.27
\`\`\`

⚠️ Python uses **duck typing** — it doesn't require formal inheritance for polymorphism. Any object with an \`area()\` method works in the loop above, regardless of its class hierarchy.`,
        flashcardFront: "What is duck typing and how does it differ from the polymorphism required by languages like Java?",
        flashcardBack: "Duck typing: \"if it walks like a duck and quacks like a duck, it's a duck.\" Python only cares whether an object has the required methods/attributes, not what class it belongs to. A function that calls `obj.area()` works on any object with an `area()` method — no inheritance from a `Shape` base class is required. Java requires explicit interface implementation or class inheritance for polymorphism. Duck typing makes Python code more flexible but less safe — errors appear at runtime when a method is missing, not at compile time.",
      },
      {
        name: "isinstance() and issubclass()",
        orderIndex: 3,
        prerequisites: ["Class Inheritance"],
        explanation: `**\`isinstance(obj, Class)\`** checks whether an object is an instance of a class **or any subclass**. **\`issubclass(Sub, Base)\`** checks the class hierarchy.

\`\`\`python
class Animal: pass
class Dog(Animal): pass
class ServiceDog(Dog): pass

sd = ServiceDog()
isinstance(sd, ServiceDog)   # True
isinstance(sd, Dog)          # True  — subclass
isinstance(sd, Animal)       # True  — grandparent

issubclass(ServiceDog, Dog)    # True
issubclass(ServiceDog, Animal) # True
issubclass(Dog, ServiceDog)    # False

# Check against multiple types
isinstance(sd, (Dog, Cat))   # True if either
\`\`\`

⚠️ Prefer \`isinstance\` over \`type(x) == ClassName\` — the latter breaks with subclasses. \`isinstance(True, int)\` is \`True\` because \`bool\` subclasses \`int\`.`,
        flashcardFront: "Why is `isinstance(x, int)` preferred over `type(x) == int` for type checking?",
        flashcardBack: "`type(x) == int` returns `False` for `bool` values (since `type(True)` is `bool`, not `int`), even though booleans behave as integers in Python. `isinstance(x, int)` returns `True` for both `int` and `bool` instances because it respects the inheritance chain. This matters for correct subclass handling: if a subclass of `int` exists in a library, `type(x) == int` rejects it while `isinstance(x, int)` accepts it. `isinstance` is the correct, idiomatic type check in Python.",
      },
      {
        name: "Abstract Base Classes",
        orderIndex: 4,
        prerequisites: ["Method Overriding and Polymorphism"],
        explanation: `**Abstract Base Classes (ABCs)** define a required interface — methods that subclasses must implement. They cannot be instantiated directly.

\`\`\`python
from abc import ABC, abstractmethod

class DataSource(ABC):
    @abstractmethod
    def connect(self) -> None:
        """Establish connection."""

    @abstractmethod
    def fetch(self, query: str) -> list:
        """Execute query and return results."""

    def ping(self):              # concrete method — shared by all
        self.connect()
        return True

class SQLiteSource(DataSource):
    def connect(self): ...       # must implement or TypeError
    def fetch(self, query): ...

# DataSource()  → TypeError: Can't instantiate abstract class
src = SQLiteSource()   # OK — all abstract methods implemented
\`\`\`

⚠️ If a subclass doesn't implement **all** abstract methods, it is also abstract and cannot be instantiated.`,
        flashcardFront: "What guarantees does an abstract base class provide that a regular base class with `raise NotImplementedError` does not?",
        flashcardBack: "An ABC raises `TypeError` **at instantiation time** if any abstract method is not overridden — you find out immediately when the object is created. A base class with `raise NotImplementedError` in method bodies only raises an error **at call time** — you can create the object successfully and only discover the problem when you call the missing method. ABCs also register themselves with `isinstance`/`issubclass` checks, and they can be introspected via `__abstractmethods__`. They make contracts explicit and enforce them as early as possible.",
      },
    ],
  },

  // ── SESSION 10 ────────────────────────────────────────────────────────────
  {
    index: 10,
    title: "Exceptions, Assertions and Testing",
    cheatSheet: `## Exceptions, Assertions and Testing

**Exception Hierarchy (partial)**
\`\`\`
BaseException
└── Exception
    ├── ValueError, TypeError, KeyError
    ├── AttributeError, IndexError
    ├── FileNotFoundError, PermissionError
    └── RuntimeError, NotImplementedError
\`\`\`

**try / except / else / finally**
\`\`\`python
try:
    result = int(user_input)
except ValueError as e:
    print(f"Bad input: {e}")
except (TypeError, KeyError):
    print("Type or key error")
else:
    print("Success:", result)   # runs if no exception
finally:
    print("Always runs")        # cleanup
\`\`\`

**Raising Exceptions**
\`\`\`python
raise ValueError("must be positive")
raise  # re-raise current exception inside except
\`\`\`

**Custom Exceptions**
\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        super().__init__(f"Need {amount}, have {balance}")
        self.amount = amount
        self.balance = balance
\`\`\`

**assert**
\`\`\`python
assert x > 0, f"Expected positive, got {x}"
# Disabled when Python runs with -O flag
\`\`\`
⚠️ Use \`assert\` for invariants during development. Use \`raise\` for production input validation.

**unittest basics**
\`\`\`python
import unittest
class TestAdd(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(add(1, 2), 3)
    def test_zero(self):
        self.assertRaises(ValueError, add, 0, 0)
\`\`\``,
    concepts: [
      {
        name: "Python Exception Hierarchy",
        orderIndex: 0,
        prerequisites: [],
        explanation: `Python exceptions are **classes** arranged in a hierarchy. All built-in exceptions inherit from \`BaseException\`; most user-facing ones inherit from \`Exception\`.

\`\`\`python
# Key built-in exceptions:
ValueError      # right type, wrong value: int("abc")
TypeError       # wrong type: 1 + "a"
KeyError        # dict key not found: d["missing"]
IndexError      # sequence index out of range: lst[99]
AttributeError  # no such attribute: obj.xyz
FileNotFoundError  # subclass of OSError
ZeroDivisionError
NameError       # undefined variable
StopIteration   # iterator exhausted
\`\`\`

The hierarchy matters for \`except\` clauses: catching \`Exception\` catches all subclasses. Catching \`BaseException\` also catches \`SystemExit\`, \`KeyboardInterrupt\`, and \`GeneratorExit\` — almost never what you want.

⚠️ Never write \`except:\` or \`except BaseException:\` — they swallow \`Ctrl+C\` and program exit signals. Always name the exception type(s) you expect.`,
        flashcardFront: "Why is `except Exception` safer than a bare `except:` clause?",
        flashcardBack: "A bare `except:` catches *everything* including `SystemExit`, `KeyboardInterrupt`, and `GeneratorExit` — which inherit from `BaseException` but not `Exception`. Catching `KeyboardInterrupt` prevents Ctrl+C from working; catching `SystemExit` prevents `sys.exit()` from working. `except Exception` only catches user-facing errors that derive from `Exception`, leaving process-control signals intact. Even better: be specific and catch only the exception types you actually expect and can handle.",
      },
      {
        name: "try / except / else / finally",
        orderIndex: 1,
        prerequisites: ["Python Exception Hierarchy"],
        explanation: `Python's full exception handling syntax has four clauses:

\`\`\`python
try:
    value = int(input("Enter number: "))
    result = 100 / value
except ValueError:
    print("Not a number")
except ZeroDivisionError as e:
    print(f"Division error: {e}")
except (TypeError, KeyError):   # catch multiple types
    print("Type or key problem")
else:
    # Runs ONLY if no exception was raised in try
    print(f"Result: {result}")
finally:
    # Runs ALWAYS — exception or not, return or break
    print("Cleanup done")
\`\`\`

Except clauses are checked in order — **most specific first**. \`else\` keeps the "happy path" separate from error handling. \`finally\` is for cleanup (closing files, releasing locks).

⚠️ Don't catch exceptions you can't meaningfully handle — let them propagate to a level that can.`,
        flashcardFront: "What is the purpose of the `else` clause in a try/except block, and why not just put its code in the `try` block?",
        flashcardBack: "The `else` clause runs only if the `try` block completed without raising any exception. Putting code in `else` instead of `try` is important because it keeps the `except` handlers honest — they only catch exceptions from the `try` block, not from the success-path code. If the success code raises an unexpected exception, you want it to propagate rather than be silently caught by your `except ValueError` handler. It separates \"code that might fail in expected ways\" from \"code that should succeed\".",
      },
      {
        name: "Raising Exceptions",
        orderIndex: 2,
        prerequisites: ["try / except / else / finally"],
        explanation: `Use **\`raise\`** to signal that something has gone wrong. You can raise built-in exceptions or custom ones, with an informative message.

\`\`\`python
def divide(a, b):
    if not isinstance(b, (int, float)):
        raise TypeError(f"Divisor must be numeric, got {type(b).__name__}")
    if b == 0:
        raise ZeroDivisionError("Divisor cannot be zero")
    return a / b

# Re-raise: propagate after logging
try:
    result = divide(10, 0)
except ZeroDivisionError:
    print("Logging error...")
    raise    # bare raise re-raises the current exception

# Exception chaining
try:
    open("missing.txt")
except FileNotFoundError as e:
    raise RuntimeError("Config file missing") from e
\`\`\`

⚠️ Raise the **most specific** exception type that fits. Raising \`Exception("something went wrong")\` gives callers no way to handle it specifically.`,
        flashcardFront: "What does `raise X from Y` do, and why is it useful for exception chaining?",
        flashcardBack: "`raise X from Y` raises exception X while explicitly recording Y as the **cause**. This is exception chaining. Python then shows both in the traceback: \"The above exception was the direct cause of the following exception.\" It's useful when you translate a low-level exception into a higher-level one — for example, converting a `KeyError` from a config dict into a `ConfigurationError`. Without `from Y`, the original cause may be hidden. Using `raise X from None` explicitly suppresses the cause chain when you don't want to expose internal details.",
      },
      {
        name: "Custom Exception Classes",
        orderIndex: 3,
        prerequisites: ["Raising Exceptions"],
        explanation: `Define **custom exceptions** by subclassing \`Exception\` (or a more specific subclass). This lets callers handle your exceptions precisely.

\`\`\`python
class AppError(Exception):
    """Base for all application exceptions."""

class ValidationError(AppError):
    def __init__(self, field, value, reason):
        super().__init__(f"Field '{field}' invalid: {reason}")
        self.field = field
        self.value = value
        self.reason = reason

class InsufficientFundsError(AppError):
    def __init__(self, amount, balance):
        super().__init__(f"Need £{amount}, have £{balance}")
        self.shortfall = amount - balance

# Usage
try:
    withdraw(200)
except InsufficientFundsError as e:
    print(f"Short by £{e.shortfall}")
except AppError:
    print("Other app error")
\`\`\`

⚠️ Always call \`super().__init__(message)\` in custom exception \`__init__\` so the message appears in tracebacks and \`str(e)\`.`,
        flashcardFront: "Why define a base `AppError` class that all your custom exceptions inherit from?",
        flashcardBack: "A base exception class lets callers choose their level of specificity. They can catch `InsufficientFundsError` for that exact case, `AppError` to catch any application-level error (vs system errors), or `Exception` to catch everything. Without a base class, callers must list every custom exception individually in `except` clauses. It also lets you add shared behaviour — like error codes or structured logging — to the base class and have all children inherit it. It's the same open/closed principle applied to exception hierarchies.",
      },
      {
        name: "assert Statements",
        orderIndex: 4,
        prerequisites: ["Raising Exceptions"],
        explanation: `**\`assert\`** checks that a condition is true and raises \`AssertionError\` with an optional message if it's not. It is a **development-time** tool for documenting and verifying invariants.

\`\`\`python
def sqrt(x):
    assert x >= 0, f"sqrt requires non-negative input, got {x}"
    return x ** 0.5

# Typical uses
assert len(items) > 0, "items must not be empty"
assert isinstance(model, BaseModel), "wrong type passed"
assert result == expected, f"got {result}, expected {expected}"
\`\`\`

\`\`\`python
# assert is compiled away with python -O (optimise flag)
# So this is WRONG for user input validation:
assert user_age >= 0   # invisible in production!
\`\`\`

⚠️ Use \`assert\` only for **internal invariants** that should never be false if your code is correct. For **user input or external data**, always raise a proper exception explicitly — asserts can be disabled.`,
        flashcardFront: "Why should you never use `assert` to validate user input or function arguments in production code?",
        flashcardBack: "Assertions are disabled when Python runs with the `-O` (optimise) flag, which some deployment environments use. A `assert user_age >= 0` check simply disappears in optimised mode — the validation is silently skipped. Additionally, `AssertionError` gives callers no specific information about what went wrong or how to fix it. For validation, raise `ValueError` or a custom exception with a clear message. Reserve `assert` for internal invariants: things that should be impossible if your own code is correct, not for checking external inputs.",
      },
      {
        name: "unittest Basics",
        orderIndex: 5,
        prerequisites: ["assert Statements"],
        explanation: `**\`unittest\`** is Python's built-in testing framework. Tests are methods on \`TestCase\` subclasses, prefixed with \`test_\`.

\`\`\`python
import unittest

def add(a, b):
    if not isinstance(a, (int, float)):
        raise TypeError("numeric only")
    return a + b

class TestAdd(unittest.TestCase):
    def test_integers(self):
        self.assertEqual(add(2, 3), 5)

    def test_floats(self):
        self.assertAlmostEqual(add(0.1, 0.2), 0.3, places=10)

    def test_type_error(self):
        with self.assertRaises(TypeError):
            add("a", 1)

    def setUp(self):     # runs before each test method
        self.data = [1, 2, 3]

    def tearDown(self):  # runs after each test method
        pass

if __name__ == "__main__":
    unittest.main()
\`\`\`

Run with: \`python -m unittest test_module.py\` or \`python -m unittest discover\`.

⚠️ Test one thing per test method. Long tests with multiple assertions make it hard to identify which assertion failed.`,
        flashcardFront: "What is the difference between `assertEqual` and `assertAlmostEqual`, and when do you need the latter?",
        flashcardBack: "`assertEqual(a, b)` checks `a == b` exactly. `assertAlmostEqual(a, b, places=7)` checks that `round(a - b, places) == 0` — they differ by at most `0.5 * 10**(-places)`. You need `assertAlmostEqual` when comparing floating-point results because `0.1 + 0.2 == 0.3` is `False` in IEEE-754 arithmetic. Any computation involving floats can accumulate small rounding errors that make exact equality tests fragile. Use `assertAlmostEqual` with an appropriate number of decimal places for the precision your code needs.",
      },
    ],
  },

  // ── SESSION 11 ────────────────────────────────────────────────────────────
  {
    index: 11,
    title: "Recursion",
    cheatSheet: `## Recursion

**Structure of a Recursive Function**
Every recursive function needs:
1. **Base case** — stops the recursion
2. **Recursive case** — calls itself with a simpler input

\`\`\`python
def factorial(n):
    if n == 0:        # base case
        return 1
    return n * factorial(n - 1)   # recursive case
\`\`\`

**Call Stack**
Each recursive call adds a **stack frame**. Python's default limit is ~1000 frames.
\`\`\`python
import sys
sys.getrecursionlimit()     # 1000
sys.setrecursionlimit(5000) # increase (use cautiously)
\`\`\`

**Classic Examples**
\`\`\`python
# Fibonacci (naive — exponential time)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

# Fibonacci (memoised — linear time)
from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

# Sum of nested list
def deep_sum(lst):
    total = 0
    for item in lst:
        if isinstance(item, list):
            total += deep_sum(item)
        else:
            total += item
    return total
\`\`\`

⚠️ Python does NOT do tail-call optimisation. Deep recursion → \`RecursionError\`. Convert to iteration for large inputs.`,
    concepts: [
      {
        name: "Recursive Function Structure",
        orderIndex: 0,
        prerequisites: [],
        explanation: `A **recursive function** calls itself. Every valid recursive function has a **base case** (terminates recursion) and a **recursive case** (moves toward the base case).

\`\`\`python
def count_down(n):
    if n <= 0:           # base case — stop
        print("Done!")
        return
    print(n)
    count_down(n - 1)    # recursive case — smaller n

count_down(3)
# 3
# 2
# 1
# Done!
\`\`\`

Each call to \`count_down\` creates a new **stack frame** with its own local \`n\`. Frames stack up until the base case is reached, then unwind in reverse order.

⚠️ Without a base case (or if the base case is never reached), the function recurses forever until Python raises \`RecursionError: maximum recursion depth exceeded\`.`,
        flashcardFront: "What happens step-by-step in memory when `count_down(3)` is called recursively?",
        flashcardBack: "Each `count_down(n)` call pauses mid-execution and pushes a new stack frame onto the call stack. The frames are: `count_down(3)` → calls `count_down(2)` → calls `count_down(1)` → calls `count_down(0)` which hits the base case and returns. Then the frames unwind: `count_down(1)` resumes after its recursive call and returns, then `count_down(2)`, then `count_down(3)`. Each frame holds its own `n`. The call stack grows linearly with n, which is why deep recursion hits Python's limit (~1000 frames).",
      },
      {
        name: "Factorial and the Base Case",
        orderIndex: 1,
        prerequisites: ["Recursive Function Structure"],
        explanation: `**Factorial** (\`n!\`) is the canonical recursive example: \`n! = n × (n-1)!\` with base case \`0! = 1\`.

\`\`\`python
def factorial(n):
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if n == 0:        # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))   # 120  (5×4×3×2×1)
print(factorial(0))   # 1    (base case)
\`\`\`

Trace of \`factorial(4)\`:
\`\`\`
factorial(4) = 4 × factorial(3)
             = 4 × 3 × factorial(2)
             = 4 × 3 × 2 × factorial(1)
             = 4 × 3 × 2 × 1 × factorial(0)
             = 4 × 3 × 2 × 1 × 1 = 24
\`\`\`

⚠️ The iterative version (\`math.factorial\`) is always faster and not limited by the call stack — prefer it in production.`,
        flashcardFront: "Why is the base case `n == 0` returning 1 mathematically correct, and what breaks without it?",
        flashcardBack: "0! = 1 is a mathematical convention that makes many combinatorial formulas consistent (e.g., the number of ways to arrange 0 items is 1 — the empty arrangement). Without the base case, `factorial(0)` would call `factorial(-1)`, then `factorial(-2)`, descending forever. The base case is what gives recursion a stopping condition. Even with validation (`if n < 0: raise`), you still need the base case for `n == 0` to terminate the valid input path. A missing base case always leads to infinite recursion and `RecursionError`.",
      },
      {
        name: "Fibonacci and Memoisation",
        orderIndex: 2,
        prerequisites: ["Factorial and the Base Case"],
        explanation: `The naive recursive Fibonacci is **exponential time** because it recomputes the same values repeatedly. **Memoisation** (caching results) fixes this.

\`\`\`python
# Naive: O(2^n) — extremely slow for large n
def fib_slow(n):
    if n <= 1: return n
    return fib_slow(n-1) + fib_slow(n-2)

# Memoised with lru_cache: O(n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print(fib(50))   # instant
print(fib.cache_info())   # shows hits vs misses
\`\`\`

\`lru_cache\` stores the return value for each unique set of arguments. When \`fib(5)\` is called a second time, it returns the cached result immediately.

⚠️ \`lru_cache\` only works on functions with **hashable** arguments. It stores results in memory — avoid for very large argument spaces.`,
        flashcardFront: "Why does naive recursive Fibonacci have exponential time complexity, and how does memoisation reduce it to linear?",
        flashcardBack: "Naive `fib(n)` calls `fib(n-1)` and `fib(n-2)`, each of which calls two more, forming a binary tree of calls with ~2^n nodes. `fib(3)` is computed dozens of times for `fib(30)`. Memoisation stores each computed result the first time, so every distinct `n` is computed exactly once. With memoisation, `fib(n)` makes n unique calls (from n down to 0), each O(1) after the first, giving O(n) total time. The call tree becomes a straight line instead of an exponential tree.",
      },
      {
        name: "Recursion vs Iteration",
        orderIndex: 3,
        prerequisites: ["Factorial and the Base Case"],
        explanation: `Any recursive algorithm can be rewritten iteratively. The choice depends on clarity, performance, and stack depth requirements.

\`\`\`python
# Recursive factorial — elegant, limited by stack depth
def factorial_rec(n):
    return 1 if n == 0 else n * factorial_rec(n-1)

# Iterative factorial — always preferred for large n
def factorial_iter(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# When recursion shines: tree/graph traversal
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], [5]]))   # [1, 2, 3, 4, 5]
\`\`\`

⚠️ Python has no **tail-call optimisation** — even a tail-recursive function consumes a stack frame per call. For inputs > ~1000, use iteration or an explicit stack.`,
        flashcardFront: "What types of problems are naturally recursive, and when should you convert to an iterative solution?",
        flashcardBack: "Recursion is natural when the problem has recursive structure: trees (traversal, search), divide-and-conquer (merge sort, binary search), nested data (flatten, deep copy), and mathematical induction proofs. Convert to iteration when: input size exceeds Python's recursion limit (~1000), performance is critical (function call overhead is significant), or the recursive version isn't clearly simpler than the iterative one. Iterative solutions using an explicit stack data structure can replace recursion without the depth limitation: use `stack = [root]; while stack: node = stack.pop(); ...`.",
      },
    ],
  },

  // ── SESSION 12 ────────────────────────────────────────────────────────────
  {
    index: 12,
    title: "Lambda, Map, Filter and Comprehensions",
    cheatSheet: `## Lambda, Map, Filter and Comprehensions

**Lambda Functions**
Anonymous single-expression functions. Best for short callbacks.
\`\`\`python
square = lambda x: x ** 2
sorted(data, key=lambda x: x["score"])
\`\`\`

**map() and filter()**
\`\`\`python
nums = [1, 2, 3, 4, 5]
list(map(lambda x: x*2, nums))      # [2,4,6,8,10]
list(filter(lambda x: x%2==0, nums)) # [2,4]
\`\`\`
💡 Prefer list comprehensions over map/filter — more readable.

**List Comprehensions**
\`\`\`python
[expr for item in iterable if condition]
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
flat    = [n for row in matrix for n in row]   # nested
\`\`\`

**Dict and Set Comprehensions**
\`\`\`python
{k: v for k, v in items.items() if v > 0}  # dict
{x**2 for x in range(10)}                   # set (unique values)
\`\`\`

**Generator Expressions**
Like list comprehensions but **lazy** — compute on demand, O(1) memory.
\`\`\`python
total = sum(x**2 for x in range(1_000_000))  # no list in memory
gen = (x**2 for x in range(10))              # generator object
next(gen)   # 0
next(gen)   # 1
\`\`\`
⚠️ Generators can only be iterated once. After exhaustion they yield nothing.`,
    concepts: [
      {
        name: "Lambda Functions",
        orderIndex: 0,
        prerequisites: [],
        explanation: `A **lambda** is an anonymous function defined as a single expression. It is most useful as an inline argument to higher-order functions like \`sorted\`, \`map\`, or \`filter\`.

\`\`\`python
# Named function
def double(x):
    return x * 2

# Equivalent lambda
double = lambda x: x * 2

# Most common use: as a key function
people = [{"name": "Bob", "age": 30}, {"name": "Ada", "age": 25}]
sorted(people, key=lambda p: p["age"])   # sort by age

# Multi-argument lambda
multiply = lambda x, y: x * y
multiply(3, 4)   # 12
\`\`\`

Lambdas are limited to **one expression** — no statements, no multiple lines, no assignments.

⚠️ If you find yourself writing a complex lambda, define a proper function with \`def\` instead — named functions are easier to test and debug.`,
        flashcardFront: "What are the limitations of lambda compared to `def`, and what is lambda's primary practical use?",
        flashcardBack: "Lambda is restricted to a **single expression** — no statements, no assignments, no multi-line body, no docstring. It can't contain `if` blocks (only ternary `x if c else y`), loops, or `return`. Its primary practical use is as a short inline callback where defining a named function would be verbose: `sorted(data, key=lambda x: x.score)`, `map(lambda x: x*2, nums)`. For anything more complex, a named function is clearer, testable, and debuggable. PEP 8 explicitly discourages assigning lambdas to variables — use `def` instead.",
      },
      {
        name: "map() and filter()",
        orderIndex: 1,
        prerequisites: ["Lambda Functions"],
        explanation: `**\`map(fn, iterable)\`** applies a function to every element and returns a **lazy iterator**. **\`filter(fn, iterable)\`** keeps elements for which \`fn\` returns truthy.

\`\`\`python
nums = [1, 2, 3, 4, 5]

# map: transform each element
doubled = list(map(lambda x: x * 2, nums))   # [2,4,6,8,10]

# With a named function
def celsius_to_f(c): return c * 9/5 + 32
temps_f = list(map(celsius_to_f, [0, 20, 100]))

# filter: keep elements matching predicate
evens = list(filter(lambda x: x % 2 == 0, nums))  # [2,4]
non_none = list(filter(None, [1, 0, "a", "", None, True]))  # [1,"a",True]
\`\`\`

Both return **iterators**, not lists — wrap in \`list()\` if you need to inspect all values, or consume directly in a \`for\` loop.

⚠️ \`filter(None, iterable)\` filters out all falsy values — convenient but implicit; prefer explicit predicates for clarity.`,
        flashcardFront: "Why do `map()` and `filter()` return iterators instead of lists, and when does that matter?",
        flashcardBack: "Returning iterators is a memory optimisation: the output is computed **lazily**, one element at a time, only when consumed. For a 1 GB file of lines, `map(process, lines)` doesn't process all lines upfront — it processes them as you iterate, keeping memory use constant. It only matters when you need all results at once (then wrap in `list()`), when the source is very large (lazy is a win), or when chaining operations — `list(filter(p, map(fn, items)))` avoids creating intermediate lists. In modern Python, list comprehensions are usually preferred for clarity, but `map`/`filter` are better when the function is already named.",
      },
      {
        name: "List Comprehensions",
        orderIndex: 2,
        prerequisites: ["map() and filter()"],
        explanation: `**List comprehensions** are the Pythonic replacement for \`map\` and \`filter\`. They are more readable and usually faster.

\`\`\`python
# Basic: [expression for item in iterable]
squares = [x**2 for x in range(10)]

# With filter condition
evens = [x for x in range(20) if x % 2 == 0]

# Transform + filter combined
result = [x**2 for x in range(20) if x % 2 == 0]

# Nested loops (flattening a 2D list)
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [n for row in matrix for n in row]   # [1,2,3,4,5,6]

# String processing
words = ["  hello  ", "  world  "]
cleaned = [w.strip().title() for w in words]  # ['Hello', 'World']
\`\`\`

⚠️ Nested comprehensions can become unreadable. If a comprehension requires more than two \`for\` clauses or complex conditions, use a regular loop.`,
        flashcardFront: "Is a list comprehension always faster than an equivalent `for` loop with `append`? Explain why.",
        flashcardBack: "Generally yes, but not always dramatically. List comprehensions are faster because Python can optimise the bytecode for the comprehension pattern — it pre-allocates the list and avoids repeated attribute lookup of `list.append` on each iteration. The comprehension body also runs in a slightly optimised internal loop. However, the difference is usually small (10–30%), and for complex logic where the comprehension becomes hard to read, a regular loop is better — clarity beats micro-optimisation. Profile before optimising.",
      },
      {
        name: "Dictionary and Set Comprehensions",
        orderIndex: 3,
        prerequisites: ["List Comprehensions"],
        explanation: `Dict and set comprehensions use the same syntax pattern as list comprehensions but produce different container types.

\`\`\`python
# Dict comprehension: {key_expr: value_expr for item in iterable}
squares_dict = {x: x**2 for x in range(6)}
# {0:0, 1:1, 2:4, 3:9, 4:16, 5:25}

# Invert a dictionary
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}  # {1:"a", 2:"b", 3:"c"}

# Filter a dict
positive = {k: v for k, v in scores.items() if v > 0}

# Set comprehension: {expr for item in iterable}
unique_squares = {x**2 for x in range(-5, 6)}  # {0,1,4,9,16,25} — no duplicates

# Find unique first characters
initials = {word[0].upper() for word in words}
\`\`\`

⚠️ Dict comprehensions require unique keys — if the same key is produced twice, the last value wins silently.`,
        flashcardFront: "What happens when a dict comprehension produces duplicate keys, and how can you detect this?",
        flashcardBack: "The last value silently wins. `{x % 3: x for x in range(6)}` produces `{0: 3, 1: 4, 2: 5}` — earlier values (0→0, 1→1, 2→2) are overwritten without any error or warning. To detect this, compare `len(keys_list)` with `len(set(keys_list))` before building the comprehension, or use `collections.Counter` on the keys to find duplicates. If you need to aggregate duplicate keys (rather than overwrite), use `collections.defaultdict(list)` and a regular loop.",
      },
      {
        name: "Generator Expressions",
        orderIndex: 4,
        prerequisites: ["List Comprehensions"],
        explanation: `**Generator expressions** have the same syntax as list comprehensions but use \`()\` instead of \`[]\`. They produce a **lazy iterator** that computes values on demand, using O(1) memory.

\`\`\`python
# List comprehension — builds the whole list in memory
total = sum([x**2 for x in range(1_000_000)])  # 1M integers in memory

# Generator expression — lazy, no intermediate list
total = sum(x**2 for x in range(1_000_000))    # O(1) memory

# Creating a generator object
gen = (x**2 for x in range(5))
next(gen)   # 0
next(gen)   # 1
list(gen)   # [4, 9, 16] — first two already consumed

# Chaining generators
lines = (line.strip() for line in open("data.txt"))
non_empty = (line for line in lines if line)
\`\`\`

⚠️ Generators are **single-use** — once exhausted, iterating again produces nothing. Convert to a list if you need to iterate multiple times.`,
        flashcardFront: "When should you use a generator expression instead of a list comprehension, and what is the key trade-off?",
        flashcardBack: "Use a generator when you only need to iterate once and don't need random access or the total count. The trade-off: generators use O(1) memory (compute one value at a time) but can only be consumed once. Lists use O(n) memory but can be indexed, sliced, measured with `len()`, and iterated multiple times. For `sum(x**2 for x in big_range)`, a generator is strictly better — no list is built. For `data = [process(x) for x in items]` where you need `data[0]`, `len(data)`, or multiple passes, a list is necessary.",
      },
      {
        name: "functools.reduce()",
        orderIndex: 5,
        prerequisites: ["map() and filter()", "Lambda Functions"],
        explanation: `**\`reduce(fn, iterable, initial)\`** applies a function cumulatively to pairs of elements, reducing the iterable to a single value. Moved to \`functools\` in Python 3 to discourage overuse.

\`\`\`python
from functools import reduce

# Sum (prefer sum() in practice)
reduce(lambda acc, x: acc + x, [1, 2, 3, 4])   # 10

# Product
reduce(lambda acc, x: acc * x, [1, 2, 3, 4])   # 24

# Max (prefer max() in practice)
reduce(lambda a, b: a if a > b else b, [3,1,4,1,5])  # 5

# With initial value — handles empty iterables
reduce(lambda a, b: a + b, [], 0)   # 0 (without initial: TypeError)

# Practical: flatten nested config
from operator import getitem
reduce(getitem, ["a","b","c"], {"a":{"b":{"c":42}}})  # 42
\`\`\`

⚠️ For simple reductions, built-ins (\`sum\`, \`max\`, \`min\`, \`any\`, \`all\`) are clearer. Use \`reduce\` only when no built-in fits.`,
        flashcardFront: "Why was `reduce()` moved from a built-in to `functools` in Python 3, and when is it genuinely useful?",
        flashcardBack: "Guido van Rossum moved `reduce` because most uses of it (sum, product, max) are better expressed with dedicated built-ins or loops that are immediately clear to any Python reader. `reduce` forces you to mentally simulate the fold, which is less readable than `sum()` or `max()`. It's genuinely useful when you need a general left fold over a sequence with an operation that has no built-in equivalent: chained dictionary access (`reduce(getitem, keys, d)`), combining DataFrames, or building a result by applying a series of transformations from a list. It remains available in `functools` for these legitimate uses.",
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// DB WRITE LOGIC (identical to seed.ts)
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let db: PrismaClient
  if (process.env.TURSO_DATABASE_URL) {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql")
    db = new PrismaClient({
      adapter: new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  } else {
    const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3")
    const dbPath = path.resolve(process.cwd(), "dev.db")
    db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: dbPath }) })
  }

  const subjectConfig = {
    name: "Python for AI",
    slug: "python",
    sessionCount: 15,
  }

  try {
    const subject = await db.subject.upsert({
      where: { slug: subjectConfig.slug },
      create: subjectConfig,
      update: {},
    })
    console.log(`\n📚 Subject: ${subject.name} (${subject.id})`)

    for (const sessionData of SESSIONS) {
      // Idempotent — delete existing session at this index
      const existing = await db.session.findUnique({
        where: { subjectId_index: { subjectId: subject.id, index: sessionData.index } },
      })
      if (existing) {
        const concepts = await db.concept.findMany({ where: { sessionId: existing.id } })
        for (const c of concepts) {
          const exercises = await db.exercise.findMany({ where: { conceptId: c.id } })
          for (const ex of exercises) {
            await db.attempt.deleteMany({ where: { exerciseId: ex.id } })
          }
          await db.exercise.deleteMany({ where: { conceptId: c.id } })
          await db.masteryScore.deleteMany({ where: { conceptId: c.id } })
          await db.conceptPrereq.deleteMany({ where: { OR: [{ conceptId: c.id }, { prereqId: c.id }] } })
        }
        await db.concept.deleteMany({ where: { sessionId: existing.id } })
        await db.session.delete({ where: { id: existing.id } })
      }

      const session = await db.session.create({
        data: {
          subjectId: subject.id,
          index: sessionData.index,
          title: sessionData.title,
          cheatSheet: sessionData.cheatSheet,
        },
      })

      const conceptIdMap: Record<string, string> = {}
      for (const c of sessionData.concepts) {
        const created = await db.concept.create({
          data: {
            sessionId: session.id,
            name: c.name,
            explanation: c.explanation,
            orderIndex: c.orderIndex,
          },
        })
        conceptIdMap[c.name] = created.id

        await db.exercise.create({
          data: {
            conceptId: created.id,
            type: "FLASHCARD",
            front: c.flashcardFront,
            back: c.flashcardBack,
          },
        })
      }

      // Wire prerequisite edges
      for (const c of sessionData.concepts) {
        for (const prereqName of c.prerequisites) {
          const prereqId = conceptIdMap[prereqName]
          if (prereqId) {
            await db.conceptPrereq.create({
              data: { conceptId: conceptIdMap[c.name], prereqId },
            })
          }
        }
      }

      console.log(`  ✅ Session ${sessionData.index}: "${sessionData.title}" (${sessionData.concepts.length} concepts)`)
    }

    console.log(`\n🎉 Done — ${SESSIONS.length} sessions seeded.\n`)
  } finally {
    await db.$disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
