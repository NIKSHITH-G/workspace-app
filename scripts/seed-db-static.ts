/**
 * Static seed — no API calls. Hand-authored "Database Systems" content, one
 * session per teaching week, grounded in a standard relational-databases unit
 * (intro → ER modelling → relational model → normalisation → SQL → NoSQL → BI).
 * Mirrors seed-math-static.ts. Run: npx tsx scripts/seed-db-static.ts
 *
 * All cards are MULTIPLE CHOICE (parity with Python): each concept carries
 * `options` (exactly 4, PLAIN TEXT) and `answer` (must match one option).
 * `flashcardFront` is the question (rendered as Markdown — code fences OK);
 * `flashcardBack` is the rationale shown after answering.
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

// Resolve a concept to its card fields. Every DB concept is MCQ.
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
  // ── WEEK 1 — Introduction to Databases ──────────────────────────────────────
  {
    index: 1,
    title: "Introduction to Databases",
    cheatSheet: `## Introduction to Databases

**Before databases**
- *Manual systems* — data on paper in folders/cabinets; slow to update and report.
- *File processing systems* — data in separate computer files, one set per program.

⚠️ Problems with file processing:
- **Data duplication** → the same fact stored in many files, leading to **inconsistency**.
- **Program–data dependence** → change the file layout and every program must change.
- **Islands of information** → limited sharing, weak security.
- **Lengthy development** → answering a new question needs new programming.

**What a database is**
> A **database** is a collection of *logically related* data stored in a single logical repository, together with a description of that data (structures, relationships and access paths).

A **DBMS** (Database Management System) is the software that defines, stores, manages and controls access to the database (e.g. Oracle, MySQL, SQL Server, PostgreSQL).

💡 The DBMS gives us **data independence**: applications ask *what* they want, not *how/where* it is stored.

**Types of database model**
| Model | Note |
|---|---|
| Hierarchical | tree of records (older) |
| Network | records linked as a graph (older) |
| **Relational** | data in tables; **unit focus** |
| Object / Object-Relational | objects + relational |
| NoSQL | non-relational, for big/varied data |

**Client–server view**
A front-end *application (client)* sends requests; the *DBMS (server)* stores and serves the data. This unit focuses on the **back end** (structure, queries, integrity).

🔑 **Collecting personal data responsibly**
- Some information is **sensitive** (race, health, religion, sexual orientation…) and needs explicit consent.
- **Protected attributes** (age, disability, sex, gender identity…) are covered by privacy & anti-discrimination law.
- The **client + legal obligations** decide what to collect — not the designer. Only collect what is *reasonably necessary*.`,
    concepts: [
      {
        name: "From File Processing to Databases",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Before databases, organisations stored data either **manually** (paper records in cabinets) or in **file processing systems** — separate computer files, typically one set of files per application. Each program defined and owned its own files.

This caused four recurring problems:

- **Data duplication.** The same fact (a customer's address, say) was stored in several files. When it changed in one place but not another, the data became **inconsistent** — and you couldn't tell which copy was right.
- **Program–data dependence.** The physical layout of a file was baked into the programs that read it. Changing the file structure forced changes to every program.
- **Islands of information.** Files were hard to share across departments, and security was weak.
- **Lengthy development.** Answering a *new* question often meant writing a *new* program.

A database with a DBMS attacks all four: data is stored once in a shared repository, described separately from the programs, and queried flexibly without rewriting code.`,
        flashcardFront: `In a **file processing system**, the same customer address is stored in three different files. This most directly causes which problem?`,
        options: ["Data duplication leading to inconsistency", "Slow disk hardware", "Loss of referential integrity", "Deadlock between transactions"],
        answer: "Data duplication leading to inconsistency",
        flashcardBack: `Storing the same fact in multiple files is **data duplication (redundancy)**. The danger is that an update changes one copy but not the others, so the copies disagree — that is **data inconsistency**. (Referential integrity and deadlock are relational-database/transaction concepts that come later; the issue here is simply redundant storage.) A database solves this by storing each fact **once** in a shared repository.`,
      },
      {
        name: "What Is a Database and a DBMS",
        orderIndex: 2,
        prerequisites: ["From File Processing to Databases"],
        explanation: `A **database** is a collection of *logically related* data stored in a single logical repository. Crucially, it stores not just the data values but also a **description** of the data: the structures, the relationships between them, and the access paths. (The repository may physically live on one machine, be distributed, or sit in the cloud — that is hidden from users.)

A **Database Management System (DBMS)** is the software layer that defines, stores, manages and controls all access to the database. Examples: Oracle, MySQL, PostgreSQL, SQL Server.

The big win is **data independence**: because the data's structure is described *inside* the database rather than hard-coded into each program, applications can ask *what* data they want and let the DBMS work out *how* to retrieve it. You can run many different queries without changing the structure, and you can change storage details without breaking applications.`,
        flashcardFront: `What is the key difference between a **database** and a **DBMS**?`,
        options: [
          "The database is the stored collection of related data; the DBMS is the software that manages access to it",
          "They are two words for exactly the same thing",
          "The database is the software; the DBMS is the data",
          "A DBMS can only manage NoSQL data, a database only relational data",
        ],
        answer: "The database is the stored collection of related data; the DBMS is the software that manages access to it",
        flashcardBack: `The **database** is the data (and its description) — the logically related collection in the repository. The **DBMS** is the *software* (Oracle, MySQL, …) that defines, stores, secures and serves that data. Keeping the data's description inside the database gives **data independence**: programs say what they want, the DBMS decides how to fetch it.`,
      },
      {
        name: "Types of Database Models",
        orderIndex: 3,
        prerequisites: ["What Is a Database and a DBMS"],
        explanation: `Databases are categorised by their underlying **data model** — the way data and relationships are organised:

- **Hierarchical** — records form a tree (parent/child). Older; rigid.
- **Network** — records linked as a graph with explicit pointers. Older.
- **Relational** — data held in **tables** (relations) with rows and columns; relationships expressed by shared values, not pointers. This is the dominant model and the **focus of this unit**.
- **Object-oriented / object-relational** — store objects, sometimes blended with the relational model.
- **NoSQL** — non-relational families (key-value, document, column, graph) designed for large, fast-changing, or loosely structured data.

Relational systems (Oracle, MySQL, SQL Server, PostgreSQL) remain extremely popular, but newer workloads — social networks, multimedia, data streams, web/big data — have driven the rise of NoSQL alternatives. The right choice is "horses for courses": pick the model that fits the task.`,
        flashcardFront: `Which of these is **not** a database *model*?`,
        options: ["Oracle", "Hierarchical", "Relational", "Network"],
        answer: "Oracle",
        flashcardBack: `**Oracle** is a *DBMS product* (a vendor's software), not a data model. The data **models** include hierarchical, network, relational, object/object-relational and NoSQL. Oracle happens to be a relational DBMS — so it *implements* the relational model, but it is not itself a model.`,
      },
      {
        name: "The Client–Server View",
        orderIndex: 4,
        prerequisites: ["What Is a Database and a DBMS"],
        explanation: `Real systems split into a **front end** and a **back end**:

- The **front end (client)** is the application the user interacts with — a web or mobile app. It collects input and displays results.
- The **back end (server)** is the DBMS holding the data. It stores the structure, runs the queries, and enforces **integrity** (the rules that keep data valid).

The two communicate over a network: the client sends a request (often SQL), the server processes it against the database and returns the answer. The same database can serve many different front ends at once.

This unit concentrates on building the **back end** — designing tables, writing queries, and enforcing integrity — because that is the shared foundation every application depends on. A well-built back end means front ends can be swapped or added without touching the data.`,
        flashcardFront: `In a typical client–server database application, what is the **server's** main job?`,
        options: [
          "Store the data, run queries, and enforce data integrity",
          "Render the user interface and collect input",
          "Replace the need for any front-end application",
          "Format the screen layout for mobile devices",
        ],
        answer: "Store the data, run queries, and enforce data integrity",
        flashcardBack: `The **server** is the DBMS back end: it holds the data, executes queries, and enforces integrity rules. The **client** (front end) handles the user interface and input. Separating them lets one database serve many front ends — which is exactly why this unit focuses on the back end.`,
      },
      {
        name: "Collecting Personal Data Responsibly",
        orderIndex: 5,
        prerequisites: [],
        explanation: `Designing a database is not just technical — what you choose to **collect** about people carries legal and ethical weight.

Some personal information is classed as **sensitive** (e.g. racial or ethnic origin, health, religious beliefs, sexual orientation, political views). Collecting it generally requires **explicit consent**. Certain **protected attributes** (age, disability, sex, gender identity, race…) are covered by **privacy and anti-discrimination law**.

Key principles:

- Collect only what is **reasonably necessary** for the purpose.
- The **client together with legal/privacy obligations** decides what is collected — *not* the database designer acting alone.
- Be aware that both *collecting* and *failing to collect* an attribute can lead to harm. Collecting race could enable discrimination; *not* collecting it could hide a bias in (say) a medical trial.
- Where data must be collected, tell people why, and apply extra protection to sensitive items.

🎯 Good design asks: *Am I following the law? Why do I need this attribute? Could collecting — or not collecting — it cause harm?*`,
        flashcardFront: `When designing a database, who should decide **which** personal attributes are collected?`,
        options: [
          "The client, guided by legal and privacy obligations",
          "The database designer alone, for convenience",
          "Whoever writes the front-end application",
          "Nobody — collect every attribute you can, just in case",
        ],
        answer: "The client, guided by legal and privacy obligations",
        flashcardBack: `The **client**, constrained by **privacy and anti-discrimination law**, decides what is collected — not the designer's preference, and certainly not "collect everything". Only data that is *reasonably necessary* should be gathered, sensitive items need consent, and the designer must weigh the harm of both collecting *and* failing to collect protected attributes.`,
      },
    ],
  },

  // ── WEEK 2 — Conceptual Modelling (ER) ──────────────────────────────────────
  {
    index: 2,
    title: "Conceptual Modelling (ER)",
    cheatSheet: `## Conceptual Modelling — the ER Model

**Database Design Life Cycle**
1. **Requirements** definition
2. **Conceptual** design (ER model — DBMS-independent)
3. **Logical** design (e.g. relational)
4. **Physical** design (specific vendor)
5. Implementation & testing

**ER building blocks**
- **Entity** — a thing we store data about (CUSTOMER, DRONE). Drawn as a box.
- **Attribute** — a property of an entity (cust_name).
- **Relationship** — a meaningful association between entities; on a conceptual model this is the **only** way entities connect.
- **Key attribute** — uniquely identifies an instance (cust_id). Other attributes are non-key.

**Attribute types**
| Type | Opposite | Example |
|---|---|---|
| **Simple** (atomic) | **Composite** (subdivides) | age · address→street/city/zip |
| **Single-valued** | **Multi-valued** (many values) | one DOB · several degrees |
| **Derived** | stored | age from date_of_birth |

⚠️ Don't usually store **derived** data (e.g. age) — calculate it, so it can't go stale.

**Strong vs weak entity**
- **Strong** — identified by its own key.
- **Weak** — cannot be identified on its own; its key includes the owner's key (e.g. CLASS keyed by *prof_id + class_no*).

**Cardinality** — how many of one entity relate to the other: **1:1**, **1:M**, **M:N**.

🔑 **Associative / bridging entity** — added to resolve an **M:N** relationship *only when* you need to store attributes about the association itself.

💡 **Golden rule:** model exactly what the brief describes — every entity/attribute/relationship in the brief, and **nothing** that isn't.`,
    concepts: [
      {
        name: "The Database Design Life Cycle",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Designing a database proceeds through distinct stages, moving from *what the business needs* down to *how a specific product stores it*:

1. **Requirements definition** — gather and agree what data and rules the system must capture.
2. **Conceptual design** — build an **ER model**: entities, attributes, relationships. This is **DBMS-independent** — it describes the business, not any product.
3. **Logical design** — map the conceptual model to a chosen *type* of database (for us, the **relational** model: a set of relations).
4. **Physical design** — tailor the logical model to a specific *vendor* (Oracle, MySQL…) and produce the schema.
5. **Implementation and testing**.

The value of separating these is that the **conceptual** model captures the business meaning once, independent of technology. You could implement the same conceptual model in different products later. Skipping conceptual design and jumping straight to tables tends to bake in mistakes that are expensive to undo.`,
        flashcardFront: `At which stage of the design life cycle is the model **independent of any DBMS product**?`,
        options: ["Conceptual design", "Physical design", "Implementation and testing", "Logical design"],
        answer: "Conceptual design",
        flashcardBack: `The **conceptual** (ER) model describes the business — entities, attributes, relationships — with **no reference to any DBMS**. *Logical* design commits to a model *type* (relational), and *physical* design commits to a specific *vendor* (Oracle, MySQL). Keeping the conceptual stage technology-neutral means it captures meaning that survives a change of product.`,
      },
      {
        name: "Entities, Attributes and Relationships",
        orderIndex: 2,
        prerequisites: ["The Database Design Life Cycle"],
        explanation: `The ER model has three core building blocks:

- An **entity** is a class of things we store data about — CUSTOMER, DRONE, RENTAL. (One actual customer is an *instance* of the CUSTOMER entity.) Drawn as a box.
- An **attribute** is a property of an entity — \`cust_name\`, \`cust_phone\`. One attribute (or set) is the **key**, which uniquely identifies each instance; the rest are non-key.
- A **relationship** is a meaningful association *between* entities — "a CUSTOMER *makes* a RENTAL". On a conceptual model, relationships are the **only** way entities are connected.

Two discipline rules matter. First, give each relationship a **verb** that reads naturally. Second, if two entities are associated in **more than one way**, model each separately — e.g. an EMPLOYEE can be a *member of* a TEAM **and** a *leader of* a TEAM; these are different relationships and must not be merged. Avoid **redundant** relationships that merely restate information already derivable through others.`,
        flashcardFront: `An EMPLOYEE can be a **member of** a team and also the **leader of** a team. How should this be modelled?`,
        options: [
          "As two separate relationships between EMPLOYEE and TEAM",
          "As one combined relationship, since both involve the same entities",
          "As an attribute of TEAM only",
          "It cannot be modelled in an ER diagram",
        ],
        answer: "As two separate relationships between EMPLOYEE and TEAM",
        flashcardBack: `"Member of" and "leader of" are **different associations**, so they are **two separate relationships** even though they connect the same two entities. Merging them would lose meaning (you couldn't distinguish a member from the leader). The general rule: each distinct way two entities relate is its own relationship, each with its own verb.`,
      },
      {
        name: "Attribute Types",
        orderIndex: 3,
        prerequisites: ["Entities, Attributes and Relationships"],
        explanation: `Attributes are classified along three independent dimensions:

- **Simple vs composite.** A *simple* (atomic) attribute can't be sensibly subdivided (\`age\`). A *composite* one can — \`address\` splits into street, city, postcode.
- **Single-valued vs multi-valued.** A *single-valued* attribute holds one value per instance (one date of birth). A *multi-valued* attribute can hold several (a person may hold several degrees).
- **Stored vs derived.** A *derived* attribute can be **calculated** from others — \`age\` from \`date_of_birth\`, or an order total from its line items.

A practical guideline: **don't store derived data**. If you store \`age\`, it silently becomes wrong as time passes; computing it from \`date_of_birth\` on demand keeps it correct. (Sometimes performance reasons justify storing a derived value, but that's a deliberate trade-off.)

Whether an attribute is, say, multi-valued depends entirely on the **client's requirements** — "phone number" is single-valued for one business and multi-valued for another.`,
        flashcardFront: `Why is it usually **not** a good idea to store a person's **age** as an attribute?`,
        options: [
          "It is derived from date of birth, so a stored value becomes stale",
          "Age is a composite attribute",
          "Age can never be multi-valued",
          "Numbers cannot be stored in a database",
        ],
        answer: "It is derived from date of birth, so a stored value becomes stale",
        flashcardBack: `Age is a **derived** attribute — it can be calculated from \`date_of_birth\`. If you *store* it, it goes out of date the moment a birthday passes and must be constantly maintained. Computing it on demand keeps it always correct. (Storing a derived value is occasionally justified for performance, but it's a conscious trade-off, not the default.)`,
      },
      {
        name: "Strong vs Weak Entities",
        orderIndex: 4,
        prerequisites: ["Entities, Attributes and Relationships"],
        explanation: `Entities differ in how they are **identified**:

- A **strong entity** has a key built from its **own** attributes. A CUSTOMER identified by \`cust_id\` stands alone.
- A **weak entity** cannot be identified by its own attributes alone — its identity depends on an **owner** entity. Its key therefore **includes the owner's key**.

Classic example: a CLASS is "the 1st, 2nd, 3rd… class of a professor". \`class_no\` alone (1, 2, 3…) is not unique across all professors — professor 1's class 1 and professor 2's class 1 are different classes. The class is only identifiable as *(prof_id, class_no)*. So CLASS is a **weak** entity, owned by PROFESSOR (the strong entity), and its key borrows \`prof_id\`.

Spotting weak entities early matters because it determines the **composite key** you'll need, and the identifying relationship to the owner.`,
        flashcardFront: `A CLASS is identified by the combination *(prof_id, class_no)* — \`class_no\` restarts at 1 for each professor. CLASS is therefore a:`,
        options: ["Weak entity owned by PROFESSOR", "Strong entity", "Multi-valued attribute", "Derived attribute"],
        answer: "Weak entity owned by PROFESSOR",
        flashcardBack: `Because \`class_no\` is **not unique on its own** (every professor has a class 1, 2, 3…), CLASS can only be identified with the owner's key: *(prof_id, class_no)*. An entity that borrows its owner's key to be identified is a **weak entity**; PROFESSOR is the strong owner. A strong entity, by contrast, is identified by its own attributes alone.`,
      },
      {
        name: "Associative (Bridging) Entities for M:N",
        orderIndex: 5,
        prerequisites: ["Strong vs Weak Entities"],
        explanation: `Relationships have a **cardinality**: 1:1, 1:M, or M:N (many-to-many). On a **conceptual** model an M:N relationship is perfectly legitimate and often the most honest description — e.g. a CUSTOMER takes many TRAINING courses, and each course is taken by many customers.

An **associative entity** (also *bridging* or *composite* entity) is introduced to represent an M:N association as its own box. The key question is **when**:

🔑 Add a bridging entity **only when you need to store attributes that belong to the association itself** — facts that aren't about either entity alone.

For the customer/training example, the *date completed* and *expiry date* describe a particular customer-takes-course pairing, not the customer or the course on its own. Those attributes force a bridging entity (often called something like CUST_TRAIN).

If an M:N relationship carries **no** attributes of its own, you can leave it as a plain M:N on the conceptual model; the bridge can be created later during logical mapping.`,
        flashcardFront: `On a conceptual model, when should you introduce an **associative (bridging) entity** for an M:N relationship?`,
        options: [
          "Only when there are attributes describing the association itself",
          "Always, for every M:N relationship",
          "Never — M:N relationships are not allowed",
          "Only when both entities are weak entities",
        ],
        answer: "Only when there are attributes describing the association itself",
        flashcardBack: `M:N relationships **are allowed** conceptually. You add a bridging entity **only when the association has its own attributes** (e.g. the *date completed* of a customer-takes-course pairing, which belongs to neither the customer nor the course alone). A bare M:N with no attributes can stay as-is conceptually and be bridged later when mapping to relations.`,
      },
    ],
  },

  // ── WEEK 3 — The Relational Model & Relational Algebra ──────────────────────
  {
    index: 3,
    title: "The Relational Model & Algebra",
    cheatSheet: `## The Relational Model

A **relation** (table) is a set of **tuples** (rows) over **attributes** (columns).

**Relation properties**
- **No duplicate tuples** (a relation is a *set*).
- Tuples are **unordered**; attributes are **unordered**.
- Each cell holds a **single atomic value** — no repeating groups (**1NF**).
- All values of an attribute come from the same **domain**.

⚠️ A *table* and a *relation* are not the same thing — tables can have duplicate/ordered rows; relations cannot.

**Functional dependency (FD)**
\`A → B\` ("A determines B"): for each value of A there is exactly **one** value of B.
e.g. \`orderno → orderdate\`, \`orderno, prodno → qtyordered\`.

**Keys**
- **Superkey** — any attribute set that is **unique** across tuples.
- **Candidate key (CK)** — a *minimal* superkey (no proper subset is unique).
- **Primary key (PK)** — the chosen CK. Others are **alternate keys**.
- **Foreign key (FK)** — attribute(s) that match a PK in the same or another relation.

**Integrity rules**
- 🔑 **Entity integrity** — no part of a PK may be NULL.
- 🔑 **Referential integrity** — an FK must match an existing PK value **or be NULL**.

**Notation:** \`STAFF (staff_id, staff_name, …)\` — PK underlined; name singular.

**Relational algebra** (procedural; operates on ≤ 2 relations at a time)
| Operator | Meaning |
|---|---|
| σ Selection | choose **rows** by a condition |
| π Projection | choose **columns** |
| ⨝ Join | combine relations on matching attributes |
| ∪ ∩ − | union / intersect / difference (union-compatible) |

💡 Filter early (σ before ⨝) for efficiency.`,
    concepts: [
      {
        name: "Relations and Their Properties",
        orderIndex: 1,
        prerequisites: [],
        explanation: `In the relational model, data lives in **relations** — what we informally call tables. A relation is a **set of tuples** (rows) defined over a set of **attributes** (columns). Because a relation is a *set*, several properties follow automatically:

- **No duplicate tuples** — sets have no repeats, so every row must be unique.
- **Tuples are unordered** — there's no "first" row; rows are accessed by *content*, not position.
- **Attributes are unordered** and each has a distinct name.
- **Atomic values** — each cell holds a single, indivisible value; **no repeating groups** (multi-valued attributes). This is the **first normal form** rule.
- All values in a column come from the same **domain**.

This is why a relation is *not* identical to a spreadsheet table: a table may contain duplicate rows and treats row/column order as meaningful, whereas a relation forbids duplicates and ignores order. Keeping these properties is what lets the relational algebra and SQL reason about data purely by **value**.`,
        flashcardFront: `Which statement is **true** for a relation in the relational model?`,
        options: [
          "Each cell holds a single atomic value and there are no duplicate tuples",
          "Rows are ordered and duplicates are allowed",
          "A column may contain a repeating group of values",
          "The order of attributes is significant",
        ],
        answer: "Each cell holds a single atomic value and there are no duplicate tuples",
        flashcardBack: `Because a relation is a **set** of tuples: no duplicates, no ordering of rows or attributes, and every cell holds **one atomic value** (no repeating groups — the 1NF rule). A *spreadsheet table* can break all of these, which is exactly why "table" and "relation" are not synonyms.`,
      },
      {
        name: "Functional Dependency",
        orderIndex: 2,
        prerequisites: ["Relations and Their Properties"],
        explanation: `A **functional dependency** captures a rule about how attribute values constrain each other. We write \`A → B\` ("A functionally determines B", or "B depends on A") to mean:

> For every value of A, there is **exactly one** corresponding value of B in the relation.

Examples: \`orderno → orderdate\` (each order has one date); \`prodno → proddesc\` (each product code has one description). The left side can be **composite**: \`orderno, prodno → qtyordered\` (the quantity depends on the *pair*).

FDs are the formal language of database design. They are statements about the *meaning* of the data (business rules), not something you read off a few sample rows. They drive the choice of **keys** — a candidate key functionally determines *every* other attribute — and they are the engine of **normalisation**: removing the "wrong" dependencies (partial and transitive ones) is exactly how we eliminate redundancy.`,
        flashcardFront: `The functional dependency \`orderno → orderdate\` means:`,
        options: [
          "Each orderno value is associated with exactly one orderdate value",
          "Each orderdate value is associated with exactly one orderno",
          "orderno and orderdate are always equal",
          "orderdate is the primary key",
        ],
        answer: "Each orderno value is associated with exactly one orderdate value",
        flashcardBack: `\`A → B\` means each value of the **determinant** A maps to exactly one value of B. So \`orderno → orderdate\`: every order number has a single order date. It says nothing about the reverse (many orders could share a date), and it's a statement about the data's *meaning* (a business rule), not something proven from a handful of rows.`,
      },
      {
        name: "Keys: Superkey, Candidate Key, Primary Key",
        orderIndex: 3,
        prerequisites: ["Functional Dependency"],
        explanation: `Keys are defined by two properties — **uniqueness** and **minimality**:

- A **superkey** is any attribute or set of attributes that is **unique** across all tuples (no two rows share its value). A relation can have many superkeys — adding extra attributes to a superkey still gives a superkey.
- A **candidate key (CK)** is a **minimal** superkey: it's unique *and* no proper subset of it is unique (the *irreducibility* property). A relation may have several candidate keys.
- The **primary key (PK)** is the one candidate key chosen to identify tuples. Any remaining candidate keys are **alternate keys**.

Example: for \`EMPLOYEE(empno, empname, empsalary, emptaxfileno)\`, both \`empno\` and \`emptaxfileno\` are unique → each is a candidate key (so there are **two** CKs). One is chosen as PK; the other becomes an alternate key. \`(empno, empname)\` is a superkey but *not* a candidate key, because the subset \`empno\` is already unique, so it isn't minimal.

By convention we write the PK **underlined**, and a relation name is singular: \`STAFF(staff_id, …)\`.`,
        flashcardFront: `A **candidate key** differs from a plain **superkey** because it must also be:`,
        options: [
          "Minimal — no proper subset is itself unique",
          "Composed of a single attribute",
          "A foreign key in another relation",
          "Allowed to contain NULL values",
        ],
        answer: "Minimal — no proper subset is itself unique",
        flashcardBack: `Every candidate key is a superkey (unique), but it adds **minimality/irreducibility**: removing any attribute would destroy uniqueness. So \`(empno, empname)\` is a superkey but not a CK, because \`empno\` alone is already unique. A CK can still be **composite** (multiple attributes) — minimal doesn't mean single-attribute. One CK is chosen as the **primary key**.`,
      },
      {
        name: "Foreign Keys and Referential Integrity",
        orderIndex: 4,
        prerequisites: ["Keys: Superkey, Candidate Key, Primary Key"],
        explanation: `A **foreign key (FK)** is an attribute (or set) in one relation whose value matches a **primary key** in the same or another relation. FKs are how the relational model represents **relationships**: pairing a PK with a matching FK logically links two tables — no pointers, just shared values.

Two integrity rules protect this:

- **Entity integrity** — no part of a **primary key** may be **NULL**. (A row you can't identify is meaningless.)
- **Referential integrity** — a **foreign key** value must either **match an existing primary key** value in the referenced relation, **or be NULL**. You can't reference a parent that doesn't exist.

Example: \`PATIENT(pat_id, pat_name, dr_id)\` where \`dr_id\` is an FK to \`DOCTOR\`. If a patient row stores a \`dr_id\` that exists in no DOCTOR row, **referential integrity is violated** — the database points at a doctor who isn't there. The DBMS enforces these rules so the data stays internally consistent.`,
        flashcardFront: `A patient row stores \`dr_id = 99\`, but no doctor with \`dr_id = 99\` exists. Which rule is violated?`,
        options: ["Referential integrity", "Entity integrity", "Domain integrity", "First normal form"],
        answer: "Referential integrity",
        flashcardBack: `An FK must match an existing PK value **or be NULL** — pointing at a non-existent doctor breaks **referential integrity**. (*Entity* integrity is the different rule that a PK can't be NULL; *domain* integrity is about valid values for a column.) Referential integrity is what guarantees relationships always connect to rows that actually exist.`,
      },
      {
        name: "Relational Algebra: Selection and Projection",
        orderIndex: 5,
        prerequisites: ["Relations and Their Properties"],
        explanation: `**Relational algebra** is a *procedural* language for manipulating relations: you specify operations, and each produces a new relation. Two single-relation operators are the foundation:

- **Selection (σ)** chooses **rows** that satisfy a condition. \`σ_{belt='black'}(MEMBER)\` returns the black-belt members — same columns, fewer rows.
- **Projection (π)** chooses **columns**. \`π_{name, dob}(MEMBER)\` returns just those two attributes for every row (and, being a set, removes any duplicate rows that result).

You compose them: "show the name and dob of all black-belt members" is \`π_{name, dob}( σ_{belt='black'}(MEMBER) )\`.

💡 **Order matters for efficiency.** Apply selection (and project away unneeded columns) **early**, before joining, so later operators work on far fewer tuples. Doing the restriction first — pushing σ down — is the single most important efficiency habit in algebra and in SQL query planning.`,
        flashcardFront: `In relational algebra, which operator picks a subset of **columns**?`,
        options: ["Projection (π)", "Selection (σ)", "Join (⨝)", "Union (∪)"],
        answer: "Projection (π)",
        flashcardBack: `**Projection (π)** keeps chosen **columns** (and drops duplicate rows in the result, since relations are sets). **Selection (σ)** keeps chosen **rows** by a condition. A memory hook: pro**J**ection = **J**ust some columns; **S**election = **S**ome rows. Combine them, and apply σ early to shrink the data before joins.`,
      },
      {
        name: "Relational Algebra: Joins and Set Operators",
        orderIndex: 6,
        prerequisites: ["Relational Algebra: Selection and Projection"],
        explanation: `To combine data from **two** relations, relational algebra offers joins and set operators.

A **join (⨝)** matches tuples from two relations on a common attribute:
- **Theta-join** uses any comparison predicate (\`<, ≤, =, ≥, >\`).
- **Equi-join** is a theta-join where the predicate is equality.
- **Natural join** is an equi-join on the *identically named* attributes, automatically dropping the duplicate column. Conceptually: take the Cartesian product, keep rows where the keys match, then project away the repeated column.

**Set operators** combine **union-compatible** relations (same number of attributes, matching domains):
- **Union (∪)** — tuples in either relation.
- **Intersection (∩)** — tuples in both.
- **Difference (−)** — tuples in the first but not the second.

These are the workhorses of querying: a natural join reconnects data that normalisation split apart, while set operators answer "in A and/or B" questions. As always, restrict and project *before* joining to keep intermediate results small.`,
        flashcardFront: `A **natural join** of two relations does which of the following?`,
        options: [
          "Matches tuples on equally-named attributes and removes the duplicate column",
          "Combines every row of one with every row of the other, keeping all columns",
          "Returns rows in the first relation but not the second",
          "Requires the two relations to be union-compatible",
        ],
        answer: "Matches tuples on equally-named attributes and removes the duplicate column",
        flashcardBack: `A **natural join** is an equi-join on the **commonly-named** attribute(s), then it **projects away the duplicate column**. (Combining every row with every row is the *Cartesian product*; "first but not second" is *difference*; union-compatibility is needed for *set operators*, not joins.) Think: Cartesian product → keep matching rows → drop the repeated key column.`,
      },
    ],
  },

  // ── WEEK 4 — Normalisation ──────────────────────────────────────────────────
  {
    index: 4,
    title: "Normalisation",
    cheatSheet: `## Normalisation (UNF → 3NF)

Normalisation removes **redundancy** by splitting relations so each fact is stored **once**.

**Why** — redundancy causes *modification anomalies*:
- ⚠️ **Insert anomaly** — can't add a fact without an unrelated one (can't add a sales rep until they have a drug).
- ⚠️ **Update anomaly** — one change must be repeated in many rows (rep's phone in every drug row).
- ⚠️ **Delete anomaly** — deleting a row loses unrelated data (deleting the last drug loses the rep).

**The steps**

| From → To | Remove |
|---|---|
| UNF → **1NF** | repeating groups; define a PK |
| 1NF → **2NF** | **partial** dependencies (on *part* of a composite key) |
| 2NF → **3NF** | **transitive** dependencies (non-key → non-key) |

**UNF → 1NF**
1. Identify a PK for the main relation.
2. Move each repeating group to a **new relation**, bringing the main PK along as FK.
3. The new relation's PK is usually *(main PK + repeating-group identifier)* — a composite key.

**1NF → 2NF** (only matters with a **composite** PK)
- A *partial dependency* is a non-key attribute depending on **part** of the PK. Move it (with the part it depends on) to a new relation.

**2NF → 3NF**
- A *transitive dependency* is a non-key attribute depending on **another non-key** attribute (e.g. \`cat_code → cat_name\`). Move it out, leaving the determinant as an FK.

🔑 Goal: every non-key attribute depends on **the key, the whole key, and nothing but the key**.`,
    concepts: [
      {
        name: "Modification Anomalies",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Redundant data — the same fact stored in many rows — causes three **modification anomalies**. Picture one big relation \`DRUG(drug_code, drug_name, slsrep_id, slsrep_name, slsrep_mobile)\` where each drug row repeats its sales rep's details:

- **Insert anomaly** — you cannot record a *new sales rep* until they are assigned a drug, because there's no row to put them in without a \`drug_code\`. The structure forces unrelated facts to arrive together.
- **Update anomaly** — to change a rep's mobile number you must update **every** drug row for that rep. Miss one and the data becomes inconsistent.
- **Delete anomaly** — deleting the *last* drug for a rep also deletes the only record of that rep. You lose data you wanted to keep.

These anomalies are the *symptom*; the *cause* is storing a fact (rep details) in a relation whose subject is something else (drugs). **Normalisation** cures them by separating the facts into relations where each is stored exactly once.`,
        flashcardFront: `Deleting the last drug assigned to a sales rep also erases that rep's contact details. This is an example of a(n):`,
        options: ["Delete anomaly", "Insert anomaly", "Update anomaly", "Referential integrity error"],
        answer: "Delete anomaly",
        flashcardBack: `Losing *unrelated* data as a side-effect of a deletion is a **delete anomaly** — the rep's details were only ever stored alongside drug rows, so removing the last drug removes the rep too. It happens because two different facts (drug + rep) share one relation. Normalisation splits them apart so each can be deleted independently.`,
      },
      {
        name: "UNF to 1NF: Remove Repeating Groups",
        orderIndex: 2,
        prerequisites: ["Modification Anomalies"],
        explanation: `Normalisation starts from the data **as presented** (a form or report), written as an **unnormalised form (UNF)** — a single relation in which any **repeating group** (a set of attributes that occurs multiple times per instance) is shown in inner brackets:

\`PART(part_no, part_name, cat_code, cat_name, part_stock, part_sell (vendor_no, vendor_name, restock_date, restock_costpu, …))\`

To reach **first normal form (1NF)**:

1. **Identify a primary key** for the main relation (here \`part_no\`).
2. **Remove the repeating group** into a **new relation**, and **bring the main relation's PK along** as part of it. The main relation keeps only its non-repeating attributes.
3. **Identify the new relation's PK** — usually a **composite** of the original PK plus the repeating group's own identifier: \`RESTOCK(part_no, vendor_no, restock_date, …)\`.

The result: a valid relation has a PK, **no repeating groups**, single atomic values, and **entity integrity** (no part of any PK is null). Note we do *not* "flatten" the data into one wide table — that just re-creates redundancy.`,
        flashcardFront: `The first step in moving from UNF to 1NF, when a repeating group exists, is to:`,
        options: [
          "Move the repeating group to a new relation, carrying the main PK along as part of its key",
          "Delete the repeating attributes entirely",
          "Merge all attributes into one flat wide table",
          "Remove transitive dependencies",
        ],
        answer: "Move the repeating group to a new relation, carrying the main PK along as part of its key",
        flashcardBack: `1NF eliminates **repeating groups**: each goes to its **own new relation**, which must **carry the original PK** (so the two relations stay linked) plus its own identifier — usually forming a composite key. Flattening into one wide table is explicitly *wrong* (it re-introduces redundancy). Removing transitive dependencies is the *3NF* step, much later.`,
      },
      {
        name: "1NF to 2NF: Remove Partial Dependencies",
        orderIndex: 3,
        prerequisites: ["UNF to 1NF: Remove Repeating Groups"],
        explanation: `A relation is in **second normal form (2NF)** when it is in 1NF **and** every non-key attribute is **fully** functionally dependent on the key — i.e. on the *whole* candidate key, not just part of it.

A **partial dependency** can only exist when the PK is **composite**. It's a non-key attribute that depends on **part** of that key. Take:

\`RESTOCK(part_no, vendor_no, restock_date, vendor_name, restock_costpu, …)\`

Here \`vendor_name\` depends only on \`vendor_no\` — *part* of the composite key — not on the full \`(part_no, vendor_no, restock_date)\`. That's a partial dependency, and it means a vendor's name is repeated for every restock by that vendor (redundancy again).

**Fix:** move the partially-dependent attribute(s), together with the part of the key they depend on, into a **new relation**: \`VENDOR(vendor_no, vendor_name)\`. Leave \`vendor_no\` behind in RESTOCK as a foreign key. A relation whose PK is a **single attribute** is automatically in 2NF — there's no "part" of the key for anything to partially depend on.`,
        flashcardFront: `A **partial dependency** (the thing 2NF removes) can only occur when:`,
        options: [
          "The primary key is composite (more than one attribute)",
          "The relation has no primary key",
          "A non-key attribute depends on another non-key attribute",
          "There are repeating groups",
        ],
        answer: "The primary key is composite (more than one attribute)",
        flashcardBack: `A partial dependency = a non-key attribute depending on **part** of the key — which is only possible if the key **has parts**, i.e. it's **composite**. So any relation with a single-attribute PK is already in 2NF. (A non-key depending on another non-key is a *transitive* dependency → the 3NF step; repeating groups are the 1NF step.)`,
      },
      {
        name: "2NF to 3NF: Remove Transitive Dependencies",
        orderIndex: 4,
        prerequisites: ["1NF to 2NF: Remove Partial Dependencies"],
        explanation: `A relation is in **third normal form (3NF)** when it is in 2NF **and** has no **transitive dependencies** — that is, no non-key attribute depends on **another non-key attribute**.

In \`PART(part_no, part_name, cat_code, cat_name, …)\`, the key is \`part_no\`, but \`cat_name\` really depends on \`cat_code\`:

\`part_no → cat_code → cat_name\`

\`cat_name\` is determined by \`cat_code\` (a non-key), so it depends on the PK only *transitively*. The cost: a category's name is repeated for every part in that category (and the anomalies return).

**Fix:** move the transitively-dependent attribute(s) into a **new relation** keyed by the determinant, and leave that determinant in the original relation as a **foreign key**:

\`PART(part_no, part_name, cat_code, …)\` + \`CATEGORY(cat_code, cat_name)\`

🔑 The 3NF ideal, neatly summarised: every non-key attribute depends on **the key, the whole key, and nothing but the key** — the PK only (1NF/validity), the *whole* key (2NF), and *nothing but* the key (3NF).`,
        flashcardFront: `In \`PART(part_no, part_name, cat_code, cat_name)\` with key \`part_no\`, the dependency \`cat_code → cat_name\` is a:`,
        options: [
          "Transitive dependency, removed at 3NF",
          "Partial dependency, removed at 2NF",
          "Repeating group, removed at 1NF",
          "Valid full dependency that needs no change",
        ],
        answer: "Transitive dependency, removed at 3NF",
        flashcardBack: `\`cat_name\` depends on \`cat_code\` — a **non-key** attribute — so it depends on the PK only *transitively* (\`part_no → cat_code → cat_name\`). That's a **transitive dependency**, removed at **3NF** by splitting out \`CATEGORY(cat_code, cat_name)\` and leaving \`cat_code\` as an FK. (A *partial* dependency would be on part of a composite key — but here the key is a single attribute.)`,
      },
      {
        name: "The Normalisation Process End-to-End",
        orderIndex: 5,
        prerequisites: ["2NF to 3NF: Remove Transitive Dependencies"],
        explanation: `Putting it together, normalisation is a disciplined sequence driven by **functional dependencies**:

- **UNF** — represent the form exactly as given, marking repeating groups. No interpretation.
- **UNF → 1NF** — define a PK; remove repeating groups into new relations (carrying the PK).
- **1NF → 2NF** — remove **partial** dependencies (non-key on *part* of a composite key).
- **2NF → 3NF** — remove **transitive** dependencies (non-key on non-key).

A final, often-missed step is **synthesis**: after normalising several forms separately (e.g. a service report and a rental report), you may end up with relations that represent the **same thing** under different names. Merge them into a single definitive relation so each entity is described once across the whole design.

The payoff is a set of 3NF relations connected by PK/FK pairs, free of insert/update/delete anomalies, where every fact is stored exactly once. (Higher normal forms — BCNF, 4NF — exist, but 3NF removes the anomalies that matter for the vast majority of designs.)`,
        flashcardFront: `Two separately-normalised forms both produce a relation describing employees. The correct final step is to:`,
        options: [
          "Synthesise them — merge into one definitive relation for that entity",
          "Keep both relations to be safe",
          "Delete one of them at random",
          "Add a repeating group to combine them",
        ],
        answer: "Synthesise them — merge into one definitive relation for that entity",
        flashcardBack: `After normalising forms independently you often get duplicate relations for the same entity. **Synthesis** merges them into a **single** definitive relation, so each thing is described **once** across the design — keeping two copies would reintroduce exactly the redundancy normalisation set out to remove.`,
      },
    ],
  },

  // ── WEEK 5 — Logical Modelling ──────────────────────────────────────────────
  {
    index: 5,
    title: "Logical Modelling (ER → Relational)",
    cheatSheet: `## Logical Modelling — Mapping ER to Relations

**Three levels, three vocabularies**

| Conceptual | Logical (relational) | Physical |
|---|---|---|
| Entity | Relation | Table |
| Attribute | Attribute | Column |
| Instance | Tuple | Row |
| Identifier (key) | Primary key | Primary key |
| Relationship | *(via FK)* | *(via FK)* |
| — | Foreign key | Foreign key |

**Mapping relationships**
- 🔑 **1:M** — put the PK of the **"one"** side into the **"many"** side as an **FK**.
- 🔑 **M:N** — create a **new (bridge) relation** whose PK combines the PKs of both entities (each is also an FK).
- **1:1** — place the FK on the side that makes participation work (often the optional side), or merge.
- **Unary (recursive)** 1:M — add an FK referencing the **same** relation's PK (e.g. \`mgr_no\` → \`emp_no\`).
- **Unary M:N** — bridge relation referencing the same relation twice.

⚠️ Recursive *identifying* relationships and 1:1 *total identifying* relationships can't exist.

**Surrogate keys**
- A system-generated PK (e.g. \`ct_id\`) added **only on the logical model**, with justification.
- Must add a **UNIQUE** constraint/index on the original **natural key** so it stays unique.

**Controlling attribute values**
- **CHECK constraint** — small, fixed, unchanging set (e.g. gender 'M'/'F'/'U').
- **Lookup table** — larger or **extendable** set of valid values.`,
    concepts: [
      {
        name: "Conceptual, Logical and Physical Levels",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Database design moves through three levels, and each uses its **own vocabulary** for the same ideas:

| Conceptual | Logical (relational) | Physical |
|---|---|---|
| Entity | Relation | Table |
| Attribute | Attribute | Column |
| Instance | Tuple | Row |
| Identifier (key) | Primary key | Primary key |
| Relationship | *(via foreign key)* | *(via foreign key)* |

The **conceptual** model (ER) is DBMS-independent — it describes the business. The **logical** model commits to a database *type* (the relational model: a set of relations with PKs and FKs). The **physical** model commits to a specific *vendor* and produces the runnable schema.

The most important shift happens at the logical level: a conceptual **relationship** has no direct relational counterpart — there is no "relationship" object in a relational database. Instead, relationships are **realised through foreign keys**. So "map the ER model to a logical model" largely means deciding *where the foreign keys go*.`,
        flashcardFront: `A conceptual-model **relationship** becomes what in the logical (relational) model?`,
        options: [
          "A foreign key (there is no separate 'relationship' object)",
          "A new entity",
          "A primary key",
          "A repeating group",
        ],
        answer: "A foreign key (there is no separate 'relationship' object)",
        flashcardBack: `The relational model has **no 'relationship' construct** — associations are expressed by **foreign keys** matching primary keys. That's why mapping ER → logical is mostly about *placing the FKs correctly*. The vocabulary also shifts: entity→relation→table, instance→tuple→row, identifier→primary key.`,
      },
      {
        name: "Mapping 1:M Relationships",
        orderIndex: 2,
        prerequisites: ["Conceptual, Logical and Physical Levels"],
        explanation: `The **1:M (one-to-many)** relationship is the most common, and its mapping rule is the one to memorise:

🔑 Create a relation for each entity, then **post the primary key of the "one" side into the "many" side as a foreign key.**

Example: one DRONE_TYPE has many DRONEs; each DRONE is of one type. So \`dt_code\` (the PK of DRONE_TYPE, the "one" side) is added to DRONE (the "many" side) as an FK:

\`DRONE_TYPE(dt_code, dt_manufacturer)\`
\`DRONE(drone_id, dt_code, drone_pur_date)\`  ← \`dt_code\` is the FK

Why this direction? Because each "many"-side row relates to exactly **one** "one"-side row, a single FK column can hold that link without repetition. Putting the key the other way (a list of drone_ids inside DRONE_TYPE) would need a repeating group — which violates 1NF. The FK-on-the-many-side rule is exactly how normalisation's 1NF/2NF results turn into a clean logical model.`,
        flashcardFront: `One DRONE_TYPE has many DRONEs. To map this 1:M relationship you:`,
        options: [
          "Put dt_code (PK of DRONE_TYPE) into DRONE as a foreign key",
          "Put drone_id (PK of DRONE) into DRONE_TYPE as a foreign key",
          "Create a new bridge relation",
          "Store a list of drone_ids inside DRONE_TYPE",
        ],
        answer: "Put dt_code (PK of DRONE_TYPE) into DRONE as a foreign key",
        flashcardBack: `For **1:M**, post the PK of the **"one"** side (DRONE_TYPE) into the **"many"** side (DRONE) as an FK. Each drone links to exactly one type, so one FK column suffices. Storing a list of drone_ids in DRONE_TYPE would be a **repeating group** (breaks 1NF); a bridge relation is for **M:N**, not 1:M.`,
      },
      {
        name: "Mapping M:N Relationships",
        orderIndex: 3,
        prerequisites: ["Mapping 1:M Relationships"],
        explanation: `A **M:N (many-to-many)** relationship **cannot** be represented by an FK in either entity — neither side relates to just one of the other, so a single FK column would need to hold many values (a repeating group, forbidden in 1NF).

🔑 The rule: create a **new relation** (a *bridge*, *junction* or *associative* relation). Its primary key is the **combination of the primary keys of the two entities**, and each of those is also a **foreign key** back to its entity.

Example: customers take many training courses; each course has many customers. Map to:

\`CUSTOMER(cust_id, …)\`, \`TRAINING(train_code, …)\`, and the bridge
\`CUST_TRAIN(cust_id, train_code, ct_date_start, …)\`

The bridge naturally gives a home to any **attributes of the association** (the date completed, expiry, etc.) — these belong to the pairing, not to either entity. This is exactly the associative entity from conceptual modelling, now realised as a relation. If the natural composite key is awkward, a **surrogate key** can be added (next concept).`,
        flashcardFront: `Mapping a M:N relationship between CUSTOMER and TRAINING to relations requires:`,
        options: [
          "A new bridge relation keyed by (cust_id, train_code), each an FK",
          "An FK cust_id inside TRAINING",
          "An FK train_code inside CUSTOMER",
          "Merging CUSTOMER and TRAINING into one relation",
        ],
        answer: "A new bridge relation keyed by (cust_id, train_code), each an FK",
        flashcardBack: `M:N can't live in an FK on either side (it would need a repeating group). You create a **bridge relation** whose PK is the **pair** of both entities' PKs — \`(cust_id, train_code)\` — with each also an FK. The bridge also stores any attributes *about the association* (e.g. date completed). This is the associative entity made real.`,
      },
      {
        name: "Mapping 1:1 and Unary Relationships",
        orderIndex: 4,
        prerequisites: ["Mapping 1:M Relationships"],
        explanation: `Two special cases round out the mapping rules.

**1:1 relationships.** Put the FK on **one** side (you can choose). The usual heuristic is to place the FK on the side with **optional** participation, so the column isn't full of NULLs; if both sides are mandatory, the two entities can sometimes be merged into one relation.

**Unary (recursive) relationships** — an entity related to *itself*:
- **Unary 1:M** — add an FK to the **same** relation that references its own PK. Classic example: an employee has one manager, who is also an employee — \`EMPLOYEE(emp_no, …, mgr_no)\` where \`mgr_no\` is an FK to \`emp_no\` in the same table.
- **Unary M:N** — create a bridge relation that references the same entity's PK **twice** (e.g. parts made of other parts).

⚠️ Some structures are impossible by definition: a **recursive identifying** relationship, and a **1:1 total (mandatory-both) identifying** relationship, cannot exist. Watch out, too, for relationship **loops** that introduce ambiguity about which path carries which meaning.`,
        flashcardFront: `An employee's manager is also an employee. How is this unary 1:M relationship mapped?`,
        options: [
          "Add mgr_no to EMPLOYEE as an FK referencing emp_no in the same relation",
          "Create a separate MANAGER relation",
          "Add a repeating group of employee numbers",
          "It cannot be represented relationally",
        ],
        answer: "Add mgr_no to EMPLOYEE as an FK referencing emp_no in the same relation",
        flashcardBack: `A **unary (recursive) 1:M** relationship is mapped with a **self-referencing FK**: \`mgr_no\` in EMPLOYEE points to \`emp_no\` in the *same* relation. No new table is needed — each employee links to one manager, who is another row in EMPLOYEE. (A unary *M:N* would need a bridge referencing EMPLOYEE twice.)`,
      },
      {
        name: "Surrogate Keys and Controlling Values",
        orderIndex: 5,
        prerequisites: ["Mapping M:N Relationships"],
        explanation: `Two refinements often applied at the logical level:

**Surrogate keys.** When a natural key is large or clumsy — e.g. a bridge relation keyed by \`(train_code, cust_id, ct_date_start)\` — you may add a single system-generated PK such as \`ct_id\`. This simplifies foreign keys elsewhere (other tables now reference one column, not three). But:
- Add a surrogate **only with justification**, and **only on the logical model**.
- You **must protect the natural key** with a **UNIQUE** constraint/index, or the surrogate would let genuine duplicates slip in.

**Controlling attribute values.** To restrict what a column may contain:
- A **CHECK constraint** suits a **small, fixed, unchanging** set — e.g. \`gender IN ('M','F','U')\`. Cheap, but changing the allowed set means altering the constraint.
- A **lookup table** suits a **larger or extendable** set — store valid values as rows in their own table and reference them by FK. New values are just new rows; no schema change needed.

🎯 Rule of thumb: *fixed & tiny → CHECK; growing or large → lookup table.*`,
        flashcardFront: `You need to restrict a column to a set of valid values that the client expects to **extend over time**. Best choice?`,
        options: [
          "A lookup table referenced by a foreign key",
          "A CHECK constraint listing the values",
          "Storing the values as free-text varchar",
          "A surrogate key",
        ],
        answer: "A lookup table referenced by a foreign key",
        flashcardBack: `An **extendable** set is best held in a **lookup table**: adding a value is just inserting a row — no schema change. A **CHECK** constraint fits only a **small, fixed, unchanging** set (changing it means altering the constraint). Free-text varchar loses all value control; a surrogate key is about *identifying* rows, not restricting values.`,
      },
    ],
  },

  // ── WEEK 6 — DDL: Creating the Database ─────────────────────────────────────
  {
    index: 6,
    title: "DDL: Creating the Database",
    cheatSheet: `## DDL — Defining the Database (Oracle)

**SQL sub-languages**
- **DDL** (Data Definition) — structure: \`CREATE\`, \`ALTER\`, \`DROP\` TABLE.
- **DML** (Data Manipulation) — data: \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`SELECT\`.
- **DCL** (Data Control) — permissions: \`GRANT\`, \`REVOKE\`.

Statements end with \`;\` — keywords are **not** case-sensitive.

**Common Oracle data types**
| Type | Use |
|---|---|
| \`CHAR(n)\` | fixed-length text (padded) — codes, postcodes |
| \`VARCHAR2(n)\` | variable-length text — names |
| \`NUMBER(p,s)\` | numbers; p = total digits, s = decimals |
| \`DATE\` | date **and** time (to seconds) |

💡 Store postcodes as \`CHAR/VARCHAR2\`, not \`NUMBER\` — they're identifiers (leading zeros, no arithmetic).

**Constraints** (column-level or table-level)
\`\`\`sql
CREATE TABLE training (
  train_code  CHAR(5)       NOT NULL,
  train_desc  VARCHAR2(100) NOT NULL,
  train_hrs   NUMBER(2)     NOT NULL,
  CONSTRAINT training_pk PRIMARY KEY (train_code)
);
\`\`\`
- \`NOT NULL\` · \`UNIQUE\` · \`PRIMARY KEY\` · \`FOREIGN KEY … REFERENCES\` · \`CHECK\`
- ⚠️ All constraints **except NOT NULL** should be **named** (\`CONSTRAINT name …\`).
- Composite keys / FKs must be **table-level**.

**Referential actions on delete of a parent PK**
- **RESTRICT / NO ACTION** — block the delete if children exist.
- **CASCADE** — delete the children too.
- **SET NULL (NULLIFY)** — set the child FK to NULL.

**Changing & removing**
- \`ALTER TABLE … ADD / MODIFY / DROP …\` — change structure or add constraints.
- \`DROP TABLE t CASCADE CONSTRAINTS PURGE;\` — remove a table referenced by FKs.`,
    concepts: [
      {
        name: "SQL Sub-languages: DDL, DML, DCL",
        orderIndex: 1,
        prerequisites: [],
        explanation: `SQL is one language with several functional groups, and it helps to know which group a statement belongs to:

- **DDL — Data Definition Language** defines and changes the database **structure**: \`CREATE TABLE\`, \`ALTER TABLE\`, \`DROP TABLE\`. This week's focus.
- **DML — Data Manipulation Language** works with the **data** (rows): \`INSERT\`, \`UPDATE\`, \`DELETE\`, and \`SELECT\` for retrieval.
- **DCL — Data Control Language** manages **permissions** on database objects: \`GRANT\`, \`REVOKE\`.

A few universal mechanics: every statement ends with a **semicolon (\`;\`)**; **keywords are not case-sensitive** (\`SELECT\` = \`select\`); and predefined keywords mark the *clauses* of a statement.

Knowing the grouping clarifies intent and consequences — DDL changes the schema (and in many systems auto-commits), DML changes contents (and is governed by transactions), and DCL changes who's allowed to do what. Designers spend most of their structural work in DDL, then hand DML to applications.`,
        flashcardFront: `Which set of statements belongs to **DDL** (Data Definition Language)?`,
        options: [
          "CREATE TABLE, ALTER TABLE, DROP TABLE",
          "INSERT, UPDATE, DELETE",
          "GRANT, REVOKE",
          "SELECT, COMMIT, ROLLBACK",
        ],
        answer: "CREATE TABLE, ALTER TABLE, DROP TABLE",
        flashcardBack: `**DDL** defines *structure*: \`CREATE\`, \`ALTER\`, \`DROP\` TABLE. \`INSERT/UPDATE/DELETE\` are **DML** (manipulate data); \`GRANT/REVOKE\` are **DCL** (permissions). Knowing the group tells you the effect: DDL changes the schema, DML changes the rows, DCL changes access rights.`,
      },
      {
        name: "Oracle Data Types",
        orderIndex: 2,
        prerequisites: ["SQL Sub-languages: DDL, DML, DCL"],
        explanation: `Choosing the right **data type** for each column is part of design. Common Oracle types:

- **\`CHAR(n)\`** — *fixed*-length text, blank-padded to \`n\`. Good for codes of known length (a 5-char training code).
- **\`VARCHAR2(n)\`** — *variable*-length text up to \`n\`. Good for names and free text. (Note \`'apple'\` in CHAR(10) is padded and won't equal \`'apple'\` in VARCHAR2(10).)
- **\`NUMBER(p, s)\`** — numeric with \`p\` total significant digits and \`s\` decimal places. \`NUMBER(6,2)\` holds up to 9999.99 — right for a balance capped at $2000.00.
- **\`DATE\`** — stores a date **and** a time (down to seconds). Use it for any point in time; don't store years as DATE if you only need the year (a \`NUMBER(4)\` or \`CHAR(4)\` is clearer).

🎯 A key judgement: store **identifiers as text**, not numbers. A postcode like \`3001\` or \`0800\` is an identifier — it has no arithmetic meaning and may carry leading zeros — so \`CHAR(4)\`/\`VARCHAR2(4)\` is correct; \`NUMBER\` would drop leading zeros and invite meaningless sums.`,
        flashcardFront: `Why store an Australian postcode (e.g. 3001, 0800) as \`CHAR(4)\`/\`VARCHAR2(4)\` rather than \`NUMBER(4)\`?`,
        options: [
          "It is an identifier — no arithmetic, and NUMBER would drop leading zeros",
          "NUMBER cannot store four digits",
          "CHAR is always faster than NUMBER",
          "Postcodes must always be added together",
        ],
        answer: "It is an identifier — no arithmetic, and NUMBER would drop leading zeros",
        flashcardBack: `A postcode is an **identifier**, not a quantity: you never do arithmetic on it, and some (like \`0800\`) have **leading zeros** that \`NUMBER\` would discard. So text types (\`CHAR\`/\`VARCHAR2\`) are correct. General rule: numbers you *calculate with* → \`NUMBER\`; numbers that merely *label* things → text.`,
      },
      {
        name: "CREATE TABLE and Constraints",
        orderIndex: 3,
        prerequisites: ["Oracle Data Types"],
        explanation: `\`CREATE TABLE\` defines a relation as columns plus **constraints** — the rules the DBMS enforces to keep data valid. The constraint types:

- **\`NOT NULL\`** — the column must have a value.
- **\`UNIQUE\`** — no two rows share the value (an alternate key).
- **\`PRIMARY KEY\`** — unique **and** not null; identifies rows.
- **\`FOREIGN KEY … REFERENCES\`** — value must match a PK elsewhere (referential integrity).
- **\`CHECK\`** — value must satisfy a condition, e.g. \`CHECK (train_type IN ('P','F'))\`.

Constraints can be written at **column level** (inline with one column) or **table level** (after the columns). A composite PK or composite FK *must* be table-level, since it spans several columns.

\`\`\`sql
CREATE TABLE training (
  train_code CHAR(5)       NOT NULL,
  train_desc VARCHAR2(100) NOT NULL,
  train_hrs  NUMBER(2)     NOT NULL,
  CONSTRAINT training_pk PRIMARY KEY (train_code)   -- table-level
);
\`\`\`

⚠️ Every constraint **except NOT NULL** should be given a **name** (\`CONSTRAINT training_pk …\`). Named constraints produce clear error messages and can be enabled, disabled or dropped by name later.`,
        flashcardFront: `Which constraint can be declared **only** at table level (not inline on a single column)?`,
        options: [
          "A composite primary key spanning two columns",
          "A NOT NULL on one column",
          "A CHECK on a single column",
          "A single-column UNIQUE",
        ],
        answer: "A composite primary key spanning two columns",
        flashcardBack: `A **composite** PK (or composite FK) spans **multiple columns**, so it can't be attached to one column inline — it must be **table-level**. Single-column constraints (NOT NULL, a single-column CHECK or UNIQUE) can be written either way. Also remember: name every constraint except NOT NULL.`,
      },
      {
        name: "Referential Integrity Actions",
        orderIndex: 4,
        prerequisites: ["CREATE TABLE and Constraints"],
        explanation: `A foreign key raises a question: what should happen to **child** rows when the **parent** row they reference is **deleted**? SQL lets you declare the behaviour:

- **RESTRICT / NO ACTION** — **block** the deletion while matching child rows exist. (Oracle's default behaviour is essentially NO ACTION.) Safest: you can't orphan children.
- **CASCADE** — delete the parent **and** automatically delete all its child rows. Use when children have no meaning without the parent.
- **SET NULL (NULLIFY)** — delete the parent and set the children's FK to **NULL**. Only possible if the FK column allows NULLs.

The right choice comes from the **business meaning**, decided at **design time** and read off the model's *mandatory vs optional* participation. If a child *must* have a parent (mandatory), SET NULL is invalid — you'd violate the rule — so RESTRICT or CASCADE apply. If the link is optional, SET NULL can be appropriate. For example, deleting a drone might CASCADE to its service records (they're meaningless without the drone) but SET NULL the servicing employee FK (the service still happened).`,
        flashcardFront: `A child row's FK is **mandatory** (cannot be NULL). Which referential action is **invalid** for it?`,
        options: ["SET NULL", "CASCADE", "RESTRICT", "NO ACTION"],
        answer: "SET NULL",
        flashcardBack: `**SET NULL** would write NULL into the child's FK — impossible if that FK is **mandatory (NOT NULL)**, so it's invalid here. **CASCADE** (delete the children) and **RESTRICT/NO ACTION** (block the delete) remain valid. The choice is a *design-time* decision driven by mandatory-vs-optional participation on the model.`,
      },
      {
        name: "ALTER TABLE and DROP TABLE",
        orderIndex: 5,
        prerequisites: ["CREATE TABLE and Constraints"],
        explanation: `Schemas evolve, so DDL provides statements to change and remove tables.

**\`ALTER TABLE\`** modifies an existing table's structure:
- **ADD** a column or a constraint — \`ALTER TABLE training ADD (train_type CHAR(1) DEFAULT 'P', CONSTRAINT chk_tt CHECK (train_type IN ('P','F')));\`
- **MODIFY** a column — e.g. make it \`NOT NULL\`.
- **DROP** a column or constraint.

A common, cleaner pattern is to create tables first and add **foreign keys afterwards with ALTER**, so creation order doesn't matter and FK constraints are clearly named. Constraints can also be temporarily **DISABLED/ENABLED** — but never on a live system, since while disabled the DBMS stops enforcing that rule and invalid rows could slip in.

**\`DROP TABLE\`** removes a table and its data. If other tables reference it via FKs, a plain drop fails; you use \`DROP TABLE customer CASCADE CONSTRAINTS PURGE;\` — \`CASCADE CONSTRAINTS\` removes the dependent FK constraints, and \`PURGE\` skips the recycle bin so the space is reclaimed immediately.`,
        flashcardFront: `A plain \`DROP TABLE customer;\` fails because other tables reference it via FKs. What fixes it?`,
        options: [
          "DROP TABLE customer CASCADE CONSTRAINTS PURGE;",
          "DROP TABLE customer ONLY;",
          "ALTER TABLE customer DROP;",
          "DELETE FROM customer;",
        ],
        answer: "DROP TABLE customer CASCADE CONSTRAINTS PURGE;",
        flashcardBack: `\`CASCADE CONSTRAINTS\` removes the FK constraints in *other* tables that point at CUSTOMER, letting the drop proceed; \`PURGE\` bypasses the recycle bin to free space at once. (\`DELETE FROM customer\` only removes *rows*, not the table; it's DML, not DDL.)`,
      },
    ],
  },

  // ── WEEK 7 — DML & Transactions ─────────────────────────────────────────────
  {
    index: 7,
    title: "DML & Transaction Management",
    cheatSheet: `## DML & Transactions

**INSERT** — add rows
\`\`\`sql
INSERT INTO member (member_id, member_name) VALUES (100, 'Sam');  -- list cols
INSERT INTO member VALUES (100, 'Sam', NULL);                     -- all cols, in order
\`\`\`
- **Sequence** for auto-increment PKs: \`seq.NEXTVAL\`, \`seq.CURRVAL\`.
  ⚠️ Don't rely on a sequence value after a COMMIT/ROLLBACK.

**UPDATE / DELETE** — change or remove rows (a missing \`WHERE\` hits **every** row!)
\`\`\`sql
UPDATE drone SET drone_cost_hr = drone_cost_hr * 1.1 WHERE dt_code = 'DIN2';
DELETE FROM customer WHERE cust_id NOT IN (SELECT cust_id FROM cust_train);
\`\`\`

**ACID — transaction properties**
- 🔑 **Atomicity** — all operations complete, or none do (all-or-nothing).
- 🔑 **Consistency** — moves the DB from one valid state to another.
- 🔑 **Isolation** — concurrent transactions don't interfere.
- 🔑 **Durability** — once committed, changes survive failures.

**Concurrency problems** (interleaving without control)
- **Lost update** · **Uncommitted (dirty) data** · **Inconsistent retrieval**

**Locking**
- **Shared (S)** lock — many readers at once (read, not write).
- **Exclusive (X)** lock — one writer; blocks all others.
- ⚠️ **Deadlock** — each transaction holds what the other needs → "deadly embrace".

**Recovery**
- **Transaction log** — before/after values of every change.
- **Checkpoint** — flush committed work to disk periodically.
- **REDO** committed (after-images); **UNDO** uncommitted (before-images).
- **Backup** ≠ checkpoint; for hard crashes, restore backup + REDO (forward recovery).`,
    concepts: [
      {
        name: "INSERT and Sequences",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**\`INSERT\`** adds rows to a table, in two forms:

- **Listing the columns** — \`INSERT INTO member (member_id, member_name) VALUES (100, 'Sam');\` — explicit, order-independent, and robust if the table changes. **Preferred.**
- **Not listing columns** — \`INSERT INTO member VALUES (100, 'Sam', NULL);\` — you must supply a value for **every** column **in definition order**. Brittle.

For numeric primary keys you rarely want to invent IDs by hand. Oracle provides a **SEQUENCE** — an auto-incrementing number generator:

\`\`\`sql
CREATE SEQUENCE manuf_seq START WITH 100 INCREMENT BY 1;
INSERT INTO manufacturer VALUES (manuf_seq.NEXTVAL, 'Monash Drones');
INSERT INTO drone_type  VALUES ('DJIT','DJI Trello', manuf_seq.CURRVAL);
\`\`\`

\`NEXTVAL\` produces the next number; \`CURRVAL\` re-reads the *same* value just generated (handy for inserting a child that references the parent you just created).

⚠️ A sequence value **cannot be relied upon after a COMMIT or ROLLBACK** — capture and use it within the same transaction.`,
        flashcardFront: `In Oracle, what does a **SEQUENCE** provide?`,
        options: [
          "Auto-incrementing numbers (via NEXTVAL/CURRVAL), typically for PKs",
          "A way to sort query results",
          "A backup of the transaction log",
          "A lock on a row",
        ],
        answer: "Auto-incrementing numbers (via NEXTVAL/CURRVAL), typically for PKs",
        flashcardBack: `A **SEQUENCE** generates a stream of numbers — \`NEXTVAL\` for the next, \`CURRVAL\` to re-read the last one in the same session — most often to populate numeric **primary keys** without hand-coding IDs. Caveat: don't rely on the value after a **COMMIT/ROLLBACK**. (Sorting is \`ORDER BY\`; locks and logs are unrelated.)`,
      },
      {
        name: "UPDATE and DELETE",
        orderIndex: 2,
        prerequisites: ["INSERT and Sequences"],
        explanation: `**\`UPDATE\`** changes values in existing rows; **\`DELETE\`** removes rows. Both take an optional \`WHERE\` that selects which rows are affected:

\`\`\`sql
UPDATE training
SET train_desc = 'DJI Hobby Drone Training', train_hrs = 5
WHERE train_code = 'DJIHY';

DELETE FROM customer
WHERE cust_id NOT IN (SELECT DISTINCT cust_id FROM cust_train);
\`\`\`

⚠️ The \`WHERE\` is critical: **omit it and the statement affects every row** in the table — \`UPDATE drone SET ...\` with no WHERE updates *all* drones; \`DELETE FROM customer\` empties the whole table.

Two powerful features:
- The \`SET\` value can be an **expression** referencing the current value: \`SET drone_cost_hr = drone_cost_hr * 1.1\` (a 10% rise).
- The condition (or the SET value) can use a **subquery** to pull values from other tables — as in the DELETE above, which removes customers who appear in no \`cust_train\` row.

Because SQL string comparison is **case-sensitive**, functions like \`UPPER()\`/\`LOWER()\` are used to match regardless of the stored case.`,
        flashcardFront: `What happens if you run \`DELETE FROM customer;\` with **no WHERE clause**?`,
        options: [
          "Every row in customer is deleted",
          "Nothing — a WHERE is mandatory",
          "Only the first row is deleted",
          "The table structure is dropped",
        ],
        answer: "Every row in customer is deleted",
        flashcardBack: `No \`WHERE\` means the operation applies to **all rows** — \`DELETE FROM customer;\` empties the table (the same trap applies to \`UPDATE\` without WHERE). The table itself still exists (that would be \`DROP\`). Always double-check the WHERE before running UPDATE/DELETE.`,
      },
      {
        name: "ACID Transaction Properties",
        orderIndex: 3,
        prerequisites: ["UPDATE and DELETE"],
        explanation: `A **transaction** is a logical unit of work — one or more SQL statements that must succeed or fail **together**. The DBMS guarantees four properties, abbreviated **ACID**:

- **Atomicity** — all the transaction's operations complete, or **none** do. A funds transfer that debits one account must also credit the other; if it stops halfway, the whole thing is rolled back.
- **Consistency** — a transaction takes the database from one **valid** state to another, respecting all constraints.
- **Isolation** — concurrent transactions must not interfere; intermediate results of one aren't visible to others until it commits.
- **Durability** — once a transaction **commits**, its changes are permanent and survive a later crash.

\`COMMIT\` makes a transaction's changes permanent; \`ROLLBACK\` undoes them. Example: two UPDATEs (return a rental, then add to the drone's flight time) followed by \`COMMIT\`. If power is lost **after the first UPDATE but before COMMIT**, **atomicity** requires the first change to be undone — you can't keep half a transaction.`,
        flashcardFront: `A transaction does two UPDATEs then COMMITs. Power fails after the **first** UPDATE only. Which ACID property requires that first change be undone?`,
        options: ["Atomicity", "Durability", "Isolation", "Consistency"],
        answer: "Atomicity",
        flashcardBack: `**Atomicity** = all-or-nothing. Since the transaction never reached \`COMMIT\`, *none* of its changes may persist, so the first UPDATE must be **rolled back**. (Durability is the opposite guarantee — it protects changes *after* a successful commit. Isolation concerns concurrent transactions.)`,
      },
      {
        name: "Concurrency Problems",
        orderIndex: 4,
        prerequisites: ["ACID Transaction Properties"],
        explanation: `When transactions run **concurrently**, their operations can **interleave**. Serial execution (one fully finishing before the next starts) is always correct but slow; interleaving boosts throughput but, without control, can corrupt data. An interleaving is acceptable only if it is **serialisable** — gives the same result as *some* serial order.

Three classic problems arise from uncontrolled interleaving:

- **Lost update** — two transactions read the same value, both modify it, and the second overwrite **erases** the first's change.
- **Uncommitted (dirty) data** — one transaction reads a value another has changed **but not yet committed**; if that other transaction then rolls back, the first acted on data that never really existed.
- **Inconsistent retrieval** — a read-only transaction computes an aggregate (say, total flight time) **while** another transaction is updating some of those rows, so it sums a mix of old and new values — an inconsistent snapshot.

Recognising which problem a scenario shows is the first step; the cure is concurrency control via **locking**.`,
        flashcardFront: `T1 sums total flight time (read-only) while T2 simultaneously updates some of those rows. T1's total mixes old and new values. This is:`,
        options: ["Inconsistent retrieval", "Lost update", "Uncommitted (dirty) data", "Deadlock"],
        answer: "Inconsistent retrieval",
        flashcardBack: `A read-only transaction aggregating data **while it's being changed** gets a mixed, inconsistent snapshot — **inconsistent retrieval**. (*Lost update* needs two writers overwriting each other; *dirty read* needs reading uncommitted changes that may roll back; *deadlock* is a mutual-wait, not a read problem.)`,
      },
      {
        name: "Locking and Deadlock",
        orderIndex: 5,
        prerequisites: ["Concurrency Problems"],
        explanation: `The standard cure for concurrency problems is **locking**. A lock marks part of the database as temporarily unavailable; a transaction must **acquire** the appropriate lock before accessing a data item and **releases** it when it completes. A DBMS component, the **lock manager**, coordinates this.

Two main lock modes:

- **Shared (S) lock** — for **reading**. Many transactions may hold a shared lock on the same item at once (concurrent reads are safe).
- **Exclusive (X) lock** — for **writing**. Only one transaction may hold it, and no shared locks may coexist; everyone else waits.

Locking prevents lost updates and dirty reads, but it introduces a new risk:

⚠️ **Deadlock** ("deadly embrace"). T1 holds an exclusive lock on A and wants B; T2 holds B and wants A. Each waits for a resource the other won't release, so **neither can proceed**. The DBMS detects this (e.g. via a wait-for graph) and resolves it by **aborting** one transaction (the victim), which rolls back and frees its locks so the other can continue.`,
        flashcardFront: `T1 locks A and waits for B; T2 locks B and waits for A. Neither can continue. This is:`,
        options: ["Deadlock", "A shared lock", "Inconsistent retrieval", "Durability"],
        answer: "Deadlock",
        flashcardBack: `Two transactions each holding a resource the other needs, both waiting forever, is a **deadlock** ("deadly embrace"). The DBMS detects it and **aborts one victim** (rolling it back to release its locks) so the other proceeds. A *shared lock* simply allows concurrent reads — not the problem here.`,
      },
      {
        name: "Recovery: Logs, Checkpoints and Backups",
        orderIndex: 6,
        prerequisites: ["ACID Transaction Properties"],
        explanation: `**Recovery** restores the database to its last consistent state after a failure. The core tool is the **transaction log** (journal), which records, for every change: the transaction id, the operation, the object affected, and the **before** and **after** values. It's force-written to stable storage (ideally on separate devices) so it survives a crash.

- A **soft crash** loses volatile memory but not the disk. Recovery uses the log: **UNDO** (roll back) transactions that never committed using **before-images**, and **REDO** committed transactions using **after-images**.
- A **checkpoint** is taken periodically: committed work is flushed to disk and a marker written to the log, so recovery need only scan back to the **last checkpoint** rather than the whole log.

A **hard crash** physically destroys the disk. The log alone isn't enough — you need a **backup** (a copy of the database on a separate device, taken regularly, ideally with an off-site copy). Recovery = restore the most recent **backup**, then **REDO** all committed transactions since (forward recovery).

🔑 A **backup is not a checkpoint**: a checkpoint flushes committed work *within* the live database; a backup is a separate copy that survives the live database being destroyed.`,
        flashcardFront: `After a **hard crash** (the disk is physically destroyed), recovery requires:`,
        options: [
          "Restoring the most recent backup, then REDOing committed transactions",
          "Only UNDOing uncommitted transactions from the log",
          "Only taking a new checkpoint",
          "Nothing — checkpoints fully replace backups",
        ],
        answer: "Restoring the most recent backup, then REDOing committed transactions",
        flashcardBack: `A hard crash destroys the disk, so the live log/checkpoints are gone too — you must **restore a backup** (a separate copy) and then **REDO** committed work since the backup (forward recovery). A **checkpoint is not a backup**: it only flushes committed work inside the live DB, which is exactly what's lost in a hard crash.`,
      },
    ],
  },

  // ── WEEK 8 — SQL Part 1 ─────────────────────────────────────────────────────
  {
    index: 8,
    title: "SQL Part 1: Querying",
    cheatSheet: `## SQL Part 1 — SELECT

\`\`\`sql
SELECT  drone_id, drone_pur_date     -- columns (projection)
FROM    drone                         -- source table(s)
WHERE   drone_pur_price > 2000        -- row restriction
ORDER BY drone_pur_date DESC;         -- sorting
\`\`\`

**Predicates (in WHERE)**
| Need | Operator |
|---|---|
| range | \`BETWEEN 3000 AND 5300\` |
| set membership | \`IN (a, b, c)\` |
| pattern | \`LIKE 'A%'\` (\`%\` any, \`_\` one) |
| null test | \`IS NULL\` / \`IS NOT NULL\` |

⚠️ Never \`= NULL\` — NULL is **UNKNOWN**; use \`IS NULL\`.

**Three-valued logic:** TRUE / FALSE / **UNKNOWN**. A row is returned only if its predicate is **TRUE**. NULL in a comparison → UNKNOWN → not returned.

**Combining predicates:** \`NOT\` → \`AND\` → \`OR\` (use brackets!).
"not 3 and not 8" = \`emp_no <> 3 AND emp_no <> 8\`.

**ORDER BY** — \`ASC\` (default) / \`DESC\`; \`NULLS FIRST/LAST\`; multiple columns.
**DISTINCT** — remove duplicate rows from the result.

**NVL** — replace NULL: \`NVL(rent_in_dt, 'Still out')\`.
**Dates** — display with \`TO_CHAR(d,'dd-Mon-yyyy')\`; compare/insert with \`TO_DATE(...)\`.

🔑 **ANSI JOIN** (put joins in FROM, never the WHERE):
\`\`\`sql
FROM manufacturer JOIN drone_type ON manufacturer.manuf_id = drone_type.manuf_id
FROM manufacturer JOIN drone_type USING (manuf_id)
FROM manufacturer NATURAL JOIN drone_type
\`\`\`
Concatenate strings with \`||\`.`,
    concepts: [
      {
        name: "SELECT, FROM, WHERE",
        orderIndex: 1,
        prerequisites: [],
        explanation: `The \`SELECT\` statement retrieves data and is the workhorse of SQL. Three clauses form its core:

- **\`SELECT\`** — *which columns* to display (a projection). \`SELECT *\` returns all columns.
- **\`FROM\`** — *which table(s)* to draw from.
- **\`WHERE\`** — *which rows* to keep (the restriction); rows failing the condition are excluded.

\`\`\`sql
SELECT drone_id, drone_pur_date, drone_flight_time
FROM   drone
WHERE  drone_pur_price > 2000;
\`\`\`

This reads: from the \`drone\` table, keep rows where the purchase price exceeds 2000, and show those three columns. \`SELECT\` corresponds to relational **projection**, \`WHERE\` to **selection** — the two algebra operations from Week 3, now in concrete syntax.

The \`WHERE\` condition is a **predicate** evaluated against every row independently. Getting comfortable writing precise predicates — ranges, lists, patterns, null tests, and combinations — is most of what early SQL practice is about.`,
        flashcardFront: `In a SELECT statement, which clause decides **which rows** are returned?`,
        options: ["WHERE", "SELECT", "FROM", "ORDER BY"],
        answer: "WHERE",
        flashcardBack: `**\`WHERE\`** filters **rows** (the restriction) — it's relational *selection*. **\`SELECT\`** chooses **columns** (projection); **\`FROM\`** names the table(s); **\`ORDER BY\`** sorts the output. Each row is tested against the WHERE predicate independently and kept only if the predicate is TRUE.`,
      },
      {
        name: "Predicates: BETWEEN, IN, LIKE, IS NULL",
        orderIndex: 2,
        prerequisites: ["SELECT, FROM, WHERE"],
        explanation: `SQL offers concise operators for common WHERE conditions:

- **\`BETWEEN a AND b\`** — an **inclusive range**. \`drone_pur_price BETWEEN 3000 AND 5300\` keeps prices from 3000 to 5300 inclusive (equivalent to \`>= 3000 AND <= 5300\`).
- **\`IN (v1, v2, …)\`** — **set membership**: the value equals one of the listed items. \`dt_code IN ('DIN2','PAPR')\`.
- **\`LIKE\`** — **pattern matching** for text, with wildcards \`%\` (any sequence of characters) and \`_\` (exactly one character). \`name LIKE 'A%'\` matches anything starting with A.
- **\`IS NULL\` / \`IS NOT NULL\`** — test for the absence/presence of a value.

⚠️ The most common beginner error: writing \`column = NULL\`. NULL means *unknown*, and any comparison **with** NULL yields UNKNOWN — never TRUE — so \`= NULL\` matches **nothing**. To find missing values you **must** use \`IS NULL\`. For "rentals not yet returned": \`WHERE rent_in_dt IS NULL\`.`,
        flashcardFront: `To list rentals that have **not been returned** (\`rent_in_dt\` is empty), the correct condition is:`,
        options: [
          "WHERE rent_in_dt IS NULL",
          "WHERE rent_in_dt = NULL",
          "WHERE rent_in_dt = ''",
          "WHERE rent_in_dt IS EMPTY",
        ],
        answer: "WHERE rent_in_dt IS NULL",
        flashcardBack: `Missing values are tested with **\`IS NULL\`**. \`= NULL\` never works: NULL is *unknown*, so any comparison with it evaluates to **UNKNOWN** (not TRUE) and matches no rows. (\`= ''\` tests for an empty string, a different thing; \`IS EMPTY\` isn't valid SQL here.)`,
      },
      {
        name: "Three-Valued Logic and NULL",
        orderIndex: 3,
        prerequisites: ["Predicates: BETWEEN, IN, LIKE, IS NULL"],
        explanation: `SQL predicates use **three-valued logic**: a condition can be **TRUE**, **FALSE**, or **UNKNOWN**. The third value exists because of **NULL**, which represents a missing or unknown value. Any comparison involving NULL (e.g. \`price > 2000\` when price is NULL) evaluates to **UNKNOWN**.

The rule for results is simple: a row is returned **only if its WHERE predicate is TRUE**. Rows evaluating to FALSE *or* UNKNOWN are excluded.

This affects the logical connectives too:
- \`AND\` is TRUE only if **both** sides are TRUE; \`TRUE AND UNKNOWN = UNKNOWN\`.
- \`OR\` is TRUE if **either** side is TRUE; \`TRUE OR UNKNOWN = TRUE\`.
- \`NOT UNKNOWN = UNKNOWN\`.

The practical consequences catch people out. \`price > 2000\` excludes rows where price is NULL (they're UNKNOWN, not FALSE) — and so does \`NOT (price > 2000)\`, because negating UNKNOWN stays UNKNOWN. A NULL row therefore satisfies *neither* a condition nor its negation. This is exactly why you can never compare to NULL with \`=\` and must use \`IS NULL\`.`,
        flashcardFront: `A row is **returned** by a query only when its WHERE predicate evaluates to:`,
        options: ["TRUE", "TRUE or UNKNOWN", "Anything except FALSE", "FALSE"],
        answer: "TRUE",
        flashcardBack: `Only **TRUE** rows are returned. With NULLs, predicates use **three-valued logic** (TRUE/FALSE/**UNKNOWN**), and both FALSE and UNKNOWN rows are excluded. That's why a NULL value satisfies neither \`price > 2000\` nor its negation — both come out UNKNOWN — and why missing values need \`IS NULL\`.`,
      },
      {
        name: "ORDER BY and DISTINCT",
        orderIndex: 4,
        prerequisites: ["SELECT, FROM, WHERE"],
        explanation: `Because a relation has **no inherent row order**, you must use **\`ORDER BY\`** whenever output order matters:

- Direction: **\`ASC\`** (ascending, the default) or **\`DESC\`** (descending).
- NULL placement: \`NULLS FIRST\` / \`NULLS LAST\` to control where missing values land.
- **Multiple columns**: \`ORDER BY drone_flight_time DESC, drone_id\` sorts by flight time (high to low), breaking ties by drone_id.

\`\`\`sql
SELECT rent_no, rent_out_dt, rent_in_dt
FROM   rental
ORDER BY rent_in_dt DESC NULLS LAST;   -- most recent first, unreturned at the end
\`\`\`

**\`DISTINCT\`**, part of the \`SELECT\` clause, removes **duplicate rows** from the result — useful for "which distinct values occur?" questions: \`SELECT DISTINCT drone_id FROM rental\` lists each rented drone once, however many times it was rented. Use it with care: it forces the DBMS to compare and deduplicate, and applied carelessly it can hide that you should really have grouped or joined differently.`,
        flashcardFront: `\`SELECT DISTINCT drone_id FROM rental;\` returns:`,
        options: [
          "Each rented drone_id once, with duplicates removed",
          "Every rental row including repeats",
          "Drones sorted by drone_id",
          "Only the first rental per drone",
        ],
        answer: "Each rented drone_id once, with duplicates removed",
        flashcardBack: `**\`DISTINCT\`** removes duplicate rows from the result, so a drone rented ten times appears **once**. It does *not* sort (that's \`ORDER BY\`) and doesn't pick a "first" row. Use it deliberately — deduplication has a cost and can mask a query that should really use grouping or a different join.`,
      },
      {
        name: "ANSI Joins: ON, USING, NATURAL",
        orderIndex: 5,
        prerequisites: ["SELECT, FROM, WHERE"],
        explanation: `To combine rows from multiple tables, use **ANSI join** syntax — the join goes in the **\`FROM\`** clause, not the \`WHERE\`:

- **\`JOIN … ON\`** — the general form, works always; you state the matching condition explicitly:
  \`FROM manufacturer JOIN drone_type ON manufacturer.manuf_id = drone_type.manuf_id\`
- **\`JOIN … USING (col)\`** — shorthand when the matching columns share a name: \`USING (manuf_id)\`.
- **\`NATURAL JOIN\`** — automatically joins on *all* identically-named columns: \`manufacturer NATURAL JOIN drone_type\`.

⚠️ Putting the join condition in the \`WHERE\` clause (the old "implicit join") is **discouraged and marked wrong** in this unit: it's effectively a cross join (Cartesian product) then a filter, which is error-prone — forget the condition and you get every combination of rows.

A practical method: identify the source tables, build the join table by table (use \`ON\`), then add row restrictions (\`WHERE\`), then the select list and \`ORDER BY\`. Oracle concatenates strings with **\`||\`**, handy for output like \`cust_fname || ' ' || cust_lname\`.`,
        flashcardFront: `Why does this unit require **ANSI joins** (join condition in FROM) rather than putting the condition in the WHERE clause?`,
        options: [
          "WHERE-clause joins are an implicit cross join filtered afterwards — error-prone",
          "WHERE-clause joins are slower in every DBMS",
          "ANSI joins allow NULLs but WHERE joins do not",
          "There is no real difference; it is purely cosmetic",
        ],
        answer: "WHERE-clause joins are an implicit cross join filtered afterwards — error-prone",
        flashcardBack: `An implicit (WHERE-clause) join is conceptually a **Cartesian product then a filter** — omit or mistype the condition and you silently get every row-combination. ANSI \`JOIN … ON/USING/NATURAL\` states the relationship clearly in \`FROM\`, separating *how tables connect* from *which rows to keep*, which is why it's required.`,
      },
      {
        name: "NVL and Date Formatting",
        orderIndex: 6,
        prerequisites: ["Three-Valued Logic and NULL"],
        explanation: `Two Oracle essentials for tidy output and correct date handling.

**\`NVL(value, replacement)\`** substitutes a value when the first argument is **NULL**. \`NVL(rent_in_dt, 'Still out')\` shows "Still out" for unreturned rentals instead of a blank. Note the two arguments must be type-compatible: since \`rent_in_dt\` is a DATE and \`'Still out'\` is text, you first convert the date to text — \`NVL(TO_CHAR(rent_in_dt,'dd-Mon-yyyy'), 'Still out')\`.

**Dates** need explicit conversion, in two directions:
- **Displaying**: a DATE is formatted with **\`TO_CHAR(date, 'format')\`** — e.g. \`TO_CHAR(rent_out_dt,'dd-Mon-yyyy')\` → \`05-Mar-2021\`. \`TO_CHAR\` also formats numbers.
- **Comparing / inserting**: text representing a date is parsed with **\`TO_DATE('31-Mar-2021','dd-Mon-yyyy')\`** so it's a real DATE for comparison.

🎯 Mnemonic: \`TO_CHAR\` *out* (date → text for display), \`TO_DATE\` *in* (text → date for storage/comparison). Relying on the database's default date format instead is a frequent source of bugs.`,
        flashcardFront: `What does \`NVL(rent_in_dt, 'Still out')\` do?`,
        options: [
          "Shows 'Still out' when rent_in_dt is NULL, otherwise the value",
          "Deletes rows where rent_in_dt is NULL",
          "Converts rent_in_dt to uppercase",
          "Sorts rows with NULLs last",
        ],
        answer: "Shows 'Still out' when rent_in_dt is NULL, otherwise the value",
        flashcardBack: `**\`NVL(a, b)\`** returns \`b\` when \`a\` is **NULL**, else \`a\` — here displaying "Still out" for unreturned rentals. The two arguments must be type-compatible, so a DATE is usually wrapped in \`TO_CHAR\` first. (Uppercasing is \`UPPER\`; NULL ordering is \`NULLS LAST\`.)`,
      },
    ],
  },

  // ── WEEK 9 — SQL Intermediate ───────────────────────────────────────────────
  {
    index: 9,
    title: "SQL Intermediate: Grouping & Subqueries",
    cheatSheet: `## SQL Intermediate

**Aggregate functions** (summarise many rows → one value)
\`COUNT(*)\`, \`COUNT(col)\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`.
⚠️ \`COUNT(*)\` counts rows; \`COUNT(col)\` ignores NULLs in *col*.

**Clause order (written & logical):**
\`SELECT · FROM · WHERE · GROUP BY · HAVING · ORDER BY\`
Logical execution: **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**.

**GROUP BY** — apply the aggregate **per group**:
\`\`\`sql
SELECT dt_code, AVG(drone_flight_time)
FROM drone GROUP BY dt_code ORDER BY dt_code;
\`\`\`
🔑 Every non-aggregated column in SELECT/HAVING/ORDER BY **must** be in GROUP BY (else *ORA-00979: not a GROUP BY expression*).

**WHERE vs HAVING**
- **WHERE** filters **rows** *before* grouping.
- **HAVING** filters **groups** *after* aggregation (can use aggregates).
\`\`\`sql
SELECT dt_code, AVG(drone_flight_time)
FROM drone
WHERE  to_char(drone_pur_date,'yyyy') = '2021'   -- rows
GROUP BY dt_code
HAVING AVG(drone_flight_time) > 50                -- groups
ORDER BY dt_code;
\`\`\`

**Subqueries** (a query inside a query)
- Single-value → compare with \`=\`, \`<\`, \`>\`.
- Multi-row (list) → use \`IN\`, or \`ANY\`/\`ALL\` with \`<\`,\`>\`.
- \`> ALL(...)\` = greater than the max; \`> ANY(...)\` = greater than the min.`,
    concepts: [
      {
        name: "Aggregate Functions",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**Aggregate functions** collapse **many rows into a single summary value**:

- **\`COUNT\`** — how many. \`COUNT(*)\` counts **rows**; \`COUNT(col)\` counts **non-NULL** values in that column.
- **\`SUM\`** / **\`AVG\`** — total / average of a numeric column.
- **\`MIN\`** / **\`MAX\`** — smallest / largest value.

\`\`\`sql
SELECT MAX(drone_flight_time) FROM drone;
SELECT COUNT(*) FROM drone WHERE drone_flight_time > 100;
\`\`\`

Used without grouping, an aggregate treats the **whole result set** as one group and returns one row.

⚠️ The \`COUNT(*)\` vs \`COUNT(col)\` distinction matters: if some rows have a NULL in \`col\`, \`COUNT(col)\` is **smaller** than \`COUNT(*)\` because aggregates (except \`COUNT(*)\`) ignore NULLs. \`AVG(col)\` likewise averages over only the non-NULL values, which can surprise you if you expected NULLs to count as zero. Knowing what each function does with NULLs prevents subtly wrong totals.`,
        flashcardFront: `How does \`COUNT(*)\` differ from \`COUNT(rent_in_dt)\`?`,
        options: [
          "COUNT(*) counts all rows; COUNT(rent_in_dt) ignores rows where rent_in_dt is NULL",
          "They always return the same number",
          "COUNT(*) ignores NULLs; COUNT(rent_in_dt) counts them",
          "COUNT(*) only works without a WHERE clause",
        ],
        answer: "COUNT(*) counts all rows; COUNT(rent_in_dt) ignores rows where rent_in_dt is NULL",
        flashcardBack: `\`COUNT(*)\` counts **every row**; \`COUNT(col)\` counts only rows where \`col\` is **not NULL** (like all aggregates except \`COUNT(*)\`, it skips NULLs). So if some rentals haven't been returned, \`COUNT(rent_in_dt)\` < \`COUNT(*)\`. The same NULL-skipping applies to \`SUM\`/\`AVG\`.`,
      },
      {
        name: "GROUP BY",
        orderIndex: 2,
        prerequisites: ["Aggregate Functions"],
        explanation: `**\`GROUP BY\`** partitions rows into groups that share the same value(s) in the grouping column(s), then applies the aggregate **to each group** rather than the whole table:

\`\`\`sql
SELECT dt_code, AVG(drone_flight_time)
FROM   drone
GROUP BY dt_code
ORDER BY dt_code;
\`\`\`

This returns one row per \`dt_code\`, each with that type's average flight time. You can group by several columns — \`GROUP BY cust_id, train_code\` makes a group for each *(customer, course)* pairing.

🔑 The cardinal rule: **every column in the \`SELECT\` list that is not inside an aggregate must appear in the \`GROUP BY\`.** Otherwise Oracle raises *ORA-00979: not a GROUP BY expression*. The reason is logical — within a group, a non-aggregated column could have many different values, and the DBMS wouldn't know which one to show. (The reverse isn't required: you may group by a column you don't display.) Note you can group by an expression like \`TO_CHAR(ct_date_start,'yyyy')\`, but a column **alias** can't be used in \`GROUP BY\`, because grouping happens before the SELECT aliases are assigned.`,
        flashcardFront: `\`SELECT cust_id, train_code, COUNT(*) FROM cust_train GROUP BY cust_id;\` raises *ORA-00979*. Why?`,
        options: [
          "train_code is in SELECT but not in GROUP BY",
          "You cannot use COUNT(*) with GROUP BY",
          "cust_id must be aggregated",
          "GROUP BY must come before WHERE",
        ],
        answer: "train_code is in SELECT but not in GROUP BY",
        flashcardBack: `Every **non-aggregated** SELECT column must be in the \`GROUP BY\`. Here \`train_code\` is displayed but not grouped — within a single \`cust_id\` group there could be several train_codes, so the DBMS can't pick one. Fix: \`GROUP BY cust_id, train_code\`. (Grouping by an extra column you *don't* display is fine; only the SELECT→GROUP BY direction is enforced.)`,
      },
      {
        name: "HAVING vs WHERE",
        orderIndex: 3,
        prerequisites: ["GROUP BY"],
        explanation: `Both \`WHERE\` and \`HAVING\` filter, but at **different stages**:

- **\`WHERE\`** filters **individual rows** *before* grouping. It cannot reference aggregate functions (the groups don't exist yet).
- **\`HAVING\`** filters **whole groups** *after* aggregation. It typically *does* reference aggregates.

\`\`\`sql
SELECT dt_code, AVG(drone_flight_time) AS avg_flight
FROM   drone
WHERE  TO_CHAR(drone_pur_date,'yyyy') = '2021'   -- keep 2021 rows
GROUP BY dt_code
HAVING AVG(drone_flight_time) > 50               -- keep groups averaging > 50
ORDER BY dt_code;
\`\`\`

The DBMS executes clauses in this **logical order**: **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**. So the WHERE here first discards non-2021 rows; the survivors are grouped by type; then HAVING keeps only the type-groups whose average exceeds 50.

🎯 Rule of thumb: condition on **raw column values → WHERE**; condition on an **aggregate of a group → HAVING**. Putting an aggregate in WHERE is an error; putting a plain row filter in HAVING usually works but is less efficient (you'd group rows you could have discarded earlier).`,
        flashcardFront: `You want to keep only drone types whose **average** flight time exceeds 50. This condition belongs in:`,
        options: ["HAVING", "WHERE", "SELECT", "ORDER BY"],
        answer: "HAVING",
        flashcardBack: `A condition on an **aggregate of a group** (\`AVG(...) > 50\`) goes in **\`HAVING\`**, which filters groups *after* aggregation. \`WHERE\` filters raw rows *before* grouping and can't see aggregates. Logical order: FROM → WHERE → GROUP BY → **HAVING** → SELECT → ORDER BY.`,
      },
      {
        name: "Subqueries with IN, ANY, ALL",
        orderIndex: 4,
        prerequisites: ["Aggregate Functions"],
        explanation: `A **subquery** is a query nested inside another. The choice of comparison operator depends on **how many values** the subquery returns:

- **Single value** (e.g. \`SELECT AVG(price) FROM drone\`) → compare with \`=\`, \`<\`, \`>\`:
  \`WHERE price > (SELECT AVG(price) FROM drone)\`.
- **Multiple rows (a list)** → you cannot use a bare \`>\`/\`=\`; use:
  - **\`IN\`** — equals any value in the list.
  - **\`> ANY (…)\`** — greater than **at least one** value = greater than the **minimum**.
  - **\`> ALL (…)\`** — greater than **every** value = greater than the **maximum**.

\`\`\`sql
SELECT * FROM drone
WHERE price > ALL (SELECT MIN(price) FROM drone GROUP BY dt_code);
\`\`\`

⚠️ A frequent error is *ORA-01427: single-row subquery returns more than one row* — it means you used \`=\`/\`>\` against a subquery that returned several rows; switch to \`IN\`/\`ANY\`/\`ALL\`. Remember the equivalences: \`> ALL\` ↔ "> max", \`> ANY\` ↔ "> min" — they're easy to mix up under exam pressure.`,
        flashcardFront: `\`WHERE price > ALL (subquery returning many prices)\` retrieves rows where price is greater than:`,
        options: [
          "Every value returned — i.e. greater than the maximum",
          "At least one value — i.e. greater than the minimum",
          "Exactly one value",
          "The average of the values",
        ],
        answer: "Every value returned — i.e. greater than the maximum",
        flashcardBack: `\`> ALL(list)\` means greater than **every** value, which is the same as greater than the **maximum**. Contrast \`> ANY(list)\` = greater than **at least one** value = greater than the **minimum**. Use \`IN\`/\`ANY\`/\`ALL\` (not bare \`>\`/\`=\`) whenever the subquery can return multiple rows, or you'll hit ORA-01427.`,
      },
    ],
  },

  // ── WEEK 10 — SQL Advanced ──────────────────────────────────────────────────
  {
    index: 10,
    title: "SQL Advanced",
    cheatSheet: `## SQL Advanced

**CASE** — conditional value in the SELECT list
\`\`\`sql
SELECT drone_id,
  CASE WHEN dt_carry_kg = 0 THEN 'No load'
       WHEN dt_carry_kg < 4 THEN 'Light Loads'
       ELSE 'Heavy Loads' END AS capacity
FROM drone_type NATURAL JOIN drone;
\`\`\`

**Subquery flavours**
- **Nested** — independent of outer query; runs **once**.
- **Inline view (derived table)** — a subquery in the **FROM** clause, used as a table.
- **Correlated** — references the outer row; runs **once per outer row**.

**Views** — a stored, named query (a *virtual table*)
\`CREATE OR REPLACE VIEW v AS SELECT …;\` — reuse, simplify, access control.

**Joins**
- **Self join** — a table joined to itself (alias it) — e.g. employee → manager.
- **Outer join** — keep unmatched rows too:
  - \`LEFT OUTER JOIN\` keeps all left rows; \`RIGHT\` keeps all right; unmatched side → NULL.
  - 💡 Use to include rows with **no** matches (e.g. drones **never** rented).

**Set operators** (queries must be **union-compatible**)
| Operator | Result |
|---|---|
| \`UNION\` | rows in either, **duplicates removed** |
| \`UNION ALL\` | rows in either, **duplicates kept** |
| \`INTERSECT\` | rows in **both** |
| \`MINUS\` | rows in first **but not** second |

**Handy functions:** \`LPAD/RPAD\`, \`LTRIM/RTRIM\`, \`DECODE\`, \`EXTRACT\`, \`NVL\`.`,
    concepts: [
      {
        name: "The CASE Expression",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**\`CASE\`** lets a query output different values depending on a condition — like an if/else inside the \`SELECT\` list. It evaluates each \`WHEN\` in order and returns the first matching \`THEN\`; if none match, the \`ELSE\` value (or NULL):

\`\`\`sql
SELECT drone_id,
  CASE
    WHEN dt_carry_kg = 0 THEN 'No load'
    WHEN dt_carry_kg < 4 THEN 'Light Loads'
    ELSE 'Heavy Loads'
  END AS carrying_capacity,
  drone_cost_hr
FROM drone_type NATURAL JOIN drone
ORDER BY drone_id;
\`\`\`

This turns a raw number into a human-readable category. Because the \`WHEN\`s are tested **top to bottom**, order matters: once \`dt_carry_kg = 0\` is handled, the \`< 4\` test only sees values greater than 0, so it correctly means "between 0 and 4". \`CASE\` is invaluable for classifying, bucketing, or relabelling values directly in a query — and it can appear in other clauses too (e.g. \`ORDER BY\`), not just the select list.`,
        flashcardFront: `In a \`CASE\` expression, how are the \`WHEN\` conditions evaluated?`,
        options: [
          "Top to bottom; the first matching WHEN wins",
          "All at once, returning every match",
          "Bottom to top",
          "In random order",
        ],
        answer: "Top to bottom; the first matching WHEN wins",
        flashcardBack: `\`CASE\` tests its \`WHEN\` branches **in order, top to bottom**, and returns the **first** match's \`THEN\` (or the \`ELSE\`/NULL if none). That ordering is what lets a later test like \`< 4\` implicitly mean "between 0 and 4" once \`= 0\` has already been handled above it.`,
      },
      {
        name: "Nested, Inline and Correlated Subqueries",
        orderIndex: 2,
        prerequisites: ["The CASE Expression"],
        explanation: `Subqueries come in three forms, distinguished by *where* they sit and *how often* they run:

- **Nested (simple) subquery** — sits in the \`WHERE\` (or \`HAVING\`), is **independent** of the outer query, and is evaluated **once**; its result feeds the outer query. \`WHERE price > (SELECT AVG(price) FROM drone)\`.
- **Inline view (derived table)** — a subquery placed in the **\`FROM\`** clause and treated as a table the outer query selects from. Useful for computing an intermediate result (e.g. a per-group total) and then joining or filtering on it.
- **Correlated subquery** — references a column from the **outer** query, so it must be re-evaluated **once for every outer row**. "For each drone, find rentals longer than *that drone's* maximum" — the inner query depends on the current outer \`drone_id\`.

The key performance intuition: a nested subquery runs **once**; a **correlated** one runs **per outer row**, so it can be far more expensive. Correlated subqueries are powerful (they can also drive correlated \`UPDATE\`s) but should be used when the row-by-row dependency is genuinely needed.`,
        flashcardFront: `What distinguishes a **correlated** subquery from a plain nested one?`,
        options: [
          "It references the outer query and is re-evaluated once per outer row",
          "It is always faster",
          "It must appear in the FROM clause",
          "It can only return a single value",
        ],
        answer: "It references the outer query and is re-evaluated once per outer row",
        flashcardBack: `A **correlated** subquery depends on a column of the **outer** row, so it runs **once for each outer row** — more costly than a **nested** subquery, which is independent and runs **once**. (A subquery in the **FROM** clause is an *inline view/derived table* — a third, separate category.)`,
      },
      {
        name: "Views",
        orderIndex: 3,
        prerequisites: ["Nested, Inline and Correlated Subqueries"],
        explanation: `A **view** is a stored, named \`SELECT\` — a **virtual table**. It holds no data of its own; each time you query it, the underlying \`SELECT\` runs against the base tables:

\`\`\`sql
CREATE OR REPLACE VIEW maxdaysout_view AS
  SELECT drone_id, MAX(rent_in_dt - rent_out_dt) AS maxdays
  FROM   rental
  WHERE  rent_in_dt IS NOT NULL
  GROUP BY drone_id;

SELECT * FROM maxdaysout_view ORDER BY drone_id;
\`\`\`

Views serve three main purposes:
- **Reuse / simplification** — wrap a complex query once and treat it as a table afterwards.
- **Access control** — grant users a view exposing only certain rows/columns, hiding the rest of the base table.
- **Consistency** — everyone uses the same agreed definition of, say, "completed rentals".

Because a view always reflects the **current** base data, it's never stale. \`CREATE OR REPLACE\` lets you redefine it without dropping first. (Note: views are great in practice but are sometimes disallowed in assessments precisely to make you write the full query.)`,
        flashcardFront: `A standard (non-materialised) **view** stores:`,
        options: [
          "No data of its own — it's a stored query run against the base tables",
          "A permanent physical copy of the query's rows",
          "Only the primary keys of the base tables",
          "The transaction log",
        ],
        answer: "No data of its own — it's a stored query run against the base tables",
        flashcardBack: `A view is a **virtual table**: it stores the *query definition*, not the data, so querying it re-runs the \`SELECT\` against the live base tables and is always current. Uses: reuse/simplification, **access control** (expose only some rows/columns), and a shared consistent definition.`,
      },
      {
        name: "Self Joins",
        orderIndex: 4,
        prerequisites: ["Nested, Inline and Correlated Subqueries"],
        explanation: `A **self join** joins a table to **itself**. It's the tool for **unary/recursive** relationships, where a row relates to another row in the same table.

The classic case is an employee hierarchy: \`EMPLOYEE\` has \`emp_no\` and \`mgr_no\`, where \`mgr_no\` refers to another employee's \`emp_no\`. To list each employee alongside their manager's name, join EMPLOYEE to a second copy of EMPLOYEE, using **table aliases** to tell the two copies apart:

\`\`\`sql
SELECT e1.emp_no, e1.emp_name, e2.emp_name AS manager
FROM   employee e1 JOIN employee e2
       ON e1.mgr_no = e2.emp_no
ORDER BY e1.emp_name;
\`\`\`

Here \`e1\` is the "employee" role and \`e2\` is the "manager" role — same physical table, two logical roles. The aliases are **mandatory**: without them the DBMS can't distinguish \`e1.emp_name\` from \`e2.emp_name\`.

Note an ordinary (inner) self join on \`mgr_no = emp_no\` excludes anyone with a NULL manager (e.g. the CEO); to include them you'd use an **outer** join (next concept).`,
        flashcardFront: `Listing each employee with their manager's name (manager is also an employee) requires a:`,
        options: [
          "Self join — the EMPLOYEE table joined to itself with aliases",
          "Set operator (UNION)",
          "Cross join of two different tables",
          "View, with no join at all",
        ],
        answer: "Self join — the EMPLOYEE table joined to itself with aliases",
        flashcardBack: `When a row relates to another row in the **same** table (employee → manager via \`mgr_no\`), you join the table to itself — a **self join** — using **aliases** (\`e1\`, \`e2\`) to separate the two roles. The aliases are required so the DBMS can tell the two copies' columns apart.`,
      },
      {
        name: "Outer Joins",
        orderIndex: 5,
        prerequisites: ["Self Joins"],
        explanation: `An **inner join** returns only rows that have a **match** on both sides. Often you also want the **unmatched** rows — and that's an **outer join**:

- **\`LEFT OUTER JOIN\`** — keep **all** rows from the **left** table; where the right has no match, its columns come back **NULL**.
- **\`RIGHT OUTER JOIN\`** — keep all rows from the **right** table similarly.
- **\`FULL OUTER JOIN\`** — keep unmatched rows from **both** sides.

💡 The killer use case is "find the items with **no** matches". To "list the number of times **all** drones have been rented — *including drones never rented*", an inner join to \`rental\` would silently drop the never-rented drones (they have no rental rows). A LEFT OUTER JOIN from \`drone\` keeps them, with NULL rental data:

\`\`\`sql
SELECT d.drone_id, COUNT(r.rent_no) AS times_rented
FROM   drone d LEFT OUTER JOIN rental r ON d.drone_id = r.drone_id
GROUP BY d.drone_id;
\`\`\`

Note \`COUNT(r.rent_no)\` (not \`COUNT(*)\`) correctly yields **0** for never-rented drones, because COUNT ignores the NULLs the outer join produced. Wrap totals in \`NVL(...,0)\` when you need 0 instead of NULL.`,
        flashcardFront: `To list **all** drones with how many times each was rented — **including drones never rented** — you use:`,
        options: [
          "A LEFT OUTER JOIN from drone to rental",
          "An inner join between drone and rental",
          "An INTERSECT of the two tables",
          "A self join on drone",
        ],
        answer: "A LEFT OUTER JOIN from drone to rental",
        flashcardBack: `An inner join drops drones with no rental rows. A **LEFT OUTER JOIN** from \`drone\` keeps **every** drone, filling NULLs where there's no rental — so never-rented drones still appear. Pair it with \`COUNT(r.rent_no)\` (ignores NULL → 0) or \`NVL(...,0)\` to show 0 rather than NULL.`,
      },
      {
        name: "Set Operators",
        orderIndex: 6,
        prerequisites: ["Outer Joins"],
        explanation: `**Set operators** combine the results of two \`SELECT\` queries into one result set (stacking results vertically, unlike joins which combine columns horizontally):

| Operator | Returns |
|---|---|
| **\`UNION\`** | rows in **either** query, **duplicates removed** |
| **\`UNION ALL\`** | rows in either query, **duplicates kept** |
| **\`INTERSECT\`** | rows in **both** queries |
| **\`MINUS\`** | rows in the **first** but **not** the second |

The two queries must be **union-compatible**: the **same number of columns** with **compatible data types** in the same order.

Worked uses:
- **\`MINUS\`** — "drones that have **not** been rented" = all drones MINUS drones that appear in rentals.
- **\`INTERSECT\`** — "employees who share a surname with a customer".
- **\`UNION\`** — build one labelled list, e.g. customers tagged "Completed training" together with those tagged "Not completed".

💡 Choose \`UNION ALL\` over \`UNION\` when you know there are no duplicates (or want to keep them) — it skips the deduplication work and is faster. All set operators have equal precedence and evaluate left-to-right unless parentheses say otherwise.`,
        flashcardFront: `Which set operator lists rows returned by the **first** query but **not** the second (e.g. drones never rented)?`,
        options: ["MINUS", "UNION", "INTERSECT", "UNION ALL"],
        answer: "MINUS",
        flashcardBack: `**\`MINUS\`** = rows in the first query that are **not** in the second — perfect for "all drones MINUS rented drones = never-rented drones". \`UNION\` merges (dedup), \`UNION ALL\` merges (keep dups), \`INTERSECT\` = in both. All require the queries to be **union-compatible** (same column count and compatible types).`,
      },
    ],
  },

  // ── WEEK 11 — NoSQL & Big Data ──────────────────────────────────────────────
  {
    index: 11,
    title: "NoSQL & Big Data",
    cheatSheet: `## NoSQL & Big Data

**The 3 V's of Big Data**
- **Volume** — sheer quantity of data.
- **Velocity** — speed it arrives / must be processed (streams).
- **Variety** — structured, semi-structured, unstructured.
(Some add **Veracity** — trustworthiness.)

**Scaling**
- **Scale up** — bigger single machine.
- 🔑 **Scale out** — spread load across many **commodity** servers (Google, Amazon). Drives non-relational designs.

**NoSQL** = **N**ot **o**nly SQL: non-relational, mostly open source, **distributed** (cluster-friendly), **schema-less**.

**Four NoSQL data models**
| Model | Idea | Example |
|---|---|---|
| **Key-value** | key → value blob | Redis, DynamoDB |
| **Document** | key → JSON/BSON document | MongoDB |
| **Column-family** | wide rows grouped by column family | Cassandra |
| **Graph** | nodes + edges (relationships) | Neo4j |

**Distribution**
- **Sharding** — split **one** copy of data across machines (scale).
- **Replication** — copy **same** data to several machines (availability/resilience).

**MongoDB** — *document* DB: **Documents → Collections → Database**. Stores **BSON** (binary JSON). Relationships: **embedded** (denormalised) vs **referenced** (normalised).

**MongoDB CRUD**
\`\`\`js
db.dronerent.insertOne({...});  db.dronerent.insertMany([...]);
db.dronerent.find({ "carrying_capacity": { "$gt": 4 } },
                  { "drone_id": 1, "_id": 0 });   // filter, projection
db.dronerent.countDocuments({ "RentalInfo.rent_in": { "$eq": null } });
db.dronerent.updateOne({...}, { "$set": { "cost_per_hour": 55 } });
db.dronerent.deleteMany({...});
\`\`\`
Operators: \`$eq $gt $lt $lte $and\`; \`$set\` (assign), \`$inc\` (increment); \`.sort({f:1})\` 1=asc, -1=desc.`,
    concepts: [
      {
        name: "Big Data: Volume, Velocity, Variety",
        orderIndex: 1,
        prerequisites: [],
        explanation: `**Big Data** describes datasets whose scale or nature outstrips traditional relational processing. It's characterised by the **three V's**:

- **Volume** — the sheer *quantity* of data to store (think sensor networks generating tens of thousands of records per second, or petabyte warehouses).
- **Velocity** — the *speed* at which data enters and must be processed. **Stream processing** analyses data as it arrives (e.g. the LHC producing data at gigabytes per second); there's no time to store-then-analyse.
- **Variety** — variation in *structure*: **structured** data fits a predefined model (relational rows); **unstructured** data does not (text, images, video); **semi-structured** sits between (JSON with flexible fields).

A common fourth V is **Veracity** — how trustworthy/clean the data is.

The point of naming the V's is that each stresses a relational DBMS differently — too much volume for one machine, too fast a velocity for store-then-query, too much variety for a fixed schema — which collectively motivated the rise of **NoSQL** and distributed processing.`,
        flashcardFront: `Which trio are the classic **three V's** of Big Data?`,
        options: ["Volume, Velocity, Variety", "Volume, Validity, Version", "Velocity, Veracity, Value", "Variety, Volume, Vendor"],
        answer: "Volume, Velocity, Variety",
        flashcardBack: `The classic three V's are **Volume** (how much), **Velocity** (how fast it arrives/must be processed), and **Variety** (structured vs semi- vs unstructured). **Veracity** (trustworthiness) is often added as a fourth. Each V stresses a traditional RDBMS in a different way, motivating NoSQL and distributed processing.`,
      },
      {
        name: "Scaling Out and NoSQL",
        orderIndex: 2,
        prerequisites: ["Big Data: Volume, Velocity, Variety"],
        explanation: `When a workload outgrows a single server, there are two responses:

- **Scaling up (vertical)** — replace the machine with a **bigger** one (more CPU/RAM). Simple, but there's a ceiling and it gets expensive fast.
- **Scaling out (horizontal)** — spread the work across **many smaller, commodity servers**. There's effectively no ceiling — just add machines.

🔑 The web giants (Google, Amazon) chose to **scale out**: lots of cheap boxes rather than one supercomputer. But the relational model, with its joins and strict schema, is hard to distribute across hundreds of nodes. This drove **non-relational** designs (Google's Bigtable, Amazon's Dynamo).

The umbrella term **NoSQL** ("Not only SQL") was coined in 2009 for this movement. Typical characteristics:
- **non-relational**,
- mostly **open source**,
- **distributed** / cluster-friendly (built to scale out),
- **schema-less** — no fixed storage schema, so each record can differ in structure.

The trade-off: you gain scale and flexibility but often relax the strict consistency and rich querying that relational systems guarantee.`,
        flashcardFront: `**Scaling out** to handle Big Data means:`,
        options: [
          "Spreading the workload across many commodity servers",
          "Upgrading to one much larger, more powerful server",
          "Deleting old data to save space",
          "Switching every column to text",
        ],
        answer: "Spreading the workload across many commodity servers",
        flashcardBack: `**Scaling out (horizontal)** distributes work across **many cheap commodity machines** — the approach Google/Amazon took, with effectively no ceiling. **Scaling up (vertical)** instead buys one bigger box (limited, costly). Because relational joins/schemas are hard to distribute, scaling out drove the rise of **NoSQL**.`,
      },
      {
        name: "NoSQL Data Models",
        orderIndex: 3,
        prerequisites: ["Scaling Out and NoSQL"],
        explanation: `NoSQL isn't one thing — there are four main families, each suited to different access patterns:

- **Key-value store** — the simplest: each item is a **key → value** pair, where the value is an opaque blob (number, string, document, image). Extremely fast lookups by key. (Redis, DynamoDB.)
- **Document store** — each item is a **document**, usually JSON/BSON (or XML). Documents can have **variable structure** and **embedded** sub-documents — no fixed columns. (MongoDB.)
- **Column-family (wide-column) store** — a key points to a set of columns grouped into **column families**; rows can have different columns. Great for very large, sparse tables. (Cassandra.)
- **Graph database** — data as **nodes** connected by **edges** (relationships). Unlike the other three (which are *aggregate-oriented*), a graph model is highly *non*-aggregated and is navigated by following relationships. Ideal for networks — social graphs, recommendations. (Neo4j.)

Choosing among them is again "horses for courses": key-value for fast simple lookups, document for flexible records, column-family for massive sparse data, graph for richly connected data.`,
        flashcardFront: `Which NoSQL model stores data as **nodes connected by edges** and is navigated via relationships?`,
        options: ["Graph", "Key-value", "Document", "Column-family"],
        answer: "Graph",
        flashcardBack: `A **graph** database represents data as **nodes** and **edges** (relationships) and is queried by traversing those connections — ideal for social networks and recommendations. The other three (key-value, document, column-family) are *aggregate-oriented* stores; graph is the odd one out, viewing data at a highly non-aggregated, relationship-first level.`,
      },
      {
        name: "Sharding and Replication",
        orderIndex: 4,
        prerequisites: ["Scaling Out and NoSQL"],
        explanation: `Distributing data across many machines uses two complementary techniques — and the distinction is a favourite exam point:

- **Sharding** — split **one** copy of the data into pieces (shards) and place **different** pieces on **different** machines. No single machine holds everything. The goal is **scale**: capacity and throughput grow as you add nodes, since each handles only its slice.
- **Replication** — store **copies of the same** data on **several** machines. The goal is **availability and resilience**: if one node fails, another copy still serves the data, and reads can be spread across replicas.

They solve different problems — sharding is about *fitting and handling more data*; replication is about *not losing access to data*. Real systems usually combine them: shard the dataset for scale, then replicate each shard for safety.

This also surfaces a deep trade-off in distributed databases — **consistency vs availability**: keeping all replicas perfectly in sync (consistency) can conflict with always being able to respond (availability), especially during network partitions. Different NoSQL systems pick different balances.`,
        flashcardFront: `What is the difference between **sharding** and **replication**?`,
        options: [
          "Sharding splits one copy across machines (scale); replication copies the same data to several machines (availability)",
          "They are two names for the same thing",
          "Sharding copies data for backup; replication splits it for speed",
          "Sharding only applies to relational databases",
        ],
        answer: "Sharding splits one copy across machines (scale); replication copies the same data to several machines (availability)",
        flashcardBack: `**Sharding** = partition **one** dataset across nodes (each holds a *different* slice) → **scale/capacity**. **Replication** = keep **copies of the same** data on several nodes → **availability/resilience** (survive failures, spread reads). Systems often do both: shard for scale, then replicate each shard for safety.`,
      },
      {
        name: "MongoDB: Documents and Collections",
        orderIndex: 5,
        prerequisites: ["NoSQL Data Models"],
        explanation: `**MongoDB** is the leading **document** database. Its structure parallels relational concepts but with more flexibility:

- A **document** ≈ a row — a set of **field–value pairs**, but with rich, nested structure (sub-documents and arrays).
- A **collection** ≈ a table — a group of documents (but documents in one collection need **not** share the same fields).
- A **database** holds collections.

So the hierarchy is **Documents → Collections → Database**. Documents are stored as **BSON** (Binary JSON), which extends JSON with extra types and is compact and fast to traverse. A field can hold a scalar, an **array** (\`[ ]\`), or an **embedded document** (\`{ }\`).

A central design decision is how to represent **relationships**:
- **Embedding (denormalised)** — nest related data *inside* the parent document (e.g. a drone's rental history as an array of sub-documents). Fast to read in one go; can duplicate data.
- **Referencing (normalised)** — store a *reference* (an id) to a document in another collection, like a foreign key. Less duplication; needs extra lookups.

The right choice depends on access patterns — embed data you read together, reference data shared widely or updated independently.`,
        flashcardFront: `In MongoDB, the storage hierarchy is:`,
        options: [
          "Documents → Collections → Database",
          "Rows → Tables → Schema",
          "Collections → Documents → Database",
          "Fields → Rows → Tables",
        ],
        answer: "Documents → Collections → Database",
        flashcardBack: `MongoDB nests **Documents → Collections → Database**: a *document* (field–value pairs, stored as **BSON**) is like a row; a *collection* groups documents (without forcing a shared schema); a *database* holds collections. Relationships are modelled by **embedding** (denormalised, nested) or **referencing** (normalised, by id).`,
      },
      {
        name: "MongoDB CRUD",
        orderIndex: 6,
        prerequisites: ["MongoDB: Documents and Collections"],
        explanation: `MongoDB's CRUD operations are methods on a collection. The general retrieve/update form is \`db.collection.command({filter}, {projection/action})\`.

**Create**
\`\`\`js
db.dronerent.insertOne({ drone_id: 102, cost_per_hour: 50 });
db.dronerent.insertMany([ {...}, {...} ]);   // array of documents
\`\`\`

**Read** — \`find(filter, projection)\`. The **filter** selects documents using operators (quoted): \`$eq\`, \`$gt\`, \`$lt\`, \`$lte\`, \`$and\`. The **projection** lists fields to show — \`1\` = include, \`0\` = suppress:
\`\`\`js
db.dronerent.find({ "carrying_capacity": { "$gt": 4 } },
                  { "drone_id": 1, "cost_per_hour": 1, "_id": 0 });
db.dronerent.countDocuments({ "RentalInfo.rent_in": { "$eq": null } });
// dot notation reaches into sub-documents: "type.code"; .sort({drone_id: 1}) 1=asc, -1=desc
\`\`\`

**Update** — \`updateOne\`/\`updateMany({filter},{action})\`, using \`$set\` to assign or \`$inc\` to increment:
\`\`\`js
db.dronerent.updateMany({ "type.code": "PAPR" }, { "$set": { "cost_per_hour": 55 } });
\`\`\`

**Delete** — \`deleteOne\`/\`deleteMany({filter})\`; drop the whole collection with \`db.dronerent.drop()\`.

The mental mapping: \`find\` ↔ SELECT, filter ↔ WHERE, projection ↔ the SELECT column list, \`$set\` ↔ SET.`,
        flashcardFront: `In a MongoDB \`find()\` **projection**, what does \`"_id": 0\` do?`,
        options: [
          "Suppresses the _id field from the output (0 = exclude, 1 = include)",
          "Filters to documents whose _id is 0",
          "Sorts results by _id ascending",
          "Sets _id to zero for all matched documents",
        ],
        answer: "Suppresses the _id field from the output (0 = exclude, 1 = include)",
        flashcardBack: `In a projection, **1 includes** a field and **0 excludes** it — so \`"_id": 0\` hides the default \`_id\` from the output. (Filtering by value happens in the *first* \`find\` argument with operators like \`$eq\`; sorting is \`.sort()\`; assignment is \`$set\` in an update.) Projection ↔ the SELECT column list in SQL.`,
      },
    ],
  },

  // ── WEEK 12 — BI, Data Warehousing & Ethics ─────────────────────────────────
  {
    index: 12,
    title: "BI, Data Warehousing & Ethics",
    cheatSheet: `## BI, Data Warehousing & Ethics

**Operational vs decision-support data**
| Operational (OLTP) | Decision support (OLAP) |
|---|---|
| daily transactions | analysis for decisions |
| current, detailed | historical, summarised |
| read **and** write | mostly **read-only** |
| "How many enrolled now?" | "Total per state, per year, over years?" |

Decision-support data differs in **time span**, **granularity**, **dimensionality**.

**Data warehouse** (Inmon's definition) — a collection of data that is:
- 🔑 **Integrated** · **Subject-oriented** · **Time-variant** · **Non-volatile**
- Read-optimised for analysis & query; supports decision making; costly to build.

**OLTP vs OLAP** — "horses for courses": RDBMS still rules transactions (OLTP); analytics/big data use warehouses, Hadoop, Spark, NoSQL.

**Data security — the CIA triad**
- **Confidentiality** — no unauthorised disclosure.
- **Integrity** — data stays consistent/correct.
- **Availability** — system stays usable (no degradation/interruption).
(+ **Compliance** with external regulation.)

⚙️ Safeguards: change default passwords, patch, restrict access, audit/session logs, encryption.

**Privacy & ethics**
- **Privacy Act 1988** → **13 Australian Privacy Principles** (collection, use, accountability, access/correction).
- Breaches (e.g. Optus, Medibank) → real harm + penalties.
- **Data ethics**: *Is this right? Could anyone be harmed? Is anyone left behind?* Diverse teams spot issues earlier.`,
    concepts: [
      {
        name: "Operational vs Decision-Support Data",
        orderIndex: 1,
        prerequisites: [],
        explanation: `Databases serve two very different purposes, and conflating them leads to poor designs.

**Operational data** supports the **day-to-day running** of the business — the constant inserts, updates and deletes of transactions. It's **current**, **detailed**, and held in relational databases optimised for many small read/write transactions (**OLTP** — Online Transaction Processing). Example question: *"How many students are enrolled in this unit right now?"*

**Decision-support data** supports **management decisions** — analysis and reporting. It differs from operational data in three main ways:
- **Time span** — historical, spanning years, not just "now".
- **Granularity** — summarised/aggregated, not every individual transaction.
- **Dimensionality** — analysed across many dimensions at once (by state, by year, by product…).

Example question: *"What is the total number of students per state, per year, and across years?"* — a multi-dimensional, historical roll-up.

These needs pull in opposite directions: OLTP wants fast small writes on current data; decision support wants fast complex reads over huge historical aggregates. That tension is exactly why **data warehouses** exist (next concept).`,
        flashcardFront: `Decision-support data differs from operational data mainly in:`,
        options: [
          "Time span, granularity and dimensionality",
          "Programming language and file format",
          "Vendor and operating system",
          "Password length and encryption",
        ],
        answer: "Time span, granularity and dimensionality",
        flashcardBack: `Decision-support data is **historical** (longer *time span*), **summarised** (coarser *granularity*), and analysed across many *dimensions* — versus operational/OLTP data, which is current, detailed, and transaction-focused. Their opposing demands (fast small writes vs heavy historical reads) are what motivate a separate **data warehouse**.`,
      },
      {
        name: "The Data Warehouse",
        orderIndex: 2,
        prerequisites: ["Operational vs Decision-Support Data"],
        explanation: `A **data warehouse** is a database built specifically for analysis and decision support, kept separate from operational systems. The classic definition (Inmon) gives four defining properties:

- **Integrated** — data from many source systems is cleaned and combined into a consistent whole (uniform names, units, encodings).
- **Subject-oriented** — organised around business *subjects* (sales, customers) rather than around applications.
- **Time-variant** — it keeps **history**; every record is associated with a time period, so you can analyse trends and changes over time.
- **Non-volatile** — data is **loaded and read**, not continuously updated/deleted by users. Once in, it stays, providing a stable basis for analysis.

A warehouse is usually **read-only**, optimised for complex queries and aggregation rather than transactions. It takes significant time, money and effort to build and maintain, and increasingly lives in the **cloud**.

🔑 The four properties together explain *why* you don't just run reports on the operational database: the warehouse is integrated (consistent), historical (time-variant), stable (non-volatile) and analysis-shaped (subject-oriented) — none of which an OLTP system provides.`,
        flashcardFront: `Which set of properties best describes a **data warehouse**?`,
        options: [
          "Integrated, subject-oriented, time-variant, non-volatile",
          "Normalised, transactional, volatile, single-source",
          "Schema-less, distributed, write-heavy, real-time",
          "Encrypted, replicated, sharded, in-memory",
        ],
        answer: "Integrated, subject-oriented, time-variant, non-volatile",
        flashcardBack: `Inmon's four properties: **integrated** (consistent across sources), **subject-oriented** (organised by business subject), **time-variant** (keeps history), **non-volatile** (loaded then read, not constantly updated). Together they make it a stable, historical, analysis-ready store — which a volatile, current, application-oriented OLTP database is not.`,
      },
      {
        name: "OLTP vs OLAP: Horses for Courses",
        orderIndex: 3,
        prerequisites: ["The Data Warehouse"],
        explanation: `Two contrasting workloads sit on top of these data stores:

- **OLTP — Online Transaction Processing.** Many short read/write transactions on current data: place an order, enrol a student, return a drone. Relational databases excel here; **normalisation** and ACID transactions keep the data correct.
- **OLAP — Online Analytical Processing.** Few but heavy, mostly read-only queries that aggregate large volumes across dimensions: "total sales per region per quarter". Data warehouses (often denormalised for query speed) and big-data tools serve this.

The guiding principle is **"horses for courses"** — match the technology to the task. Conventional RDBMSs continue to dominate OLTP and won't be replaced. For analytics and big data, a range of products is appropriate: parallel/cluster processing (**Hadoop**, **Spark**), distributed file systems (**HDFS**), NoSQL stores, and in-memory databases.

So the modern data landscape is **polyglot**: an organisation might run Oracle for transactions, a cloud warehouse for analytics, MongoDB for flexible documents, and Spark for large-scale processing — each chosen because it fits a particular job, not because one tool wins everywhere.`,
        flashcardFront: `The principle "horses for courses" in modern data management means:`,
        options: [
          "Choose the database technology that best fits each task (OLTP, OLAP, big data)",
          "Always use a relational database for everything",
          "Always replace relational databases with NoSQL",
          "Store all data in a single giant table",
        ],
        answer: "Choose the database technology that best fits each task (OLTP, OLAP, big data)",
        flashcardBack: `"Horses for courses" = **match the tool to the workload**. RDBMSs still own **OLTP** (transactions); **OLAP**/analytics and big data lean on warehouses, Hadoop/Spark, HDFS and NoSQL. The result is a **polyglot** stack — no single technology is best at everything.`,
      },
      {
        name: "Data Security: The CIA Triad",
        orderIndex: 4,
        prerequisites: [],
        explanation: `**Information system security** protects the system and its main asset — the **data** — and is classically framed as the **CIA triad**:

