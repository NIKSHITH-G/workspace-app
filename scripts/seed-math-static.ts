/**
 * Static seed — no API calls. Hand-authored Mathematical Foundations (MAT9004)
 * content, one session per teaching week. Mirrors seed-python-static.ts.
 * Run: npx tsx scripts/seed-math-static.ts
 *
 * Note: the Markdown renderer has no LaTeX support, so maths is written with
 * Unicode symbols (∈ ⊆ ∪ ∩ → ≤ ∞ Σ Π) and code spans, not $...$.
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
// SESSION DATA  (added batch by batch — Weeks 1–12)
// ─────────────────────────────────────────────────────────────────────────────

const SESSIONS: Session[] = [
  // ── WEEK 1 — Sets, Functions & Notation (Lectures 1–2) ────────────────────
  {
    index: 1,
    title: "Sets, Functions and Notation",
    cheatSheet: `## Sets, Functions & Notation

**Sets**
A *set* is an unordered collection of **distinct** objects. Order and repetition don't matter, so \`{1, 2, 3} = {3, 1, 1, 2}\`.
Important sets: \`∅\` (empty set), \`ℕ = {0, 1, 2, …}\` (naturals — 0 **is** included in this unit), \`ℤ\` (integers), \`ℝ\` (reals).

**Membership & operations** — for sets A, B:
- \`x ∈ A\` / \`x ∉ A\` — x is / is not an element of A
- \`A ⊆ B\` — every element of A is also in B (subset)
- \`A ∩ B\` — intersection (in A **and** B)
- \`A ∪ B\` — union (in A **or** B)
- \`A \\ B\` — set difference (in A but **not** in B)

💡 \`{1,2,3} ∩ {2,3,4} = {2,3}\`, \`{1,2,3} ∪ {2,3,4} = {1,2,3,4}\`, \`{1,2,3} \\ {2,3,4} = {1}\`.

**Set-builder notation**
\`{x ∈ S : P(x)}\` = all elements of S with property P. E.g. \`{x ∈ ℕ : x is prime} = {2,3,5,7,…}\`.

**Intervals** (reals a < b)
- \`[a, b]\` closed \`= {x ∈ ℝ : a ≤ x ≤ b}\`
- \`(a, b)\` open \`= {x ∈ ℝ : a < x < b}\`
- \`[a, b)\`, \`(a, b]\` half-open; \`[a, ∞)\`, \`(−∞, b]\` unbounded

⚠️ Square bracket = endpoint **included**; round bracket = endpoint **excluded**.

**Sigma (sum) & Pi (product) notation**
\`Σ\` from \`x=a\` to \`b\` of \`f(x)\` \`= f(a) + f(a+1) + … + f(b)\`. \`Π\` is the same with **products**.
\`\`\`
Σ (i=1 to 7) (2i − 1) = 1 + 3 + 5 + … + 13 = 49
\`\`\`
The empty sum \`= 0\`; the empty product \`= 1\`.

**Functions**
\`f : X → Y\` assigns to each \`x ∈ X\` **exactly one** \`f(x) ∈ Y\`. X = *domain*, Y = *codomain*, and the *image* is \`f(X) = {f(x) : x ∈ X}\`.
*Zeroes* (roots): the \`x\` with \`f(x) = 0\` — where the graph crosses the x-axis.

**Inverses & bijections**
- *Injective* (one-to-one): distinct inputs give distinct outputs
- *Surjective* (onto): the image is the whole codomain
- *Bijective*: both injective and surjective

\`f\` has an inverse \`f⁻¹\` **if and only if** it is bijective. To find \`f⁻¹\`, solve \`y = f(x)\` for \`x\`.
⚠️ \`f⁻¹(x) ≠ 1/f(x)\` — the inverse undoes \`f\`, it is not the reciprocal.

**Convex & concave**
*Convex*: the straight line between any two points of the graph lies **above** (or on) the graph. *Concave*: that line lies **below** (or on) it. A straight-line graph is both.`,
    concepts: [
      {
        name: "Sets and Set Operations",
        orderIndex: 1,
        prerequisites: [],
        explanation: `A **set** is an unordered collection of **distinct** objects called its *elements*. Two principles follow immediately: order does not matter and duplicates collapse, so \`{1, 2, 3}\`, \`{3, 2, 1}\` and \`{1, 1, 2, 3}\` are all the **same** set.

We write \`x ∈ A\` when x is an element of A, and \`x ∉ A\` when it is not. Four operations build new sets from old:

- **Subset** \`A ⊆ B\`: every element of A is also in B.
- **Intersection** \`A ∩ B\`: elements in A **and** B.
- **Union** \`A ∪ B\`: elements in A **or** B (or both).
- **Difference** \`A \\ B\`: elements in A but **not** in B.

Some sets appear constantly: the empty set \`∅\` (no elements), the naturals \`ℕ = {0, 1, 2, …}\` (in this unit 0 is a natural number), the integers \`ℤ\`, and the reals \`ℝ\`. These nest neatly: \`ℕ ⊆ ℤ ⊆ ℝ\`.

In data science, sets are the language for collections of items, categories, or events — and the operations above describe combining, filtering and excluding those collections.`,
        flashcardFront: `Is \`{a, b, c} = {c, a, b, b}\`? And what are \`{1,2,3} ∩ {3,4}\`, \`{1,2,3} ∪ {3,4}\`, and \`{1,2,3} \\ {3,4}\`?`,
        flashcardBack: `Yes — they are the **same set**. A set is unordered and its elements are distinct, so reordering and repeating elements changes nothing: \`{a,b,c} = {c,a,b,b}\`.

For the operations: \`{1,2,3} ∩ {3,4} = {3}\` (common elements), \`{1,2,3} ∪ {3,4} = {1,2,3,4}\` (everything from either, with 3 listed once), and \`{1,2,3} \\ {3,4} = {1,2}\` (elements of the first that are not in the second — note 4 plays no role here because difference only removes, it never adds).`,
      },
      {
        name: "Set-Builder Notation and Intervals",
        orderIndex: 2,
        prerequisites: ["Sets and Set Operations"],
        explanation: `Listing every element is impractical for large or infinite sets, so we describe a set by a **property**. **Set-builder notation** \`{x ∈ S : P(x)}\` means "all elements x of S for which the statement P(x) is true". For example \`{x ∈ ℕ : x is prime} = {2, 3, 5, 7, 11, …}\` and \`{x ∈ ℤ : −1 ≤ x ≤ 1} = {−1, 0, 1}\`.

**Intervals** are the most common sets of real numbers and have their own shorthand. For \`a < b\`:

- \`[a, b] = {x ∈ ℝ : a ≤ x ≤ b}\` — **closed**, includes both endpoints.
- \`(a, b) = {x ∈ ℝ : a < x < b}\` — **open**, excludes both endpoints.
- \`[a, b)\` and \`(a, b]\` — **half-open**, include one endpoint.
- \`[a, ∞) = {x ∈ ℝ : x ≥ a}\` and \`(−∞, b] = {x ∈ ℝ : x ≤ b}\` — unbounded.

The bracket style is the whole message: **square** means the endpoint is **in** the set, **round** means it is **out**. Note \`∞\` is not a number, so it always gets a round bracket.`,
        flashcardFront: `Write \`{x ∈ ℝ : 2 ≤ x < 5}\` as an interval. Why is the bracket different at each end?`,
        flashcardBack: `It is \`[2, 5)\`. The **square** bracket at 2 means 2 is included (the condition is \`2 ≤ x\`, so x can equal 2). The **round** bracket at 5 means 5 is excluded (the condition is \`x < 5\`, strictly less, so 5 is not in the set). The bracket style directly encodes whether the inequality at that end is "≤/≥" (closed, square) or "</>" (open, round). This is a half-open interval — common when you want "from 2 up to but not including 5".`,
      },
      {
        name: "Sigma (Sum) and Pi (Product) Notation",
        orderIndex: 3,
        prerequisites: ["Sets and Set Operations"],
        explanation: `Long sums and products are written compactly with **Sigma** (\`Σ\`) and **Pi** (\`Π\`) notation. For integers \`a ≤ b\`:

\`\`\`
Σ (x=a to b) f(x) = f(a) + f(a+1) + … + f(b)
Π (x=a to b) f(x) = f(a) · f(a+1) · … · f(b)
\`\`\`

The letter under the symbol (here \`x\`) is the **index**: it runs through every integer from the bottom value to the top value, and you add (Σ) or multiply (Π) the resulting terms. For example \`Σ (i=1 to 7) (2i − 1) = 1 + 3 + 5 + 7 + 9 + 11 + 13 = 49\`, and \`Π (i=1 to 4) i = 1·2·3·4 = 24\`.

You can also sum/multiply over the elements of a set: \`Σ_{x ∈ S} f(x)\`. Two conventions are worth memorising because they keep formulas consistent: the **empty sum is 0** and the **empty product is 1** (the "do nothing" value for each operation). This notation underpins almost everything later — averages, dot products, variance and probabilities are all sums in disguise.`,
        flashcardFront: `Expand \`Σ (x=1 to 3) ax\` and \`Π (y=4 to 5) (1/y)\`. What do an empty sum and an empty product equal?`,
        flashcardBack: `\`Σ (x=1 to 3) ax = a·1 + a·2 + a·3 = a + 2a + 3a = 6a\` — the index x takes the values 1, 2, 3 and each term is \`ax\`. (If instead the term were \`aˣ\` it would be \`a + a² + a³\`; read the expression carefully.)

\`Π (y=4 to 5) (1/y) = (1/4)·(1/5) = 1/20\`.

The **empty sum = 0** and the **empty product = 1**. These are the identity elements: adding 0 changes nothing, multiplying by 1 changes nothing, so a sum/product over no terms defaults to them and keeps formulas well-behaved.`,
      },
      {
        name: "Functions: Domain, Codomain, Image and Zeroes",
        orderIndex: 4,
        prerequisites: ["Sets and Set Operations"],
        explanation: `A **function** \`f : X → Y\` is a rule that assigns to **each** \`x ∈ X\` **exactly one** output \`f(x) ∈ Y\`. The set X is the **domain** (allowed inputs) and Y is the **codomain** (where outputs live). Both the rule *and* these sets are part of the function.

The **image** \`f(X) = {f(x) : x ∈ X}\` is the set of values actually hit — it is a subset of the codomain, and may be smaller than it. (When we write "\`f(x) = …\` with domain X" and don't name a codomain, the convention is to take the image itself as codomain.)

The **zeroes** (or *roots*) of \`f\` are the inputs where the output is zero: \`{x ∈ X : f(x) = 0}\`. Graphically these are exactly the points where the curve crosses (or touches) the x-axis. For example \`f(x) = (x − 1)(x + 2)\` has zeroes at \`x = 1\` and \`x = −2\`, and \`f(x) = x² − 1\` has zeroes at \`x = ±1\`.

Functions are the backbone of modelling in data science: we *describe data with a function* to make predictions, and *describe cost or error with a function* to optimise.`,
        flashcardFront: `What three things make up a function \`f : X → Y\`? How can the image differ from the codomain, using \`f : ℝ → ℝ\`, \`f(x) = x²\`?`,
        flashcardBack: `A function is a **domain** X, a **codomain** Y, and a **rule** that gives each \`x ∈ X\` exactly one \`f(x) ∈ Y\`. "Exactly one" is essential: an input can't map to two outputs.

For \`f(x) = x²\` with codomain ℝ, the **image** is \`[0, ∞)\` — squares are never negative — which is a *proper subset* of the codomain ℝ. So the codomain is "where outputs are allowed to live" (ℝ), while the image is "where they actually land" (the non-negative reals). They coincide only when every codomain value is hit, i.e. when the function is surjective.`,
      },
      {
        name: "Inverses, Injections, Surjections and Bijections",
        orderIndex: 5,
        prerequisites: ["Functions: Domain, Codomain, Image and Zeroes"],
        explanation: `A function \`g : Y → X\` is the **inverse** of \`f : X → Y\` if it undoes f both ways: \`g(f(x)) = x\` and \`f(g(y)) = y\` for all x, y. We write \`g = f⁻¹\`. To find it, solve \`y = f(x)\` for x — e.g. for \`f(x) = 2x + 1\`, solving gives \`f⁻¹(y) = (y − 1)/2\`.

⚠️ \`f⁻¹\` is **not** the reciprocal: \`f⁻¹(x) ≠ 1/f(x)\`.

Whether an inverse exists is governed by two properties:

- **Injective** (one-to-one): distinct inputs give distinct outputs — \`x₁ ≠ x₂ ⟹ f(x₁) ≠ f(x₂)\`. No output is "reused".
- **Surjective** (onto): every codomain element is hit — the image equals the whole codomain.
- **Bijective**: both injective and surjective.

The key theorem: **f has an inverse if and only if it is bijective.** Injectivity lets you reverse the arrow unambiguously (each output came from one input); surjectivity guarantees every \`y ∈ Y\` has something to map back to. For instance \`f(x) = x²\` on ℝ is neither (−2 and 2 share an output, and negatives are never hit), but restricted to \`f : [0, ∞) → [0, ∞)\` it becomes bijective with inverse \`√x\`.`,
        flashcardFront: `Why is \`f : ℝ → ℝ\`, \`f(x) = x²\` not invertible, but \`f : [0,∞) → [0,∞)\`, \`f(x) = x²\` is? Connect this to injective/surjective.`,
        flashcardBack: `On all of ℝ, \`x²\` fails **both** conditions. It is **not injective**: \`f(−2) = f(2) = 4\`, so two distinct inputs share an output and you couldn't decide which one \`f⁻¹(4)\` should return. It is **not surjective** onto ℝ either: negative numbers are never outputs, so there's nothing to map them back to.

Restricting to \`[0, ∞) → [0, ∞)\` fixes both. With only non-negative inputs, each output comes from exactly one input (**injective**), and every non-negative target is achieved (**surjective**) — so the function is **bijective** and has the inverse \`f⁻¹(x) = √x\`. This is exactly why "f is invertible ⟺ f is bijective": you need uniqueness of the input (injective) and existence of an input for every output (surjective).`,
      },
      {
        name: "Convex and Concave Functions",
        orderIndex: 6,
        prerequisites: ["Functions: Domain, Codomain, Image and Zeroes"],
        explanation: `Convexity describes the *shape* of a graph using a simple chord test. A function is **convex** if, for **any** two points on its graph, the straight line segment (chord) joining them lies **entirely above or on** the graph. It is **concave** if every such chord lies **entirely below or on** the graph.

Intuition: a convex function "holds water" (curves upward, like \`f(x) = x²\` or \`f(x) = 2ˣ\`), while a concave function "spills water" (curves downward, like \`f(x) = −x²\` or \`f(x) = log x\`). A **straight line is both** convex and concave, since every chord lies exactly on the graph.

This matters enormously for **optimisation**, which is the heart of much of machine learning. A convex function has a single "valley" with no false bottoms, so any local minimum is automatically the **global** minimum — making it easy and reliable to minimise. Concave functions have the same guarantee for maxima. Much of the effort in designing learning algorithms goes into setting up a convex cost function precisely so that minimisation is tractable.`,
        flashcardFront: `State the chord test for a **convex** function, and explain why convexity is so useful for optimisation.`,
        flashcardBack: `**Chord test:** a function is convex if, for any two points on its graph, the straight line between them lies **entirely above or on** the graph (concave is the mirror image — chord below the graph). Equivalently, a convex graph curves upward / "holds water".

It's prized in optimisation because a convex function has **no local minima other than the global one** — there's a single valley with no misleading dips. So a downhill search can't get stuck in a bad local minimum; wherever you stop is the true best. This is why so many machine-learning cost functions are deliberately designed to be convex: it makes finding the optimal parameters reliable and efficient. (The analogous statement holds for concave functions and maxima.)`,
      },
    ],
  },

  // ── WEEK 2 — Functions for Data & Derivatives (Lectures 3–4) ───────────────
  {
    index: 2,
    title: "Functions for Data and Derivatives",
    cheatSheet: `## Functions for Data & Derivatives

**Three model functions** (for fitting data)
- **Exponential** $f(x) = b\\,a^{x}$ with $a>0,\\ b\\neq 0$. Base $a$, initial value $f(0)=b$. Natural base $e\\approx 2.71828$.
- **Logarithmic** $f(x) = b\\log_a(x)$ — the inverse of the exponential. Domain $x>0$.
- **Power-law** $f(x) = b\\,x^{a}$.

**Log/exp rules**
$$\\log_a(xy)=\\log_a x+\\log_a y,\\quad \\log_a\\!\\tfrac{x}{y}=\\log_a x-\\log_a y,\\quad \\log_a(x^{k})=k\\log_a x$$
$$\\log_a(x)=\\frac{\\ln x}{\\ln a},\\qquad a^{x+y}=a^x a^y,\\qquad \\log_a(a^x)=x$$

**Linearising plots** (find the right model by making data a straight line)
- **log-log** — plot $(\\ln x,\\ln y)$: a **power law** becomes linear (slope $a$).
- **log-lin** (semi-log) — plot $(x,\\ln y)$: an **exponential** becomes linear (slope $\\ln a$).
- **lin-log** — plot $(\\ln x, y)$: a **logarithm** becomes linear.

💡 Estimate the slope from two points, then back out the parameters $a,b$.

**Derivatives** — the instantaneous slope/rate of change
$$f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}$$
It's the slope of the tangent line at $x$. For a line $f(x)=mx+b$, $f'(x)=m$ (constant).

**Basic rules**
$$\\frac{d}{dx}x^{n}=n\\,x^{n-1},\\quad \\frac{d}{dx}e^{x}=e^{x},\\quad \\frac{d}{dx}\\ln x=\\frac{1}{x},\\quad \\frac{d}{dx}a^{x}=a^{x}\\ln a$$
Sum/constant: $(f+g)'=f'+g'$ and $(c\\,f)'=c\\,f'$.

**Product & chain rules**
$$(fg)'=f'g+fg',\\qquad \\big(f(g(x))\\big)'=f'(g(x))\\,g'(x)$$

**Higher derivatives** — differentiate again: $f''(x)=\\dfrac{d}{dx}f'(x)$ measures how the slope itself changes (curvature). $f''>0 \\Rightarrow$ convex; $f''<0 \\Rightarrow$ concave.`,
    concepts: [
      {
        name: "Exponential Functions",
        orderIndex: 1,
        prerequisites: ["Functions: Domain, Codomain, Image and Zeroes"],
        explanation: `An **exponential function** has the form $f(x) = b\\,a^{x}$ for real constants $a > 0$ (the **base**) and $b \\neq 0$. The base sits in the *exponent's seat* — the variable $x$ is the power — which is what makes growth explosive. The constant $b$ is the **initial value**, since $f(0) = b\\,a^{0} = b$.

The most important base is **Euler's number** $e \\approx 2.71828$, giving the *natural exponential* $e^{x}$. It can be approximated by $\\left(1+\\tfrac{1}{n}\\right)^{n}$ for large $n$ and arises naturally in continuous growth and compound interest.

Three properties characterise $f(x) = b\\,a^{x}$:

- **No zeroes** — $a^{x}$ is always positive, so $f$ is either always positive ($b>0$) or always negative ($b<0$); it never crosses the x-axis.
- **Injective when $a \\neq 1$** — e.g. for $b>0$, $f : \\mathbb{R} \\to (0,\\infty)$ is a bijection (if $a=1$ then $f$ is the constant $b$, not injective).
- **Convex when $b>0$** (concave when $b<0$).

Exponentials model anything with a constant *percentage* growth or decay rate — populations, compound interest, viral spread, radioactive decay.`,
        flashcardFront: `For $f(x) = b\\,a^{x}$, what are $a$, $b$ called, and why does an exponential function have **no zeroes**? When is it injective?`,
        flashcardBack: `$a$ is the **base** and $b$ is the **initial value** (since $f(0)=b\\,a^{0}=b$).

It has **no zeroes** because $a^{x} > 0$ for every real $x$ (a positive base raised to any power stays positive). Multiplying by $b \\neq 0$ can't make it zero, so $f$ is *always positive* (if $b>0$) or *always negative* (if $b<0$) — the graph never touches the x-axis, hence $f(x)=0$ has no solution.

It is **injective whenever $a \\neq 1$**: a genuinely growing ($a>1$) or decaying ($0<a<1$) exponential gives a different output for every input. The exception is $a = 1$, where $f(x) = b$ for all $x$ — a constant, which is not injective.`,
      },
      {
        name: "Logarithmic Functions",
        orderIndex: 2,
        prerequisites: ["Exponential Functions", "Inverses, Injections, Surjections and Bijections"],
        explanation: `The **logarithm** $\\log_a(x)$ is the **inverse** of the exponential $a^{x}$: it answers "to what power must I raise $a$ to get $x$?" So $\\log_a(a^{x}) = x$ and $a^{\\log_a(x)} = x$. Because it inverts an exponential whose outputs are positive, its **domain is $x > 0$** — you cannot take the log of zero or a negative number. The natural logarithm $\\ln = \\log_e$ is the inverse of $e^{x}$.

Logs turn multiplication into addition, which is why they tame data that spans many orders of magnitude:

$$\\log_a(xy)=\\log_a x+\\log_a y,\\quad \\log_a\\!\\Big(\\tfrac{x}{y}\\Big)=\\log_a x-\\log_a y,\\quad \\log_a(x^{k})=k\\log_a x$$

The **change-of-base** formula $\\log_a(x) = \\dfrac{\\ln x}{\\ln a}$ shows all logarithms are scalar multiples of one another, so the choice of base is largely a convention. A logarithmic function grows without bound but *ever more slowly* — it is concave — making it the natural model for diminishing returns and for compressing skewed data.`,
        flashcardFront: `Why is the domain of $\\log_a(x)$ restricted to $x>0$, and what does $\\log_a(x^{k})$ simplify to? State the change-of-base formula.`,
        flashcardBack: `The domain is $x>0$ because $\\log_a$ is the **inverse of $a^{x}$**, and an exponential only ever outputs **positive** values. Logs "undo" exponentials, so their inputs are exactly the exponential's outputs — the positive reals. There is no power you can raise $a$ to that yields $0$ or a negative number, so $\\log_a(0)$ and $\\log_a(\\text{negative})$ are undefined.

$\\log_a(x^{k}) = k\\log_a x$ — exponents come down as multipliers (this is what linearises power laws on a log-log plot).

Change of base: $\\log_a(x) = \\dfrac{\\ln x}{\\ln a}$, so every logarithm is just a constant multiple of $\\ln$ — the base only rescales.`,
      },
      {
        name: "Power-Law Functions",
        orderIndex: 3,
        prerequisites: ["Exponential Functions"],
        explanation: `A **power-law function** has the form $f(x) = b\\,x^{a}$ — here the variable $x$ is in the **base** and the constant $a$ is the fixed exponent. This is the structural opposite of an exponential ($b\\,a^{x}$), where the variable is in the exponent, and the distinction matters: exponentials eventually dwarf any power law.

Power laws describe **scale-free** relationships, where multiplying the input by a factor multiplies the output by a fixed factor regardless of starting point. They appear everywhere in real data: the distribution of city sizes, word frequencies (Zipf's law), wealth, and the number of links pointing to web pages — typically a few items are enormous and a long tail are tiny.

The exponent $a$ controls the shape: $a>1$ grows faster than linear, $0<a<1$ grows but flattens (concave), and $a<0$ decays. The signature you'll exploit next: a power law becomes a **straight line on a log-log plot**, because $\\ln f(x) = \\ln b + a\\ln x$ — a line in $\\ln x$ with slope exactly $a$.`,
        flashcardFront: `What's the structural difference between a power law $b\\,x^{a}$ and an exponential $b\\,a^{x}$? Why does $\\ln f(x)=\\ln b + a\\ln x$ for a power law?`,
        flashcardBack: `In a **power law** $b\\,x^{a}$ the *variable is the base* and the exponent is a fixed constant $a$. In an **exponential** $b\\,a^{x}$ the *variable is the exponent* and the base is fixed. Consequence: exponentials grow by a constant **factor** per unit step and ultimately outpace any power law.

Taking logs of $f(x)=b\\,x^{a}$: $\\ln f(x) = \\ln(b\\,x^{a}) = \\ln b + \\ln(x^{a}) = \\ln b + a\\ln x$, using $\\log(xy)=\\log x+\\log y$ and $\\log(x^{k})=k\\log x$. So plotting $\\ln f$ against $\\ln x$ gives a straight line with **slope $a$** and intercept $\\ln b$ — the basis of the log-log test.`,
      },
      {
        name: "Choosing a Model: Log-Log and Semi-Log Plots",
        orderIndex: 4,
        prerequisites: ["Logarithmic Functions", "Power-Law Functions"],
        explanation: `Given raw data, how do you tell whether it follows an exponential, a power law, or a logarithm? The trick is to **re-plot on logarithmic axes** so that the *correct* model becomes a **straight line** — and straight lines are easy to recognise and fit.

- **log-log** — plot $(\\ln x_i, \\ln y_i)$. A **power law** $y = b\\,x^{a}$ becomes linear with slope $a$ (since $\\ln y = \\ln b + a\\ln x$).
- **log-lin (semi-log)** — plot $(x_i, \\ln y_i)$. An **exponential** $y = b\\,a^{x}$ becomes linear with slope $\\ln a$ (since $\\ln y = \\ln b + (\\ln a)\\,x$).
- **lin-log** — plot $(\\ln x_i, y_i)$. A **logarithm** $y = b\\log_a x$ becomes linear.

Once a plot looks straight, estimate its **slope from two points** and read off the model's parameters. For example, fitting links-per-website data with a log-log line gave slope $\\approx -2.1$, yielding the power law $f(x) \\approx 4.3\\times10^{8}\\,x^{-2.1}$.

⚠️ This two-point linear fit is *primitive* — it uses only two data points and the fit can be poor outside their range (an exponential model of website counts over-predicted badly). That weakness is exactly what derivatives and optimisation fix: instead of guessing two points, we'll minimise the total error across **all** the data.`,
        flashcardFront: `You plot $(\\ln x, \\ln y)$ and the data falls on a straight line of slope 3. Which model fits, and what is its exponent? What would a straight **semi-log** ($x,\\ln y$) plot indicate instead?`,
        flashcardBack: `A straight line on a **log-log** plot means a **power law** $y = b\\,x^{a}$, and the slope *is* the exponent — so here $a = 3$, giving $y = b\\,x^{3}$. (The intercept gives $\\ln b$.) This works because $\\ln y = \\ln b + a\\ln x$ is linear in $\\ln x$.

A straight line on a **semi-log / log-lin** plot $(x, \\ln y)$ instead indicates an **exponential** $y = b\\,a^{x}$, because $\\ln y = \\ln b + (\\ln a)x$ is linear in $x$ — there the slope equals $\\ln a$, not $a$. The rule of thumb: *log-log ⇒ power law, semi-log ⇒ exponential.*`,
      },
      {
        name: "Derivatives: Slope and Basic Rules",
        orderIndex: 5,
        prerequisites: ["Convex and Concave Functions"],
        explanation: `For a straight line $f(x)=mx+b$, the slope $m = \\dfrac{f(x_2)-f(x_1)}{x_2-x_1}$ is the same everywhere. The **derivative** generalises "slope" to *curved* functions by measuring the slope **at a single point** — the slope of the **tangent line** there. We define it as a limit of slopes of shrinking secant lines:

$$f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}$$

$f'(x)$ is the **instantaneous rate of change** of $f$ at $x$. For a line $f(x)=mx+b$ it returns the constant $f'(x)=m$, as expected.

Rather than computing this limit every time, we use **rules** for the common building blocks:

$$\\frac{d}{dx}x^{n}=n\\,x^{n-1},\\qquad \\frac{d}{dx}e^{x}=e^{x},\\qquad \\frac{d}{dx}\\ln x=\\frac{1}{x},\\qquad \\frac{d}{dx}a^{x}=a^{x}\\ln a$$

together with linearity: $(f+g)' = f' + g'$ and $(c\\,f)' = c\\,f'$. So $\\frac{d}{dx}(3x^{4}-2x) = 12x^{3}-2$. The derivative is the key to **optimisation**: where $f'(x)=0$ the tangent is flat, marking candidate maxima and minima — which is how we'll minimise error when fitting models to data.`,
        flashcardFront: `Define $f'(x)$ as a limit and say what it represents geometrically. Differentiate $f(x)=3x^{4}-2x+e^{x}$.`,
        flashcardBack: `$$f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}$$
Geometrically it is the **slope of the tangent line** to the graph at $x$ — the instantaneous rate of change — obtained as the limit of secant-line slopes $\\frac{f(x+h)-f(x)}{h}$ as the two points merge ($h\\to 0$).

Using the power rule $\\frac{d}{dx}x^n=nx^{n-1}$, $\\frac{d}{dx}e^x=e^x$, and linearity:
$$f'(x)=3\\cdot 4x^{3}-2\\cdot 1+e^{x}=12x^{3}-2+e^{x}.$$
Each term is differentiated separately (sum rule) and constant multiples are kept ($(cf)'=cf'$).`,
      },
      {
        name: "Product Rule, Chain Rule and Higher Derivatives",
        orderIndex: 6,
        prerequisites: ["Derivatives: Slope and Basic Rules"],
        explanation: `The basic rules only handle sums and constant multiples. **Products** and **compositions** need their own rules.

**Product rule** — for a product of two functions:
$$(fg)'=f'g+fg'$$
e.g. $\\frac{d}{dx}\\big(x^{2}e^{x}\\big) = 2x\\,e^{x}+x^{2}e^{x} = (2x+x^{2})e^{x}$. ⚠️ The derivative of a product is **not** $f'g'$.

**Chain rule** — for a composition (a "function of a function"):
$$\\big(f(g(x))\\big)'=f'(g(x))\\,g'(x)$$
Differentiate the outer function (leaving the inside alone), then multiply by the derivative of the inside. e.g. $\\frac{d}{dx}\\,e^{3x^{2}} = e^{3x^{2}}\\cdot 6x$, and $\\frac{d}{dx}\\ln(5x) = \\frac{1}{5x}\\cdot 5 = \\frac{1}{x}$.

**Higher derivatives** — differentiate the derivative again. The **second derivative** $f''(x)=\\frac{d}{dx}f'(x)$ is the rate of change of the slope, i.e. **curvature**: $f''>0$ means the slope is increasing (the graph is *convex*), $f''<0$ means *concave*. This links derivatives back to convexity and is central to deciding whether a flat point ($f'=0$) is a minimum or a maximum.`,
        flashcardFront: `Differentiate $h(x)=x^{2}e^{x}$ (product rule) and $k(x)=e^{3x^{2}}$ (chain rule). What does the sign of $f''(x)$ tell you?`,
        flashcardBack: `**Product rule** $(fg)'=f'g+fg'$ on $h(x)=x^{2}e^{x}$: with $f=x^2$ ($f'=2x$) and $g=e^x$ ($g'=e^x$),
$$h'(x)=2x\\,e^{x}+x^{2}e^{x}=(2x+x^{2})e^{x}.$$

**Chain rule** $\\big(f(g(x))\\big)'=f'(g(x))g'(x)$ on $k(x)=e^{3x^{2}}$: outer $e^{u}$ stays $e^{u}$, inner $g(x)=3x^2$ has $g'(x)=6x$, so
$$k'(x)=e^{3x^{2}}\\cdot 6x.$$

The **second derivative's sign** gives curvature: $f''(x)>0 \\Rightarrow$ convex (slope increasing, "holds water"), $f''(x)<0 \\Rightarrow$ concave. At a point where $f'(x)=0$, this is exactly what tells you whether it's a **minimum** ($f''>0$) or a **maximum** ($f''<0$).`,
      },
    ],
  },

  // ── WEEK 3 — Optimisation (Lectures 5–6) ──────────────────────────────────
  {
    index: 3,
    title: "Optimisation with Derivatives",
    cheatSheet: `## Optimisation with Derivatives

**Stationary (critical) points**
A point where the tangent is flat: $f'(x)=0$. These are the *candidates* for maxima and minima.

**First-derivative test** — check the sign of $f'$ around the point:
- $f'$ goes $+\\to-$ : local **maximum**
- $f'$ goes $-\\to+$ : local **minimum**
- no sign change: neither (a saddle/inflection)

**Second-derivative test** — at a stationary point $x_0$ (where $f'(x_0)=0$):
$$f''(x_0)>0 \\Rightarrow \\text{minimum},\\qquad f''(x_0)<0 \\Rightarrow \\text{maximum}$$
($f''(x_0)=0$ is inconclusive.) Convex ⇒ any minimum is **global**.

**Global extrema on $[a,b]$** — compare $f$ at every stationary point **and** the endpoints $a,b$; the largest/smallest wins.

**Recipe for word problems**
1. Write the quantity to optimise as a function of one variable.
2. Use any constraint to eliminate extra variables.
3. Differentiate, set $f'=0$, solve.
4. Classify, and check the domain's endpoints.

**Least squares (fitting a line to data)**
For data $(x_i,y_i)$ and model $\\hat y_i = mx_i+c$, the **residual sum of squares** is
$$\\text{RSS}(m,c)=\\sum_{i=1}^{n}\\big(y_i-(mx_i+c)\\big)^{2}.$$
The "best fit" minimises RSS — found by setting its derivatives to zero. This is exactly the optimisation that underlies linear regression.`,
    concepts: [
      {
        name: "Stationary Points and the First-Derivative Test",
        orderIndex: 1,
        prerequisites: [],
        explanation: `To optimise a function — find where it is largest or smallest — we look for **stationary points** (also *critical points*): values of $x$ where $f'(x)=0$. Geometrically the tangent is **horizontal** there, which is exactly what happens at the top of a hill or the bottom of a valley. So solving $f'(x)=0$ gives the *candidates* for maxima and minima.

A flat tangent alone doesn't say *which* kind of point it is — it could be a peak, a trough, or a flat spot (inflection). The **first-derivative test** decides by examining the sign of $f'$ on either side:

- if $f'$ changes from **$+$ to $-$**, the function rises then falls — a local **maximum**;
- if $f'$ changes from **$-$ to $+$**, it falls then rises — a local **minimum**;
- if $f'$ keeps the same sign, it's neither.

For example $f(x)=x^{3}-3x$ has $f'(x)=3x^{2}-3=0$ at $x=\\pm 1$; the sign of $f'$ shows $x=-1$ is a local max and $x=1$ a local min.`,
        flashcardFront: `What is a stationary point, and how does the first-derivative test classify $x=-1$ and $x=1$ for $f(x)=x^{3}-3x$?`,
        flashcardBack: `A **stationary point** is an $x$ with $f'(x)=0$ — the tangent is horizontal, marking a candidate maximum/minimum.

For $f(x)=x^{3}-3x$: $f'(x)=3x^{2}-3=3(x-1)(x+1)$, zero at $x=\\pm 1$. Check signs of $f'$:
- around $x=-1$: $f'>0$ for $x<-1$ and $f'<0$ for $-1<x<1$, so $f'$ goes $+\\to-$ — a **local maximum**.
- around $x=1$: $f'<0$ then $f'>0$, i.e. $-\\to+$ — a **local minimum**.

The flat tangent only flags candidates; the *sign change* of $f'$ is what tells you which is which.`,
      },
      {
        name: "The Second-Derivative Test",
        orderIndex: 2,
        prerequisites: ["Stationary Points and the First-Derivative Test"],
        explanation: `The **second-derivative test** classifies a stationary point using curvature instead of checking signs on both sides. If $f'(x_0)=0$, then:

$$f''(x_0)>0 \\Rightarrow \\text{local minimum},\\qquad f''(x_0)<0 \\Rightarrow \\text{local maximum}.$$

The reasoning is the convexity link from Week 2: $f''>0$ means the graph is **convex** (curving upward) near $x_0$, so a flat point there sits at the bottom of a bowl — a minimum. $f''<0$ means **concave**, so the flat point is the top of a dome — a maximum. If $f''(x_0)=0$ the test is **inconclusive** (the point could be a min, max, or inflection) and you fall back to the first-derivative test.

This connects to *global* optimisation: if a function is convex **everywhere** ($f''\\ge 0$ throughout), then any local minimum is automatically the **global** minimum — there are no other valleys to worry about. That guarantee is why convex cost functions are so prized in machine learning.`,
        flashcardFront: `State the second-derivative test. Classify the stationary point of $f(x)=x^{2}-4x+1$.`,
        flashcardBack: `At a stationary point $x_0$ (where $f'(x_0)=0$): $f''(x_0)>0 \\Rightarrow$ **minimum**, $f''(x_0)<0 \\Rightarrow$ **maximum**, and $f''(x_0)=0$ is **inconclusive**. Intuition: $f''>0$ is convex (bottom of a bowl), $f''<0$ is concave (top of a dome).

For $f(x)=x^{2}-4x+1$: $f'(x)=2x-4=0$ gives $x=2$. Then $f''(x)=2>0$ everywhere, so $x=2$ is a **minimum**. Since $f''>0$ for all $x$ the function is convex, so this is in fact the **global** minimum, with value $f(2)=-3$.`,
      },
      {
        name: "Solving Optimisation Word Problems",
        orderIndex: 3,
        prerequisites: ["The Second-Derivative Test"],
        explanation: `Real optimisation problems arrive as words, not formulas. The workflow is always the same:

1. **Identify the quantity to optimise** and write it as a function.
2. **Reduce to one variable** using any constraint in the problem.
3. **Differentiate, set $f'=0$, and solve** for the stationary points.
4. **Classify** them (second-derivative test) and **check the endpoints** of the allowed domain.

Classic example: a farmer has $100$ m of fencing for a rectangular pen against a wall (so only three sides are fenced). Maximise the area. Let the two ends be $x$ and the side be $y$; the constraint is $2x+y=100$, so $y=100-2x$. Area $A(x)=x(100-2x)=100x-2x^{2}$. Then $A'(x)=100-4x=0$ gives $x=25$, and $A''(x)=-4<0$ confirms a **maximum**. So $y=50$ and the largest area is $1250\\ \\text{m}^{2}$.

⚠️ Always re-check the endpoints of the feasible range — the optimum can sit at a boundary rather than at a stationary point.`,
        flashcardFront: `Outline the steps to solve an optimisation word problem. Why must you also check the endpoints of the domain?`,
        flashcardBack: `Steps: (1) write the target quantity as a function; (2) use the constraint to express it in **one** variable; (3) differentiate, set $f'(x)=0$, solve for stationary points; (4) classify them and evaluate the function, **including at the domain's endpoints**.

You must check the endpoints because a continuous function on a closed interval attains its extreme values either at a stationary point **or at a boundary**. The largest/smallest value can occur where the variable is pushed to its limit (e.g. a length that can't exceed a given amount), even though $f'\\neq 0$ there. Skipping the endpoints risks reporting a local optimum while the true global one sits at the edge of the feasible region.`,
      },
      {
        name: "Least Squares and the Residual Sum of Squares",
        orderIndex: 4,
        prerequisites: ["The Second-Derivative Test"],
        explanation: `Week 2's "fit a line through two points" was crude. **Least squares** instead uses *all* the data. Given points $(x_1,y_1),\\dots,(x_n,y_n)$ and a line $\\hat y = mx+c$, the **residual** of point $i$ is the vertical gap $y_i-(mx_i+c)$ between the data and the line. The **residual sum of squares** adds up the squared gaps:

$$\\text{RSS}(m,c)=\\sum_{i=1}^{n}\\big(y_i-(mx_i+c)\\big)^{2}.$$

We square so that positive and negative errors don't cancel and so that large errors are penalised heavily. The **line of best fit** is the choice of $m$ and $c$ that **minimises** RSS — a genuine optimisation problem, now in two variables. Minimising means setting the derivatives of RSS with respect to $m$ and $c$ to zero and solving the resulting (linear) equations.

This is exactly **linear regression**, one of the most-used tools in data science — and it ties the whole week together: a real modelling task reduced to minimising a function. Because RSS is a convex function of $(m,c)$, the stationary point it produces is the *global* best fit.`,
        flashcardFront: `Define the residual sum of squares for fitting $\\hat y=mx+c$ to data $(x_i,y_i)$. Why square the residuals, and how is the best-fit line found?`,
        flashcardBack: `$$\\text{RSS}(m,c)=\\sum_{i=1}^{n}\\big(y_i-(mx_i+c)\\big)^{2},$$
the total of the squared vertical distances between each data point and the line.

We **square** the residuals for two reasons: it prevents positive and negative errors from cancelling out (so the total reflects real misfit), and it penalises large errors disproportionately, pushing the fit to avoid big misses.

The **best-fit line** minimises RSS. Treating RSS as a function of $m$ and $c$, we set its partial derivatives to zero ($\\partial\\text{RSS}/\\partial m = 0$, $\\partial\\text{RSS}/\\partial c = 0$) and solve. Since RSS is convex, that stationary point is the global minimum — this is **linear regression / ordinary least squares**.`,
      },
    ],
  },

  // ── WEEK 4 — Integration & Vectors/Matrices (Lectures 7–8) ────────────────
  {
    index: 4,
    title: "Integration and Introduction to Vectors and Matrices",
    cheatSheet: `## Integration & Vectors/Matrices

**Antiderivative (indefinite integral)**
$F$ is an antiderivative of $f$ if $F'(x)=f(x)$. We write $\\int f(x)\\,dx = F(x)+C$ (the $+C$ because constants differentiate to $0$).
$$\\int x^{n}\\,dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\neq -1),\\quad \\int e^{x}dx=e^{x}+C,\\quad \\int \\tfrac{1}{x}\\,dx=\\ln|x|+C$$

**Definite integral** — net signed area under $f$ from $a$ to $b$:
$$\\int_a^b f(x)\\,dx = F(b)-F(a)\\quad(\\text{Fundamental Theorem of Calculus}).$$
It gives the **total change**: $\\int_a^b f'(x)\\,dx = f(b)-f(a)$. Linear: $\\int(\\alpha f+\\beta g)=\\alpha\\int f+\\beta\\int g$.

**Vectors in $\\mathbb{R}^{d}$** — ordered lists $\\mathbf{v}=(v_1,\\dots,v_d)$.
- Addition / scalar multiple: componentwise, $\\mathbf{u}+\\mathbf{v}=(u_1+v_1,\\dots)$, $c\\mathbf{v}=(cv_1,\\dots)$.
- **Length** $\\|\\mathbf{v}\\|=\\sqrt{v_1^2+\\dots+v_d^2}$.

**Dot product**
$$\\mathbf{u}\\cdot\\mathbf{v}=\\sum_{i=1}^{d}u_i v_i = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta.$$
$\\mathbf{u}\\cdot\\mathbf{v}=0 \\iff$ the vectors are **perpendicular**.

**Matrices** — rectangular arrays ($m\\times n$). Add and scalar-multiply **entrywise** (same shape required).`,
    concepts: [
      {
        name: "Antiderivatives and Indefinite Integrals",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Differentiation has a reverse: **antidifferentiation**. $F$ is an **antiderivative** of $f$ if $F'(x)=f(x)$ — it is a function whose slope is $f$. The collection of all antiderivatives is the **indefinite integral**, written $\\int f(x)\\,dx = F(x)+C$.

The constant $C$ is essential: since the derivative of any constant is $0$, functions differing by a constant share the same derivative, so $f$ has infinitely many antiderivatives, all of the form $F(x)+C$.

Reversing the differentiation rules gives the basic integrals:

$$\\int x^{n}\\,dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\neq -1),\\qquad \\int e^{x}\\,dx=e^{x}+C,\\qquad \\int \\frac{1}{x}\\,dx=\\ln|x|+C.$$

(The case $n=-1$ is special — its antiderivative is $\\ln|x|$, not a power.) Integration is **linear**: $\\int(\\alpha f+\\beta g)\\,dx=\\alpha\\int f\\,dx+\\beta\\int g\\,dx$, so you integrate term by term.`,
        flashcardFront: `What does it mean for $F$ to be an antiderivative of $f$, and why does $\\int f(x)\\,dx$ include "$+C$"? Compute $\\int (x^{3}+\\tfrac{1}{x})\\,dx$.`,
        flashcardBack: `$F$ is an antiderivative of $f$ when $F'(x)=f(x)$ — its slope at every point equals $f$.

The "$+C$" appears because **constants vanish under differentiation**: if $F'=f$ then $(F+C)'=f$ too for any constant $C$. So $f$ has a whole family of antiderivatives differing by a constant, and $\\int f\\,dx$ denotes them all.

$\\int\\!\\big(x^{3}+\\tfrac1x\\big)dx = \\dfrac{x^{4}}{4}+\\ln|x|+C$, using $\\int x^n dx=\\frac{x^{n+1}}{n+1}$ for the cube and the special rule $\\int\\frac1x dx=\\ln|x|$ for the reciprocal (since $n=-1$ breaks the power rule).`,
      },
      {
        name: "The Definite Integral and Total Change",
        orderIndex: 2,
        prerequisites: ["Antiderivatives and Indefinite Integrals"],
        explanation: `A **definite integral** $\\int_a^b f(x)\\,dx$ is a *number*: the **net signed area** between the graph of $f$ and the x-axis from $x=a$ to $x=b$ (area above the axis counts positive, below negative). The **Fundamental Theorem of Calculus** connects it to antiderivatives:

$$\\int_a^b f(x)\\,dx = F(b)-F(a),\\quad\\text{where } F'=f.$$

So you integrate by finding any antiderivative and subtracting its values at the endpoints. For example $\\int_0^2 x\\,dx = \\big[\\tfrac{x^2}{2}\\big]_0^2 = 2$.

The most useful reading for data science is **total change**: since $f'$ is the rate of change of $f$, integrating a rate recovers the accumulated amount:

$$\\int_a^b f'(x)\\,dx = f(b)-f(a).$$

If $f'$ is a speed, the integral is distance travelled; if it's a flow rate, the integral is total volume. Definite integrals are also linear and additive over intervals: $\\int_a^c = \\int_a^b + \\int_b^c$.`,
        flashcardFront: `State the Fundamental Theorem of Calculus and the "total change" interpretation. Evaluate $\\int_1^3 2x\\,dx$.`,
        flashcardBack: `**Fundamental Theorem of Calculus:** if $F'=f$ then $\\int_a^b f(x)\\,dx = F(b)-F(a)$ — the definite integral (net signed area under $f$) equals the change in any antiderivative across the interval.

**Total change:** because $f'$ is the rate of change of $f$, $\\int_a^b f'(x)\\,dx = f(b)-f(a)$ — integrating a rate over $[a,b]$ gives the net accumulated change (e.g. speed → distance, flow → volume).

$\\int_1^3 2x\\,dx = \\big[x^{2}\\big]_1^3 = 3^{2}-1^{2} = 9-1 = 8.$`,
      },
      {
        name: "Vectors in Euclidean Space",
        orderIndex: 3,
        prerequisites: [],
        explanation: `A **vector** in $\\mathbb{R}^{d}$ is an ordered list of $d$ real numbers, $\\mathbf{v}=(v_1,\\dots,v_d)$. It has a dual nature: a **point** in $d$-dimensional space, or an **arrow** with direction and length from the origin. In data science a vector is the natural container for one data record — $d$ features describing one item.

Two operations make $\\mathbb{R}^{d}$ a *vector space*, both performed **componentwise**:

- **Addition:** $\\mathbf{u}+\\mathbf{v}=(u_1+v_1,\\dots,u_d+v_d)$ — geometrically the "tip-to-tail" parallelogram rule.
- **Scalar multiplication:** $c\\,\\mathbf{v}=(cv_1,\\dots,cv_d)$ — stretches the arrow by factor $c$ (and flips it if $c<0$).

The **length** (or *norm*) of a vector generalises Pythagoras:

$$\\|\\mathbf{v}\\|=\\sqrt{v_1^{2}+v_2^{2}+\\dots+v_d^{2}}.$$

Adding vectors combines feature records; scaling adjusts magnitude; the norm measures size or distance — all foundational for geometry-based methods like nearest neighbours and clustering.`,
        flashcardFront: `How do you add vectors and multiply by a scalar in $\\mathbb{R}^{d}$? Compute $2\\mathbf{u}-\\mathbf{v}$ and $\\|\\mathbf{v}\\|$ for $\\mathbf{u}=(1,2)$, $\\mathbf{v}=(3,-4)$.`,
        flashcardBack: `Both operations are **componentwise**: $\\mathbf{u}+\\mathbf{v}=(u_1+v_1,\\dots,u_d+v_d)$ and $c\\mathbf{v}=(cv_1,\\dots,cv_d)$.

$2\\mathbf{u}=(2,4)$ and $2\\mathbf{u}-\\mathbf{v}=(2-3,\\,4-(-4))=(-1,8)$.

The length uses the Pythagorean formula $\\|\\mathbf{v}\\|=\\sqrt{v_1^2+\\dots+v_d^2}$, so $\\|\\mathbf{v}\\|=\\sqrt{3^{2}+(-4)^{2}}=\\sqrt{9+16}=\\sqrt{25}=5.$`,
      },
      {
        name: "The Dot Product",
        orderIndex: 4,
        prerequisites: ["Vectors in Euclidean Space"],
        explanation: `The **dot product** combines two vectors of the same dimension into a single number:

$$\\mathbf{u}\\cdot\\mathbf{v}=\\sum_{i=1}^{d}u_i v_i = u_1v_1+u_2v_2+\\dots+u_dv_d.$$

It has a powerful geometric meaning:

$$\\mathbf{u}\\cdot\\mathbf{v}=\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta,$$

where $\\theta$ is the angle between the vectors. Two consequences are used constantly:

- **Orthogonality:** $\\mathbf{u}\\cdot\\mathbf{v}=0 \\iff$ the vectors are **perpendicular** (since $\\cos 90^\\circ=0$).
- **Self dot product:** $\\mathbf{v}\\cdot\\mathbf{v}=\\|\\mathbf{v}\\|^{2}$, the squared length.

The dot product measures **alignment**: large and positive when vectors point the same way, zero when perpendicular, negative when opposed. This single operation underlies similarity scores (cosine similarity), projections, and the weighted sums computed by every neuron in a neural network.`,
        flashcardFront: `Give the algebraic and geometric formulas for $\\mathbf{u}\\cdot\\mathbf{v}$. What does $\\mathbf{u}\\cdot\\mathbf{v}=0$ mean? Compute $(1,2,3)\\cdot(4,0,-1)$.`,
        flashcardBack: `Algebraically, $\\mathbf{u}\\cdot\\mathbf{v}=\\sum_i u_iv_i$ (multiply matching components, then sum). Geometrically, $\\mathbf{u}\\cdot\\mathbf{v}=\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ where $\\theta$ is the angle between them.

$\\mathbf{u}\\cdot\\mathbf{v}=0$ means the vectors are **orthogonal (perpendicular)** — because the lengths are positive, the product is zero only when $\\cos\\theta=0$, i.e. $\\theta=90^\\circ$.

$(1,2,3)\\cdot(4,0,-1)=1\\cdot4+2\\cdot0+3\\cdot(-1)=4+0-3=1.$`,
      },
      {
        name: "Introduction to Matrices",
        orderIndex: 5,
        prerequisites: ["Vectors in Euclidean Space"],
        explanation: `A **matrix** is a rectangular array of numbers with $m$ rows and $n$ columns — an "$m\\times n$ matrix". Its entries are written $a_{ij}$ (row $i$, column $j$). You can read a matrix as a stack of row vectors, a row of column vectors, or — most importantly later — as a **linear transformation** that maps vectors to vectors.

$$A=\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\\ (2\\times 2),\\qquad B=\\begin{bmatrix} 1 & 0 & 5 \\\\ 2 & 1 & 7 \\end{bmatrix}\\ (2\\times 3).$$

Two basic operations work just like for vectors and require the **same shape**, acting **entrywise**:

- **Addition:** $(A+B)_{ij}=a_{ij}+b_{ij}$.
- **Scalar multiplication:** $(cA)_{ij}=c\\,a_{ij}$.

Matrices are the workhorses of data science: a whole dataset is a matrix (rows = records, columns = features), images are matrices of pixels, and systems of linear equations are written compactly as $A\\mathbf{x}=\\mathbf{b}$. The richer operation — matrix multiplication — comes next week.`,
        flashcardFront: `What does an "$m\\times n$ matrix" mean, and how do you add two matrices or scale one? Can you add a $2\\times 3$ and a $3\\times 2$ matrix?`,
        flashcardBack: `An **$m\\times n$ matrix** has $m$ rows and $n$ columns; entry $a_{ij}$ sits in row $i$, column $j$.

Addition and scalar multiplication are **entrywise**: $(A+B)_{ij}=a_{ij}+b_{ij}$ and $(cA)_{ij}=c\\,a_{ij}$.

**No** — you cannot add a $2\\times 3$ and a $3\\times 2$ matrix. Entrywise addition requires the matrices to have **exactly the same shape** (same number of rows *and* columns), so there is a matching entry to add. (Matrix *multiplication* has different shape rules — that's a separate operation.)`,
      },
    ],
  },

  // ── WEEK 5 — Matrices, Linear Systems & Inverses (Lectures 9–10) ──────────
  {
    index: 5,
    title: "Matrix Multiplication, Linear Systems and Inverses",
    cheatSheet: `## Matrices, Linear Systems & Inverses

**Matrix multiplication** — $(AB)_{ij}=\\sum_k a_{ik}b_{kj}$ (row $i$ of $A$ **dot** column $j$ of $B$).
- Defined only when **inner dimensions match**: $(m\\times n)(n\\times p)=(m\\times p)$.
- **Not commutative:** $AB\\neq BA$ in general. Associative and distributive.
- **Identity** $I$: $AI=IA=A$.

**Linear systems** — $A\\mathbf{x}=\\mathbf{b}$ packs a system of linear equations into one matrix equation.

**Gaussian elimination** — solve by row-reducing the augmented matrix $[\\,A\\mid \\mathbf{b}\\,]$ using **elementary row operations**:
1. swap two rows; 2. multiply a row by a non-zero scalar; 3. add a multiple of one row to another.
Reduce to row-echelon form, then back-substitute. Outcomes: a unique solution, infinitely many, or none.

**Inverse matrix** — a square $A$ is invertible if there's $A^{-1}$ with $AA^{-1}=A^{-1}A=I$. Then $A\\mathbf{x}=\\mathbf{b}\\Rightarrow \\mathbf{x}=A^{-1}\\mathbf{b}$.

**$2\\times2$ inverse:** for $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$,
$$\\det A = ad-bc,\\qquad A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}.$$
$A$ is invertible **iff** $\\det A\\neq 0$.`,
    concepts: [
      {
        name: "Matrix Multiplication",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**Matrix multiplication** is not entrywise — it is built from dot products. The entry in row $i$, column $j$ of $AB$ is the dot product of **row $i$ of $A$** with **column $j$ of $B$**:

$$(AB)_{ij}=\\sum_{k} a_{ik}\\,b_{kj}.$$

For this to make sense the row length of $A$ must match the column length of $B$, so the **inner dimensions must agree**: an $(m\\times n)$ times an $(n\\times p)$ gives an $(m\\times p)$ matrix. For example
$$\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}5\\\\6\\end{bmatrix}=\\begin{bmatrix}1\\cdot5+2\\cdot6\\\\3\\cdot5+4\\cdot6\\end{bmatrix}=\\begin{bmatrix}17\\\\39\\end{bmatrix}.$$

Two features surprise newcomers:

- **It is not commutative:** $AB\\neq BA$ in general (often one product isn't even defined). Order matters.
- The **identity matrix** $I$ (ones on the diagonal, zeros elsewhere) acts like the number $1$: $AI=IA=A$.

Multiplication *is* associative and distributive. It represents **composing transformations** — applying one linear map after another — which is why it powers everything from rotating graphics to a forward pass through a neural network.`,
        flashcardFront: `How is entry $(AB)_{ij}$ computed, what shape rule must hold, and why is matrix multiplication not commutative?`,
        flashcardBack: `$(AB)_{ij}=\\sum_k a_{ik}b_{kj}$ — the **dot product of row $i$ of $A$ with column $j$ of $B$**.

**Shape rule:** the inner dimensions must match — $(m\\times n)(n\\times p)=(m\\times p)$. The number of columns of $A$ must equal the number of rows of $B$, so each row–column dot product has matching length.

It is **not commutative** because the construction is asymmetric (rows of the left factor against columns of the right): swapping to $BA$ pairs different vectors, and often $BA$ isn't even a valid shape. Concretely, $AB$ means "do $B$ then $A$" as transformations — applying maps in the other order generally gives a different result.`,
      },
      {
        name: "Linear Systems and Gaussian Elimination",
        orderIndex: 2,
        prerequisites: ["Matrix Multiplication"],
        explanation: `A system of linear equations packs neatly into one matrix equation $A\\mathbf{x}=\\mathbf{b}$, where $A$ holds the coefficients, $\\mathbf{x}$ the unknowns, and $\\mathbf{b}$ the right-hand sides. **Gaussian elimination** solves it systematically by working on the **augmented matrix** $[\\,A\\mid\\mathbf{b}\\,]$ with three **elementary row operations**, none of which change the solution set:

1. swap two rows;
2. multiply a row by a non-zero number;
3. add a multiple of one row to another.

The goal is **row-echelon form** — a staircase of leading entries with zeros below them — after which **back-substitution** reads off the unknowns from the bottom up. For example, eliminating $x$ from the lower equations turns the system triangular, then you solve for the last variable and substitute upward.

A linear system has exactly one of three outcomes: a **unique solution**, **infinitely many** (a free variable remains), or **none** (a contradiction like $0=1$ appears). Gaussian elimination reveals which case you're in and is the standard algorithm computers use to solve systems with thousands of variables.`,
        flashcardFront: `What are the three elementary row operations, and what three outcomes can a linear system $A\\mathbf{x}=\\mathbf{b}$ have?`,
        flashcardBack: `**Elementary row operations** (each preserves the solution set): (1) swap two rows; (2) multiply a row by a non-zero scalar; (3) add a multiple of one row to another. Applied to the augmented matrix $[A\\mid\\mathbf{b}]$ they reduce it to row-echelon form for back-substitution.

A linear system has exactly one of **three outcomes**:
- a **unique solution** (every variable pinned down),
- **infinitely many** solutions (a free variable survives — the rows don't constrain everything),
- **no solution** (elimination produces a contradiction such as $0=1$, i.e. the equations are inconsistent).`,
      },
      {
        name: "The Inverse of a Matrix",
        orderIndex: 3,
        prerequisites: ["Matrix Multiplication", "Linear Systems and Gaussian Elimination"],
        explanation: `For a **square** matrix $A$, the **inverse** $A^{-1}$ is the matrix that undoes it: $AA^{-1}=A^{-1}A=I$. It plays the role of "dividing by $A$". Its payoff for linear systems is immediate — if $A$ is invertible, then

$$A\\mathbf{x}=\\mathbf{b}\\ \\Rightarrow\\ \\mathbf{x}=A^{-1}\\mathbf{b},$$

a unique solution in one step.

Not every matrix has an inverse. The **determinant** decides: for a $2\\times2$ matrix $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$,

$$\\det A = ad-bc,\\qquad A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}.$$

$A$ is **invertible if and only if $\\det A\\neq 0$**. When $\\det A=0$ the matrix is *singular*: it squashes space flat (collapses dimensions), so it can't be undone, and the system $A\\mathbf{x}=\\mathbf{b}$ then has either no solution or infinitely many. Geometrically $|\\det A|$ is the factor by which $A$ scales area/volume — zero means everything is flattened.`,
        flashcardFront: `When is a $2\\times2$ matrix invertible, and what is $A^{-1}$? How does this solve $A\\mathbf{x}=\\mathbf{b}$?`,
        flashcardBack: `For $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$, the determinant is $\\det A=ad-bc$, and $A$ is invertible **iff $\\det A\\neq 0$**. Then
$$A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}$$
(swap the diagonal entries, negate the off-diagonal, divide by the determinant).

This solves a system directly: from $A\\mathbf{x}=\\mathbf{b}$, multiply both sides on the left by $A^{-1}$ to get $\\mathbf{x}=A^{-1}\\mathbf{b}$ — a unique solution. If $\\det A=0$ the matrix is singular (it collapses space), $A^{-1}$ doesn't exist, and the system has no unique solution.`,
      },
    ],
  },

  // ── WEEK 6 — Eigenvalues and Eigendecomposition (Lectures 11–12) ──────────
  {
    index: 6,
    title: "Eigenvalues, Eigenvectors and Eigendecomposition",
    cheatSheet: `## Eigenvalues & Eigendecomposition

**Definition** — for a square matrix $A$, a non-zero vector $\\mathbf{x}$ is an **eigenvector** with **eigenvalue** $\\lambda$ if
$$A\\mathbf{x}=\\lambda\\mathbf{x}.$$
$A$ only **stretches** $\\mathbf{x}$ (by factor $\\lambda$) — it doesn't rotate it. Eigenvectors are the matrix's "natural axes".

**Finding eigenvalues** — solve the **characteristic equation**:
$$\\det(A-\\lambda I)=0.$$
For $2\\times2$ this is a quadratic in $\\lambda$.

**Finding eigenvectors** — for each $\\lambda$, solve the homogeneous system $(A-\\lambda I)\\mathbf{x}=\\mathbf{0}$ (Gaussian elimination); the non-zero solutions are the eigenvectors.

**Eigendecomposition** — if an $n\\times n$ matrix has $n$ independent eigenvectors, then
$$A=PDP^{-1},$$
where $P$'s columns are the eigenvectors and $D=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$.

**Matrix powers** — diagonalisation makes powers cheap:
$$A^{n}=PD^{n}P^{-1},\\qquad D^{n}=\\operatorname{diag}(\\lambda_1^{n},\\dots,\\lambda_n^{n}).$$
Used to find long-run behaviour of systems (e.g. Markov/voting models as $n\\to\\infty$). Eigenvectors/values underpin PCA, PageRank and stability analysis.`,
    concepts: [
      {
        name: "Eigenvalues and Eigenvectors",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Most vectors get knocked off their original line when a matrix acts on them — $A$ both stretches and rotates them. **Eigenvectors** are the special non-zero vectors that $A$ leaves pointing the **same way**, merely scaling them. Formally, $\\mathbf{x}\\neq\\mathbf{0}$ is an eigenvector of a square matrix $A$ with **eigenvalue** $\\lambda$ if

$$A\\mathbf{x}=\\lambda\\mathbf{x}.$$

The matrix acts on this direction like a simple number: stretch by $\\lambda$ (if $|\\lambda|>1$), shrink ($|\\lambda|<1$), or flip ($\\lambda<0$). We require $\\mathbf{x}\\neq\\mathbf{0}$ because the zero vector trivially satisfies the equation for any $\\lambda$ and tells us nothing.

Eigenvectors are the matrix's **natural axes** — the directions along which a complicated transformation becomes a plain scaling. This is the key to understanding what a matrix "really does", and it drives some of the most important algorithms in data science: principal component analysis (directions of greatest variance), Google's PageRank (the dominant eigenvector of the web), and the stability of dynamical systems.`,
        flashcardFront: `What equation defines an eigenvector $\\mathbf{x}$ and eigenvalue $\\lambda$ of $A$? Why must $\\mathbf{x}\\neq\\mathbf{0}$, and what does $A$ "do" to an eigenvector geometrically?`,
        flashcardBack: `$\\mathbf{x}$ (non-zero) is an **eigenvector** with **eigenvalue** $\\lambda$ when $A\\mathbf{x}=\\lambda\\mathbf{x}$.

We require $\\mathbf{x}\\neq\\mathbf{0}$ because $A\\mathbf{0}=\\lambda\\mathbf{0}$ holds for *every* $\\lambda$ — the zero vector would be a meaningless "eigenvector" carrying no information.

Geometrically, $A$ acts on an eigenvector as **pure scaling**: it keeps the vector on its own line (no rotation) and multiplies its length by $\\lambda$ — stretching if $|\\lambda|>1$, shrinking if $|\\lambda|<1$, and reversing direction if $\\lambda<0$. Eigenvectors are thus the "natural axes" along which the transformation is simplest.`,
      },
      {
        name: "Finding Eigenvalues: the Characteristic Equation",
        orderIndex: 2,
        prerequisites: ["Eigenvalues and Eigenvectors"],
        explanation: `To find eigenvalues, rewrite $A\\mathbf{x}=\\lambda\\mathbf{x}$ as $A\\mathbf{x}-\\lambda\\mathbf{x}=\\mathbf{0}$, i.e. $(A-\\lambda I)\\mathbf{x}=\\mathbf{0}$ (the identity $I$ lets us subtract $\\lambda$ from a matrix). We want a **non-zero** solution $\\mathbf{x}$. A homogeneous system $(A-\\lambda I)\\mathbf{x}=\\mathbf{0}$ has a non-zero solution **exactly when the matrix is singular**, i.e. its determinant is zero. This gives the **characteristic equation**:

$$\\det(A-\\lambda I)=0.$$

Expanding the determinant produces the **characteristic polynomial** in $\\lambda$; its roots are the eigenvalues. For a $2\\times2$ matrix it's a quadratic. Example: for $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$,

$$\\det\\!\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}=(2-\\lambda)^{2}-1=\\lambda^{2}-4\\lambda+3=(\\lambda-1)(\\lambda-3)=0,$$

so the eigenvalues are $\\lambda=1$ and $\\lambda=3$. An $n\\times n$ matrix has $n$ eigenvalues (counted with multiplicity, possibly complex).`,
        flashcardFront: `Why does solving $\\det(A-\\lambda I)=0$ give the eigenvalues? Find the eigenvalues of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.`,
        flashcardBack: `Rearranging $A\\mathbf{x}=\\lambda\\mathbf{x}$ gives $(A-\\lambda I)\\mathbf{x}=\\mathbf{0}$. We need a **non-zero** $\\mathbf{x}$, and a homogeneous system has a non-trivial solution **iff its matrix is singular**, i.e. $\\det(A-\\lambda I)=0$. So the eigenvalues are exactly the $\\lambda$ that make $A-\\lambda I$ non-invertible — the roots of the **characteristic polynomial**.

For $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$:
$$\\det\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}=(2-\\lambda)^2-1=\\lambda^2-4\\lambda+3=(\\lambda-1)(\\lambda-3).$$
Setting this to $0$ gives eigenvalues $\\lambda=1$ and $\\lambda=3$.`,
      },
      {
        name: "Finding Eigenvectors",
        orderIndex: 3,
        prerequisites: ["Finding Eigenvalues: the Characteristic Equation"],
        explanation: `Once you have an eigenvalue $\\lambda$, its eigenvectors are the non-zero solutions of the homogeneous system

$$(A-\\lambda I)\\mathbf{x}=\\mathbf{0},$$

solved by Gaussian elimination. Because $\\lambda$ was chosen to make $A-\\lambda I$ singular, this system always has infinitely many solutions forming a line (or higher-dimensional space) through the origin — the **eigenspace** for $\\lambda$. Any non-zero vector on it is an eigenvector, so eigenvectors are only defined **up to scaling** (if $\\mathbf{x}$ works so does $5\\mathbf{x}$).

Continuing the example $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ with $\\lambda=3$:

$$A-3I=\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix},\\quad (A-3I)\\mathbf{x}=\\mathbf{0}\\ \\Rightarrow\\ -x_1+x_2=0\\ \\Rightarrow\\ x_1=x_2,$$

so every multiple of $\\begin{bmatrix}1\\\\1\\end{bmatrix}$ is an eigenvector. Similarly $\\lambda=1$ gives the direction $\\begin{bmatrix}1\\\\-1\\end{bmatrix}$. You can verify: $A\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\begin{bmatrix}3\\\\3\\end{bmatrix}=3\\begin{bmatrix}1\\\\1\\end{bmatrix}$. ✓`,
        flashcardFront: `Given an eigenvalue $\\lambda$, how do you find its eigenvectors, and why are they only determined up to scaling? Find an eigenvector for $\\lambda=3$, $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.`,
        flashcardBack: `Solve the homogeneous system $(A-\\lambda I)\\mathbf{x}=\\mathbf{0}$ (e.g. by Gaussian elimination); its non-zero solutions are the eigenvectors for $\\lambda$.

They're only determined **up to scaling** because the solution set is an entire line/subspace through the origin (the eigenspace): if $\\mathbf{x}$ satisfies $A\\mathbf{x}=\\lambda\\mathbf{x}$ then so does any multiple $c\\mathbf{x}$. So we report a *direction*, not a unique vector.

For $\\lambda=3$: $A-3I=\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}$, and $(A-3I)\\mathbf{x}=\\mathbf{0}$ reduces to $x_1=x_2$. So $\\mathbf{x}=\\begin{bmatrix}1\\\\1\\end{bmatrix}$ (or any multiple). Check: $A\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\begin{bmatrix}3\\\\3\\end{bmatrix}=3\\begin{bmatrix}1\\\\1\\end{bmatrix}$. ✓`,
      },
      {
        name: "Eigendecomposition and Matrix Powers",
        orderIndex: 4,
        prerequisites: ["Finding Eigenvectors"],
        explanation: `If an $n\\times n$ matrix $A$ has $n$ linearly independent eigenvectors, it can be **diagonalised**:

$$A=PDP^{-1},$$

where the columns of $P$ are the eigenvectors and $D=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$ holds the corresponding eigenvalues. This says: change to the eigenvector coordinate system ($P^{-1}$), where $A$ acts as the simple diagonal scaling $D$, then change back ($P$).

The headline payoff is **cheap matrix powers**. Because the $P^{-1}P$ terms collapse,

$$A^{n}=PD^{n}P^{-1},\\qquad D^{n}=\\operatorname{diag}(\\lambda_1^{n},\\dots,\\lambda_n^{n}).$$

Raising a diagonal matrix to a power just raises each eigenvalue to that power — turning an expensive repeated multiplication into a few scalar exponentials. This is exactly how you find the **long-run behaviour** of iterative systems: in a Markov/voting model where the state after $n$ steps is $A^{n}\\mathbf{x}_0$, the term with the largest eigenvalue dominates as $n\\to\\infty$, revealing the steady state. Eigendecomposition also underlies PCA and spectral methods.`,
        flashcardFront: `What is the eigendecomposition $A=PDP^{-1}$, and why does it make computing $A^{n}$ easy?`,
        flashcardBack: `If $A$ ($n\\times n$) has $n$ independent eigenvectors, then $A=PDP^{-1}$ where the **columns of $P$ are the eigenvectors** and $D=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$ is the diagonal matrix of eigenvalues. It expresses $A$ as "change to eigen-coordinates, scale, change back".

Powers become trivial because the middle factors telescope:
$$A^{n}=(PDP^{-1})(PDP^{-1})\\cdots=PD^{n}P^{-1},$$
since each $P^{-1}P=I$ cancels. And $D^{n}=\\operatorname{diag}(\\lambda_1^{n},\\dots,\\lambda_n^{n})$ — just raise each eigenvalue to the power. So $A^{100}$ needs a handful of scalar powers instead of 100 matrix multiplications, which is how long-run/steady-state behaviour (largest eigenvalue dominates) is found.`,
      },
    ],
  },

  // ── WEEK 7 — Relations and Multivariate Functions (Lectures 13–14) ────────
  {
    index: 7,
    title: "Relations and Multivariate Functions",
    cheatSheet: `## Relations & Multivariate Functions

**Binary relations** — a relation $R$ between sets $X,Y$ is any subset of pairs $R\\subseteq X\\times Y$; "$x\\,R\\,y$" means $(x,y)\\in R$. A **function** is the special case where each $x$ relates to **exactly one** $y$. Relations are more general (one input may relate to many outputs).

**Conics in the plane**
- **Circle** centre $(h,k)$, radius $r$: $(x-h)^{2}+(y-k)^{2}=r^{2}$.
- **Ellipse** centred at origin: $\\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}=1$ (semi-axes $a,b$).

**Plotting inequalities** — an inequality like $y\\le f(x)$ or $x^2+y^2\\le r^2$ defines a **region** (shade one side of the boundary curve). Systems of inequalities = intersection of regions (basis of linear programming).

**Multivariate functions** — $f:\\mathbb{R}^{n}\\to\\mathbb{R}$, e.g. $f(x,y)$. Graph is a **surface**; **level sets** $\\{f=c\\}$ are contour lines.

**Partial derivatives** — differentiate w.r.t. one variable, treating the others as **constants**:
$$f_x=\\frac{\\partial f}{\\partial x},\\qquad f_y=\\frac{\\partial f}{\\partial y}.$$
The **gradient** $\\nabla f=(f_x,f_y)$ points in the direction of steepest increase.`,
    concepts: [
      {
        name: "Binary Relations",
        orderIndex: 1,
        prerequisites: [],
        explanation: `A function is a strict rule — each input gives **exactly one** output. A **binary relation** drops that restriction. A relation $R$ between sets $X$ and $Y$ is simply a **set of ordered pairs**, $R\\subseteq X\\times Y$ (where $X\\times Y$ is all pairs $(x,y)$). We write $x\\,R\\,y$ to mean $(x,y)\\in R$ — "$x$ is related to $y$".

Because a relation is *any* collection of pairs, one input can relate to **many** outputs, or none. Everyday examples: "is a friend of" on a set of people, "$\\le$" on numbers, "divides" on integers. Each is just the set of pairs for which the statement holds.

The connection to functions is precise: **a function is exactly a relation in which every $x\\in X$ appears in exactly one pair.** So functions are a special, well-behaved kind of relation. This broader viewpoint matters in data science because relations model networks and databases — a social graph, a table linking customers to orders — where one-to-many and many-to-many links are the norm, not the exception.`,
        flashcardFront: `What is a binary relation between $X$ and $Y$, and how is a function a special case of one?`,
        flashcardBack: `A **binary relation** $R$ between $X$ and $Y$ is any subset of the set of ordered pairs $X\\times Y$; we write $x\\,R\\,y$ for $(x,y)\\in R$. There's no restriction — an element of $X$ may be related to many elements of $Y$, or to none.

A **function** is the special case where the relation pairs **each $x\\in X$ with exactly one $y\\in Y$**. So every function is a relation, but most relations aren't functions (they allow one-to-many links). This is why relations model things functions can't — networks, "friend of", "divides", and database links with many-to-many connections.`,
      },
      {
        name: "Circles, Ellipses and Plotting Regions",
        orderIndex: 2,
        prerequisites: ["Binary Relations"],
        explanation: `Some important relations aren't functions because they fail the "one output per input" rule — **conics** are the classic example. A **circle** of radius $r$ centred at $(h,k)$ is the set of points at distance $r$ from the centre:

$$(x-h)^{2}+(y-k)^{2}=r^{2}.$$

It's not a function of $x$ (most vertical lines hit it twice). Stretching the circle by different amounts along the axes gives an **ellipse**, centred at the origin:

$$\\frac{x^{2}}{a^{2}}+\\frac{y^{2}}{b^{2}}=1,$$

with semi-axis $a$ along $x$ and $b$ along $y$.

Replacing "$=$" with an inequality turns a curve into a **region**: $(x-h)^2+(y-k)^2\\le r^2$ is the filled disc, and $y\\le f(x)$ is everything on or below the curve $y=f(x)$. You plot it by drawing the boundary and **shading the correct side** (test a point). A **system** of inequalities is the *intersection* of such regions — the shaded overlap. This is the geometric heart of **linear programming**, where you optimise over a feasible region carved out by linear inequalities.`,
        flashcardFront: `Give the equations of a circle (centre $(h,k)$, radius $r$) and an origin-centred ellipse. How do you plot the region $x^{2}+y^{2}\\le 9$?`,
        flashcardBack: `**Circle:** $(x-h)^2+(y-k)^2=r^2$ — all points at distance $r$ from $(h,k)$. **Ellipse** (origin): $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ with semi-axes $a$ (along $x$) and $b$ (along $y$).

To plot $x^2+y^2\\le 9$: first draw the **boundary** $x^2+y^2=9$ — a circle of radius $3$ centred at the origin. The inequality is "$\\le$", so the region is **inside** (the filled disc, boundary included). Confirm by testing a point: the origin gives $0\\le 9$ ✓, so shade the side containing the origin. (For "$<$" you'd draw the boundary dashed to show it's excluded.)`,
      },
      {
        name: "Multivariate Functions",
        orderIndex: 3,
        prerequisites: [],
        explanation: `Real models depend on **many** inputs, so we need functions of several variables: $f:\\mathbb{R}^{n}\\to\\mathbb{R}$, written $f(x_1,\\dots,x_n)$. The two-variable case $f(x,y)$ is the one to picture. Where a single-variable function draws a **curve**, a two-variable function draws a **surface** floating above the $xy$-plane: the height at point $(x,y)$ is $f(x,y)$. For instance $f(x,y)=x^{2}+y^{2}$ is a bowl (paraboloid) and $f(x,y)=-x^2-y^2$ is a dome.

Surfaces are hard to draw, so we use **level sets** (contour lines): the set of inputs giving a fixed output, $\\{(x,y):f(x,y)=c\\}$. These are exactly the contour lines on a topographic map — each curve marks a constant height. Closely-spaced contours mean a steep region; widely-spaced means gentle.

In data science, a model with $n$ parameters has a **cost function** $f:\\mathbb{R}^{n}\\to\\mathbb{R}$, and "training" means finding the input that minimises it — optimisation in many dimensions. So multivariate functions are the setting for essentially all of machine learning, and the next concepts (partial derivatives, the gradient, the Hessian) are the tools for navigating their surfaces.`,
        flashcardFront: `What does the graph of a two-variable function $f(x,y)$ look like, and what is a level set? Describe the level sets of $f(x,y)=x^2+y^2$.`,
        flashcardBack: `The graph of $f(x,y)$ is a **surface** in 3D: above each point $(x,y)$ in the plane, the surface has height $f(x,y)$ (a curve becomes a surface when you add a variable).

A **level set** (contour) is the set of inputs with a fixed output value: $\\{(x,y):f(x,y)=c\\}$ — like the constant-height curves on a topographic map.

For $f(x,y)=x^2+y^2$: setting $x^2+y^2=c$ gives, for each $c>0$, a **circle** of radius $\\sqrt{c}$ centred at the origin. So the level sets are concentric circles (and the surface itself is a bowl/paraboloid); circles get farther apart as you move out, reflecting the bowl's increasing steepness.`,
      },
      {
        name: "Partial Derivatives and the Gradient",
        orderIndex: 4,
        prerequisites: ["Multivariate Functions", "Derivatives: Slope and Basic Rules"],
        explanation: `To do calculus on a surface we ask: how does $f$ change if we nudge **just one** input? That's a **partial derivative**. To compute $f_x=\\dfrac{\\partial f}{\\partial x}$, differentiate with respect to $x$ while treating every other variable as a **constant**; likewise $f_y=\\dfrac{\\partial f}{\\partial y}$. For example, if $f(x,y)=x^{2}y+3y^{2}$ then

$$f_x = 2xy\\quad(\\text{$y$ held fixed}),\\qquad f_y = x^{2}+6y\\quad(\\text{$x$ held fixed}).$$

Geometrically $f_x$ is the slope of the surface in the $x$-direction (the slope you'd feel walking due east), and $f_y$ the slope walking north.

Collecting the partials gives the **gradient** vector

$$\\nabla f=(f_x,\\,f_y).$$

The gradient points in the direction of **steepest increase** of $f$, and its negative points downhill fastest. This single fact is the engine of **gradient descent**, the optimisation algorithm behind most machine learning: to minimise a cost function, repeatedly step in the direction $-\\nabla f$. Partial derivatives also feed the stationary-point and Hessian machinery for 2D optimisation next week.`,
        flashcardFront: `How do you compute the partial derivative $f_x$, and what does the gradient $\\nabla f$ represent? Find $f_x$ and $f_y$ for $f(x,y)=x^{2}y+3y^{2}$.`,
        flashcardBack: `For $f_x=\\partial f/\\partial x$, differentiate $f$ with respect to $x$ while **treating all other variables as constants** (similarly for $f_y$).

For $f(x,y)=x^2y+3y^2$: holding $y$ fixed, $f_x=2xy$ (the $3y^2$ term is constant in $x$, so it vanishes); holding $x$ fixed, $f_y=x^2+6y$.

The **gradient** $\\nabla f=(f_x,f_y)$ is the vector of partials. It points in the **direction of steepest increase** of $f$ (and $-\\nabla f$ is steepest descent), with magnitude equal to that steepest slope. This is the basis of gradient descent: to minimise a cost function, repeatedly step in the $-\\nabla f$ direction.`,
      },
    ],
  },

  // ── WEEK 8 — Two-Variable Optimisation (Lectures 15–16) ───────────────────
  {
    index: 8,
    title: "Stationary Points and Optimisation in Two Variables",
    cheatSheet: `## Two-Variable Optimisation

**First-order (linear) approximation** — near a point, a function is well approximated by its tangent plane:
$$f(x,y)\\approx f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b).$$

**Stationary points** — both partials vanish:
$$f_x(x,y)=0\\quad\\text{and}\\quad f_y(x,y)=0.$$
These are the candidate maxima, minima and **saddle points**.

**The Hessian** — the matrix of second partial derivatives:
$$H=\\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{bmatrix},\\qquad \\det H = f_{xx}f_{yy}-f_{xy}^{2}.$$

**Second-derivative test** at a stationary point:
- $\\det H>0$ and $f_{xx}>0$ → **local minimum**
- $\\det H>0$ and $f_{xx}<0$ → **local maximum**
- $\\det H<0$ → **saddle point** (min in one direction, max in another)
- $\\det H=0$ → inconclusive

**Global extrema** — compare all interior stationary points with the boundary of the region. Convex $f$ ⇒ a stationary point is the global minimum.`,
    concepts: [
      {
        name: "First-Order Approximation and Stationary Points in 2D",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Just as a one-variable function is approximated near a point by its **tangent line**, a two-variable function is approximated near $(a,b)$ by its **tangent plane**:

$$f(x,y)\\approx f(a,b)+f_x(a,b)\\,(x-a)+f_y(a,b)\\,(y-b).$$

The partial derivatives give the plane's slopes in the $x$- and $y$-directions. This linear approximation is how the surface looks "up close".

To **optimise** $f(x,y)$, we hunt for **stationary points** — points where the tangent plane is perfectly **flat**, which requires *both* partial slopes to be zero:

$$f_x(x,y)=0\\quad\\text{and}\\quad f_y(x,y)=0.$$

Solving this pair of equations simultaneously gives the candidates. Unlike the 1D case there are now **three** kinds of flat point: a local **minimum** (bottom of a bowl), a local **maximum** (top of a dome), and a brand-new possibility — a **saddle point**, which goes up in one direction and down in another (like a mountain pass or a Pringle). Finding the candidates is only half the job; the next concept classifies them.`,
        flashcardFront: `What conditions define a stationary point of $f(x,y)$, and what three types can it be? Find the stationary point of $f(x,y)=x^{2}+y^{2}-4x$.`,
        flashcardBack: `A **stationary point** has a flat tangent plane, requiring **both** partials to vanish: $f_x(x,y)=0$ and $f_y(x,y)=0$ (solved simultaneously). The three types are a local **minimum**, a local **maximum**, and a **saddle point** (up one way, down another — new in 2D).

For $f(x,y)=x^2+y^2-4x$: $f_x=2x-4=0\\Rightarrow x=2$, and $f_y=2y=0\\Rightarrow y=0$. So the only stationary point is $(2,0)$. (It's a minimum — the surface is a bowl shifted to be centred at $x=2$.)`,
      },
      {
        name: "The Hessian and Classifying Stationary Points",
        orderIndex: 2,
        prerequisites: ["First-Order Approximation and Stationary Points in 2D"],
        explanation: `To classify a 2D stationary point we need second-order information — the curvature in every direction — packaged in the **Hessian matrix** of second partial derivatives:

$$H=\\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{bmatrix}.$$

(Here $f_{xx}$ differentiates $f_x$ again by $x$, $f_{xy}$ differentiates $f_x$ by $y$, etc.; for nice functions $f_{xy}=f_{yx}$.) The test uses its **determinant** $\\det H = f_{xx}f_{yy}-f_{xy}^{2}$, evaluated at the stationary point:

- $\\det H>0$ and $f_{xx}>0$ → **local minimum** (curves up both ways);
- $\\det H>0$ and $f_{xx}<0$ → **local maximum** (curves down both ways);
- $\\det H<0$ → **saddle point** (curves up one way, down another);
- $\\det H=0$ → **inconclusive**.

The cross term $f_{xy}^{2}$ is what makes a saddle detectable: it measures how the two directions interact. This is the genuine 2D generalisation of the single-variable second-derivative test, and the same Hessian idea — now an $n\\times n$ matrix — is exactly how optimisation algorithms classify critical points in high-dimensional machine-learning models.`,
        flashcardFront: `Write the Hessian and the determinant test for classifying a 2D stationary point. What does $\\det H<0$ indicate?`,
        flashcardBack: `Hessian $H=\\begin{bmatrix}f_{xx}&f_{xy}\\\\f_{yx}&f_{yy}\\end{bmatrix}$ with $\\det H=f_{xx}f_{yy}-f_{xy}^{2}$ (evaluated at the stationary point). Test:
- $\\det H>0,\\ f_{xx}>0$ → **local minimum**
- $\\det H>0,\\ f_{xx}<0$ → **local maximum**
- $\\det H<0$ → **saddle point**
- $\\det H=0$ → inconclusive.

$\\det H<0$ indicates a **saddle point**: the surface curves *upward* in one direction and *downward* in another (like a mountain pass), so it's neither a max nor a min even though the tangent plane is flat. The negative determinant signals these conflicting curvatures.`,
      },
      {
        name: "Finding Global Extrema in Two Variables",
        orderIndex: 3,
        prerequisites: ["The Hessian and Classifying Stationary Points"],
        explanation: `The Hessian test only finds **local** behaviour at interior flat points. To find the **global** maximum or minimum of $f(x,y)$ over a region, you must also check the **boundary** — the extreme value can sit on the edge of the feasible region where the gradient need not vanish.

The full procedure:

1. Find all interior **stationary points** ($f_x=f_y=0$) and evaluate $f$ there.
2. Examine the **boundary** of the region. On each boundary piece, substitute its equation to reduce $f$ to a **single-variable** function, then optimise that (and include the corner points).
3. **Compare all candidate values** — the largest is the global maximum, the smallest the global minimum.

A powerful shortcut comes from **convexity**: if $f$ is convex on the whole region (e.g. the Hessian satisfies $\\det H\\ge 0$ and $f_{xx}\\ge 0$ everywhere), then any interior stationary point is automatically the **global minimum** — no boundary check needed. This is why convex optimisation is so desirable in machine learning: a single gradient calculation locates the global optimum with a guarantee, instead of leaving you to worry about other valleys or the boundary.`,
        flashcardFront: `To find the global maximum of $f(x,y)$ over a region, why isn't it enough to find interior stationary points? What shortcut does convexity give?`,
        flashcardBack: `Interior stationary points only capture flat spots *inside* the region. A continuous function on a closed bounded region can attain its global max/min **on the boundary**, where $\\nabla f$ need not be zero. So you must (1) evaluate $f$ at interior stationary points, (2) optimise $f$ along each boundary piece (reduce to one variable) including corners, and (3) compare **all** these values — the biggest is the global maximum.

**Convexity shortcut:** if $f$ is convex everywhere on the region (Hessian "positive" throughout: $\\det H\\ge0$, $f_{xx}\\ge0$), then any stationary point is automatically the **global minimum** — there are no other valleys and no need to scour the boundary. That guarantee is the appeal of convex optimisation.`,
      },
    ],
  },

  // ── WEEK 9 — Counting and Combinatorics (Lectures 17–18) ──────────────────
  {
    index: 9,
    title: "Counting and Combinatorics",
    cheatSheet: `## Counting & Combinatorics

**Three basic rules**
- **Multiplication (product) rule** — a sequence of independent choices with $n_1,n_2,\\dots$ options multiplies: $n_1\\times n_2\\times\\cdots$.
- **Addition rule** — mutually exclusive cases add: $|A\\cup B|=|A|+|B|$ when disjoint.
- **Complement rule** — count the opposite: (wanted) = (total) − (unwanted).

**Factorials & the four types of selection** — choosing $r$ from $n$:

| | ordered | unordered |
|---|---|---|
| **no repetition** | $\\dfrac{n!}{(n-r)!}$ | $\\dbinom{n}{r}$ |
| **with repetition** | $n^{r}$ | $\\dbinom{n+r-1}{r}$ |

$n!=n(n-1)\\cdots1$, $\\ 0!=1$.

**Binomial coefficient** — number of $r$-subsets of $n$:
$$\\binom{n}{r}=\\frac{n!}{r!\\,(n-r)!}.$$

**Inclusion–Exclusion** (two sets):
$$|A\\cup B|=|A|+|B|-|A\\cap B|.$$

**Pigeonhole principle** — putting $n$ items into $k<n$ boxes forces some box to hold $\\ge 2$ items (more generally $\\ge\\lceil n/k\\rceil$).`,
    concepts: [
      {
        name: "The Multiplication, Addition and Complement Rules",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Counting "how many?" rests on three rules. The **multiplication (product) rule**: if a task is a *sequence* of independent steps with $n_1$ options for the first, $n_2$ for the second, and so on, the total number of outcomes is the **product** $n_1\\times n_2\\times\\cdots$. For example a menu with 3 starters and 4 mains offers $3\\times4=12$ meals; a 4-digit PIN has $10^{4}=10000$ possibilities.

The **addition rule** handles *alternatives*: if you must pick from one of several **mutually exclusive** groups, the totals **add**. With 5 novels and 3 poetry books, there are $5+3=8$ ways to choose one book. The keyword is "or" between disjoint options — versus "and then" for the product rule.

The **complement rule** is a frequent shortcut: when the thing you want is awkward to count but its *opposite* is easy, use

$$(\\text{wanted})=(\\text{total})-(\\text{unwanted}).$$

E.g. the number of 4-letter strings containing *at least one* vowel is easier as (all strings) − (no vowels). Choosing the right combination of these three rules solves most counting problems.`,
        flashcardFront: `When do you multiply vs add counts, and what is the complement rule? How many 4-digit PINs have at least one digit equal to 0?`,
        flashcardBack: `**Multiply** when an outcome is a *sequence* of independent steps ("do this **and then** that"): total $=n_1\\times n_2\\times\\cdots$. **Add** when choosing among *mutually exclusive* alternatives ("this **or** that", disjoint groups): total $=|A|+|B|$.

**Complement rule:** (wanted) = (total) − (unwanted) — count the easy opposite and subtract.

PINs with **at least one 0**: counting directly is messy, so use the complement. Total PINs $=10^4=10000$. PINs with **no** 0: each digit has 9 choices, $9^4=6561$. So at least one 0 $=10000-6561=\\mathbf{3439}$.`,
      },
      {
        name: "Permutations and the Four Types of Selection",
        orderIndex: 2,
        prerequisites: ["The Multiplication, Addition and Complement Rules"],
        explanation: `Selecting $r$ items from $n$ has **four** flavours, depending on whether **order matters** and whether **repetition is allowed**. The **factorial** $n!=n(n-1)\\cdots2\\cdot1$ (with $0!=1$) counts the orderings of $n$ distinct items.

- **Ordered, no repetition** (*permutations*): $\\dfrac{n!}{(n-r)!}=n(n-1)\\cdots(n-r+1)$. First pick has $n$ options, next $n-1$, etc. (e.g. gold/silver/bronze from 8 runners: $8\\cdot7\\cdot6=336$).
- **Ordered, with repetition**: $n^{r}$ — each of the $r$ slots independently has $n$ options (e.g. a 3-letter code from 26 letters: $26^{3}$).
- **Unordered, no repetition** (*combinations*): $\\binom{n}{r}$ — covered next.
- **Unordered, with repetition**: $\\binom{n+r-1}{r}$ ("stars and bars").

The two questions to ask every counting problem are: *does order matter?* and *can items repeat?* — they pick the formula. Order matters for rankings, passwords, sequences; it doesn't for committees, hands of cards, subsets.`,
        flashcardFront: `What two questions decide which selection formula to use? In how many ways can 3 of 8 runners take gold, silver and bronze?`,
        flashcardBack: `Ask: **(1) does order matter?** and **(2) is repetition allowed?** Those two yes/no answers select one of the four formulas:
- ordered, no repeat: $\\frac{n!}{(n-r)!}$
- ordered, with repeat: $n^r$
- unordered, no repeat: $\\binom{n}{r}$
- unordered, with repeat: $\\binom{n+r-1}{r}$.

Medals are **ordered** (gold ≠ silver) and use **no repetition** (one medal each), so it's a permutation: $\\frac{8!}{(8-3)!}=8\\cdot7\\cdot6=\\mathbf{336}$ ways.`,
      },
      {
        name: "Combinations and Binomial Coefficients",
        orderIndex: 3,
        prerequisites: ["Permutations and the Four Types of Selection"],
        explanation: `When **order doesn't matter** and there's **no repetition**, we count **combinations** — the number of $r$-element subsets of an $n$-element set — given by the **binomial coefficient**:

$$\\binom{n}{r}=\\frac{n!}{r!\\,(n-r)!}.$$

The logic: there are $\\frac{n!}{(n-r)!}$ ordered selections, but each unordered subset has been counted $r!$ times (once per ordering of its $r$ members), so we divide by $r!$. Read "$\\binom{n}{r}$" as "$n$ choose $r$". For example a 5-card hand from 52 cards: $\\binom{52}{5}=2{,}598{,}960$.

Two facts are worth memorising: the **symmetry** $\\binom{n}{r}=\\binom{n}{n-r}$ (choosing what to keep = choosing what to leave out), and the boundary values $\\binom{n}{0}=\\binom{n}{n}=1$. They're called *binomial* coefficients because they're the coefficients in $(a+b)^{n}=\\sum_{r=0}^{n}\\binom{n}{r}a^{r}b^{n-r}$, and they appear all over probability — counting how many ways an event can happen.`,
        flashcardFront: `What does $\\binom{n}{r}$ count, why is there a division by $r!$, and what is $\\binom{n}{r}$ vs $\\binom{n}{n-r}$?`,
        flashcardBack: `$\\binom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}$ counts the **$r$-element subsets** of an $n$-set — unordered selections without repetition ("$n$ choose $r$").

The **division by $r!$** corrects for over-counting: there are $\\frac{n!}{(n-r)!}$ *ordered* selections, but a subset doesn't care about order, and its $r$ elements can be arranged in $r!$ ways — all the same subset. Dividing by $r!$ collapses those duplicates.

**Symmetry:** $\\binom{n}{r}=\\binom{n}{n-r}$ — choosing the $r$ to include is equivalent to choosing the $n-r$ to exclude, so the counts are equal.`,
      },
      {
        name: "Inclusion–Exclusion and the Pigeonhole Principle",
        orderIndex: 4,
        prerequisites: ["The Multiplication, Addition and Complement Rules"],
        explanation: `The addition rule only works for **disjoint** sets. When sets **overlap**, naively adding double-counts the shared part, so we correct with **Inclusion–Exclusion**. For two sets:

$$|A\\cup B|=|A|+|B|-|A\\cap B|,$$

and for three: $|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|$ — add singles, subtract pairs, add the triple. E.g. of 100 students, 60 take maths, 45 take stats, 30 take both: those taking at least one $=60+45-30=75$.

A different but equally handy counting fact is the **Pigeonhole Principle**: if you place $n$ items into $k$ boxes and $n>k$, then **some box contains at least two items**. More precisely, some box holds at least $\\lceil n/k\\rceil$ items. It sounds obvious but proves surprising results — e.g. in any group of 13 people, two share a birth **month** (13 people, 12 months); among any 367 people, two share a birthday. It's a favourite tool for guaranteeing that a coincidence *must* exist without constructing it.`,
        flashcardFront: `State two-set Inclusion–Exclusion and the Pigeonhole Principle. Of 100 students, 60 do maths, 45 do stats, 30 do both — how many do at least one?`,
        flashcardBack: `**Inclusion–Exclusion (two sets):** $|A\\cup B|=|A|+|B|-|A\\cap B|$ — add the two counts but subtract the overlap, which was counted twice.

**Pigeonhole Principle:** if $n$ items go into $k$ boxes with $n>k$, some box gets **at least two** items (in general, at least $\\lceil n/k\\rceil$). It guarantees an unavoidable collision.

Students doing at least one subject: $|M\\cup S|=|M|+|S|-|M\\cap S|=60+45-30=\\mathbf{75}$. (The 30 who do both were counted in both 60 and 45, so subtract them once.)`,
      },
    ],
  },

  // ── WEEK 10 — Probability (Lectures 19–20) ────────────────────────────────
  {
    index: 10,
    title: "Probability and Conditional Probability",
    cheatSheet: `## Probability

**Basics** — a **sample space** $\\Omega$ is the set of all outcomes; an **event** $A\\subseteq\\Omega$ is a set of outcomes. Probability $P$ obeys:
$$0\\le P(A)\\le 1,\\quad P(\\Omega)=1,\\quad P(A\\cup B)=P(A)+P(B)\\ \\text{if disjoint}.$$
**Equally likely** outcomes: $P(A)=\\dfrac{|A|}{|\\Omega|}$ (counting!). **Complement:** $P(A^{c})=1-P(A)$.

**Independence** — $A,B$ independent iff
$$P(A\\cap B)=P(A)\\,P(B).$$

**Conditional probability** — probability of $A$ given $B$ occurred:
$$P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}\\quad(P(B)>0).$$
Rearranged: $P(A\\cap B)=P(A\\mid B)\\,P(B)$.

**Law of total probability** (partition $B,B^{c}$):
$$P(A)=P(A\\mid B)P(B)+P(A\\mid B^{c})P(B^{c}).$$

**Bayes' theorem** — flip the conditioning:
$$P(B\\mid A)=\\frac{P(A\\mid B)\\,P(B)}{P(A)}.$$`,
    concepts: [
      {
        name: "Probability Basics and Axioms",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Probability quantifies uncertainty. The **sample space** $\\Omega$ is the set of all possible outcomes of an experiment (for a die, $\\Omega=\\{1,2,3,4,5,6\\}$); an **event** $A$ is a subset of outcomes ("even" is $\\{2,4,6\\}$). A probability $P$ assigns each event a number obeying three **axioms**:

- $0\\le P(A)\\le 1$ (probabilities are between impossible and certain);
- $P(\\Omega)=1$ (something must happen);
- if $A$ and $B$ are **disjoint** (can't both occur), $P(A\\cup B)=P(A)+P(B)$.

From these follows the constantly-used **complement rule** $P(A^{c})=1-P(A)$.

When all outcomes are **equally likely**, probability reduces to *counting*:

$$P(A)=\\frac{|A|}{|\\Omega|}=\\frac{\\text{favourable outcomes}}{\\text{total outcomes}}.$$

This is why Week 9's combinatorics matters — e.g. the chance two dice sum to 7 is $\\frac{6}{36}=\\frac16$, and the probability of a specific poker hand is a ratio of binomial coefficients. Probability is the language data science uses to measure predictability and draw inferences from data.`,
        flashcardFront: `State the three probability axioms. For equally likely outcomes, how is $P(A)$ computed? Find $P(\\text{sum}=7)$ for two dice.`,
        flashcardBack: `**Axioms:** (1) $0\\le P(A)\\le1$; (2) $P(\\Omega)=1$ (the whole sample space is certain); (3) for **disjoint** events, $P(A\\cup B)=P(A)+P(B)$. (These give the complement rule $P(A^c)=1-P(A)$.)

For **equally likely** outcomes, $P(A)=\\dfrac{|A|}{|\\Omega|}$ — favourable outcomes over total outcomes (pure counting).

Two dice: $|\\Omega|=36$ equally likely ordered pairs. Sum $=7$ occurs for $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ — 6 outcomes. So $P(\\text{sum}=7)=\\frac{6}{36}=\\frac{1}{6}$.`,
      },
      {
        name: "Independence",
        orderIndex: 2,
        prerequisites: ["Probability Basics and Axioms"],
        explanation: `Two events are **independent** when one occurring tells you **nothing** about the other. The precise definition is multiplicative:

$$A,B\\text{ independent}\\iff P(A\\cap B)=P(A)\\,P(B).$$

So the probability that *both* happen is the product of their individual probabilities. For example, two separate fair coin flips: $P(\\text{both heads})=\\tfrac12\\cdot\\tfrac12=\\tfrac14$. Drawing cards **with replacement** keeps draws independent; **without replacement** makes them dependent (the first draw changes the deck).

⚠️ Don't confuse **independent** with **disjoint** (mutually exclusive) — they're nearly opposite. Disjoint events *can't co-occur*, so if one happens the other definitely didn't — that's maximal dependence, and for events of positive probability disjoint implies **not** independent.

Independence is the assumption that makes probability tractable: it lets you multiply probabilities across many events. The "naive Bayes" classifier, for instance, gets its speed by *assuming* features are independent given the class — often false, but useful.`,
        flashcardFront: `Define independence of events $A,B$. Why are "independent" and "disjoint" not the same thing?`,
        flashcardBack: `$A$ and $B$ are **independent** iff $P(A\\cap B)=P(A)\\,P(B)$ — the chance both occur is the product of the separate chances, meaning one event carries no information about the other.

**Independent ≠ disjoint.** *Disjoint* (mutually exclusive) means $A\\cap B=\\varnothing$, so $P(A\\cap B)=0$ — they *can't both happen*. That's actually strong **dependence**: if $A$ occurs, you know $B$ did not. For events with $P(A),P(B)>0$, disjoint events are never independent (since $P(A)P(B)>0\\neq0$). Independence is about *no influence*; disjointness is about *cannot co-occur*.`,
      },
      {
        name: "Conditional Probability",
        orderIndex: 3,
        prerequisites: ["Independence"],
        explanation: `**Conditional probability** updates a probability once you learn that another event has occurred. The probability of $A$ **given** $B$ is

$$P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}\\qquad(P(B)>0).$$

Intuitively, learning $B$ happened shrinks the sample space to just $B$, so you re-weigh: of the $B$-world, what fraction is also $A$? For example, drawing one card, $P(\\text{King}\\mid\\text{face card})=\\frac{4/52}{12/52}=\\frac{4}{12}=\\frac13$ — among the 12 face cards, 4 are kings.

Rearranging gives the **multiplication rule** $P(A\\cap B)=P(A\\mid B)\\,P(B)$, the standard way to compute "and" probabilities for dependent events.

Conditioning connects back to independence: $A$ and $B$ are independent **exactly when** $P(A\\mid B)=P(A)$ — knowing $B$ doesn't change $A$'s probability. Conditional probability is the mathematical core of *learning from evidence*, which is precisely what data science and machine learning do: update beliefs as data arrives.`,
        flashcardFront: `Define $P(A\\mid B)$ and explain the intuition. Compute $P(\\text{King}\\mid\\text{face card})$ for a single card draw. How does this relate to independence?`,
        flashcardBack: `$P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$ (for $P(B)>0$): the probability of $A$ **given** $B$ occurred. Intuition — knowing $B$ happened restricts the world to $B$, so you ask what fraction of that $B$-world is also $A$, re-normalising by $P(B)$.

A deck has 12 face cards, 4 of them kings: $P(\\text{King}\\mid\\text{face})=\\dfrac{4/52}{12/52}=\\dfrac{4}{12}=\\dfrac13$.

**Link to independence:** $A,B$ are independent exactly when $P(A\\mid B)=P(A)$ — conditioning on $B$ leaves $A$'s probability unchanged, i.e. $B$ gives no information about $A$.`,
      },
      {
        name: "Bayes' Theorem and the Law of Total Probability",
        orderIndex: 4,
        prerequisites: ["Conditional Probability"],
        explanation: `Often you know $P(A\\mid B)$ but want $P(B\\mid A)$ — the conditioning the *other way round*. Two results make this routine.

The **Law of Total Probability** assembles an overall probability from cases. If $B$ and its complement $B^{c}$ partition the sample space,

$$P(A)=P(A\\mid B)\\,P(B)+P(A\\mid B^{c})\\,P(B^{c}).$$

**Bayes' Theorem** then flips the conditioning:

$$P(B\\mid A)=\\frac{P(A\\mid B)\\,P(B)}{P(A)}.$$

This is the engine of evidence-based reasoning: $P(B)$ is your **prior** belief, $P(A\\mid B)$ the **likelihood** of the evidence, and $P(B\\mid A)$ the updated **posterior**. The famous counterintuitive case is **medical testing**: a disease affects $1\\%$ of people, a test is $99\\%$ accurate, you test positive — yet $P(\\text{disease}\\mid +)$ is only about $50\\%$, because the huge healthy majority generates many false positives. Bayes' theorem is foundational to spam filters, diagnostics, and Bayesian machine learning.`,
        flashcardFront: `State Bayes' theorem and the law of total probability. Why can $P(\\text{disease}\\mid \\text{positive test})$ be far below the test's accuracy?`,
        flashcardBack: `**Law of total probability** (partition $B,B^c$): $P(A)=P(A\\mid B)P(B)+P(A\\mid B^c)P(B^c)$ — combine the conditional probabilities weighted by how likely each case is.

**Bayes' theorem:** $P(B\\mid A)=\\dfrac{P(A\\mid B)\\,P(B)}{P(A)}$ — flips $P(A\\mid B)$ into $P(B\\mid A)$ using the prior $P(B)$.

In the disease example, even a $99\\%$-accurate test gives a low $P(\\text{disease}\\mid+)$ because the disease is **rare** (low prior). The few true positives from the $1\\%$ who are sick are swamped by the **false positives** from the huge $99\\%$ who are healthy ($1\\%$ of a large group). Bayes weighs the evidence against the prior, so a rare condition needs strong evidence to become probable.`,
      },
    ],
  },

  // ── WEEK 11 — Random Variables and Distributions (Lectures 21–22) ─────────
  {
    index: 11,
    title: "Random Variables and Distributions",
    cheatSheet: `## Random Variables & Distributions

**Random variable (RV)** — a function $X$ assigning a number to each outcome (e.g. the sum of two dice).

**Expected value (mean)** — the long-run average:
$$E[X]=\\sum_x x\\,P(X=x)\\quad(\\text{discrete}).$$
Linearity: $E[aX+b]=aE[X]+b$ and $E[X+Y]=E[X]+E[Y]$ (always).

**Variance & standard deviation** — spread about the mean:
$$\\operatorname{Var}(X)=E\\big[(X-E[X])^{2}\\big]=E[X^{2}]-(E[X])^{2},\\qquad \\sigma=\\sqrt{\\operatorname{Var}(X)}.$$
$\\operatorname{Var}(aX+b)=a^{2}\\operatorname{Var}(X)$.

**Discrete distributions**
- **Uniform** on $\\{1,\\dots,n\\}$: each value prob $1/n$.
- **Binomial** $B(n,p)$ — number of successes in $n$ independent trials: $P(X=k)=\\binom{n}{k}p^{k}(1-p)^{n-k}$, $E[X]=np$, $\\operatorname{Var}=np(1-p)$.

**Continuous RVs** — described by a density $f(x)\\ge0$ with $\\int f=1$; probabilities are **areas**: $P(a\\le X\\le b)=\\int_a^b f(x)\\,dx$.
- **Normal** $N(\\mu,\\sigma^{2})$ — the bell curve; mean $\\mu$, sd $\\sigma$.`,
    concepts: [
      {
        name: "Random Variables and Expected Value",
        orderIndex: 1,
        prerequisites: [],
        explanation: `A **random variable** $X$ is a function that attaches a **number** to every outcome of an experiment. Rolling two dice and adding them defines $X\\in\\{2,\\dots,12\\}$; the number of heads in 10 flips is a random variable. It turns messy outcomes into numbers we can average and analyse.

The **expected value** (or *mean*) $E[X]$ is the long-run average value of $X$ over many repetitions — each value weighted by its probability:

$$E[X]=\\sum_x x\\,P(X=x).$$

For one fair die, $E[X]=\\frac{1}{6}(1+2+\\cdots+6)=3.5$ — note the expected value need not be an attainable outcome; it's a balance point. A crucial, almost magical property is **linearity of expectation**:

$$E[aX+b]=aE[X]+b,\\qquad E[X+Y]=E[X]+E[Y],$$

and the second holds **even when $X$ and $Y$ are dependent**. That makes expected values easy to combine — e.g. the expected sum of two dice is just $3.5+3.5=7$ — and underlies risk and reward calculations throughout statistics and machine learning.`,
        flashcardFront: `What is a random variable, how is $E[X]$ defined, and what does linearity of expectation say? Find $E[X]$ for one fair die.`,
        flashcardBack: `A **random variable** $X$ assigns a number to each outcome of an experiment (turning outcomes into measurable quantities). Its **expected value** is the probability-weighted average $E[X]=\\sum_x x\\,P(X=x)$ — the long-run mean.

**Linearity of expectation:** $E[aX+b]=aE[X]+b$ and $E[X+Y]=E[X]+E[Y]$; remarkably the sum rule holds **even for dependent** $X,Y$.

One fair die: $E[X]=\\frac{1}{6}(1+2+3+4+5+6)=\\frac{21}{6}=3.5$. (Note 3.5 isn't a possible roll — the mean is a balance point, not necessarily an outcome.)`,
      },
      {
        name: "Variance and Standard Deviation",
        orderIndex: 2,
        prerequisites: ["Random Variables and Expected Value"],
        explanation: `The mean tells you the centre; **variance** tells you the **spread**. It is the expected squared distance from the mean:

$$\\operatorname{Var}(X)=E\\big[(X-E[X])^{2}\\big]=E[X^{2}]-(E[X])^{2}.$$

The second form (mean of the square minus square of the mean) is usually easier to compute. We square the deviations so positive and negative gaps don't cancel and so large deviations are penalised — but squaring also changes the units, so we take the square root to get the **standard deviation**

$$\\sigma=\\sqrt{\\operatorname{Var}(X)},$$

which lives in the same units as $X$ and is the natural measure of "typical deviation from the mean".

Scaling behaves differently from the mean: $\\operatorname{Var}(aX+b)=a^{2}\\operatorname{Var}(X)$ — adding a constant $b$ shifts everything and doesn't change spread, while multiplying by $a$ scales the spread by $a^{2}$ (or $|a|$ for $\\sigma$). Variance and standard deviation are everywhere in data science: they quantify uncertainty, drive the normal distribution, and define notions like the "bias–variance tradeoff".`,
        flashcardFront: `Give two formulas for $\\operatorname{Var}(X)$ and define standard deviation. Why square the deviations, and what is $\\operatorname{Var}(aX+b)$?`,
        flashcardBack: `$\\operatorname{Var}(X)=E[(X-E[X])^2]=E[X^2]-(E[X])^2$ (the second form — "mean of square minus square of mean" — is the easy one to compute). The **standard deviation** is $\\sigma=\\sqrt{\\operatorname{Var}(X)}$.

We **square** the deviations so that positive and negative gaps from the mean don't cancel, and so large misses count more; we then square-root for $\\sigma$ to return to the original units (a "typical" deviation).

**Scaling:** $\\operatorname{Var}(aX+b)=a^2\\operatorname{Var}(X)$ — the shift $b$ doesn't affect spread, and the factor $a$ scales variance by $a^2$ (so $\\sigma$ by $|a|$).`,
      },
      {
        name: "Discrete Distributions: Uniform and Binomial",
        orderIndex: 3,
        prerequisites: ["Variance and Standard Deviation"],
        explanation: `A **distribution** specifies the probability of each value a random variable can take. Two discrete ones are essential.

The **discrete uniform** distribution on $\\{1,2,\\dots,n\\}$ gives every value equal probability $\\frac1n$ — the model for a fair die or a random integer.

The **binomial** distribution $B(n,p)$ counts the number of **successes** in $n$ **independent** trials, each succeeding with probability $p$ (e.g. heads in $n$ flips, defective items in a batch). Its probability mass function combines counting and independence:

$$P(X=k)=\\binom{n}{k}p^{k}(1-p)^{n-k},$$

the $\\binom{n}{k}$ counting which trials succeed, $p^{k}(1-p)^{n-k}$ giving the probability of any one such pattern. Its summary statistics are clean:

$$E[X]=np,\\qquad \\operatorname{Var}(X)=np(1-p).$$

So in 100 fair-coin flips you expect $np=50$ heads with standard deviation $\\sqrt{100\\cdot0.5\\cdot0.5}=5$. The binomial is the foundational model for repeated yes/no experiments — A/B tests, conversion rates, and reliability all rest on it.`,
        flashcardFront: `What does the binomial $B(n,p)$ model, what is $P(X=k)$, and what are its mean and variance? Expected heads and sd in 100 fair flips?`,
        flashcardBack: `$B(n,p)$ models the number of **successes in $n$ independent trials**, each with success probability $p$. Its pmf is
$$P(X=k)=\\binom{n}{k}p^{k}(1-p)^{n-k},$$
where $\\binom{n}{k}$ counts which $k$ trials succeed and $p^k(1-p)^{n-k}$ is one such pattern's probability. Mean and variance: $E[X]=np$, $\\operatorname{Var}(X)=np(1-p)$.

For 100 fair flips ($n=100$, $p=0.5$): expected heads $=np=50$, variance $=np(1-p)=100(0.5)(0.5)=25$, so standard deviation $=\\sqrt{25}=5$.`,
      },
      {
        name: "Continuous Random Variables and the Normal Distribution",
        orderIndex: 4,
        prerequisites: ["Discrete Distributions: Uniform and Binomial"],
        explanation: `When a quantity varies on a continuum (height, time, temperature), individual values each have probability **zero**, so we describe it with a **probability density function** $f(x)\\ge0$ instead. Probabilities are **areas** under the density — exactly the definite integrals from Week 4:

$$P(a\\le X\\le b)=\\int_a^b f(x)\\,dx,\\qquad \\int_{-\\infty}^{\\infty} f(x)\\,dx=1.$$

The total area is $1$ (something happens), and only *ranges*, not single points, carry probability.

The most important continuous distribution is the **normal** (or *Gaussian*) $N(\\mu,\\sigma^{2})$ — the symmetric **bell curve** centred at its mean $\\mu$ with spread set by its standard deviation $\\sigma$. The famous **68–95–99.7 rule** says about $68\\%$ of the probability lies within $1\\sigma$ of the mean, $95\\%$ within $2\\sigma$, and $99.7\\%$ within $3\\sigma$.

The normal distribution dominates statistics because of the **Central Limit Theorem**: sums and averages of many independent random effects tend to a normal shape, regardless of the original distribution. That's why measurement errors, averages, and the binomial (for large $n$) all look bell-shaped — and why the normal underpins confidence intervals, hypothesis tests, and much of machine learning.`,
        flashcardFront: `For a continuous RV, how are probabilities obtained from the density $f(x)$? Describe the normal distribution and the 68–95–99.7 rule.`,
        flashcardBack: `For a continuous random variable, single values have probability $0$; instead a **density** $f(x)\\ge0$ (with total area $\\int_{-\\infty}^{\\infty}f=1$) gives probabilities as **areas**: $P(a\\le X\\le b)=\\int_a^b f(x)\\,dx$.

The **normal** $N(\\mu,\\sigma^2)$ is the symmetric **bell curve** centred at mean $\\mu$, with width controlled by standard deviation $\\sigma$. The **68–95–99.7 rule**: roughly $68\\%$ of values lie within $\\pm1\\sigma$ of $\\mu$, $95\\%$ within $\\pm2\\sigma$, and $99.7\\%$ within $\\pm3\\sigma$. It's ubiquitous because the Central Limit Theorem makes sums/averages of many independent effects approximately normal.`,
      },
    ],
  },

  // ── WEEK 12 — Graphs and Trees (Lectures 23–24) ───────────────────────────
  {
    index: 12,
    title: "Graphs and Trees",
    cheatSheet: `## Graphs & Trees

**Graph** — a set of **vertices** $V$ joined by **edges** $E$ (each edge connects two vertices). Models networks: social, road, web, dependency.

**Degree** — $\\deg(v)$ = number of edges at $v$. **Handshake lemma:**
$$\\sum_{v\\in V}\\deg(v)=2|E|$$
(each edge adds 1 to two degrees) — so the number of **odd-degree vertices is even**.

**Walks, paths, cycles** — a **walk** is a sequence of adjacent vertices; a **path** repeats no vertex; a **cycle** is a closed path. A graph is **connected** if there's a path between every pair.

**Tree** — a **connected** graph with **no cycles**. Key facts: a tree on $n$ vertices has exactly $n-1$ edges, and there is a **unique path** between any two vertices.

**Adjacency matrix** — $A$ with $A_{ij}=1$ if $i,j$ are joined (else $0$); symmetric for undirected graphs. $(A^{k})_{ij}$ counts walks of length $k$ from $i$ to $j$.

**Euler vs Hamilton** — an **Euler** trail/circuit uses every **edge** once (exists iff $\\le 2$ / $0$ odd-degree vertices); a **Hamilton** path/cycle visits every **vertex** once (hard in general).`,
    concepts: [
      {
        name: "Graphs: Vertices, Edges and Degree",
        orderIndex: 1,
        prerequisites: [],
        explanation: `A **graph** $G=(V,E)$ is a set of **vertices** (nodes) $V$ together with a set of **edges** $E$, where each edge joins a pair of vertices. It is the universal model for *things and the connections between them*: people and friendships, cities and roads, web pages and links, tasks and dependencies. Two vertices joined by an edge are **adjacent**.

The **degree** of a vertex $v$, written $\\deg(v)$, is the number of edges meeting it. Degrees obey a beautifully simple law, the **Handshake Lemma**:

$$\\sum_{v\\in V}\\deg(v)=2|E|.$$

The reason: each edge has two endpoints, so it contributes exactly $1$ to the degree of two vertices — counting all degrees counts every edge twice. An immediate, surprising corollary: **the number of odd-degree vertices is always even** (so at a party, the number of people who have shaken hands an odd number of times is even). Degree is the most basic measure of a vertex's importance, and refined versions of it (centrality) rank influential nodes in social and information networks.`,
        flashcardFront: `What is the degree of a vertex, and what does the Handshake Lemma state? Why must the number of odd-degree vertices be even?`,
        flashcardBack: `The **degree** $\\deg(v)$ is the number of edges incident to vertex $v$. The **Handshake Lemma** states $\\sum_{v}\\deg(v)=2|E|$ — the degrees sum to twice the number of edges, because each edge has two endpoints and so adds $1$ to two vertices' degrees.

Since the total $\\sum\\deg(v)=2|E|$ is **even**, and the even-degree vertices contribute an even amount, the odd-degree vertices must contribute an even total too. A sum of odd numbers is even only when there's an **even count** of them — hence the number of odd-degree vertices is always even.`,
      },
      {
        name: "Walks, Paths, Cycles and Connectivity",
        orderIndex: 2,
        prerequisites: ["Graphs: Vertices, Edges and Degree"],
        explanation: `Movement through a graph follows edges. A **walk** is a sequence of vertices where consecutive ones are joined by an edge — repetition of vertices and edges is allowed. Tightening the rules gives the key terms:

- a **path** is a walk that repeats **no vertex** (so no edge either);
- a **cycle** is a closed path — it starts and ends at the same vertex, otherwise repeating none.

These let us define **connectivity**: a graph is **connected** if there is a path between **every** pair of vertices — the network is "all one piece". If not, it splits into **connected components** (separate islands). For a road network, connectivity means you can drive from any town to any other; a disconnected social network has isolated groups.

Whether short paths or cycles exist drives countless applications: shortest-path routing (GPS, packet routing), detecting cycles (deadlocks, circular dependencies), and measuring how tightly knit a community is. The distinction between a *walk* (anything goes) and a *path* (no repeats) is exactly what separates "is it reachable?" from "what's the efficient route?".`,
        flashcardFront: `Distinguish a walk, a path, and a cycle. What does it mean for a graph to be connected?`,
        flashcardBack: `A **walk** is a sequence of vertices with each consecutive pair joined by an edge — **repeats are allowed**. A **path** is a walk that **repeats no vertex** (hence no edge). A **cycle** is a **closed path**: it returns to its start, otherwise repeating no vertex.

A graph is **connected** if there is a **path between every pair of vertices** — it's all one piece, so you can get from any vertex to any other. If it isn't connected, it breaks into separate **connected components** (isolated sub-graphs with no edges between them).`,
      },
      {
        name: "Trees",
        orderIndex: 3,
        prerequisites: ["Walks, Paths, Cycles and Connectivity"],
        explanation: `A **tree** is a **connected** graph with **no cycles** — the leanest possible connected structure, with just enough edges to hold everything together and not one more. Family trees, file-system folders, decision trees and organisational charts are all trees.

Trees have several equivalent defining properties, each useful:

- a tree on $n$ vertices has **exactly $n-1$ edges** (the minimum for connectivity — removing any edge disconnects it);
- there is a **unique path between any two vertices** (no cycles means no alternative routes);
- adding any new edge creates **exactly one cycle**, while removing any edge **disconnects** the tree.

Vertices of degree $1$ are called **leaves**. The "unique path" property is what makes trees so computationally friendly: hierarchies, search structures (binary search trees), and the **decision trees** of machine learning all exploit it — every item has one well-defined route from the root. Spanning trees (a tree touching every vertex of a larger graph) also solve network-design problems like laying minimum-length cable.`,
        flashcardFront: `Define a tree. How many edges does a tree on $n$ vertices have, and why is the path between any two vertices unique?`,
        flashcardBack: `A **tree** is a **connected** graph with **no cycles** — connected with the fewest possible edges.

A tree on $n$ vertices has exactly **$n-1$ edges**: that's the minimum needed for connectivity (any fewer disconnects it), and having no cycles means it has no "spare" edges beyond that.

The path between any two vertices is **unique** because a *second* distinct path between the same pair would, combined with the first, form a **cycle** — contradicting the no-cycles property. So acyclic + connected forces exactly one route between every pair, which is what makes trees ideal for hierarchies and search.`,
      },
      {
        name: "Adjacency Matrices, Euler and Hamilton",
        orderIndex: 4,
        prerequisites: ["Walks, Paths, Cycles and Connectivity"],
        explanation: `Graphs connect back to linear algebra through the **adjacency matrix** $A$: for a graph on vertices $1,\\dots,n$, set $A_{ij}=1$ if vertices $i$ and $j$ are joined by an edge, and $0$ otherwise. For an undirected graph $A$ is **symmetric**. Its real power: **matrix powers count walks** — $(A^{k})_{ij}$ equals the number of walks of length $k$ from $i$ to $j$. This turns connectivity questions into matrix computations (and links to eigenvalues, e.g. in PageRank).

Two famous traversal problems are easy to confuse:

- an **Euler trail/circuit** uses **every edge exactly once**. There's a clean criterion (Euler): a connected graph has an Euler **circuit** iff every vertex has **even degree**, and an Euler **trail** iff exactly **two** vertices have odd degree. This solved the original Königsberg bridges problem.
- a **Hamilton path/cycle** visits **every vertex exactly once**. Despite the similar wording, there is **no** simple degree criterion — deciding whether a Hamilton cycle exists is computationally **hard** (NP-complete), and it underlies the Travelling Salesman Problem.

The contrast — *every edge* (Euler, easy) versus *every vertex* (Hamilton, hard) — is a classic lesson that small changes in a problem's statement can flip it from trivial to intractable.`,
        flashcardFront: `What is the adjacency matrix and what does $(A^{k})_{ij}$ count? Contrast Euler and Hamilton traversals.`,
        flashcardBack: `The **adjacency matrix** $A$ has $A_{ij}=1$ when vertices $i,j$ are joined by an edge, else $0$ (symmetric for undirected graphs). Its powers count walks: $(A^{k})_{ij}$ = the number of **walks of length $k$** from $i$ to $j$.

**Euler** trail/circuit uses **every edge once**; it has a simple test — a connected graph has an Euler **circuit** iff every vertex has **even degree** (Euler **trail** iff exactly two vertices are odd-degree). **Hamilton** path/cycle visits **every vertex once**; it has **no** easy criterion and is **NP-complete** to decide (it's behind the Travelling Salesman Problem). The takeaway: "every edge" is easy, "every vertex" is hard.`,
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEED
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

  try {
    const subject = await db.subject.upsert({
      where: { slug: "maths" },
      create: {
        name: "Mathematical Foundations",
        slug: "maths",
        description: "Linear algebra, probability, statistics",
        category: "Math",
        emoji: "📐",
        status: "published",
        order: 4,
        sessionCount: 12,
      },
      // publish the subject and lock in the 12-week structure
      update: { status: "published", sessionCount: 12 },
    })
    console.log(`\n📚 Subject: ${subject.name} (${subject.id})`)

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

        await db.exercise.create({
          data: {
            conceptId: created.id,
            type: "FLASHCARD",
            front: c.flashcardFront,
            back: c.flashcardBack,
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

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
