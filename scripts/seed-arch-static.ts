/**
 * Static seed — no API calls. Hand-authored "Computer Architecture & Networks"
 * content, one session per teaching week, grounded in a standard intro unit
 * (data representation → CPU → memory → I/O → OS → networking → security).
 * Mirrors seed-db-static.ts. Run: npx tsx scripts/seed-arch-static.ts
 *
 * All cards are MULTIPLE CHOICE (parity with Python/DB): each concept carries
 * `options` (exactly 4, PLAIN TEXT) and `answer` (must match one option).
 * `flashcardFront` is the question (Markdown — code fences OK); `flashcardBack`
 * is the rationale shown after answering.
 *
 * NOTE: PrismaClient is imported lazily inside main() so migrate-prod can import
 * SESSIONS/cardFor without pulling in the Prisma engine.
 */

import path from "node:path"

type Concept = {
  name: string
  orderIndex: number
  prerequisites: string[]
  explanation: string
  flashcardFront: string
  options: string[]
  answer: string
  flashcardBack: string
}

type Session = {
  index: number
  title: string
  cheatSheet: string
  concepts: Concept[]
}

export type { Session, Concept }

// Resolve a concept to its card fields. Every arch concept is MCQ.
export function cardFor(c: Concept): { front: string; back: string; content: string } {
  if (c.options && c.options.length === 4 && c.answer) {
    return {
      front: c.flashcardFront,
      back: c.flashcardBack,
      content: JSON.stringify({ options: c.options, correctOption: c.answer }),
    }
  }
  return { front: c.flashcardFront, back: c.flashcardBack, content: "{}" }
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION DATA — Weeks 1–12
// ─────────────────────────────────────────────────────────────────────────────

export const SESSIONS: Session[] = [
  // ── WEEK 1 — Data Representation & Boolean Logic ─────────────────────────────
  {
    index: 1,
    title: "Data Representation & Boolean Logic",
    cheatSheet: `## Data Representation & Boolean Logic

**Units**
- **bit** — a single 0 or 1. **byte** = 8 bits. **word** = the natural data size of a CPU (e.g. 16/32/64 bits).

**Number systems** (subscript shows the base)
| Base | Name | Digits |
|---|---|---|
| 2 | binary | 0–1 |
| 8 | octal | 0–7 |
| 10 | decimal | 0–9 |
| 16 | hexadecimal | 0–9, A–F |

**Conversions**
- Binary→decimal: multiply each bit by its **place value** (…8 4 2 1) and add.
- Decimal→binary: repeated **division by 2**, read remainders bottom-up.
- Binary↔hex: group bits in **4s** (1 hex digit = 4 bits). \`1110 1010₂ = EA₁₆\`.

**Characters** — text is stored as codes: **ASCII** (7-bit, 128 chars), **Unicode** (extends it). \`'A' = 65 = 0x41\`.

**Signed integers (n bits)**
| Scheme | −value idea | zero |
|---|---|---|
| Unsigned | none (0…2ⁿ−1) | one |
| Sign-magnitude | flip sign bit | two (±0) |
| 1's complement | invert all bits | two (±0) |
| 🔑 **2's complement** | invert + add 1 | **one** |

⚠️ **2's complement** is what computers use: one zero, and subtraction = addition of the negative. Range for n bits: **−2ⁿ⁻¹ … +2ⁿ⁻¹−1**.

**Overflow** — result doesn't fit the bit width (e.g. two positives sum to a "negative"). The carry/sign goes wrong.

**Boolean logic / gates**
- **AND** (both 1), **OR** (either 1), **NOT** (invert), **XOR** (differ).
- Build circuits from gates; simplify expressions with Boolean laws to use fewer gates.`,
    concepts: [
      {
        name: "Bits, Bytes and Number Systems",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Computers store everything as **bits** — a bit is a single binary digit, \`0\` or \`1\`. Eight bits form a **byte**, and a **word** is the natural unit a particular CPU works with (commonly 16, 32 or 64 bits).

Because hardware is two-state, the natural number system is **binary (base 2)**. But long binary strings are hard for humans, so we also use:

- **Decimal (base 10)** — everyday numbers, digits 0–9.
- **Octal (base 8)** — digits 0–7.
- **Hexadecimal (base 16)** — digits 0–9 then A–F (A=10 … F=15).

Each system is *positional*: a digit's value is the digit times the **base raised to its position**. In binary the place values are …8, 4, 2, 1; in hex they are …256, 16, 1.

To avoid ambiguity we mark the base with a subscript: \`45₁₀\` (decimal), \`101101₂\` (binary), \`2D₁₆\` (hex). Hexadecimal is especially convenient because **one hex digit maps to exactly four bits**, so it's a compact shorthand for binary — which is why memory addresses and byte values are usually shown in hex.`,
        flashcardFront: `How many **bits** are in one **byte**?`,
        options: ["8", "4", "16", "2"],
        answer: "8",
        flashcardBack: `A **byte = 8 bits**. A single **bit** is one 0/1; a **word** is the CPU's natural data size (16/32/64 bits), which varies by machine. Because each hex digit encodes exactly 4 bits, one byte is neatly written as **two hex digits** (e.g. \`0xEA\`).`,
      },
      {
        name: "Number System Conversions",
        orderIndex: 2,
        prerequisites: ["Bits, Bytes and Number Systems"],
        explanation: `Converting between bases is a core skill.

**Binary → decimal**: multiply each bit by its **place value** and sum. \`1101₂ = 8 + 4 + 0 + 1 = 13₁₀\`.

**Decimal → binary**: repeatedly **divide by 2**, recording remainders, then read the remainders **bottom to top**. \`13 ÷ 2 = 6 r1, 6 ÷ 2 = 3 r0, 3 ÷ 2 = 1 r1, 1 ÷ 2 = 0 r1\` → \`1101₂\`.

**Binary ↔ hexadecimal**: the shortcut is **groups of four bits**, because 2⁴ = 16. To go binary→hex, split the bits into nibbles (from the right) and convert each:
\`\`\`
1110 1010₂  →  E   A   →  EA₁₆
\`\`\`
To go hex→binary, expand each hex digit to its 4-bit pattern: \`F = 1111\`, \`A = 1010\`, so \`FA₁₆ = 1111 1010₂\`.

**Hex/decimal**: use place values 16, 256, … — e.g. \`1AF₁₆ = 1·256 + 10·16 + 15 = 431₁₀\`.

The grouping trick is why hex and binary convert *without arithmetic* — just lookup — whereas decimal conversions need division/multiplication.`,
        flashcardFront: `What is the binary number \`11101010₂\` in hexadecimal?`,
        options: ["EA", "AE", "D5", "FA"],
        answer: "EA",
        flashcardBack: `Split into nibbles from the right: \`1110\` and \`1010\`. \`1110₂ = 14 = E\`, \`1010₂ = 10 = A\` → **EA₁₆**. This 4-bits-per-hex-digit grouping is why binary↔hex needs no arithmetic, just a lookup — unlike conversions to/from decimal, which require dividing or multiplying.`,
      },
      {
        name: "Representing Characters (ASCII)",
        orderIndex: 3,
        prerequisites: ["Bits, Bytes and Number Systems"],
        explanation: `Computers store only numbers, so **text** is represented by mapping each character to a numeric **code**. The classic scheme is **ASCII** (American Standard Code for Information Interchange), which uses **7 bits** to encode 128 characters: the uppercase and lowercase letters, digits, punctuation, and control characters.

Some useful landmarks: \`'A' = 65 (0x41)\`, \`'a' = 97 (0x61)\`, \`'0' = 48 (0x30)\`. Notice that the digit **character** \`'0'\` is **not** the number 0 — it's code 48. And \`'a'\` is exactly 32 more than \`'A'\`, which is why changing case is just adding/subtracting 32.

To store a string, you store the sequence of codes. \`"FA5"\` becomes the codes for \`'F'\` (70), \`'A'\` (65), \`'5'\` (53).

ASCII only covers English. **Unicode** extends the idea to virtually every writing system (with encodings like UTF-8 that are backward-compatible with ASCII for the first 128 codes). The key concept is the same everywhere: characters are an agreed-upon **numeric code**, and the program's *context* decides whether a stored number means a character or a quantity.`,
        flashcardFront: `In 7-bit ASCII, the character \`'0'\` (zero) is stored as the code 48, **not** the value 0. Why does this matter?`,
        options: [
          "The character '0' and the number 0 are different things with different bit patterns",
          "ASCII cannot represent digits at all",
          "'0' is always stored as binary 0000",
          "Numbers and characters are identical in memory",
        ],
        answer: "The character '0' and the number 0 are different things with different bit patterns",
        flashcardBack: `A digit **character** like \`'0'\` is just another symbol with an ASCII code (48 / 0x30), distinct from the **numeric** value 0. That's why reading the keystroke "5" gives code 53, and you must convert it before doing arithmetic. The same bits mean a character or a number purely depending on how the program interprets them.`,
      },
      {
        name: "Signed Integers and Two's Complement",
        orderIndex: 4,
        prerequisites: ["Number System Conversions"],
        explanation: `With a fixed number of bits we need a scheme to represent **negative** numbers. Four common ones for \`n\` bits:

- **Unsigned** — all patterns are non-negative, range \`0 … 2ⁿ−1\`. No negatives.
- **Sign-magnitude** — the leftmost bit is the sign (0=+, 1=−), the rest is the magnitude. Simple, but has **two zeros** (+0 and −0).
- **One's complement** — negate by **inverting every bit**. Also has two zeros.
- **Two's complement** — negate by **inverting every bit and adding 1**. This is what real computers use.

🔑 Two's complement wins because it has **exactly one zero** and, crucially, **subtraction becomes addition**: \`a − b\` is just \`a + (−b)\`, so the CPU needs only an adder. The leftmost bit still indicates sign, but it also carries place value (negative).

Example (4-bit): \`+5 = 0101\`; to get \`−5\`, invert → \`1010\`, add 1 → \`1011\`. Check: \`0101 + 1011 = 10000\`, the carry out of 4 bits is discarded, leaving \`0000\` = 0. ✓ The range for n bits is **−2ⁿ⁻¹ to +2ⁿ⁻¹−1** (e.g. 8-bit: −128 … +127).`,
        flashcardFront: `In **two's complement**, how do you negate a number (e.g. turn +5 into −5)?`,
        options: [
          "Invert all the bits, then add 1",
          "Just flip the leftmost (sign) bit",
          "Invert all the bits only",
          "Subtract 1, then invert all the bits",
        ],
        answer: "Invert all the bits, then add 1",
        flashcardBack: `Two's-complement negation = **invert every bit, then add 1**. (Just flipping the sign bit is *sign-magnitude*; inverting only is *one's complement*.) Two's complement is used because it has a **single zero** and lets the CPU do subtraction with the same adder it uses for addition: \`a − b = a + (−b)\`.`,
      },
      {
        name: "Overflow and Number Ranges",
        orderIndex: 5,
        prerequisites: ["Signed Integers and Two's Complement"],
        explanation: `A fixed bit width can only represent a fixed **range** of values. In **two's complement** with \`n\` bits the range is \`−2ⁿ⁻¹ … +2ⁿ⁻¹−1\`:
- 4-bit: −8 … +7
- 8-bit: −128 … +127

**Overflow** happens when the true result of an operation falls **outside** that range, so it can't be stored correctly. The tell-tale sign in two's complement: **adding two numbers of the same sign produces a result with the opposite sign**.

Example (8-bit, range −128…+127): \`92 + 92 = 184\`, but 184 > 127. In bits: \`01011100 + 01011100 = 10111000\`, whose leftmost bit is 1 → it reads as a **negative** number (−72), which is clearly wrong. Two positives "wrapped around" into a negative — overflow.

⚠️ Overflow is *not* the same as a carry-out being discarded; you detect signed overflow by the **sign rule** above, not by the final carry. The practical lesson: the number of bits you choose sets a hard ceiling/floor, and exceeding it silently corrupts the result — which is why picking an adequate integer size matters.`,
        flashcardFront: `Using 8-bit two's complement (range −128…+127), computing \`92 + 92\` gives a **negative** result. This is:`,
        options: [
          "Overflow — the true answer (184) exceeds the representable range",
          "A rounding error",
          "Correct — 92 + 92 really is negative",
          "A character-encoding problem",
        ],
        answer: "Overflow — the true answer (184) exceeds the representable range",
        flashcardBack: `184 is beyond the 8-bit signed maximum of +127, so it can't be stored — **overflow**. The classic signature is two **same-sign** values summing to the **opposite** sign (here two positives → negative). Choosing enough bits for the expected range is how you avoid silently corrupted results.`,
      },
      {
        name: "Boolean Logic and Logic Gates",
        orderIndex: 6,
        prerequisites: [],
        explanation: `At the lowest level, a computer computes with **logic gates** — circuits that take binary inputs and produce a binary output according to **Boolean logic**. The basic gates:

- **AND** — output 1 only if **both** inputs are 1.
- **OR** — output 1 if **at least one** input is 1.
- **NOT** — inverts a single input (1→0, 0→1).
- **XOR** (exclusive OR) — output 1 if the inputs **differ**.

Each gate is defined by a **truth table** listing the output for every input combination. Gates combine into circuits that implement any Boolean function — in fact XOR can be built from AND, OR and NOT.

**Boolean algebra** lets us *simplify* expressions before building the circuit, using laws such as identity, complement, distribution and De Morgan's (\`NOT(A AND B) = NOT A OR NOT B\`). Simplifying matters practically: a smaller expression means **fewer gates**, so the circuit is cheaper, faster and uses less power. The workflow is: write the truth table → derive the Boolean expression → simplify → draw the circuit.`,
        flashcardFront: `An **XOR** gate outputs 1 when:`,
        options: [
          "Its two inputs differ (one 1 and one 0)",
          "Both inputs are 1",
          "Both inputs are 0",
          "At least one input is 1",
        ],
        answer: "Its two inputs differ (one 1 and one 0)",
        flashcardBack: `**XOR** (exclusive OR) = 1 exactly when the inputs **differ**. Compare: **AND** needs *both* 1; **OR** needs *at least one* 1 (so OR is also 1 when both are 1, where XOR is 0). XOR can be built from AND/OR/NOT, and simplifying Boolean expressions reduces gate count.`,
      },
    ],
  },

  // ── WEEK 2 — CPU Architecture & MARIE Assembly ──────────────────────────────
  {
    index: 2,
    title: "CPU Architecture & Assembly (MARIE)",
    cheatSheet: `## CPU Architecture & Assembly (MARIE)

**Stored-program (von Neumann) computer** — instructions **and** data share the same memory. The CPU fetches instructions one at a time.

**Key CPU registers (MARIE)**
| Register | Role |
|---|---|
| **AC** | Accumulator — holds working data / results |
| **PC** | Program Counter — address of the **next** instruction |
| **IR** | Instruction Register — the instruction being executed |
| **MAR** | Memory Address Register — address to access |
| **MBR** | Memory Buffer Register — data to/from memory |

🔑 **Fetch–Decode–Execute cycle** (repeats forever):
1. **Fetch** instruction at PC into IR; PC++
2. **Decode** the opcode
3. **Execute** (may read/write memory or AC)

**MARIE instructions (sample)**
\`\`\`
Load  X     / AC ← contents of address X
Store X     / address X ← AC
Add   X     / AC ← AC + contents of X
Input       / AC ← keyboard
Output      / display AC
Halt        / stop
Skipcond    / skip next instr based on AC (>,=,< 0)
Jump  L     / PC ← address of label L
\`\`\`

**Labels** name memory addresses so you don't hard-code numbers:
\`\`\`
loop, Load num
      Add  num
      Store num
      Jump loop
num,  DEC 3      / a variable initialised to 3
\`\`\`

**Machine code** — each assembled instruction = an **opcode** + an **address** (shown in hex in memory). Assembly is the human-readable form; the assembler translates it.`,
    concepts: [
      {
        name: "The Stored-Program Computer and CPU Registers",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Modern computers follow the **stored-program (von Neumann) model**: both the **program instructions and the data** live in the same main memory, and the CPU reads instructions from memory one after another. This is what makes a computer general-purpose — load different instructions and it does a different job.

The CPU does its work in small, fast storage cells called **registers**. In the teaching machine **MARIE**, the important ones are:

- **AC (Accumulator)** — the main working register; arithmetic results land here.
- **PC (Program Counter)** — holds the **address of the next instruction** to fetch.
- **IR (Instruction Register)** — holds the **current instruction** being executed.
- **MAR (Memory Address Register)** — the memory address the CPU is about to access.
- **MBR (Memory Buffer Register)** — data just read from, or about to be written to, memory.

Memory itself is an array of numbered cells (addresses). The CPU uses MAR/MBR to talk to memory, the PC to keep its place in the program, and the AC to compute. Understanding which register holds what is the key to reading any low-level program trace.`,
        flashcardFront: `Which CPU register holds the **address of the next instruction** to be executed?`,
        options: ["PC (Program Counter)", "AC (Accumulator)", "IR (Instruction Register)", "MBR (Memory Buffer Register)"],
        answer: "PC (Program Counter)",
        flashcardBack: `The **PC (Program Counter)** points to the **next** instruction's address; it's incremented during each fetch so execution advances. The **IR** holds the *current* instruction, the **AC** holds working data/results, and **MAR/MBR** carry the address/data when talking to memory.`,
      },
      {
        name: "The Fetch–Decode–Execute Cycle",
        orderIndex: 2,
        prerequisites: ["The Stored-Program Computer and CPU Registers"],
        explanation: `A CPU runs a program by endlessly repeating the **fetch–decode–execute cycle** (the *machine cycle*):

1. **Fetch** — copy the instruction at the address in the **PC** into the **IR** (via MAR/MBR), then **increment the PC** so it points to the following instruction.
2. **Decode** — interpret the instruction's **opcode** to work out what operation is required and what operand it needs.
3. **Execute** — carry it out: do arithmetic in the **AC**, read or write memory, or change the PC (for a jump).

Then the cycle repeats with the new PC value, until a \`Halt\` instruction stops it.

The reason the PC is incremented during *fetch* (before execute) is subtle but important: it means a **jump** instruction works simply by **overwriting the PC** during execute — the next fetch then continues from the new location. This single, simple loop, driven by the clock, is how every program — no matter how complex — actually runs. Higher-level constructs (loops, conditionals, function calls) all reduce to manipulating the PC within this cycle.`,
        flashcardFront: `In the fetch–decode–execute cycle, when is the **PC normally incremented**?`,
        options: [
          "During fetch, so it points to the next instruction before execute runs",
          "Only after the program halts",
          "Never — the PC is fixed",
          "During decode, after the instruction is interpreted",
        ],
        answer: "During fetch, so it points to the next instruction before execute runs",
        flashcardBack: `The PC is incremented **during fetch**, so by execute time it already points at the *following* instruction. This is what lets a **jump** work by simply overwriting the PC during execute — the next fetch resumes from the new address. The cycle repeats until \`Halt\`.`,
      },
      {
        name: "MARIE Instructions and the Accumulator",
        orderIndex: 3,
        prerequisites: ["The Fetch–Decode–Execute Cycle"],
        explanation: `MARIE's instruction set is deliberately tiny, and almost everything flows through the **accumulator (AC)**. The core data-movement and arithmetic instructions:

\`\`\`
Load  X    / AC ← contents of memory address X
Store X    / memory address X ← AC
Add   X    / AC ← AC + contents of X
Subt  X    / AC ← AC − contents of X
Input      / AC ← value from the keyboard
Output     / display the value in AC
Halt       / stop execution
\`\`\`

Notice the pattern: to add two numbers you \`Load\` the first into the AC, \`Add\` the second, then \`Store\` the result back to memory — there is nowhere else to compute. This "accumulator architecture" keeps the hardware simple at the cost of more instructions.

Data is placed in memory with a directive like \`DEC 3\` (store the decimal value 3 in this cell) or \`HEX 1F\`. A program is just a sequence of these instructions and data values laid out in consecutive memory cells. Reading a MARIE program means tracking how each instruction changes the **AC** and memory, step by step.`,
        flashcardFront: `In MARIE, to add the values in addresses X and Y and store the result in Z, the correct sequence is:`,
        options: [
          "Load X; Add Y; Store Z",
          "Add X; Add Y; Store Z",
          "Store X; Load Y; Add Z",
          "Input X; Output Y; Halt",
        ],
        answer: "Load X; Add Y; Store Z",
        flashcardBack: `Everything goes through the **AC**: \`Load X\` puts X's value in the AC, \`Add Y\` adds Y's value to the AC, \`Store Z\` writes the AC to Z. You can't add two memory cells directly — the accumulator architecture forces load → operate → store, which is why simple tasks take several instructions.`,
      },
      {
        name: "Branching: Skipcond, Jump and Labels",
        orderIndex: 4,
        prerequisites: ["MARIE Instructions and the Accumulator"],
        explanation: `Straight-line programs aren't enough — we need **decisions** and **repetition**, which means changing the PC conditionally.

- **\`Jump L\`** unconditionally sets the PC to the address of label \`L\` — an unconditional branch.
- **\`Skipcond\`** tests the AC and **skips the next instruction** if a condition holds: \`Skipcond 800\` skips if \`AC > 0\`, \`Skipcond 400\` if \`AC = 0\`, \`Skipcond 000\` if \`AC < 0\`. Combined with \`Jump\`, this builds *if-then-else* and *loops*.

**Labels** are names for memory addresses, so you write \`Jump loop\` instead of \`Jump 7\`. The assembler resolves each label to its actual address, so your program still works if instructions move:
\`\`\`
loop,  Input
       Skipcond 400   / if AC = 0 ...
       Jump  done     / ... exit
       Store num
       Jump  loop     / otherwise repeat
done,  Halt
num,   DEC 0
\`\`\`

This is the assembly-level reality behind every \`if\` and \`while\`: a comparison sets a condition, and a conditional skip/jump steers the PC. Labels keep it readable and relocatable.`,
        flashcardFront: `What is the purpose of \`Skipcond\` in MARIE?`,
        options: [
          "Conditionally skip the next instruction based on the AC (>, =, or < 0)",
          "Always jump to a labelled address",
          "Add a value to the accumulator",
          "Halt the program when the AC is zero",
        ],
        answer: "Conditionally skip the next instruction based on the AC (>, =, or < 0)",
        flashcardBack: `\`Skipcond\` tests the **AC** (greater than, equal to, or less than 0) and **skips the next instruction** when the condition is true. Paired with \`Jump\` (an *unconditional* branch), it implements if/else and loops. **Labels** name addresses so branches stay readable and relocatable.`,
      },
      {
        name: "Machine Code and Assembly",
        orderIndex: 5,
        prerequisites: ["MARIE Instructions and the Accumulator"],
        explanation: `The instructions we write (\`Load X\`, \`Add Y\`) are **assembly language** — a human-readable form. The CPU actually executes **machine code**: each instruction encoded as a binary number, conventionally shown in **hexadecimal** in memory.

In MARIE a machine instruction packs two parts into one word: an **opcode** (which operation) and an **address** (which operand). For example, if \`Load\` has opcode \`1\` and the operand is address \`004\`, the assembled instruction appears in memory as \`1004\` (hex). \`Add\` from address \`004\` might be \`3004\`, and so on.

The **assembler** is the tool that translates your assembly program into this machine code, resolving labels to addresses along the way. The reverse — **disassembly** — means reading raw memory contents and reconstructing the original instructions by splitting each word back into opcode + address using the instruction-set table.

The deep point of the stored-program model reappears here: an instruction like \`1004\` is just a number in memory, indistinguishable from data \`1004\` except by **how the CPU uses it**. Whether a memory word is an instruction or a piece of data depends entirely on whether the PC points the fetch step at it.`,
        flashcardFront: `A MARIE machine-code instruction (e.g. \`1004\` in hex) is composed of:`,
        options: [
          "An opcode plus an operand address",
          "Two separate data values",
          "Only an opcode, with no operand",
          "An ASCII character code",
        ],
        answer: "An opcode plus an operand address",
        flashcardBack: `Each instruction word splits into an **opcode** (the operation, e.g. \`1\` = Load) and an **operand address** (e.g. \`004\`). The **assembler** produces this code (resolving labels); **disassembly** reverses it. Since \`1004\` is just a number, only the CPU's *use* of it (fetched as an instruction vs read as data) gives it meaning.`,
      },
    ],
  },

  // ── WEEK 3 — Memory Management ──────────────────────────────────────────────
  {
    index: 3,
    title: "Memory & Memory Management",
    cheatSheet: `## Memory & Memory Management

**Memory hierarchy** (fast/small/dear → slow/big/cheap)
\`Registers → Cache → Main memory (RAM) → Disk/SSD\`
💡 The closer to the CPU, the faster and more expensive per byte.

**Virtual vs physical addresses**
- Each process sees its own **virtual** address space starting at 0.
- The OS/MMU **maps** virtual addresses to **physical** RAM addresses.
- Benefits: isolation, simpler programming, more apparent memory than RAM.

**Allocation schemes**
| Scheme | Idea | Wastage |
|---|---|---|
| **Fixed partitioning** | RAM split into fixed blocks | **internal** fragmentation |
| **Dynamic partitioning** | blocks sized to each process | **external** fragmentation |
| 🔑 **Paging** | RAM = fixed **frames**; process = **pages**; page table maps page→frame | small **internal** frag (last page) |

**Fragmentation**
- ⚠️ **Internal** — unused space *inside* an allocated block.
- ⚠️ **External** — enough free space total, but split into pieces too small to use.

**Paging details**
- Page size = frame size (e.g. 4 KB).
- A **page table** per process maps each page to a physical frame.
- Pages can be non-contiguous → no external fragmentation.
- Idle pages can be moved to **disk** and brought back on demand (a *page fault*).`,
    concepts: [
      {
        name: "The Memory Hierarchy",
        orderIndex: 1,
        prerequisites: [],
        explanation: `No single memory technology is both fast *and* large *and* cheap, so computers use a **memory hierarchy** — layers that trade speed for capacity and cost:

\`\`\`
Registers  →  Cache  →  Main memory (RAM)  →  Disk / SSD
 fastest                                        slowest
 tiny                                            huge
 priciest/byte                              cheapest/byte
\`\`\`

- **Registers** live inside the CPU — a handful of words, accessed in a single clock cycle.
- **Cache** holds recently/frequently used data close to the CPU.
- **Main memory (RAM)** is the working store for running programs; it's *volatile* (lost on power-off).
- **Disk/SSD** is large, cheap, and *non-volatile* (persists), but far slower.

The hierarchy works because of **locality**: programs tend to reuse the same data and nearby data, so keeping that in fast upper levels gives most of the speed of fast memory at close to the cost of slow memory. When the CPU needs something, it checks the fast levels first and only reaches down to slower levels on a miss. Understanding this layering explains why memory management — deciding what lives in RAM vs disk — matters so much for performance.`,
        flashcardFront: `In the memory hierarchy, as you move **closer to the CPU** (registers → cache → RAM → disk), memory becomes:`,
        options: [
          "Faster, smaller and more expensive per byte",
          "Slower, larger and cheaper per byte",
          "Faster, larger and cheaper per byte",
          "Slower, smaller and more expensive per byte",
        ],
        answer: "Faster, smaller and more expensive per byte",
        flashcardBack: `Closer to the CPU = **faster, smaller, costlier per byte** (registers/cache); further = slower, larger, cheaper (RAM, then disk). The hierarchy exploits **locality** to deliver near-fast-memory speed at near-cheap-memory cost. RAM is volatile; disk/SSD is non-volatile.`,
      },
      {
        name: "Virtual vs Physical Addresses",
        orderIndex: 2,
        prerequisites: ["The Memory Hierarchy"],
        explanation: `If every program used physical RAM addresses directly, programs would clash and you'd have to know exactly where each would load. **Virtual memory** solves this: each process is given its own **virtual address space** that appears to start at address 0 and be contiguous, regardless of where it actually sits in RAM.

The operating system, with hardware help (the **MMU** — Memory Management Unit), **maps** each virtual address to a real **physical address** at run time. So two processes can both use "virtual address 0" while occupying completely different physical locations.

Benefits:
- **Isolation/protection** — a process can't see or corrupt another's memory.
- **Simpler programs** — every program is written as if it owns memory from 0.
- **More apparent memory than RAM** — rarely-used parts can be kept on disk and pulled in only when needed, so the virtual space can exceed physical RAM.

Example: the OS might load a Zoom process starting at physical \`10000H\` and a word processor at \`40000H\`; each still uses its own virtual addresses, and the mapping hides where they really are. This translation layer is the foundation for the allocation schemes that follow.`,
        flashcardFront: `What is the main benefit of giving each process its own **virtual address space**?`,
        options: [
          "Isolation and the illusion of contiguous memory starting at 0, mapped to real RAM by the OS/MMU",
          "It makes RAM physically larger",
          "It removes the need for a CPU",
          "It stores data permanently when power is lost",
        ],
        answer: "Isolation and the illusion of contiguous memory starting at 0, mapped to real RAM by the OS/MMU",
        flashcardBack: `Virtual addressing gives each process a private, contiguous space from 0, which the **OS/MMU maps** to scattered physical RAM. This brings **isolation** (processes can't touch each other's memory), simpler programming, and the ability to appear to have more memory than physical RAM (unused parts kept on disk). It doesn't change the physical size of RAM.`,
      },
      {
        name: "Fixed Partitioning and Internal Fragmentation",
        orderIndex: 3,
        prerequisites: ["Virtual vs Physical Addresses"],
        explanation: `One simple way to share RAM among processes is **fixed (static) partitioning**: divide memory in advance into a set number of blocks. The blocks can be **equal** size or a mix of **unequal** sizes, but their boundaries are fixed.

A process is placed into a partition big enough to hold it. The drawback: a process rarely fills its partition exactly, so the **leftover space inside the partition is wasted** — this is **internal fragmentation**.

Example: a 512 KB process placed in a 4 MB partition wastes (4 MB − 512 KB) of internal space — that memory is allocated but unusable by anyone else.

Internal fragmentation is the cost of allocating in **fixed-size chunks**: you round each request up to a whole block, and the rounding is lost. Equal-size partitions make placement trivial but waste a lot when process sizes vary; unequal partitions reduce waste but require choosing the partition sizes wisely. The total internal fragmentation is the sum of "(partition size − process size)" over all occupied partitions. This problem motivates the more flexible schemes that follow.`,
        flashcardFront: `A 512 KB process is loaded into a fixed 4 MB partition. The wasted space inside that partition is called:`,
        options: ["Internal fragmentation", "External fragmentation", "A page fault", "Overflow"],
        answer: "Internal fragmentation",
        flashcardBack: `Space wasted **inside** an allocated block (4 MB − 512 KB here) is **internal fragmentation** — the cost of allocating in fixed-size chunks and rounding each request up to a whole block. (Wasted space *between* blocks is *external* fragmentation, the problem of dynamic partitioning.)`,
      },
      {
        name: "Dynamic Partitioning and External Fragmentation",
        orderIndex: 4,
        prerequisites: ["Fixed Partitioning and Internal Fragmentation"],
        explanation: `**Dynamic partitioning** allocates each process a block of **exactly** the size it needs, rather than rounding up to a fixed partition. This eliminates internal fragmentation — no wasted space inside a block.

But as processes start and finish, RAM becomes a patchwork of used and free regions. When a process ends it leaves a hole; over time you get many small scattered holes. The problem: **there may be enough total free memory for a new process, but no single hole is big enough**. This is **external fragmentation** — free space exists but is fragmented into unusable pieces.

Example: free holes of 4 MB + 14 MB exist (18 MB total free), but a 12 MB process *can* fit the 14 MB hole, whereas a 16 MB process can't fit either hole despite 18 MB being free overall.

Remedies include **compaction** (shuffling processes together to merge the free holes into one) — but that's expensive, requiring processes to be moved. The fundamental tension — fixed chunks waste space *inside* (internal), variable chunks waste space *between* (external) — is exactly what **paging** is designed to escape.`,
        flashcardFront: `Total free RAM is 18 MB, but it's split into a 4 MB and a 14 MB hole, so a 16 MB process can't load. This is:`,
        options: [
          "External fragmentation",
          "Internal fragmentation",
          "A cache miss",
          "Sign-magnitude overflow",
        ],
        answer: "External fragmentation",
        flashcardBack: `Enough memory exists in total, but it's broken into pieces too small to use — **external fragmentation**, the downside of dynamic partitioning. It can be fixed by **compaction** (moving processes to merge holes), which is costly. Paging avoids it by allowing non-contiguous allocation.`,
      },
      {
        name: "Paging",
        orderIndex: 5,
        prerequisites: ["Dynamic Partitioning and External Fragmentation"],
        explanation: `**Paging** is the scheme that defeats external fragmentation. Physical memory is divided into equal-size **frames** (say 4 KB each), and each process's address space is divided into equal-size **pages** of the same size. A page can be placed in **any free frame** — pages need not be contiguous.

Each process has a **page table** mapping each of its pages to the physical frame holding it. When the CPU issues a virtual address, the hardware splits it into a *page number* (look up the frame in the page table) and an *offset* (position within the frame).

Consequences:
- **No external fragmentation** — any free frame can be used, so scattered free frames are all usable.
- Only **internal fragmentation** in the **last page** of a process (it rarely fills exactly one frame). A 15 KB process with 4 KB frames needs 4 pages = 16 KB, wasting 1 KB.
- Idle pages can be moved out to **disk** to free frames; when accessed again, a **page fault** triggers the OS to bring the page back into a free frame and update the page table.

Paging is why modern systems can run many processes, each with its own large virtual space, on limited physical RAM.`,
        flashcardFront: `Why does **paging** eliminate *external* fragmentation?`,
        options: [
          "Any page can go in any free frame, so non-contiguous free frames are all usable",
          "It allocates one giant contiguous block per process",
          "It never uses the disk",
          "It rounds every process up to the same large size",
        ],
        answer: "Any page can go in any free frame, so non-contiguous free frames are all usable",
        flashcardBack: `Paging uses fixed-size **frames** and lets a process's **pages** occupy **any** free frames (non-contiguous), so scattered free space is fully usable — no external fragmentation. The only waste is small **internal** fragmentation in a process's **last page**. A **page table** maps pages→frames; idle pages can live on disk and return on a **page fault**.`,
      },
    ],
  },

  // ── WEEK 4 — Input / Output ─────────────────────────────────────────────────
  {
    index: 4,
    title: "Input / Output",
    cheatSheet: `## Input / Output (I/O)

**The problem:** I/O devices are far **slower** than the CPU and vary wildly. The CPU talks to them through **I/O modules/controllers**, not directly.

**Three ways the CPU handles I/O**
| Technique | How | CPU cost |
|---|---|---|
| **Programmed I/O (polling)** | CPU repeatedly checks "ready?" in a loop | ⚠️ wastes CPU (busy-waiting) |
| **Interrupt-driven** | device signals the CPU when ready | CPU free until interrupted |
| 🔑 **DMA** | a DMA controller moves data ↔ memory directly | CPU only set-up + final interrupt |

**Interrupts**
- Device raises an **interrupt** → CPU pauses, saves state, runs an **interrupt service routine (ISR)**, then resumes.
- Avoids wasteful polling.

**DMA (Direct Memory Access)**
- For big/fast transfers (disk, network), the **DMA controller** transfers blocks straight to/from RAM.
- CPU is interrupted **once** at the end, not per byte.

**Buses** — shared wires connecting CPU, memory and I/O:
- **Address bus** (where), **Data bus** (what), **Control bus** (signals: read/write, interrupt…).

**Registers in I/O (MARIE)** — \`Input\` reads a device into the **AC**; \`Output\` writes the AC to a device. \`ORG\` sets where code is placed in memory.`,
    concepts: [
      {
        name: "I/O Fundamentals and I/O Modules",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**Input/Output (I/O)** is how a computer communicates with the outside world — keyboards, screens, disks, networks. The central challenge is **mismatch**: I/O devices are vastly **slower** than the CPU and come in enormous variety (different speeds, data formats, electrical signals).

To manage this, the CPU does **not** talk to devices directly. Instead each device connects through an **I/O module** (or *controller*) that acts as an interface: it buffers data, reports status (busy/ready/error), and translates between the device's signals and the CPU's standard interface. The CPU communicates with these controllers, often through special **registers** or memory-mapped locations.

This indirection gives the system **modularity**: the CPU uses a uniform way to issue I/O requests, while each controller hides the messy device-specific details. It also lets devices and the CPU work at their own pace, with the controller bridging the speed gap via buffering.

The key question that follows is *how* the CPU coordinates with these slow controllers — does it wait, get notified, or delegate the transfer? That choice (polling vs interrupts vs DMA) is the heart of I/O design.`,
        flashcardFront: `Why does the CPU communicate with devices through an **I/O module/controller** rather than directly?`,
        options: [
          "It bridges the speed mismatch and hides device-specific details behind a uniform interface",
          "Controllers make devices run as fast as the CPU",
          "The CPU has no way to do arithmetic otherwise",
          "It permanently stores the data",
        ],
        answer: "It bridges the speed mismatch and hides device-specific details behind a uniform interface",
        flashcardBack: `An **I/O module/controller** sits between CPU and device: it **buffers** data (bridging the big speed gap), reports status, and presents a **uniform interface** so the CPU doesn't deal with each device's electrical/format quirks. This modularity lets CPU and devices each run at their own pace.`,
      },
      {
        name: "Programmed I/O and Polling",
        orderIndex: 2,
        prerequisites: ["I/O Fundamentals and I/O Modules"],
        explanation: `The simplest way for the CPU to do I/O is **programmed I/O** using **polling**: the CPU repeatedly **checks the device's status register** in a loop ("are you ready yet?") and only transfers data once the device reports ready.

\`\`\`
loop:  read status register
       if not ready: go to loop      ← busy-waiting
       transfer one unit of data
\`\`\`

It's easy to implement and gives the CPU full control over timing. But the cost is severe: while spinning in that loop, the CPU does **no useful work** — it is **busy-waiting**. Because devices are so much slower than the CPU, it may execute millions of pointless checks waiting for a single keystroke or disk sector.

⚠️ Programmed I/O wastes enormous CPU time and scales terribly when many devices are involved. It's acceptable only for very simple systems or when the CPU genuinely has nothing else to do. The desire to *stop wasting cycles* is exactly what motivates **interrupt-driven I/O** — letting the device tell the CPU when it's ready, instead of the CPU constantly asking.`,
        flashcardFront: `The main drawback of **programmed I/O (polling)** is that:`,
        options: [
          "The CPU busy-waits, wasting cycles repeatedly checking if the device is ready",
          "It cannot transfer data at all",
          "It requires a separate DMA controller",
          "It corrupts data during transfer",
        ],
        answer: "The CPU busy-waits, wasting cycles repeatedly checking if the device is ready",
        flashcardBack: `In polling the CPU loops on the status register — **busy-waiting** — doing no useful work while it waits for a slow device. That wastes huge numbers of cycles, which is why **interrupt-driven I/O** (let the device signal the CPU) is preferred.`,
      },
      {
        name: "Interrupt-Driven I/O",
        orderIndex: 3,
        prerequisites: ["Programmed I/O and Polling"],
        explanation: `**Interrupt-driven I/O** removes busy-waiting. Instead of the CPU constantly polling, the device **raises an interrupt** — an electrical signal — when it is ready (or has finished). The CPU is then free to run other work in the meantime.

When an interrupt arrives, the CPU:
1. **Finishes the current instruction**, then **saves its state** (PC and registers).
2. Jumps to an **interrupt service routine (ISR)** — code that handles that device (e.g. read the keystroke).
3. On completion, **restores the saved state** and resumes exactly where it left off.

This is far more efficient: the CPU only spends time on a device when there's actually something to do, and can service many devices responsively. The trade-off is added complexity — the system needs a mechanism to identify which device interrupted (interrupt vectors/priorities) and to save/restore context correctly.

Conceptually, an interrupt is like a doorbell versus repeatedly opening the door to check for visitors: you get on with your work and respond only when signalled. This event-driven model underpins how real operating systems juggle the keyboard, disk, network and timers simultaneously.`,
        flashcardFront: `In **interrupt-driven I/O**, what happens when a device becomes ready?`,
        options: [
          "It signals the CPU, which pauses, runs an interrupt service routine, then resumes",
          "The CPU keeps polling the device in a loop",
          "The device writes directly to disk with no CPU involvement ever",
          "The program halts permanently",
        ],
        answer: "It signals the CPU, which pauses, runs an interrupt service routine, then resumes",
        flashcardBack: `The device **raises an interrupt**; the CPU saves its state, runs the **ISR** to service the device, then restores state and continues. This frees the CPU to do other work instead of **busy-waiting** (polling) — at the cost of needing context-save and interrupt-handling machinery.`,
      },
      {
        name: "Direct Memory Access (DMA)",
        orderIndex: 4,
        prerequisites: ["Interrupt-Driven I/O"],
        explanation: `Even with interrupts, the CPU is still involved in **every unit** of data transferred — for a large disk or network transfer, that's an interrupt and CPU action for each chunk, which adds up. **Direct Memory Access (DMA)** offloads the bulk transfer entirely.

A dedicated **DMA controller** is given the job: the source, destination in RAM, and the amount of data. It then transfers the whole block **directly between the device and memory**, without the CPU moving each piece. The CPU only:
1. **Sets up** the transfer (tells the DMA controller what to do), then carries on with other work.
2. Receives a **single interrupt** when the entire transfer is complete.

🔑 The win: for high-volume I/O (disk, network, graphics), the CPU is freed from the per-byte work and is interrupted just **once** at the end, instead of once per chunk. The DMA controller and CPU do share the memory bus, so there can be brief contention ("cycle stealing"), but this is far cheaper than the CPU doing the transfer itself.

The progression *polling → interrupts → DMA* is a steady reduction in how much the CPU must babysit I/O — culminating in DMA, where it barely participates at all.`,
        flashcardFront: `With **DMA**, how often is the CPU typically interrupted during a large block transfer?`,
        options: [
          "Once, when the whole transfer is complete",
          "Once for every byte transferred",
          "Continuously, in a polling loop",
          "Never — DMA needs no CPU involvement at all",
        ],
        answer: "Once, when the whole transfer is complete",
        flashcardBack: `A **DMA controller** moves the entire block directly between device and RAM; the CPU only **sets up** the transfer and gets a **single interrupt at the end**. That's the big saving over interrupt-driven I/O (one interrupt per chunk) and polling (constant checking). The CPU isn't *uninvolved* — it still configures the transfer and shares the memory bus.`,
      },
      {
        name: "Buses and the Datapath",
        orderIndex: 5,
        prerequisites: ["I/O Fundamentals and I/O Modules"],
        explanation: `The CPU, memory and I/O controllers are connected by **buses** — shared sets of wires that carry information between components. A system bus is usually described as three functional parts:

- **Address bus** — carries *where*: the memory address or device the CPU wants to access. Its width sets how much memory can be addressed (n lines → 2ⁿ addresses).
- **Data bus** — carries *what*: the actual data being read or written. Its width affects how many bits move at once.
- **Control bus** — carries *signals*: read vs write, interrupt requests, clock, bus-grant, etc.

Because a bus is **shared**, only one transfer can use it at a time, so the bus can be a bottleneck and access must be coordinated (which is also why DMA "steals cycles" from the CPU when it uses the bus).

In MARIE specifically, I/O ties back to the registers from Week 2: \`Input\` brings a value from a device into the **AC**, \`Output\` sends the AC to a device, and addresses/data flow via the MAR/MBR over the buses. Seeing the buses makes concrete *how* the CPU's registers, memory and devices are physically linked into one working datapath.`,
        flashcardFront: `Which bus carries the **memory address or device identifier** the CPU wants to access?`,
        options: ["Address bus", "Data bus", "Control bus", "Accumulator bus"],
        answer: "Address bus",
        flashcardBack: `The **address bus** carries *where* (the location); the **data bus** carries *what* (the actual bits); the **control bus** carries *signals* (read/write, interrupts, clock). The address bus width sets the maximum addressable memory (n lines → 2ⁿ addresses). Buses are **shared**, so they can bottleneck and must be arbitrated.`,
      },
    ],
  },

  // ── WEEK 5 — Operating Systems & Linux ──────────────────────────────────────
  {
    index: 5,
    title: "Operating Systems & Linux",
    cheatSheet: `## Operating Systems & the Linux Command Line

**An OS** sits between hardware and applications. Its three core jobs:
- 🔑 **Process management** — run/schedule programs, share the CPU.
- 🔑 **Memory management** — allocate RAM, virtual memory (Week 3).
- 🔑 **File management** — organise data on disk into files/directories.

**Process** — a *program in execution* (its own memory + CPU state). The OS scheduler interleaves many processes on the CPU.

**Linux file system** — a single tree rooted at \`/\`.
| Path type | Meaning |
|---|---|
| **Absolute** | from root: \`/home/sam/notes\` |
| **Relative** | from current dir: \`docs/notes\` |
| \`~\` | your home directory |
| \`.\` / \`..\` | current / parent directory |

**Essential commands**
\`\`\`bash
pwd                 # print current directory
ls -l   ls -a  ls -R# list (long / all / recursive)
cd  ~/monash        # change directory
mkdir  data         # make directory
cp  src dst         # copy
rm -r  dir          # remove (recursive for dirs)
man  ls             # manual page;  whatis ls
\`\`\`

**Wildcards (globbing)**: \`*\` = any chars, \`?\` = one char, \`[hH]*\` = starts with h/H.

**Permissions**: \`rwx\` for **user / group / others** (e.g. \`rwxr-x---\`).`,
    concepts: [
      {
        name: "What an Operating System Does",
        orderIndex: 1,
        prerequisites: [],
        explanation: `An **operating system (OS)** is the software layer between the **hardware** and the **applications**. It manages the machine's resources and provides services so that programs don't each have to control the hardware directly. Three responsibilities are central:

- **Process management** — deciding which program runs on the CPU when, starting and stopping programs, and sharing the CPU among many of them so they appear to run at once.
- **Memory management** — allocating RAM to processes, enforcing isolation, and implementing virtual memory/paging (Week 3) so each process gets its own address space.
- **File management** — organising data on storage devices into **files** and **directories**, and controlling access to them.

Beyond these, the OS handles **I/O** (via the device drivers and interrupt handling from Week 4), security and user accounts, and presents interfaces — a graphical desktop and/or a **command line** — for users to interact with the system.

The unifying idea is *abstraction and arbitration*: the OS hides messy hardware behind clean abstractions (processes, virtual memory, files) and fairly arbitrates access to shared resources so many users and programs can coexist safely.`,
        flashcardFront: `Which three functions are the **core responsibilities** of an operating system?`,
        options: [
          "Process management, memory management, file management",
          "Compiling, linking, debugging",
          "Encryption, routing, switching",
          "Addition, subtraction, comparison",
        ],
        answer: "Process management, memory management, file management",
        flashcardBack: `The OS's three core jobs are **process** management (share the CPU among programs), **memory** management (allocate RAM / virtual memory), and **file** management (organise data on disk). Underlying them all is the OS's role of **abstracting** hardware and **arbitrating** shared resources for many programs and users.`,
      },
      {
        name: "Processes and Process Management",
        orderIndex: 2,
        prerequisites: ["What an Operating System Does"],
        explanation: `A **process** is a *program in execution* — not the file on disk, but a running instance with its own **memory space** (code, data, stack) and **CPU state** (registers, program counter). Running the same program twice creates two independent processes.

Because there are usually far more processes than CPUs, the OS **scheduler** rapidly switches the CPU between them — a **context switch** saves one process's state and restores another's. Switching fast enough creates the illusion that many programs run **simultaneously** (concurrency), even on a single core.

The OS tracks each process's **state**: typically *running* (currently on the CPU), *ready* (able to run, waiting its turn), or *blocked/waiting* (e.g. paused for I/O to complete). When a running process needs slow I/O, the OS blocks it and gives the CPU to a ready process — keeping the CPU busy instead of idle.

This management is what lets you browse the web while music plays and a download runs: the OS interleaves their processes, allocates each its memory, and coordinates their access to devices. Process management ties together the CPU, memory and I/O concepts from earlier weeks into a working multitasking system.`,
        flashcardFront: `A **process** is best described as:`,
        options: [
          "A program in execution, with its own memory and CPU state",
          "A program file stored on disk",
          "A single CPU instruction",
          "A directory in the file system",
        ],
        answer: "A program in execution, with its own memory and CPU state",
        flashcardBack: `A **process** is a *running instance* of a program — its own memory (code/data/stack) plus CPU state (registers, PC) — distinct from the static program file on disk. The OS **scheduler** context-switches the CPU among many processes (running/ready/blocked) to create concurrency and keep the CPU busy during I/O waits.`,
      },
      {
        name: "The Linux File System and Paths",
        orderIndex: 3,
        prerequisites: ["What an Operating System Does"],
        explanation: `Linux organises files in a single **hierarchical tree** with one **root**, written \`/\`. Everything hangs off the root: directories contain files and other directories, forming a tree. (Notable directories include \`/home\` for users' files, \`/etc\` for configuration, \`/usr\` for programs.)

A **path** specifies a file's location, and there are two kinds:

- **Absolute path** — starts from the root \`/\` and gives the full route: \`/home/sam/notes.txt\`. It means the same thing from anywhere.
- **Relative path** — starts from your **current working directory**: if you're in \`/home/sam\`, then \`docs/notes.txt\` refers to \`/home/sam/docs/notes.txt\`.

Handy shortcuts:
- \`~\` — your **home directory** (e.g. \`/home/sam\`).
- \`.\` — the **current** directory; \`..\` — the **parent** directory.

So \`cd ..\` moves up one level, and \`cd ~/monash\` jumps to \`monash\` inside your home. Use \`pwd\` ("print working directory") to see where you are. Understanding absolute vs relative paths is essential: relative paths are concise but depend on where you currently are, while absolute paths are unambiguous.`,
        flashcardFront: `Which of these is an **absolute path** in Linux?`,
        options: ["/home/sam/notes.txt", "docs/notes.txt", "../notes.txt", "notes.txt"],
        answer: "/home/sam/notes.txt",
        flashcardBack: `An **absolute path** starts at the root \`/\` and is unambiguous from anywhere: \`/home/sam/notes.txt\`. The others are **relative** — interpreted from your current directory (\`..\` = parent, no leading slash = here). \`~\` is a shortcut for your home directory.`,
      },
      {
        name: "The Command Line",
        orderIndex: 4,
        prerequisites: ["The Linux File System and Paths"],
        explanation: `The **command line** (shell) lets you control the system by typing commands — often faster and more scriptable than a GUI. You type a command, optional **options** (flags) and **arguments**, and press Enter.

Core file/directory commands:
\`\`\`bash
pwd              # print working directory
ls               # list directory contents
ls -l            # long format (permissions, size, date)
ls -a            # include hidden files (names starting with .)
ls -R            # recurse into subdirectories
cd dir           # change directory
mkdir name       # make a directory
cp src dst       # copy a file
rm file          # remove a file;  rm -r dir  removes a directory
\`\`\`

Options modify behaviour and can combine (e.g. \`ls -la\`). When you don't know a command, Linux documents itself: **\`man ls\`** opens the manual page for \`ls\` (search within it by typing \`/word\`), and **\`whatis ls\`** gives a one-line summary.

The philosophy is composability: many small, single-purpose commands that you combine. Learning to read \`man\` pages — to discover the right option for a task — is more valuable than memorising commands, because the manual is always available and authoritative.`,
        flashcardFront: `Which command shows the **manual page** for a command, e.g. to find its options?`,
        options: ["man", "ls", "pwd", "cd"],
        answer: "man",
        flashcardBack: `**\`man\`** opens the **manual page** (e.g. \`man ls\`) — the authoritative reference for a command's options; search inside with \`/word\`. (\`whatis\` gives a one-line summary.) \`ls\` lists files, \`pwd\` prints the current directory, \`cd\` changes directory. Knowing how to read \`man\` beats memorising flags.`,
      },
      {
        name: "Wildcards and Permissions",
        orderIndex: 5,
        prerequisites: ["The Command Line"],
        explanation: `Two everyday shell concepts: wildcards and permissions.

**Wildcards (globbing)** let one command match many files. The shell expands them before running the command:
- \`*\` — matches **any sequence** of characters (including none). \`*.conf\` matches every file ending in \`.conf\`.
- \`?\` — matches **exactly one** character. \`file?.txt\` matches \`file1.txt\` but not \`file12.txt\`.
- \`[...]\` — matches **one character from a set**. \`[hH]*\` matches names starting with \`h\` or \`H\`.

So \`ls /etc/*.conf\` lists all config files in \`/etc\`. (Note: by default \`ls dir\` lists a directory's *contents*; the \`-d\` option lists the directory entry itself.)

**Permissions** control who may access a file. Each file has three permission sets — for the **user (owner)**, the **group**, and **others** — each granting **r**ead, **w**rite and e**x**ecute. \`ls -l\` shows them as a 9-character string like \`rwxr-x---\`:
- \`rwx\` (user: read/write/execute),
- \`r-x\` (group: read/execute, no write),
- \`---\` (others: nothing).

Permissions are the foundation of Linux's multi-user security model, ensuring users can't read or modify each other's files unless explicitly allowed.`,
        flashcardFront: `In the shell, what does the wildcard \`*\` match?`,
        options: [
          "Any sequence of characters (including none)",
          "Exactly one character",
          "Only digits",
          "Only hidden files",
        ],
        answer: "Any sequence of characters (including none)",
        flashcardBack: `\`*\` matches **any sequence** of characters, so \`*.conf\` matches every \`.conf\` file. \`?\` matches **exactly one** character; \`[hH]\` matches one character from a set. The shell expands these *before* the command runs. (Separately, \`ls -l\` shows **rwx** permissions for user/group/others.)`,
      },
    ],
  },

  // ── WEEK 6 — Protocol Layering ──────────────────────────────────────────────
  {
    index: 6,
    title: "Networks & Protocol Layering",
    cheatSheet: `## Networks & Protocol Layering

**Protocol** — an agreed set of rules for communication (format, order, actions). Both parties must follow the same protocol.

**Why layer?** Split a complex problem into **layers**, each with one job, talking to the layer above/below via clean interfaces.
✅ Benefits: modularity, easier change, interoperability.
⚠️ Cost: some overhead, hides detail.

**TCP/IP model (5-layer view)** vs **OSI (7-layer)**
| TCP/IP | Job | Address / unit |
|---|---|---|
| **Application** | apps (HTTP, DNS, SMTP) | — / message |
| **Transport** | end-to-end (TCP/UDP) | port / segment |
| **Network** | routing across networks (IP) | IP address / packet |
| **Data Link** | one hop on a LAN (Ethernet) | MAC / frame |
| **Physical** | bits on the wire | — / bits |

🔑 **Encapsulation** — each layer wraps the data from above by adding its **header** (sender side). **Decapsulation** — each layer strips its header (receiver side).

**Logical connection** — each layer "talks" to its **peer** layer on the other host (conceptually), though data really travels down then up the stack.

**Multiplexing / demultiplexing** — combine data from several sources to send (mux); deliver arriving data to the right upper-layer process (demux), e.g. via port numbers.

**Wireshark** — a packet analyser to capture and inspect traffic layer by layer.`,
    concepts: [
      {
        name: "Protocols and Why We Layer",
        orderIndex: 1,
        prerequisites: [],
        explanation: `A **protocol** is an agreed set of **rules** that governs communication between two parties: the format of messages, the order in which they're exchanged, and the actions to take. Both ends must speak the same protocol — just as a phone call needs both people to share a language and conventions ("hello", taking turns).

Networks are enormously complex (different hardware, distances, applications), so we don't solve everything in one piece. Instead we use **protocol layering**: divide the problem into **layers**, each responsible for one well-defined job, each using the services of the layer below and offering services to the layer above through a clean **interface**.

✅ **Benefits:**
- **Modularity** — each layer can be designed, understood and tested independently.
- **Changeability** — you can swap a layer's implementation (e.g. WiFi for Ethernet) without touching the others, as long as the interface stays the same.
- **Interoperability** — standard layers let equipment from different vendors work together.

⚠️ **Costs:** some performance **overhead** (each layer adds processing and header bytes), and the abstraction can hide details that occasionally matter.

Layering is the organising principle of all modern networking — the rest of this course works layer by layer.`,
        flashcardFront: `What is the main benefit of organising network functions into **layers**?`,
        options: [
          "Modularity — each layer can be designed and changed independently via clean interfaces",
          "It removes all overhead from communication",
          "It lets one computer talk without any agreed rules",
          "It guarantees no data is ever lost",
        ],
        answer: "Modularity — each layer can be designed and changed independently via clean interfaces",
        flashcardBack: `Layering brings **modularity**: each layer has one job and a clean interface, so you can change one layer (e.g. WiFi↔Ethernet) without disturbing the others, and mix vendors (interoperability). The trade-off is some **overhead** (extra processing + header bytes). A **protocol** is the shared rule-set both ends must follow.`,
      },
      {
        name: "The TCP/IP and OSI Models",
        orderIndex: 2,
        prerequisites: ["Protocols and Why We Layer"],
        explanation: `Two reference models describe the layers. The **OSI model** has 7 layers (a teaching ideal); the **TCP/IP model** used by the real Internet is often shown as **5 layers**:

| Layer | Responsibility | Example | Address / unit |
|---|---|---|---|
| **Application** | services for user programs | HTTP, DNS, SMTP | — / message |
| **Transport** | end-to-end delivery between processes | TCP, UDP | port / segment |
| **Network** | routing packets across many networks | IP | IP address / packet |
| **Data Link** | delivery over one physical link (a hop) | Ethernet, WiFi | MAC / frame |
| **Physical** | transmitting raw bits | cables, radio | — / bits |

Each layer has a characteristic **address** and names its data unit differently (message → segment → packet → frame → bits).

The crucial mental model: a layer on one host conceptually communicates with the **same (peer) layer** on the other host — the transport layer "talks to" the remote transport layer — even though, physically, data travels **down** the sender's stack and **up** the receiver's. The lower layers exist purely to make that peer conversation possible. Knowing which layer owns which job (and which address) lets you reason about any networking problem.`,
        flashcardFront: `In the TCP/IP model, which layer is responsible for **routing packets across different networks** using IP addresses?`,
        options: ["Network layer", "Data Link layer", "Transport layer", "Application layer"],
        answer: "Network layer",
        flashcardBack: `The **Network layer** (IP) routes **packets** across interconnected networks using **IP addresses**. Above it, **Transport** (TCP/UDP) handles end-to-end delivery between processes via **ports**; below it, **Data Link** (Ethernet) moves **frames** over one hop using **MAC** addresses. Each layer = its own job, address and data-unit name.`,
      },
      {
        name: "Encapsulation and Decapsulation",
        orderIndex: 3,
        prerequisites: ["The TCP/IP and OSI Models"],
        explanation: `How does data physically move through the layered stack? Through **encapsulation** on the way out and **decapsulation** on the way in.

**Encapsulation (sender):** the application's data is handed down the stack, and **each layer adds its own header** (control information for its peer) around the data it receives from above:
\`\`\`
Application:                         [ data ]
Transport:                 [ TCP hdr | data ]          → segment
Network:          [ IP hdr | TCP hdr | data ]          → packet
Data Link: [ Eth hdr | IP hdr | TCP hdr | data | trailer ] → frame
\`\`\`
Each layer treats the unit from the layer above as opaque payload and just wraps it.

**Decapsulation (receiver):** the frame arrives and travels **up** the stack; **each layer reads and removes its own header**, using it to decide what to do, then passes the remaining payload up to the next layer.

🔑 The elegance: a header added by one layer is read **only** by the *peer* layer on the other host — the IP header by the remote network layer, the Ethernet header by the next link. This is the concrete machinery behind "each layer talks to its peer". The growth and shrinkage of headers as data descends and ascends the stack is exactly what you observe in a packet analyser.`,
        flashcardFront: `During **encapsulation**, what does each layer do as data is passed *down* the sending stack?`,
        options: [
          "Adds its own header (control information) around the data from the layer above",
          "Removes a header added by the layer above",
          "Routes the packet to its final destination",
          "Converts the data to ASCII",
        ],
        answer: "Adds its own header (control information) around the data from the layer above",
        flashcardBack: `**Encapsulation** = each layer **wraps** the unit from above with its **own header** (segment→packet→frame) on the way down. **Decapsulation** (receiver) reverses it: each layer **strips and reads its own header** on the way up. A header is meant only for the **peer** layer on the other host.`,
      },
      {
        name: "Addressing, Multiplexing and Demultiplexing",
        orderIndex: 4,
        prerequisites: ["The TCP/IP and OSI Models"],
        explanation: `Two further jobs layers perform are **addressing** and **(de)multiplexing**.

**Addressing** — each layer has its own kind of address so data reaches the right place at that level:
- **Data Link**: **MAC** address — identifies a network interface on the local link.
- **Network**: **IP** address — identifies a host across networks.
- **Transport**: **port number** — identifies the specific *process/application* on a host.

These work together: IP gets the packet to the right *host*, the port gets it to the right *program* on that host, and MAC gets a frame to the right *interface* on the local hop.

**Multiplexing (mux)** — at the sender, **combining** data from several higher-layer sources to send over one lower-layer channel. For example, the transport layer takes data from many applications and hands it all to the single network layer.

**Demultiplexing (demux)** — at the receiver, **directing** each arriving unit up to the **correct** higher-layer process. The transport layer uses the **destination port number** to decide which application gets the data — so your browser and email client both receive only their own traffic over the one network connection.

Mux/demux is what lets a single host run many networked programs at once over shared lower layers.`,
        flashcardFront: `When data arrives at a host, how does the transport layer **demultiplex** it to the correct application?`,
        options: [
          "By the destination port number",
          "By the MAC address",
          "By the IP address only",
          "By the Ethernet frame trailer",
        ],
        answer: "By the destination port number",
        flashcardBack: `**Demultiplexing** uses the **destination port number** to deliver each arriving segment to the right *process* (browser, email client…). IP gets the packet to the right **host**; the **port** picks the right **program** on it; MAC handles the local hop. Mux/demux lets one host run many networked apps over shared lower layers.`,
      },
      {
        name: "Packet Analysis with Wireshark",
        orderIndex: 5,
        prerequisites: ["Encapsulation and Decapsulation"],
        explanation: `A **packet analyser** (or *packet sniffer*) captures the traffic passing through a network interface and lets you inspect it. **Wireshark** is the standard open-source tool for this.

Wireshark makes the abstract layering **visible**. For each captured packet it shows:
- A **packet list** — a one-line summary of every packet (time, source, destination, protocol).
- A **packet details** pane — the packet broken down **layer by layer**: you can expand the Ethernet (Data Link) header, then the IP (Network) header, then the TCP (Transport) header, then the application data — exactly the nested structure created by encapsulation.
- A **packet bytes** pane — the raw bytes, highlighting the part corresponding to whatever field you select.

This is invaluable for **learning and troubleshooting**: you can watch a TCP connection set up, see how source/destination addresses appear at each layer, confirm which port and protocol an application uses, and verify that headers are added/removed as the theory predicts.

Because it sees real packets, Wireshark turns the conceptual stack into something concrete — every header you studied in encapsulation appears as an expandable section, letting you trace a single conversation from frame to application message.`,
        flashcardFront: `What does **Wireshark's** packet *details* pane let you do?`,
        options: [
          "Inspect a captured packet broken down layer by layer (Ethernet, IP, TCP, application)",
          "Permanently block malicious traffic",
          "Increase the network's bandwidth",
          "Encrypt all captured packets",
        ],
        answer: "Inspect a captured packet broken down layer by layer (Ethernet, IP, TCP, application)",
        flashcardBack: `Wireshark is a **packet analyser**: its details pane shows each packet's **nested headers layer by layer** — the very encapsulation structure you studied — so you can trace addresses, ports and protocols. It *observes* traffic (great for learning/troubleshooting); it doesn't block (that's a firewall) or add bandwidth.`,
      },
    ],
  },

  // ── WEEK 7 — LANs, Switches & VLANs ─────────────────────────────────────────
  {
    index: 7,
    title: "LANs, Switches & VLANs",
    cheatSheet: `## LANs, Switches & VLANs

**LAN (Local Area Network)** — computers directly connected in a **limited area** (room/building), circuits **owned** by the organisation, no licence needed (e.g. a lab, home WiFi).

**Building a LAN**
- Each device has a **NIC** (Network Interface Card) with a unique **MAC** address.
- Connect them with a **switch**.

**Switch vs Router**
| | Switch | Router |
|---|---|---|
| Layer | **2** (Data Link) | **3** (Network) |
| Address | **MAC** | **IP** |
| Table | **forwarding** table | **routing** table |
| Connects | devices in **same** network | **different** networks |
| Ports | many (~48) | few (~5) |

🔑 Switch learns which MAC is on which port → forwards a frame only to the right port (not a hub that floods everywhere).

**Switch modes:** cut-through (fast, may pass errors) · store-and-forward (checks errors) · fragment-free (compromise).

**VLAN (Virtual LAN)** — one physical switch carved into **multiple logical subnets** in software.
- Each **port** assigned to a VLAN; VLANs span multiple switches via **trunk** links.
- **802.1Q tag** (4 bytes, 12-bit VLAN ID → 4096 VLANs) inserted in the frame to mark its VLAN.
- **Access port** = one VLAN; **trunk port** = carries many VLANs (tagged).
✅ Benefits: logical grouping, **limited broadcast** domains, flexible, cheaper than routing.`,
    concepts: [
      {
        name: "What Is a LAN? Ethernet and NICs",
        orderIndex: 1,
        prerequisites: [],
        explanation: `A **Local Area Network (LAN)** connects computers that are **directly linked within a limited area** — a room, a building, a campus. Three things characterise a LAN: it covers a **small geographic area**, the connecting circuits are **owned by the organisation** (not leased from a telecom provider), and it can be run **without a licence**. Examples: a university lab, your home WiFi network, a public WiFi hotspot.

To join a network, each device has a **Network Interface Card (NIC)** — the hardware that connects it to the LAN (wired Ethernet or wireless WiFi). Every NIC has a globally unique **MAC address** (a hardware/physical address) burned in by the manufacturer, used to identify it on the local network.

The dominant wired LAN technology is **Ethernet**, which defines how devices format **frames** and share the medium. Modern Ethernet is typically **switched** and **full-duplex** (devices can send and receive simultaneously on point-to-point links to a switch), which avoids the collisions that plagued older shared-medium Ethernet.

A LAN is the foundational building block of networking: the next questions are how to *connect* the devices (switches) and how a switch decides *where* to send each frame (MAC addresses).`,
        flashcardFront: `What gives every network interface its unique hardware identity on a LAN?`,
        options: [
          "A MAC address on the NIC",
          "An IP address assigned by the user",
          "A port number",
          "A domain name",
        ],
        answer: "A MAC address on the NIC",
        flashcardBack: `Each **NIC (Network Interface Card)** has a globally unique **MAC address** burned in by the manufacturer — the hardware/physical identifier used on the local network. (IP addresses identify hosts across networks; ports identify processes; domain names are human-readable host names.) Ethernet is the dominant LAN technology, now usually switched and full-duplex.`,
      },
      {
        name: "Switches and MAC Addresses",
        orderIndex: 2,
        prerequisites: ["What Is a LAN? Ethernet and NICs"],
        explanation: `A **switch** is the device that connects computers into a LAN. It is a **Layer 2 (Data Link)** device: it works with **MAC addresses** and **frames**.

The clever part is how a switch decides where to send a frame. It **learns** by observing traffic: when a frame arrives on a port, the switch records the **source MAC → port** mapping in its **forwarding (MAC address) table**. Over time it learns which device is on which port. Then, when forwarding a frame, it looks up the **destination MAC** and sends the frame **only out the correct port** — not to everyone. (If the destination is unknown, it floods to all ports until it learns.)

This is a big improvement over an old **hub**, which blindly repeated every frame to **all** ports, wasting bandwidth and causing collisions. Because a switch gives each device a dedicated **full-duplex** link, no collisions occur, and switched Ethernet runs at close to full capacity.

The switch's whole job — learn MACs, build a forwarding table, deliver frames only where needed — operates entirely at Layer 2 within a single LAN. To connect *different* networks you need a router (next).`,
        flashcardFront: `How does a Layer-2 **switch** decide which port to send a frame out of?`,
        options: [
          "It looks up the destination MAC address in its forwarding table",
          "It floods every frame to all ports, always",
          "It uses the destination IP address and a routing table",
          "It uses the port number from the transport layer",
        ],
        answer: "It looks up the destination MAC address in its forwarding table",
        flashcardBack: `A switch **learns** source MAC→port mappings into a **forwarding table**, then sends each frame **only** out the port for its **destination MAC** (flooding only when the destination is unknown). This beats a **hub**, which repeats everything to all ports. Switches operate at **Layer 2** with MAC addresses, inside one LAN.`,
      },
      {
        name: "Switch vs Router",
        orderIndex: 3,
        prerequisites: ["Switches and MAC Addresses"],
        explanation: `Switches and routers are both forwarding devices, but they operate at **different layers** and solve different problems:

| | **Switch** | **Router** |
|---|---|---|
| Layer | **2** (Data Link) | **3** (Network) |
| Uses | **MAC** addresses | **IP** addresses |
| Table | **forwarding** table | **routing** table |
| Connects | devices in the **same** network | **different** networks |
| Ports | **many** (e.g. 48) | **few** (e.g. ~5) |
| Cost | cheaper | more expensive |

A **switch** moves frames **within a single LAN** using MAC addresses and a forwarding table. A **router** connects **separate networks** (e.g. your LAN to the Internet) using IP addresses and a **routing table**, deciding the next network hop toward a destination.

The two tables embody the difference: a **forwarding table** maps MAC → local port (within one network), while a **routing table** maps destination IP networks → next-hop/interface (across networks). Routers also define the boundaries of broadcast domains and connect different IP subnets.

A typical setup uses both: switches build each LAN, and a router ties the LANs together and out to the Internet. Knowing which device/address/table applies is fundamental to designing and troubleshooting networks.`,
        flashcardFront: `Which statement correctly contrasts a switch and a router?`,
        options: [
          "A switch uses MAC addresses (Layer 2) within a network; a router uses IP addresses (Layer 3) between networks",
          "A switch uses IP addresses; a router uses MAC addresses",
          "Both operate at Layer 3 using routing tables",
          "A router connects devices in the same LAN; a switch connects different networks",
        ],
        answer: "A switch uses MAC addresses (Layer 2) within a network; a router uses IP addresses (Layer 3) between networks",
        flashcardBack: `**Switch** = Layer 2, **MAC** addresses, **forwarding** table, connects devices **within** one network. **Router** = Layer 3, **IP** addresses, **routing** table, connects **different** networks (and out to the Internet). Real networks use both: switches form LANs, a router links them together.`,
      },
      {
        name: "Switch Operation Modes",
        orderIndex: 4,
        prerequisites: ["Switches and MAC Addresses"],
        explanation: `Switches can begin forwarding a frame at different points, trading **latency** against **error checking**. Three modes:

- **Cut-through** — the switch starts transmitting as soon as it has read the **destination address** (the start of the frame), before the rest arrives. **Lowest latency**, but it may forward frames that turn out to be **corrupted** (it didn't wait to check).
- **Store-and-forward** — the switch waits until the **entire frame** is received, performs **error checking** (the frame's checksum/CRC), and only then forwards it. **Higher latency**, but corrupted frames are caught and dropped rather than wasting downstream bandwidth.
- **Fragment-free** — a **compromise**: it reads the first **64 bytes** (where most collision-related errors occur) and, if those are okay, begins transmitting. Lower latency than store-and-forward, more safety than pure cut-through.

The trade-off is the theme: act sooner (cut-through) for speed but risk passing on bad frames; wait longer (store-and-forward) for reliability at the cost of delay; or split the difference (fragment-free). The right mode depends on whether the network values minimum delay or maximum integrity.`,
        flashcardFront: `Which switch mode waits for the **entire frame** and checks it for errors before forwarding?`,
        options: ["Store-and-forward", "Cut-through", "Fragment-free", "Full-duplex"],
        answer: "Store-and-forward",
        flashcardBack: `**Store-and-forward** receives the whole frame, runs **error checking**, then forwards — higher latency but catches corrupt frames. **Cut-through** forwards as soon as it reads the destination address (fastest, but may pass errors). **Fragment-free** checks the first 64 bytes as a compromise. (Full-duplex is a link property, not a forwarding mode.)`,
      },
      {
        name: "VLANs and 802.1Q Tagging",
        orderIndex: 5,
        prerequisites: ["Switch vs Router"],
        explanation: `A **VLAN (Virtual LAN)** lets a single physical switch (or set of switches) be divided into **multiple logical networks (subnets) in software**. Instead of needing separate switches for separate networks, you assign each switch **port** to a VLAN, and devices on different VLANs behave as if they were on separate LANs — even when plugged into the same switch.

To make VLANs span **multiple switches**, frames travelling between switches must carry their VLAN identity. This is done with the **IEEE 802.1Q tag**: a **4-byte** tag inserted into the Ethernet frame header that includes a **12-bit VLAN ID** (allowing up to **4096** VLANs). A switch **adds** the tag when sending a frame onto a shared inter-switch link and the receiving switch reads it to know which VLAN the frame belongs to.

✅ **Why VLANs are useful:**
- **Logical grouping** — group users by function/department regardless of physical location; people can move offices and keep their network/VLAN by reconfiguring the switch.
- **Limited broadcast** — broadcasts (like ARP) stay within their VLAN, reducing traffic and improving security compared to one big flat network.
- **Efficient and flexible** — faster, cheaper and easier to reconfigure than adding physical routers/switches.

VLANs are how organisations carve a building's switches into many tidy, isolated networks.`,
        flashcardFront: `How do switches mark which VLAN an Ethernet frame belongs to when it crosses between switches?`,
        options: [
          "By inserting an 802.1Q VLAN tag (with a 12-bit VLAN ID) into the frame",
          "By changing the destination IP address",
          "By using a separate physical cable per VLAN",
          "By encrypting the frame",
        ],
        answer: "By inserting an 802.1Q VLAN tag (with a 12-bit VLAN ID) into the frame",
        flashcardBack: `Switches insert an **IEEE 802.1Q tag** (4 bytes, **12-bit VLAN ID** → up to 4096 VLANs) into the frame so the receiving switch knows its VLAN. This is *frame tagging*. VLANs give logical grouping and **limited broadcast domains** on shared switches — no separate cables or IP changes needed.`,
      },
      {
        name: "Trunk and Access Ports",
        orderIndex: 6,
        prerequisites: ["VLANs and 802.1Q Tagging"],
        explanation: `VLAN switch ports come in two roles:

- An **access port** connects to an **end device** (a PC, printer) and carries traffic for **exactly one VLAN**. Frames on an access port are **untagged** — the device is unaware of VLANs; the switch knows the port's VLAN and tags/untags on its behalf.
- A **trunk port** connects **switch-to-switch** (or switch-to-router) and carries traffic for **many VLANs** at once. Frames on a trunk are **tagged** with their 802.1Q VLAN ID so the other end can tell them apart.

A worked example of inter-VLAN traffic: when a device in VLAN 10 sends to a device in VLAN 30, its switch receives the frame on an **access** port (VLAN 10), tags it VLAN 10, and sends it over a **trunk** to the router. The router routes it to VLAN 30, the trunk carries it back tagged VLAN 30, and the destination switch **removes the tag** at the **access** port before delivering to the device. (Because VLANs are separate subnets, a **router** is needed to move traffic *between* VLANs.)

Trunks also relate to a Layer-2 hazard: loops between switches can cause broadcast storms, which is why protocols exist to detect and break Layer-2 loops. Understanding access vs trunk is essential to designing multi-switch VLANs.`,
        flashcardFront: `Which switch port carries traffic for **only a single VLAN** and connects to an end device?`,
        options: ["Access port", "Trunk port", "Router port", "Both access and trunk ports"],
        answer: "Access port",
        flashcardBack: `An **access port** connects an end device and carries **one VLAN** (frames untagged — the device is VLAN-unaware). A **trunk port** connects switches/routers and carries **many VLANs**, tagged with 802.1Q so they stay separated. Moving traffic *between* VLANs requires a **router**, since each VLAN is its own subnet.`,
      },
    ],
  },

  // ── WEEK 8 — Network Addressing ─────────────────────────────────────────────
  {
    index: 8,
    title: "Network Addressing & Routing",
    cheatSheet: `## Network Addressing & Routing

**Two address types working together**
| | MAC address | IP address |
|---|---|---|
| Layer | 2 (Data Link) | 3 (Network) |
| Scope | **local link** (one hop) | **end-to-end** (whole journey) |
| Set by | NIC manufacturer | network config |
| Changes en route? | 🔑 **yes, every hop** | 🔑 **no, stays the same** |

**Ethernet frame** (key visible fields)
\`\`\`
| dest MAC (6) | src MAC (6) | type (2) | data (46–1500) | CRC (4) |
\`\`\`
- Type \`0x0800\` = IPv4, \`0x86DD\` = IPv6, \`0x0806\` = ARP.

**The hop-by-hop story** (client → routers → server)
- The **IP** source/destination stay the **same** the whole way (the real endpoints).
- The **MAC** source/destination change at **each hop** — they identify only the two ends of the *current* link (e.g. this PC → first router, then router → next router).

**ARP (Address Resolution Protocol)** — finds the **MAC** for a known **IP** on the local link ("Who has 10.0.0.1? Tell me your MAC"). Needed because frames need a MAC to be delivered on the LAN.

**Router / routing** — forwards packets between networks toward the destination IP using a **routing table** (next hop per destination network).`,
    concepts: [
      {
        name: "MAC vs IP Addresses",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Networking uses **two** kinds of address together, at different layers and with different scopes:

- A **MAC address** is a **Layer 2** (Data Link) address, fixed in the NIC by the manufacturer. Its scope is **local**: it identifies an interface on a single **link/LAN**.
- An **IP address** is a **Layer 3** (Network) address, assigned by network configuration. Its scope is **end-to-end**: it identifies a host across the whole internetwork.

The analogy: the **IP address is like the final postal address** of the recipient — it stays the same for the entire journey and represents the true source and destination. The **MAC address is like "hand this to the next person in the chain"** — it only concerns the immediate handoff on the current link.

This division of labour is essential. IP lets routers figure out the overall path across many networks; MAC lets each individual link actually deliver the frame to the correct next device. Neither alone is enough: IP can't be used to deliver a frame on the physical LAN, and MAC can't route across the Internet. The interplay between them — especially how each behaves as a packet crosses routers — is the key idea of this week.`,
        flashcardFront: `Which addressing pair correctly matches scope?`,
        options: [
          "MAC = local link (one hop); IP = end-to-end (whole journey)",
          "MAC = end-to-end; IP = local link",
          "Both MAC and IP are end-to-end",
          "Both MAC and IP are local-link only",
        ],
        answer: "MAC = local link (one hop); IP = end-to-end (whole journey)",
        flashcardBack: `**MAC** (Layer 2) is **local** — it identifies an interface on one link/hop. **IP** (Layer 3) is **end-to-end** — the true source/destination across the whole internetwork. IP is like the postal address (constant); MAC is "give it to the next hop". You need both: IP to route across networks, MAC to deliver on each link.`,
      },
      {
        name: "The Ethernet Frame",
        orderIndex: 2,
        prerequisites: ["MAC vs IP Addresses"],
        explanation: `On a LAN, data travels in **Ethernet frames**. The fields you can see in a tool like Wireshark are:

\`\`\`
| dest MAC (6 bytes) | src MAC (6 bytes) | type/length (2) | data (46–1500) | CRC (4) |
\`\`\`

- **Destination MAC** and **source MAC** — the two ends of *this link*.
- **Type/Length** field (2 bytes) — indicates what the frame's data contains. Key values: \`0x0800\` = an **IPv4** packet, \`0x86DD\` = **IPv6**, \`0x0806\` = an **ARP** message. This is how the receiver's data-link layer knows which Layer-3 protocol to hand the payload to (demultiplexing).
- **Data** — 46 to 1500 bytes (the encapsulated packet).
- **CRC (Frame Check Sequence)** — a checksum the receiver uses to detect transmission errors.

A few hardware fields exist but **aren't shown** in captures: a 7-byte **preamble** and 1-byte start-of-frame delimiter (for synchronisation). The 46–1500 byte data limit is the Ethernet **MTU** — larger payloads must be split into multiple frames.

Reading the frame is the practical skill: the MAC fields tell you the current link's endpoints, and the type field tells you what's inside — exactly the encapsulation idea from Week 6 made concrete.`,
        flashcardFront: `In an Ethernet frame, a **type** field value of \`0x0800\` indicates the data is:`,
        options: ["An IPv4 packet", "An IPv6 packet", "An ARP message", "A CRC checksum"],
        answer: "An IPv4 packet",
        flashcardBack: `\`0x0800\` = **IPv4**; \`0x86DD\` = IPv6; \`0x0806\` = ARP. The type field tells the receiver's data-link layer which Layer-3 protocol to pass the payload to. The frame also carries 6-byte **dest/src MAC** addresses and a 4-byte **CRC** for error detection; data is 46–1500 bytes (the Ethernet MTU).`,
      },
      {
        name: "How Addresses Change Across a Routed Network",
        orderIndex: 3,
        prerequisites: ["The Ethernet Frame"],
        explanation: `Here is the most important — and most tested — idea of the week. As a packet travels from a client, through several routers, to a server, the two address types behave **differently**:

🔑 **IP addresses stay the same end-to-end.** The source IP (client) and destination IP (server) remain unchanged in every packet, at every point along the path. They represent the true *endpoints* of the conversation.

🔑 **MAC addresses change at every hop.** Each link is a separate Layer-2 segment, so on each link the frame's source and destination MAC identify only the **two ends of that particular link**.
- On the first link: source MAC = client, destination MAC = **first router**.
- On the next link: source MAC = first router, destination MAC = **second router**.
- On the last link: source MAC = last router, destination MAC = **server**.

So a frame captured at different points in the network (e.g. with Wireshark) shows **the same IP source/destination throughout** but **different MAC source/destination on each segment**.

The reason: routing happens at Layer 3 using IP (the overall route), but each individual hop is a Layer-2 delivery using MAC. Every time a router forwards a packet onto the next link, it builds a **new frame** with that link's MAC addresses while leaving the IP packet inside untouched. This is the precise mechanism behind "IP for the journey, MAC for each hop".`,
        flashcardFront: `As a packet crosses several routers from client to server, what happens to the addresses?`,
        options: [
          "The IP source/destination stay the same; the MAC addresses change at every hop",
          "Both IP and MAC addresses stay the same the whole way",
          "The IP addresses change every hop; the MAC addresses stay the same",
          "Both change at every hop",
        ],
        answer: "The IP source/destination stay the same; the MAC addresses change at every hop",
        flashcardBack: `**IP** source/destination are the true endpoints — unchanged end-to-end. **MAC** addresses identify only the two ends of the *current* link, so each router rebuilds the frame with new MACs for the next hop. Capturing at different segments shows constant IPs but changing MACs — IP for the journey, MAC per hop.`,
      },
      {
        name: "ARP: Address Resolution",
        orderIndex: 4,
        prerequisites: ["How Addresses Change Across a Routed Network"],
        explanation: `There's a gap to fill: to **deliver** a frame on a LAN, a device needs the **destination MAC** address — but it usually only knows the destination **IP** (from the routing decision). The **Address Resolution Protocol (ARP)** bridges Layer 3 to Layer 2 by finding the MAC that corresponds to a known IP **on the local link**.

How it works: the sender broadcasts an ARP request — *"Who has IP 10.0.0.1? Tell me your MAC address"* — to every device on the LAN. The device that owns that IP replies with its MAC. The sender caches the result in an **ARP table** (so it needn't ask again soon) and can now build the frame with the correct destination MAC.

This is exactly why MAC addresses change each hop: at each link, the sending device (host or router) uses ARP to learn the MAC of the **next hop on that link** — the next router, or finally the server. ARP only operates within a single local network (it's broadcast-based), which is consistent with MAC addresses being link-local.

Because ARP is broadcast-based and unauthenticated, it's also a classic security weak point (ARP spoofing), which connects to later security topics. But its core role is simple and essential: turn a known IP into the MAC needed to deliver the next frame.`,
        flashcardFront: `What does **ARP (Address Resolution Protocol)** do?`,
        options: [
          "Finds the MAC address for a known IP address on the local link",
          "Finds the IP address for a known domain name",
          "Routes packets between different networks",
          "Encrypts frames before sending",
        ],
        answer: "Finds the MAC address for a known IP address on the local link",
        flashcardBack: `**ARP** maps a known **IP → MAC** on the local link by broadcasting "Who has this IP? Tell me your MAC". It's needed because frames are delivered by **MAC**, but routing gives you the next hop's **IP**. (Mapping a *domain name* → IP is **DNS**, a different protocol.) ARP is why each hop can fill in the correct next-hop MAC.`,
      },
      {
        name: "Routers and Internetworking",
        orderIndex: 5,
        prerequisites: ["MAC vs IP Addresses"],
        explanation: `A **router** connects separate networks and forwards packets between them — this is **internetworking**, and it's what makes the Internet a "network of networks". Routers operate at **Layer 3**, making decisions based on **IP addresses**.

The core data structure is the **routing table**: it maps **destination networks** to a **next hop** (and outgoing interface). When a packet arrives, the router examines the **destination IP**, looks up which entry matches, and forwards the packet toward that next hop. It repeats hop by hop until the packet reaches the destination's network, where it's finally delivered to the host.

Conceptually, three things make up routing:
- **A router** — the device performing forwarding.
- **Routing** — the process of choosing paths and forwarding packets.
- **A routing protocol** — how routers *learn* and *share* path information automatically.

Routing protocols fall into families such as **distance-vector** (routers tell neighbours their distances to destinations) and **link-state** (routers share a map of the network and each computes shortest paths). Routers also bound **broadcast domains** and join different IP subnets.

Together with switches (Layer 2) and ARP (IP→MAC), routers complete the delivery story: switches move frames within a LAN, ARP resolves next-hop MACs, and routers carry packets across network boundaries toward the destination IP.`,
        flashcardFront: `What does a router use to decide where to forward a packet?`,
        options: [
          "The destination IP address, looked up in its routing table",
          "The source MAC address",
          "The destination port number",
          "The Ethernet CRC field",
        ],
        answer: "The destination IP address, looked up in its routing table",
        flashcardBack: `A router forwards based on the **destination IP**, matched against its **routing table** (destination network → next hop/interface), repeating hop by hop. This Layer-3 process is **internetworking**. Routers *learn* paths via **routing protocols** (distance-vector or link-state) and connect different IP subnets/broadcast domains.`,
      },
    ],
  },

  // ── WEEK 9 — Network & Transport Layers ─────────────────────────────────────
  {
    index: 9,
    title: "Network & Transport Layers",
    cheatSheet: `## Network (IP) & Transport (TCP) Layers

**IPv4 address** — 32 bits, written as 4 dotted decimals (\`130.194.77.37\`). Total ≈ 2³² ≈ 4.3 billion addresses.
- Split into a **network part** + a **host part**.

**Classful → Classless**
- Old **classful** (A/B/C) wasted addresses (fixed boundaries).
- 🔑 **Classless (CIDR)** uses a **subnet mask** to set the network/host split anywhere → efficient.

**Subnet mask** — marks which bits are network (1s) vs host (0s).
- \`/24\` = \`255.255.255.0\` → 24 network bits, 8 host bits.
- Host bits = h → **2ʰ** addresses, of which **2ʰ − 2** are usable (minus network + broadcast).

**Per subnet:**
- **Network address** = host bits all **0**.
- **Broadcast address** = host bits all **1**.

**Transport layer**
| | TCP | UDP |
|---|---|---|
| Reliable? | ✅ yes (acks, retransmit) | ❌ no |
| Connection | yes (3-way handshake) | no |
| Ordering | yes (sequence numbers) | no |
| Use | web, email, files | streaming, DNS, games |

🔑 **TCP reliability:** **sequence numbers** order bytes; **ACKs** confirm receipt; missing data is **retransmitted**. Setup = **SYN, SYN-ACK, ACK** (3-way handshake); teardown uses FIN.`,
    concepts: [
      {
        name: "IPv4 Addresses",
        orderIndex: 1,
        prerequisites: [],
        explanation: `An **IP address** identifies a host on a network at Layer 3. **IPv4** addresses are **32 bits** long, conventionally written as four **dotted-decimal** numbers, one per byte: \`130.194.77.37\` (each part is 0–255).

Because there are 32 bits, the total number of possible IPv4 addresses is **2³² ≈ 4.3 billion** — which sounds huge but has effectively run out, motivating IPv6 (128-bit) and address-conservation techniques.

The essential structure: an IP address is split into a **network part** and a **host part**. The network part identifies *which network* the host is on; the host part identifies *which host* within that network. All hosts on the same network/subnet share the same network part. This split is what makes routing scalable — routers can forward based on the **network part** alone (one table entry covers many hosts) rather than tracking every individual host.

You can convert between the dotted-decimal form and binary by converting each byte: \`130 = 10000010\`, etc. Working in binary is necessary when you start dealing with subnet masks, where the network/host boundary can fall *within* a byte. IPv4 addressing is the foundation for subnetting, which determines exactly where that network/host line is drawn.`,
        flashcardFront: `How many bits is an **IPv4** address, and how is it usually written?`,
        options: [
          "32 bits, as four dotted-decimal numbers",
          "64 bits, as eight hex groups",
          "48 bits, as a MAC-style address",
          "16 bits, as a single decimal number",
        ],
        answer: "32 bits, as four dotted-decimal numbers",
        flashcardBack: `IPv4 = **32 bits** → ~**4.3 billion** (2³²) addresses, written as **four dotted decimals** (each byte 0–255), e.g. \`130.194.77.37\`. An address splits into a **network part** and a **host part**; routing uses the network part so one entry covers many hosts. (128-bit addresses are IPv6.)`,
      },
      {
        name: "Classful vs Classless Addressing",
        orderIndex: 2,
        prerequisites: ["IPv4 Addresses"],
        explanation: `How do we decide where the **network/host split** falls in an IP address? Two approaches, historically:

**Classful addressing** (the old way) fixed the boundary at byte limits using address **classes**:
- Class **A**: 8 network bits, 24 host bits (huge networks).
- Class **B**: 16/16.
- Class **C**: 24 network bits, 8 host bits (small networks).

The problem: the jumps were enormous and **wasteful**. An organisation needing 300 hosts was too big for a Class C (254 hosts) but a Class B (65,534 hosts) wasted tens of thousands of addresses. With only fixed sizes, vast numbers of addresses went unused.

**Classless addressing (CIDR)** (the modern way) removes fixed class boundaries. Instead, a **subnet mask** explicitly states how many bits are the network part — and that boundary can be placed **anywhere**, not just at byte limits. This lets address blocks be sized to actual need, dramatically reducing waste, and allows **subnetting** (splitting a block into smaller subnets) and aggregation.

🔑 The reason classless replaced classful: **efficient use of the limited IPv4 address space**. Today essentially all addressing is classless, written with a mask or "slash" notation (next concept).`,
        flashcardFront: `Why did **classless (CIDR)** addressing replace **classful** addressing?`,
        options: [
          "Classful's fixed class sizes wasted addresses; classless lets the network/host boundary fall anywhere",
          "Classless uses 64-bit addresses",
          "Classful was insecure and unencrypted",
          "Classless removed the need for subnet masks",
        ],
        answer: "Classful's fixed class sizes wasted addresses; classless lets the network/host boundary fall anywhere",
        flashcardBack: `**Classful** (A/B/C) fixed the network/host split at byte boundaries, so block sizes jumped from 254 to 65k hosts — hugely **wasteful**. **Classless (CIDR)** uses a **subnet mask** to put the boundary **anywhere**, sizing blocks to need and conserving the scarce IPv4 space. Classless *relies on* subnet masks, it doesn't remove them.`,
      },
      {
        name: "Subnets and Subnet Masks",
        orderIndex: 3,
        prerequisites: ["Classful vs Classless Addressing"],
        explanation: `A **subnet mask** specifies which bits of an IP address are the **network** part and which are the **host** part. In binary, the mask is a run of **1s** (network) followed by **0s** (host). It can be written in dotted-decimal (\`255.255.255.0\`) or **slash/CIDR** notation (\`/24\` = 24 leading 1-bits).

Examples of the same idea:
- \`/24\` = \`255.255.255.0\` → 24 network bits, **8 host bits**.
- \`/26\` = \`255.255.255.192\` → 26 network bits, **6 host bits**.
- The hex mask \`0xfffffe00\` = \`/23\` → 23 network bits, **9 host bits**.

To find the network part of an address, perform a bitwise **AND** of the address with the mask — the host bits get zeroed out, leaving the network address.

The number of **host bits** determines how many addresses the subnet holds: **2ʰ** total. Subnetting lets you take one address block and divide it into several smaller networks by **borrowing host bits** to extend the network part — giving each subnet its own range. This is the practical heart of classless addressing: by choosing the mask, you choose how many subnets you get and how many hosts each can hold, trading the two off against each other.`,
        flashcardFront: `In a \`/24\` subnet (mask \`255.255.255.0\`), how many bits are the **host** part?`,
        options: ["8", "24", "32", "0"],
        answer: "8",
        flashcardBack: `A \`/24\` has **24 network bits**, leaving **32 − 24 = 8 host bits**. The mask in binary is twenty-four 1s then eight 0s (\`255.255.255.0\`). Host bits set the subnet size: **2⁸ = 256** addresses here. AND-ing an address with the mask gives its network address.`,
      },
      {
        name: "Network and Broadcast Addresses",
        orderIndex: 4,
        prerequisites: ["Subnets and Subnet Masks"],
        explanation: `Within any subnet, two addresses are **reserved** and cannot be assigned to a host:

- The **network address** — all **host bits 0**. It names the subnet itself (used in routing tables).
- The **broadcast address** — all **host bits 1**. A packet sent here goes to **every host** on the subnet.

That leaves the addresses *between* them for actual hosts. So with **h host bits**:
- Total addresses in the subnet = **2ʰ**.
- **Usable host addresses = 2ʰ − 2** (subtracting network + broadcast).

Worked example for \`192.168.1.0/24\` (8 host bits):
- Network address: \`192.168.1.0\` (host bits all 0).
- Broadcast address: \`192.168.1.255\` (host bits all 1).
- Usable hosts: \`2⁸ − 2 = 254\` (\`.1\` through \`.254\`).

For a \`/26\` (6 host bits): \`2⁶ − 2 = 62\` usable hosts per subnet.

This "minus 2" is a classic exam point and a real constraint: when you design a subnet you must ensure \`2ʰ − 2\` is at least the number of hosts you need. Together, the mask, network address, broadcast address and usable count fully describe a subnet — the core arithmetic of IP network design.`,
        flashcardFront: `A subnet has 8 host bits. How many **usable host** addresses does it provide?`,
        options: ["254 (2⁸ − 2)", "256 (2⁸)", "8", "255"],
        answer: "254 (2⁸ − 2)",
        flashcardBack: `Total addresses = **2⁸ = 256**, but two are reserved: the **network address** (host bits all 0) and the **broadcast address** (host bits all 1). So **usable = 2⁸ − 2 = 254**. Always subtract 2 — and check \`2ʰ − 2\` covers the hosts you need when sizing a subnet.`,
      },
      {
        name: "TCP: Reliable Communication",
        orderIndex: 5,
        prerequisites: [],
        explanation: `The **Transport layer** provides communication between **processes** (via port numbers). Its flagship protocol, **TCP (Transmission Control Protocol)**, adds **reliability** on top of the unreliable, best-effort IP layer below it.

TCP guarantees that data arrives **complete, in order, and error-checked**, using three mechanisms:
- **Sequence numbers** — every byte is numbered, so the receiver can **reorder** segments that arrive out of order and detect gaps.
- **Acknowledgements (ACKs)** — the receiver tells the sender which bytes it has received. The **acknowledgement number** indicates the next byte expected.
- **Retransmission** — if data isn't acknowledged in time (lost or corrupted), the sender **sends it again**.

TCP is **connection-oriented**: before data flows, the two ends establish a connection with the **three-way handshake** — **SYN** (client requests), **SYN-ACK** (server agrees), **ACK** (client confirms). The connection is later closed gracefully using **FIN** segments.

You can watch all of this in Wireshark: the SYN/SYN-ACK/ACK at the start, sequence and acknowledgement numbers climbing as data transfers (Wireshark shows *relative* numbers for readability), large files split across many **segments** that TCP reassembles in order, and the FIN exchange at the end. TCP's reliability is what lets web pages, emails and file transfers arrive intact.`,
        flashcardFront: `How does TCP establish a connection before sending data?`,
        options: [
          "A three-way handshake: SYN, SYN-ACK, ACK",
          "By broadcasting an ARP request",
          "It doesn't — TCP is connectionless",
          "By sending a single FIN segment",
        ],
        answer: "A three-way handshake: SYN, SYN-ACK, ACK",
        flashcardBack: `TCP is **connection-oriented**: it opens with the **three-way handshake** — **SYN** → **SYN-ACK** → **ACK** — then transfers data reliably using **sequence numbers** (ordering), **ACKs** (confirmation) and **retransmission** (recover loss), and closes with **FIN**. This reliability is layered on top of best-effort IP.`,
      },
      {
        name: "TCP vs UDP",
        orderIndex: 6,
        prerequisites: ["TCP: Reliable Communication"],
        explanation: `The transport layer offers two main protocols, and choosing between them is a classic trade-off of **reliability vs speed/overhead**:

| | **TCP** | **UDP** |
|---|---|---|
| Connection | connection-oriented (handshake) | connectionless |
| Reliability | reliable (ACKs, retransmission) | unreliable (best-effort) |
| Ordering | yes (sequence numbers) | no |
| Overhead | higher (state, acks) | low |
| Typical use | web, email, file transfer | streaming, DNS, gaming, VoIP |

**TCP** is the right choice when **every byte must arrive correctly and in order** — loading a web page, downloading a file, sending an email. The cost is the overhead of connection setup, acknowledgements and retransmission, which can add latency.

**UDP (User Datagram Protocol)** is a thin layer over IP: it just adds **ports** (so data reaches the right process) and a checksum, with **no** connection, ordering or retransmission. This makes it **fast and lightweight**, suited to applications where speed matters more than perfection and occasional loss is acceptable — live video/audio, online games, and **DNS** queries (small, quick, easily retried).

Both use **port numbers** to demultiplex data to the correct application. The decision is essentially: do you need guaranteed delivery (TCP) or minimal latency/overhead (UDP)?`,
        flashcardFront: `Which is the best reason to choose **UDP** over TCP for a live video stream?`,
        options: [
          "Low overhead and speed matter more than recovering every lost packet",
          "It guarantees every packet arrives in order",
          "It performs a three-way handshake for reliability",
          "It encrypts the video automatically",
        ],
        answer: "Low overhead and speed matter more than recovering every lost packet",
        flashcardBack: `**UDP** is **fast and lightweight** (no handshake, acks, ordering or retransmission), so it suits real-time media/games/DNS where **low latency** beats perfect delivery and a dropped packet is tolerable. **TCP** is the opposite — reliable and ordered, but with more overhead — best when every byte must arrive (web, email, files).`,
      },
    ],
  },

  // ── WEEK 10 — Application Layer ──────────────────────────────────────────────
  {
    index: 10,
    title: "The Application Layer",
    cheatSheet: `## The Application Layer

The top layer — software that delivers **business value** to users. Runs over the transport layer using **port numbers**.

**Architectures:** host-based, client-based, and (most common) **client–server**.

**World Wide Web** — built on two technologies:
- **HTTP** — protocol between browser (client) and web server.
- **HTML** — the format describing web pages.

**HTTP request–response cycle**
\`\`\`
client → GET /page.html HTTP/1.1      (request: method + headers)
server → HTTP/1.1 200 OK ... <html>…  (response: status + headers + body)
\`\`\`
- **Methods:** GET (retrieve), HEAD (headers only), POST (send data), PUT/DELETE…
- **Status codes:** 200 OK, 404 Not Found, etc.
- 🔑 HTTP is **stateless** — server doesn't remember past requests on its own.

**DNS** — resolves a **domain name** → **IP address** (\`www.site.com\` → \`10.1.1.5\`). Usually over **UDP port 53**.

**Email**
| Protocol | Job | Port |
|---|---|---|
| **SMTP** | **send** mail (between servers / client→server) | 25 |
| **POP** | download mail to one device | 110 |
| **IMAP** | sync mail across devices (kept on server) | 143 |

**Ports** identify the service: HTTP 80, HTTPS 443, SMTP 25, DNS 53.
**TLS/SSL** — encryption between transport and application layers → **HTTPS**.`,
    concepts: [
      {
        name: "The Application Layer and Client–Server",
        orderIndex: 1,
        prerequisites: [],
        explanation: `The **Application layer** is the top of the stack — the software that lets a user do something **useful**: browse the web, send email, stream video. Unlike the lower layers (which just move bits and packets), the application layer is where the **business value** lives. Application protocols (HTTP, DNS, SMTP) run on top of the transport layer, using **port numbers** to reach the right process.

Networked applications are organised into **architectures**:
- **Host-based** — almost everything runs on one central machine; terminals just display.
- **Client-based** — most processing on the client.
- **Client–server** — the most common: a **client** (e.g. a browser) requests services from a **server** (e.g. a web server) that provides them. Work is shared, and one server handles many clients.

In the client–server model, the client **initiates** requests and the server **responds**. This pattern underlies the Web, email, and most Internet services. The server is typically always-on with a known address; clients connect as needed.

This week works through the major application protocols — HTTP/Web, DNS, and email — and how they sit on top of the transport layer and its port numbers, completing the journey from raw bits all the way up to user-facing services.`,
        flashcardFront: `In the **client–server** model, who initiates the communication?`,
        options: [
          "The client requests; the server responds",
          "The server requests; the client responds",
          "Both send requests simultaneously with no roles",
          "Neither — they only broadcast",
        ],
        answer: "The client requests; the server responds",
        flashcardBack: `In **client–server**, the **client initiates** a request and the **server responds**; one always-on server serves many clients. It's the dominant application architecture (Web, email, etc.). Application protocols (HTTP, DNS, SMTP) run over the transport layer using **port numbers** to reach the right process.`,
      },
      {
        name: "HTTP and the Request–Response Cycle",
        orderIndex: 2,
        prerequisites: ["The Application Layer and Client–Server"],
        explanation: `The **World Wide Web** rests on two technologies: **HTTP** (HyperText Transfer Protocol), the protocol browsers and servers use to communicate, and **HTML** (HyperText Markup Language), the format that describes web pages.

The Web works as a **request–response cycle**:
\`\`\`
client → GET /~guidot/test.html HTTP/1.1     ← request line
         Host: www.example.com               ← request headers

server → HTTP/1.1 200 OK                      ← status line
         Content-Type: text/html             ← response headers
                                              ← (blank line)
         <html>…</html>                       ← response body
\`\`\`

The client sends a **request** (a method + URL + headers); the server returns a **response** (a status line, headers, and the body — e.g. the HTML). A typical page load triggers **several** request–response cycles: one for the HTML, then more for each embedded resource (images, stylesheets) referenced within it — each fetched with its own GET.

The **status line** reports the outcome via a **status code**: \`200 OK\` (success), \`404 Not Found\`, \`301 Moved\`, \`500\` (server error), etc. Knowing the cycle explains what really happens when you type a URL: a sequence of HTTP requests and responses over TCP, assembling the page from its parts.`,
        flashcardFront: `The two core technologies the World Wide Web is built on are:`,
        options: [
          "HTTP (the protocol) and HTML (the page format)",
          "TCP and UDP",
          "SMTP and POP",
          "DNS and ARP",
        ],
        answer: "HTTP (the protocol) and HTML (the page format)",
        flashcardBack: `The Web = **HTTP** (the request–response protocol between browser and server) + **HTML** (the markup format describing pages). A page load is a **request–response cycle**: GET the HTML, then more GETs for each embedded image/resource. The server's **status code** (200, 404…) reports each outcome.`,
      },
      {
        name: "HTTP Methods and Statelessness",
        orderIndex: 3,
        prerequisites: ["HTTP and the Request–Response Cycle"],
        explanation: `Each HTTP request uses a **method** stating what the client wants to do:
- **GET** — retrieve the resource at a URL (the most common).
- **HEAD** — retrieve only the **headers** (e.g. to check if something changed, without the body).
- **POST** — **send data** in the request body to the server (submit a form, add an item to a cart, post a forum message).
- Less common: **PUT** (upload/replace), **DELETE** (remove), **OPTIONS**.

A defining property of HTTP is that it is **stateless**: the server treats each request **independently** and does **not** inherently remember anything about previous requests from the same client. Each request must carry whatever context the server needs.

🔑 Statelessness keeps servers simple and scalable (no per-client memory to maintain), but it means features like staying logged in or a shopping cart need an *extra* mechanism layered on top — typically **cookies**, tokens, or sessions — to re-supply identity/context with each request.

So when you stay logged in across pages, it's not HTTP "remembering" you; it's your browser re-sending a cookie on every request. Understanding methods (what action) and statelessness (no built-in memory) explains both how the Web requests things and why session management exists.`,
        flashcardFront: `HTTP is described as a **stateless** protocol because:`,
        options: [
          "The server does not inherently remember previous requests from a client",
          "It cannot transfer any data",
          "It always keeps a permanent connection open",
          "It encrypts every request",
        ],
        answer: "The server does not inherently remember previous requests from a client",
        flashcardBack: `**Stateless** = each request is handled **independently**; the server keeps no built-in memory of past requests. This makes servers simple and scalable, but means "staying logged in"/carts need an add-on like **cookies/sessions** to re-supply context each time. Methods say *what* to do: **GET** (retrieve), **POST** (send data), HEAD, PUT, DELETE.`,
      },
      {
        name: "DNS: Name Resolution",
        orderIndex: 4,
        prerequisites: ["The Application Layer and Client–Server"],
        explanation: `People remember **names** like \`www.google.com\`, but packets are routed using **IP addresses**. The **Domain Name System (DNS)** is the application-layer service that **resolves a domain name to an IP address** — the Internet's phone book.

When you visit a site, before any web request can be sent, your computer asks DNS: *"What is the IP address for \`www.argos.edu\`?"* DNS replies with the address (say \`10.1.1.5\`), and only then can the browser open a TCP connection to that IP and send its HTTP request. This is why a typical web access involves **two** services back-to-back: a DNS lookup, then the actual HTTP exchange.

DNS is a **distributed, hierarchical** system: no single server knows every name. Resolvers query a hierarchy (root → top-level domain like \`.edu\` → the domain's own server), and results are **cached** to speed up repeat lookups. Organisations often run a local DNS server that resolves their own domain and **forwards** other queries upstream (e.g. to their ISP).

DNS queries typically use **UDP on port 53** — small, fast, and easily retried, which is exactly the UDP use case. Distinguish DNS clearly from ARP: **DNS** maps *name → IP* (across the Internet), while **ARP** maps *IP → MAC* (on the local link).`,
        flashcardFront: `What does **DNS** do?`,
        options: [
          "Resolves a domain name to an IP address",
          "Resolves an IP address to a MAC address",
          "Encrypts web traffic",
          "Routes packets between networks",
        ],
        answer: "Resolves a domain name to an IP address",
        flashcardBack: `**DNS** maps a human-friendly **domain name → IP address** (the Internet's phone book), usually over **UDP port 53**. A web visit does a DNS lookup *first*, then the HTTP request to the returned IP. Don't confuse it with **ARP** (IP → MAC, local link only). DNS is distributed, hierarchical and cached.`,
      },
      {
        name: "Email: SMTP, POP and IMAP",
        orderIndex: 5,
        prerequisites: ["The Application Layer and Client–Server"],
        explanation: `Email uses **different protocols for sending and for retrieving** mail — a common point of confusion.

- **SMTP (Simple Mail Transfer Protocol)** — used to **send/push** mail: from a client to its mail server, and **between mail servers** as a message travels toward the recipient's server. SMTP is a text-based protocol (port **25**); you can even hand-type an SMTP conversation (\`HELO\`, \`MAIL FROM\`, \`RCPT TO\`, \`DATA\`).
- **POP (Post Office Protocol)** — used by a client to **download** received mail from its server, typically removing it from the server. Simple, single-device (port **110**).
- **IMAP (Internet Message Access Protocol)** — also retrieves mail, but **keeps messages on the server** and **synchronises** across devices, so the same mailbox looks consistent on your phone and laptop (port **143**).

The mental model: an email address \`user@domain\` separates the *user* from the *destination server*. SMTP carries the message **toward** the recipient's domain server; POP or IMAP lets the recipient **collect** it from that server.

🔑 Memory hook: **S**MTP = **S**end (push), while **POP/IMAP = pull** (retrieve). IMAP differs from POP by keeping mail server-side and syncing multiple devices. (Spam — unsolicited bulk email — and protections like DKIM, PGP and S/MIME build on this email foundation.)`,
        flashcardFront: `Which email protocol is used to **send** mail (client→server and between mail servers)?`,
        options: ["SMTP", "POP", "IMAP", "HTTP"],
        answer: "SMTP",
        flashcardBack: `**SMTP** = **Send** Mail (push) — client→server and server→server, port 25. **POP** and **IMAP** *retrieve* (pull) mail: POP downloads to one device; **IMAP** keeps mail on the server and **syncs** across devices. Hook: **S**MTP = **S**end; POP/IMAP = receive.`,
      },
      {
        name: "Ports and TLS/HTTPS",
        orderIndex: 6,
        prerequisites: ["HTTP and the Request–Response Cycle"],
        explanation: `Two ideas tie the application layer to security and the transport layer below.

**Port numbers** identify *which service/process* traffic is for, so one host can run many services. Servers listen on **well-known ports**: **HTTP 80**, **HTTPS 443**, **SMTP 25**, **DNS 53**, **POP 110**, **IMAP 143**. When a client connects, the **destination port** tells the server which application should handle the request, and the client uses a temporary (ephemeral) source port for the reply. This is the transport-layer **demultiplexing** from Week 9 in action — and capturing traffic in Wireshark shows exactly which ports DNS, web and email use.

**TLS (Transport Layer Security)**, formerly SSL, adds **encryption** to protect communications. It sits **between the transport layer (TCP) and the application layer (e.g. HTTP)**, securing the data without the application needing to handle cryptography itself. TLS provides **confidentiality** (encryption), **integrity**, and **authentication** (via digital certificates), using techniques like key exchange and symmetric encryption.

When HTTP runs over TLS, you get **HTTPS** — the \`https://\` and padlock in your browser, served on **port 443**. This is why a login page should be HTTPS: without TLS, the HTTP request (including passwords) would travel in the clear. Ports route traffic to the right service; TLS protects that traffic in transit, bridging into the security topics that follow.`,
        flashcardFront: `Where does **TLS** sit, and what does it give you when combined with HTTP?`,
        options: [
          "Between the transport and application layers; combined with HTTP it gives HTTPS",
          "Below the physical layer; it gives faster cabling",
          "Inside the IP header; it gives bigger addresses",
          "At the data-link layer; it gives MAC encryption only",
        ],
        answer: "Between the transport and application layers; combined with HTTP it gives HTTPS",
        flashcardBack: `**TLS** (formerly SSL) sits **between TCP and the application protocol**, adding encryption, integrity and authentication (via certificates) without the app handling crypto. HTTP over TLS = **HTTPS** (\`https://\`, padlock, **port 443**). **Ports** (HTTP 80, HTTPS 443, SMTP 25, DNS 53) identify the service for transport-layer demultiplexing.`,
      },
    ],
  },

  // ── WEEK 11 — Network Security I: Firewalls & VPNs ──────────────────────────
  {
    index: 11,
    title: "Firewalls & VPNs",
    cheatSheet: `## Network Security I — Firewalls & VPNs

**Security goals (CIA):** Confidentiality · Integrity · Availability.
**Threats:** unauthorised access, eavesdropping, malware, denial of service…

**Firewall** — inspects packets passing through and **allows or blocks** them by rule (source/dest IP, port, protocol).
- Default-deny is safest: **block everything, then allow only what's needed**.
- iptables **chains**: \`INPUT\` (to the firewall), \`OUTPUT\` (from it), \`FORWARD\` (routed through it).
\`\`\`
iptables -A FORWARD -i eth2 -o eth1 -d 10.1.1.71 -p tcp --dport 80 -j ACCEPT
\`\`\`

**DMZ (Demilitarized Zone)** — a separate network for **public-facing servers** (web, mail, DNS).
- 🔑 If a DMZ server is hacked, the **internal** network is still protected by the firewall.
- Typical "three-legged" firewall: **Internal · DMZ · Internet**.

**Stateful inspection** — firewall tracks connections; allows return traffic only if it's part of an **ESTABLISHED/RELATED** connection a local client started.

**VPN (Virtual Private Network)** — a secure, **encrypted tunnel** over a public network (the Internet).
- Packets are **encapsulated + encrypted**, sent through the tunnel, then decrypted at the other end.
- A virtual interface (e.g. \`tun0\`) appears on each end.
- Types: **Intranet** (link an org's LANs), **Extranet** (link to partners), **Access** (remote employees).
- ✅ low cost, flexible; ⚠️ overhead, no performance guarantee. *(Not the same as a VLAN!)*`,
    concepts: [
      {
        name: "Network Threats and Security Goals",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Connecting to a network exposes a system to **threats**, so security aims to protect three properties — the **CIA triad**:

- **Confidentiality** — keep data secret from unauthorised parties (e.g. nobody should read your password in transit).
- **Integrity** — keep data accurate and unaltered (nobody should tamper with a message undetected).
- **Availability** — keep the system and data usable when needed (no being knocked offline).

Common network threats map onto these:
- **Unauthorised access** — attackers gaining entry to systems or data (breaks confidentiality/integrity).
- **Eavesdropping/sniffing** — capturing traffic in transit (breaks confidentiality) — recall how easily Wireshark reads unencrypted packets.
- **Malware** — malicious software compromising hosts.
- **Denial of Service (DoS)** — flooding a service to make it unavailable (breaks availability).

Defences are layered ("defence in depth"): **firewalls** filter traffic at network boundaries, **VPNs** protect data crossing untrusted networks, and **cryptography** secures the data itself (next week). No single mechanism is enough — each addresses different threats. This week focuses on **firewalls** (controlling *what traffic is allowed*) and **VPNs** (securely *crossing public networks*).`,
        flashcardFront: `A **Denial of Service (DoS)** attack primarily threatens which security goal?`,
        options: ["Availability", "Confidentiality", "Integrity", "Portability"],
        answer: "Availability",
        flashcardBack: `A **DoS** floods a service so legitimate users can't reach it — it attacks **Availability** (the A in CIA). **Confidentiality** is threatened by eavesdropping/unauthorised access; **Integrity** by tampering. Defences are layered: firewalls (filter traffic), VPNs (protect data in transit), cryptography (protect the data itself).`,
      },
      {
        name: "Firewalls and Packet Filtering",
        orderIndex: 2,
        prerequisites: ["Network Threats and Security Goals"],
        explanation: `A **firewall** controls traffic between networks by **inspecting packets** that pass through it and **allowing or blocking** each one according to a set of **rules**. Rules typically match on source/destination **IP address**, **port number**, and **protocol** (TCP/UDP). A firewall is often placed on a **gateway router** at the boundary between an organisation and the Internet.

The safest design philosophy is **default-deny**: start by **blocking all traffic**, then **explicitly allow** only the specific services that are needed. This is far more secure than default-allow, where you'd have to anticipate and block every bad thing.

On Linux, the classic tool is **iptables**, which organises rules into **chains** for different traffic paths:
- **INPUT** — packets destined **to** the firewall itself.
- **OUTPUT** — packets generated **by** the firewall.
- **FORWARD** — packets being **routed through** the firewall (the common case for a gateway).

A rule example to allow inbound web traffic to a server:
\`\`\`
iptables -A FORWARD -i eth2 -o eth1 -d 10.1.1.71 -p tcp --dport 80 -j ACCEPT
\`\`\`
This appends to FORWARD: packets arriving on eth2, leaving on eth1, to that server, TCP port 80 → ACCEPT. Note that allowing a *request* in often also requires a matching rule to let the *response* back out — traffic is two-way.`,
        flashcardFront: `What is the safest default policy for a firewall?`,
        options: [
          "Block all traffic, then explicitly allow only what is needed (default-deny)",
          "Allow all traffic, then block known bad traffic",
          "Allow all outbound and all inbound traffic",
          "Disable the firewall during business hours",
        ],
        answer: "Block all traffic, then explicitly allow only what is needed (default-deny)",
        flashcardBack: `**Default-deny**: block everything, then allow only the specific services required — far safer than trying to enumerate every threat in a default-allow setup. Firewalls filter by **IP/port/protocol**; iptables uses **INPUT** (to firewall), **OUTPUT** (from it) and **FORWARD** (routed through). Remember responses need their own allow rule too.`,
      },
      {
        name: "The DMZ",
        orderIndex: 3,
        prerequisites: ["Firewalls and Packet Filtering"],
        explanation: `Organisations need to run servers that the **public Internet must reach** — web, mail, DNS servers. But exposing them creates risk: if such a server is compromised, an attacker could use it as a foothold to attack the rest of the network.

The solution is a **DMZ (Demilitarized Zone)**: a **separate network segment** that holds the public-facing servers, isolated from the **internal** (private) network. A common design is the **three-legged firewall**, where a single firewall has three interfaces:
- **Internet** (untrusted, outside),
- **DMZ** (public servers),
- **Internal** (trusted, private intranet).

The firewall enforces rules among all three. Crucially, it protects the **internal network from both the Internet *and* the DMZ**.

🔑 The payoff: if a DMZ server **is** breached, the attacker is still **trapped in the DMZ** — the firewall blocks them from pivoting into the sensitive internal network. The DMZ acts as a buffer zone, accepting the higher exposure that public services require while containing the blast radius of a compromise.

Typical rule patterns: allow the Internet to reach DMZ services (e.g. web on port 80), allow internal users to reach the DMZ and the Internet, but **deny** the DMZ from initiating connections into the internal network. The DMZ is a foundational network-security design pattern.`,
        flashcardFront: `Why are public-facing servers placed in a **DMZ** rather than on the internal network?`,
        options: [
          "If a DMZ server is compromised, the firewall still protects the internal network",
          "The DMZ makes servers run faster",
          "Servers in the DMZ don't need IP addresses",
          "It removes the need for a firewall",
        ],
        answer: "If a DMZ server is compromised, the firewall still protects the internal network",
        flashcardBack: `A **DMZ** isolates public servers (web/mail/DNS) on their own segment, so a breach is **contained** — the firewall stops an attacker from pivoting into the **internal** network. The classic **three-legged firewall** separates **Internet · DMZ · Internal**, and the DMZ is normally barred from initiating connections inward.`,
      },
      {
        name: "Stateful Inspection",
        orderIndex: 4,
        prerequisites: ["Firewalls and Packet Filtering"],
        explanation: `A simple (stateless) firewall judges each packet **in isolation**. That's awkward for normal two-way traffic: if an internal user opens a web page, you want the **response** to come back in — but you don't want to leave a permanent "allow inbound" hole, because that same hole would let attackers in too.

**Stateful inspection** solves this by having the firewall **track active connections** in a state table. It remembers that an internal client *initiated* a connection, and then allows **only the return traffic that belongs to that connection** — without a broad inbound rule.

In iptables terms, this uses connection states:
- **NEW** — a packet starting a new connection.
- **ESTABLISHED** — part of an existing, already-approved connection.
- **RELATED** — associated with an existing connection.

The classic rule: *allow any traffic from the internal network out, but only allow inbound traffic that is **ESTABLISHED** or **RELATED***. This means outsiders can't start connections inward, yet responses to internally-initiated requests flow back freely.

🔑 Stateful inspection gives you the security of default-deny inbound **plus** the convenience of working return traffic — by understanding connections, not just individual packets. It's the standard behaviour of modern firewalls.`,
        flashcardFront: `**Stateful inspection** lets a firewall allow inbound traffic only when it is:`,
        options: [
          "Part of an ESTABLISHED/RELATED connection a local client already started",
          "Sent to port 80",
          "From any IP address with no restriction",
          "Encrypted with TLS",
        ],
        answer: "Part of an ESTABLISHED/RELATED connection a local client already started",
        flashcardBack: `A **stateful** firewall tracks connections, so it permits inbound packets that are **ESTABLISHED/RELATED** (responses to an internally-started connection) while still blocking unsolicited **NEW** inbound attempts. This gives working return traffic without opening a permanent inbound hole — judging *connections*, not lone packets.`,
      },
      {
        name: "VPNs (Virtual Private Networks)",
        orderIndex: 5,
        prerequisites: ["Network Threats and Security Goals"],
        explanation: `A **VPN (Virtual Private Network)** creates a **secure, encrypted connection over a public network** (the Internet) — a private "tunnel" for your data across infrastructure you don't control.

How it works: VPN software simulates a **virtual network interface** (e.g. \`tun0\`). Outgoing packets are **encapsulated** (wrapped in new packets) and **encrypted**, then sent across the Internet to the VPN gateway at the other end, which **decrypts** and **decapsulates** them and forwards them into its local network. To the two ends, it's as if they share a private link, even though the traffic crosses the public Internet. Anyone capturing packets in between sees only **encrypted** data.

Using the Internet as the underlying network makes VPNs **cheap, widely available and flexible** — versus leasing dedicated private lines.

**Types of VPN:**
- **Intranet VPN** — connect an organisation's own LANs (e.g. branch offices) securely.
- **Extranet VPN** — connect different organisations (e.g. a company and its partners/customers).
- **Access VPN** — let remote **employees** reach the company intranet from anywhere (Monash offers one).

✅ Advantages: low cost, easy setup, secure, flexible (endpoints can move). ⚠️ Disadvantages: **overhead** from encryption/encapsulation, **no performance guarantees** (it runs over the public Internet), and many incompatible standards.

⚠️ A VPN has **nothing to do with a VLAN** — different concepts despite the similar name.`,
        flashcardFront: `What does a **VPN** fundamentally provide?`,
        options: [
          "A secure, encrypted tunnel for private data across a public network",
          "A way to split one switch into multiple subnets",
          "Faster Internet by removing encryption",
          "A replacement for IP addresses",
        ],
        answer: "A secure, encrypted tunnel for private data across a public network",
        flashcardBack: `A **VPN** **encapsulates + encrypts** traffic into a **tunnel** across the public Internet, so two ends communicate privately (eavesdroppers see only ciphertext). Types: **Intranet**, **Extranet**, **Access**. Cheap/flexible but adds **overhead** with no performance guarantee. Note: **a VPN is not a VLAN** (splitting a switch into subnets) — unrelated despite the name.`,
      },
    ],
  },

  // ── WEEK 12 — Cryptography & Network Security II ─────────────────────────────
  {
    index: 12,
    title: "Cryptography & Security",
    cheatSheet: `## Cryptography & Network Security

Goal: turn **plaintext** ↔ **ciphertext** so only intended parties can read/verify it.

**Symmetric-key cryptography**
- 🔑 **One shared secret key** encrypts **and** decrypts (e.g. AES).
- ✅ fast; ⚠️ challenge = **securely sharing the key** (key distribution).

**Asymmetric / public-key cryptography**
- Each party has a **key pair**: a **public key** (shared) + a **private key** (secret). (e.g. RSA)
- Based on one-way mathematical functions; keep the **private** key private.

**Two uses of a key pair (mirror images):**
| Goal | Encrypt with | Decrypt with |
|---|---|---|
| 🔒 **Confidentiality** | recipient's **public** key | recipient's **private** key |
| ✍️ **Authentication / signature** | sender's **private** key | sender's **public** key |

**Digital signature** — sign with your **private** key; anyone verifies with your **public** key.
- Proves **authenticity** (it's really from you) + **integrity** (unchanged).
- Change one character → signature **fails** verification.

**In practice (TLS/HTTPS):** use slow **public-key** crypto to safely exchange a **symmetric** session key, then use fast **symmetric** crypto for the bulk data — best of both. Certificates bind a public key to an identity.`,
    concepts: [
      {
        name: "Symmetric-Key Cryptography",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**Cryptography** transforms readable **plaintext** into scrambled **ciphertext** so only intended parties can recover it. The first major approach is **symmetric-key** cryptography.

In a symmetric scheme, **the same secret key is used for both encryption and decryption** — the key is *identical* at both ends (e.g. the **AES** algorithm, "aes-128-cbc"). Two parties who share the secret key can exchange confidential messages: the sender encrypts with the key, the receiver decrypts with the same key. Anyone without the key sees only ciphertext.

✅ Symmetric encryption is **fast and efficient**, well-suited to encrypting large amounts of data.

⚠️ Its central weakness is **key distribution**: both parties must **share the same secret key in a secure way** *before* they can communicate securely — but how do you send the key safely over an insecure network without it being intercepted? If an eavesdropper gets the key, all confidentiality is lost. This "chicken-and-egg" problem (you need a secure channel to set up the secure channel) is the key challenge symmetric crypto can't solve on its own — and is precisely what **public-key cryptography** addresses.`,
        flashcardFront: `In **symmetric-key** cryptography, how many keys are used and how?`,
        options: [
          "One shared secret key for both encryption and decryption",
          "A public key to encrypt and a private key to decrypt",
          "No keys — the data is hashed",
          "A different key for every byte",
        ],
        answer: "One shared secret key for both encryption and decryption",
        flashcardBack: `Symmetric crypto uses **one shared secret key** for both encrypt and decrypt (e.g. AES). It's **fast**, but its big challenge is **key distribution** — securely getting that shared key to both parties beforehand. Solving that securely is what **public-key** cryptography enables.`,
      },
      {
        name: "Asymmetric (Public-Key) Cryptography",
        orderIndex: 2,
        prerequisites: ["Symmetric-Key Cryptography"],
        explanation: `**Asymmetric** (or **public-key**) cryptography uses a **pair of keys** instead of one shared secret:
- a **public key**, which can be freely shared with anyone, and
- a **private key**, kept secret by the owner.

The keys are mathematically linked (generated together, based on **one-way functions** — easy to compute one way, infeasible to reverse), so that what one key encrypts, only the **other** key of the pair can decrypt. (RSA is the classic algorithm.) Critically, knowing the public key does **not** let you derive the private key, so the public key can be distributed openly.

This elegantly solves symmetric crypto's **key-distribution** problem: there's no shared secret to transmit. To send someone a confidential message, you encrypt it with **their public key** (which is public, so no secret exchange needed); only they can decrypt it, using their matching **private key**.

The cost is speed: public-key operations are **much slower** than symmetric ones, so they're not ideal for bulk data. The standard real-world pattern (used in TLS/HTTPS) is **hybrid**: use public-key crypto to securely agree on a symmetric **session key**, then switch to fast symmetric encryption for the actual data — combining the strengths of both.`,
        flashcardFront: `In public-key cryptography, what is true of the **public** key?`,
        options: [
          "It can be shared openly; the matching private key cannot be derived from it",
          "It must be kept secret like the private key",
          "It is the same as the private key",
          "It is used to sign messages on the owner's behalf",
        ],
        answer: "It can be shared openly; the matching private key cannot be derived from it",
        flashcardBack: `A **public key** is meant to be **shared openly** — and crucially you **can't derive the private key from it** (the math is one-way). This removes the shared-secret exchange that symmetric crypto needs. The trade-off is speed, so real systems use **hybrid** crypto: public-key to exchange a symmetric session key, then fast symmetric encryption.`,
      },
      {
        name: "Confidentiality vs Authentication",
        orderIndex: 3,
        prerequisites: ["Asymmetric (Public-Key) Cryptography"],
        explanation: `A key pair can be used in **two mirror-image ways**, depending on the goal — and confusing them is a classic mistake.

**For confidentiality (secrecy)** — *"only the recipient can read it"*:
- Encrypt with the **recipient's public key**.
- Only the recipient's **private key** can decrypt it.
- Anyone can encrypt a message *to* you (your public key is public), but only **you** can read it.

**For authentication (proof of sender)** — *"this really came from me, unchanged"*:
- The sender encrypts (signs) with **their own private key**.
- Anyone can verify with the sender's **public key**.
- Since only the sender holds their private key, a successful verification proves it came from them.

🔑 The rule of thumb:
- **Confidentiality → use the *recipient's* key pair** (encrypt with their public, they decrypt with their private).
- **Authentication → use the *sender's* key pair** (sign with sender's private, verify with sender's public).

The two are independent and can be combined (sign *then* encrypt) to get both secrecy *and* proof of origin. Understanding which key (public/private) and **whose** key (sender/recipient) to use for each goal is the heart of applying public-key cryptography correctly — and underpins digital signatures and TLS.`,
        flashcardFront: `To send a **confidential** message that only Alice can read, you encrypt it with:`,
        options: [
          "Alice's public key",
          "Alice's private key",
          "Your own private key",
          "A shared password only you know",
        ],
        answer: "Alice's public key",
        flashcardBack: `**Confidentiality → recipient's key pair:** encrypt with **Alice's public** key so only **Alice's private** key can decrypt it. (Signing for **authentication** is the mirror image — encrypt/sign with the *sender's private* key, verify with the *sender's public* key.) Match the goal to *whose* key and *which* key.`,
      },
      {
        name: "Digital Signatures",
        orderIndex: 4,
        prerequisites: ["Confidentiality vs Authentication"],
        explanation: `A **digital signature** uses public-key cryptography to prove a message's **authenticity** (it really came from the claimed sender) and **integrity** (it hasn't been altered) — the authentication use of a key pair.

How it works:
1. **Signing** — the **sender** uses their **private key** to produce a signature for the message (in practice, a signature over a *hash* of the message). Only the sender, who alone holds the private key, can create this.
2. **Verification** — anyone can take the message, the signature, and the **sender's public key**, and check that they match. If verification succeeds, two things are guaranteed: the message came from the holder of that private key (**authenticity**), and it hasn't changed since signing (**integrity**).

🔑 The tamper-evidence is the crucial property: if **even one character** of the message is changed after signing, verification **fails**. So a valid signature certifies the *exact* message.

Note the contrast with encryption-for-secrecy: a signature does **not** hide the message (it's still readable) — it *vouches* for it. Digital signatures are everywhere: software updates signed by vendors, signed emails (S/MIME, PGP), and the **certificates** that authenticate websites in TLS — letting your browser trust that it's really talking to the genuine site.`,
        flashcardFront: `If a single character of a digitally signed message is changed after signing, what happens at verification?`,
        options: [
          "Verification fails, revealing the message was altered",
          "Verification still succeeds",
          "The message is automatically corrected",
          "The signature decrypts the message",
        ],
        answer: "Verification fails, revealing the message was altered",
        flashcardBack: `A digital signature is **tamper-evident**: any change to the message makes verification **fail**, proving the message wasn't the one signed (**integrity**). A valid signature also proves it came from the holder of the **private key** (**authenticity**) — verified with the sender's **public key**. It vouches for the message; it doesn't hide it.`,
      },
      {
        name: "Putting It Together: TLS",
        orderIndex: 5,
        prerequisites: ["Asymmetric (Public-Key) Cryptography", "Digital Signatures"],
        explanation: `**TLS (Transport Layer Security)** — the protocol behind **HTTPS** — combines everything from this week to secure real Internet communication. It delivers all three security goals at once:
- **Confidentiality** (encryption),
- **Integrity** (tamper detection),
- **Authentication** (you're really talking to the genuine server).

The clever part is that it uses **both kinds of cryptography**, each where it's strongest — a **hybrid** scheme:
1. **Authentication + key setup with public-key crypto.** During the TLS **handshake**, the server presents a **digital certificate** — its public key, *signed* by a trusted Certificate Authority. The browser verifies that signature (a digital signature check) to confirm the server's identity. The two sides then use public-key techniques to **securely agree on a shared symmetric session key** — solving the key-distribution problem without ever sending the secret in the clear.
2. **Bulk encryption with symmetric crypto.** Once the session key is established, the actual data (web pages, form submissions) is encrypted with **fast symmetric** encryption using that key.

🔑 This hybrid design takes the **best of both**: public-key crypto's safe key exchange and authentication, plus symmetric crypto's speed for the data. It's why \`https://\` can be both secure *and* fast — and it ties together symmetric keys, key pairs, confidentiality, and digital signatures into one working system you use every day.`,
        flashcardFront: `Why does TLS/HTTPS use **both** public-key and symmetric cryptography?`,
        options: [
          "Public-key safely exchanges a session key and authenticates; symmetric then encrypts the bulk data quickly",
          "Public-key encrypts all data because it is faster",
          "Symmetric crypto authenticates the server's identity",
          "Using two methods is required only for email",
        ],
        answer: "Public-key safely exchanges a session key and authenticates; symmetric then encrypts the bulk data quickly",
        flashcardBack: `TLS is **hybrid**: it uses **public-key** crypto (with a signed **certificate**) to authenticate the server and safely agree a **symmetric session key**, then uses **fast symmetric** encryption for the actual data. This combines public-key's safe key exchange/authentication with symmetric's speed — giving confidentiality, integrity and authentication in \`https://\`.`,
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEED  (local: npm run seed:arch — uses dev.db; prod seeding lives in migrate-prod)
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const { PrismaClient } = await import("../lib/generated/prisma/client")
  let db: InstanceType<typeof PrismaClient>
  if (process.env.TURSO_DATABASE_URL) {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql/web")
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

  try {
    const subject = await db.subject.upsert({
      where: { slug: "architecture" },
      create: {
        name: "Computer Architecture & Networks",
        slug: "architecture",
        description: "Systems from silicon to protocol",
        category: "Systems",
        emoji: "🖥️",
        status: "published",
        order: 3,
        sessionCount: 12,
      },
      update: { status: "published", sessionCount: 12 },
    })
    console.log(`\n🖥️  Subject: ${subject.name} (${subject.id})`)

    if (process.argv.includes("--if-empty")) {
      const existingCount = await db.session.count({ where: { subjectId: subject.id } })
      if (existingCount > 0) {
        console.log(`   ${existingCount} sessions already present — skipping (--if-empty).`)
        return
      }
    }

    for (const sessionData of SESSIONS) {
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

        const card = cardFor(c)
        await db.exercise.create({
          data: {
            conceptId: created.id,
            type: "FLASHCARD",
            front: card.front,
            back: card.back,
            content: card.content,
          },
        })
      }

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

    console.log(`\n🎉 Done — ${SESSIONS.length} session(s) seeded.\n`)
  } finally {
    await db.$disconnect()
  }
}

// Only run when invoked directly (npm run seed:arch) — NOT when SESSIONS is
// imported by migrate-prod for the build-time prod seed.
if (process.argv[1]?.includes("seed-arch-static")) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