- **Confidentiality** — guard data against disclosure that would violate someone's privacy or the organisation's interests. Only authorised parties may see it.
- **Integrity** — keep data **consistent and free of errors/anomalies**, and enforce security standards (e.g. shredding printed reports, encrypting copies).
- **Availability** — the system must stay usable; protect it from service degradation or interruption, whether from internal faults or external attack.

A fourth concern, **Compliance**, covers obligations imposed by external regulators (government, industry).

Concretely, safeguards for a DBMS include: change **default passwords** and installation paths, apply the latest **patches**, secure installation folders with proper access rights, run only required services, set up **auditing** and **session logs**, and require **session encryption**.

🎯 The triad is a checklist for reasoning about any security measure: does it protect confidentiality, integrity, or availability? Most real breaches are failures of one of the three — and high-profile incidents (Optus, Medibank) show the cost in customer harm and penalties.`,
        flashcardFront: `In the **CIA triad** of data security, what does **Integrity** mean?`,
        options: [
          "Keeping data consistent and free of errors or unauthorised alteration",
          "Ensuring only authorised users can view the data",
          "Keeping the system available and free of interruption",
          "Complying with government regulation",
        ],
        answer: "Keeping data consistent and free of errors or unauthorised alteration",
        flashcardBack: `**Integrity** = data stays **consistent, correct and unaltered** by unauthorised means. **Confidentiality** is about *who may see* it (no improper disclosure); **Availability** is about the system staying *usable*. (Compliance — meeting external regulation — is a related fourth concern, not part of the core triad.)`,
      },
      {
        name: "Privacy Law and the Australian Privacy Principles",
        orderIndex: 5,
        prerequisites: ["Data Security: The CIA Triad"],
        explanation: `Beyond technical security, the **collection and handling of personal information** is governed by law. In Australia the cornerstone is the **Privacy Act 1988**, which sets out **13 Australian Privacy Principles (APPs)**.

The APPs are **principles-based** (and technology-neutral), giving organisations flexibility to fit their practices to their context while meeting common standards. They govern:
- the **collection, use and disclosure** of personal information,
- an organisation's **governance and accountability**,
- the **integrity and correction** of personal information,
- individuals' **rights to access** their own personal information.

A breach of an APP is an "interference with the privacy of an individual" and can trigger **regulatory action and penalties**. Real incidents — the Optus and Medibank breaches exposing millions of customer records — show both the human harm and the legal/financial consequences.

Reforms (modelled partly on the EU's **GDPR**) propose stronger protections: better transparency, a **right to erasure**, tighter rules on direct marketing, protections for children and vulnerable people, and obligations to secure and then **destroy/de-identify** data no longer needed. The designer's job is to build systems that make compliance with these principles possible.`,
        flashcardFront: `In Australia, the **13 Australian Privacy Principles** governing personal information come from:`,
        options: [
          "The Privacy Act 1988",
          "The Database Act 2009",
          "The CIA triad",
          "The GDPR (a European Union regulation)",
        ],
        answer: "The Privacy Act 1988",
        flashcardBack: `The **Privacy Act 1988** establishes the **13 Australian Privacy Principles**, which cover collection/use/disclosure, accountability, integrity/correction, and individuals' right to access their data. (The **GDPR** is the EU's equivalent and inspires Australian reforms, but isn't the source of the APPs; the CIA triad is a *security* model, not privacy law.)`,
      },
      {
        name: "Data Ethics",
        orderIndex: 6,
        prerequisites: ["Privacy Law and the Australian Privacy Principles"],
        explanation: `**Data ethics** concerns the **moral** obligations of gathering, protecting and using people's personal information — what is *right*, not merely what is *legal*. Law is a floor; ethics asks whether you *should* do something even when you *may*.

It requires **ongoing reflection**, not a one-off checkbox. Useful questions to ask throughout design and operation:
- *Is this the right thing to do? Can we do better?*
- *Is anyone likely to be **harmed**?*
- *Is everyone **included** — or is someone left behind or made more vulnerable?*
- *Does some group need additional help or protection?*

Examples make the stakes real: a social-welfare database (e.g. Centrelink-style) raises questions of genuine, informed consent and who might be wrongly excluded — the **Robodebt** scheme is a cautionary tale of automated decisions causing harm.

🔑 **Diversity matters** for ethical data systems: teams with varied backgrounds spot problems earlier (e.g. bias baked into training data), avoid group-think, and build systems that work fairly for more people. Ethical design is therefore both a mindset (keep asking who could be harmed) and a practice (build diverse teams and review continually).`,
        flashcardFront: `How does **data ethics** relate to **legal compliance**?`,
        options: [
          "Ethics asks what is right, going beyond the legal minimum",
          "They are identical — if it's legal, it's ethical",
          "Ethics only matters when the law is silent",
          "Compliance is optional once ethics is considered",
        ],
        answer: "Ethics asks what is right, going beyond the legal minimum",
        flashcardBack: `Law is the **floor**; **ethics** asks whether something is *right* even when it's permitted — keep asking *could anyone be harmed? is anyone left behind?* Something can be legal yet unethical (and harmful), as cases like Robodebt show. Diverse teams and ongoing reflection are key to building fair systems.`,
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEED  (local: npm run seed:db — uses dev.db; prod seeding lives in migrate-prod)
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
      where: { slug: "database" },
      create: {
        name: "Database Systems",
        slug: "database",
        description: "Relational & query fundamentals",
        category: "Systems",
        emoji: "🗄️",
        status: "published",
        order: 2,
        sessionCount: 12,
      },
      update: { status: "published", sessionCount: 12 },
    })
    console.log(`\n🗄️  Subject: ${subject.name} (${subject.id})`)

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

// Only run when invoked directly (npm run seed:db) — NOT when SESSIONS is
// imported by migrate-prod for the build-time prod seed.
if (process.argv[1]?.includes("seed-db-static")) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
