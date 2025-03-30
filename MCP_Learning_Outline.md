# Mastering the Model Context Protocol (MCP) – A Comprehensive Learning Guide

## 1. Introduction to MCP and Its Importance

### 1.1 What is the Model Context Protocol (MCP)?

The **Model Context Protocol (MCP)** is an open standard that enables AI models to connect with external data sources and tools in a uniform way. Think of MCP like a **USB-C port for AI applications** – a universal connector allowing any AI assistant to plug into any data source or tool that speaks the same protocol ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20is%20an%20open%20protocol,different%20data%20sources%20and%20tools)). This standardization addresses a big integration challenge: without MCP, each new combination of a language model and a data/tool source requires a custom integration (the **“M×N” problem**) which becomes a maintenance nightmare as you add more models and tools ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=Anthropic%20recently%20released%20their%20Model,of%20reference%20implementations%20of%20MCP)) ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=Without%20such%20a%20standard%2C%20the,aims%20to%20solve%20this%20problem)). By introducing a common protocol, MCP makes it **simpler, more reliable, and scalable** to give AI systems access to the data and actions they need ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=MCP%20addresses%20this%20challenge,to%20the%20data%20they%20need)) ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=as%20well%20as%20an%20open,of%20reference%20implementations%20of%20MCP)).

### 1.2 Why is MCP Important?

**Why is MCP important?** As advanced language models like **Claude and GPT-4** become more capable, they often need context beyond their built-in training data – for example, company documents, live databases, or the ability to call external APIs. MCP provides a **secure, standardized way** to supply that context and tool access without hard-coding prompts or building one-off plugins for each model ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=the%20most%20sophisticated%20models%20are,connected%20systems%20difficult%20to%20scale)). This means developers can **switch between different LLM providers or tools** more easily (enhancing interoperability), and AI assistants can maintain relevant context across different platforms as they move between tasks ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=the%20mechanical%20so%20people%20can,%E2%80%9D)). In short, MCP bridges the gap between powerful AI reasoning and the **real-world data and actions** needed for truly useful applications.

Key benefits of MCP include:

- **Unified Integration:** A single open protocol for connecting any LLM to any data source or tool, reducing bespoke code. This drastically lowers integration complexity and future-proofs your AI app as new models or services emerge ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=Without%20such%20a%20standard%2C%20the,aims%20to%20solve%20this%20problem)) ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=So%2C%20for%20our%20example%20application%2C,compatible%20clients)).
- **Rich Context & Tooling:** Enables AI assistants to retrieve documents, query databases, or execute functions on demand via standardized interfaces, leading to more relevant and powerful responses.
- **Security & Control:** Built-in patterns for keeping humans in the loop and constraining what data or actions the model can access (through client-side controls, approval steps, and clear boundaries), which is critical for enterprise and safe AI use.
- **Growing Ecosystem:** Since its introduction (late 2024), MCP has an open-source ecosystem of **SDKs** (e.g. in Python, TypeScript, Java, etc.) and **pre-built connectors** for systems like Google Drive, Slack, GitHub, databases, etc ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=Claude%203,GitHub%2C%20Git%2C%20Postgres%2C%20and%20Puppeteer)). Early adopters (e.g. Block, Apollo, Replit, Sourcegraph) are already using MCP to enhance AI capabilities in their products ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=Early%20adopters%20like%20Block%20and,functional%20code%20with%20fewer%20attempts)), meaning you can leverage community contributions and examples.

In the rest of this guide, we’ll start with the fundamentals of MCP’s architecture and concepts (beginner-friendly), then gradually dive into how to implement MCP in practice (with code snippets and examples), and finally explore advanced features (like building complex agent behaviors). By the end, you’ll understand what MCP can do and how to apply it in real-world AI system design.

## 2. MCP Architecture: Clients, Servers, and the Two-Way Connection

### 2.1 Client-Server Architecture

At its core, MCP follows a **client–server architecture** that cleanly separates AI applications from the external integrations (data or tools). Let’s clarify the roles:

- **MCP Host:** The application or environment that **hosts the AI model** and wants to use external data. This could be an AI assistant app (like **Claude Desktop**), an IDE with an AI coding assistant, or any software that interacts with an LLM and needs outside information ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=can%20connect%20to%20multiple%20servers%3A)). The host is responsible for orchestrating the overall workflow and user interface.
- **MCP Client:** A component (usually a library) running within the host application that manages a **1:1 connection to an MCP server** ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers)). Think of the client as an adapter or bridge on the AI’s side – it speaks the MCP protocol, sends requests to the server, and returns results back to the AI model. The client handles connection setup, communication, and enforcement of any client-side rules (like permission checks or sandboxing).
- **MCP Server:** A lightweight program or process that **exposes a specific data source or tool through the MCP standard** ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=The%20Model%20Context%20Protocol%20is,that%20connect%20to%20these%20servers)). Servers implement certain capabilities (like providing files, database queries, or executing code) and listen for requests from the client. A server could interface with local resources (files on your computer, a local database) or remote services (web APIs, cloud databases) – in both cases presenting them in a uniform way to the AI. Multiple servers can run concurrently, each offering different functionality, and an AI app can connect to several at once via different clients if needed.

This architecture brings modularity and clarity. The **AI model (in the host)** doesn’t directly access files or call APIs; it asks its client, which asks the server. The server doesn’t know the details of the AI – it just fulfills requests and returns data or results. Because of this decoupling, any MCP-compliant server can work with any MCP-compliant client (and thus with any AI host using that client), regardless of who developed each side ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=What%20Is%20Model%20Context%20Protocol%3F)) ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=MCP%20can%20be%20thought%20of,data%20across%20projects%20and%20applications)).

### 2.2 Communication Lifecycle

**How does communication work?** MCP communication is built on **JSON-RPC 2.0**, a well-known lightweight messaging format for remote procedure calls ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=The%20MCP%20spec%20defines%20a,support%20two%3A%20Roots%20and%20Sampling)) ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=%2A%20HTTP%20POST%20for%20client,messages)). This means all messages (requests, responses, notifications) are simple JSON objects with a `method` name and parameters. Under the hood, MCP can use different transport layers to actually send these JSON messages:

- **Standard I/O (Stdio):** For local integrations, the server process can simply read/write JSON messages via stdin/stdout. This is useful when you launch a server as a child process of your app ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=1)) ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=Standard%20Input%2FOutput%20)) (for example, starting a local file-system server).
- **HTTP + SSE:** For remote servers, MCP uses HTTP POST for client->server calls and **Server-Sent Events (SSE)** for server->client streaming responses ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=2)) ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=Server)). In practice, a server might run as a web service where the client connects to an `/sse` stream to receive events and posts requests to an endpoint like `/messages` ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=import%20express%20from%20)) ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=app.get%28,res%29%3B%20server.connect%28transport%29%3B)). This works even behind restrictive networks (e.g. where WebSockets might be disallowed), albeit with one-way streaming from server to client.

No matter the transport, the pattern is the same: the client and server perform a handshake and then exchange JSON-RPC messages. The **connection lifecycle** begins with the client sending an `initialize` request (including protocol version and features it supports), the server responds with its own capabilities, and then normal two-way messaging can commence ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=1)). Either side can send a **Request** expecting a response, or a one-way **Notification**. Either side can also cleanly terminate the connection when needed ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=3)). The MCP protocol inherits standard JSON-RPC error codes for malformed calls, but when it comes to errors **within a tool action** or similar, MCP encourages returning the error as part of the result (so the AI model can see the error message and handle it) rather than just closing the connection – we’ll discuss this more in the Tools section ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Error%20handling)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%7D%3B%20%7D%20catch%20%28error%29%20,text%3A%20%60Error%3A%20%24%7Berror.message%7D%60)).

**MCP in practice:** To illustrate the architecture, imagine a scenario with a desktop AI assistant (the host) that’s connected to two servers – one providing access to your local files, and another providing weather information. When you ask, _“Summarize the latest sales report and tell me if it was raining that day,”_ the app might use MCP to fetch both the report file and the weather via the two servers. Figure 1 conceptually shows how an AI application can sit in the middle of multiple data sources through MCP:

([Everything You Need to Know About the Model Context Protocol (MCP) from Anthropic | by allglenn | Mar, 2025 | Stackademic](https://medium.com/@glennlenormand/everything-you-need-to-know-about-the-model-context-protocol-mcp-from-anthropic-84acdb3c1a2f#:~:text=Figure%201%3A%20MCP%20as%20a,Universal%20Connector)) ([Everything You Need to Know About the Model Context Protocol (MCP) from Anthropic | by allglenn | Mar, 2025 | Stackademic](https://medium.com/@glennlenormand/everything-you-need-to-know-about-the-model-context-protocol-mcp-from-anthropic-84acdb3c1a2f#:~:text=%2B,))_Figure 1: MCP as a **universal connector** between an AI application and various data sources._ The AI app uses MCP clients to talk to a file server (Data Source A) and a weather API server (Data Source B) in a standardized way, instead of needing custom integration code for each source.

This architecture significantly reduces integration complexity. **Without MCP**, you might have to wire up each tool to each AI platform separately (one integration for File→Claude, another for File→GPT-4, another for Weather→Claude, etc.). **With MCP**, you implement each server once, and any AI client that supports MCP can use it ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=In%20this%20example%2C%20a%20developer,visualized%20in%20Figure%202%20below)) ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=with%20MCP%20on%20the%20right,com)). This is akin to plugging any brand of keyboard or camera into any laptop via USB-C – it just works with minimal fuss.

## 3. Core MCP Primitives: Building Blocks of Integration

### 3.0 Intro

MCP defines a set of **primitives** – fundamental types of interactions – that standardize what _kind_ of data or action is being exchanged. On the **server side**, there are three primitives: **Resources**, **Prompts**, and **Tools**. On the **client (host) side**, there are two: **Roots** and **Sampling** ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=The%20MCP%20spec%20defines%20a,support%20two%3A%20Roots%20and%20Sampling)) ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=The%20Server%20primitives%20are%20for,retrieve%20information%20or%20perform%20actions)). Understanding these is crucial, as they represent the various ways an AI model can **get context or perform actions** through MCP.

### 3.1 Resources – Supplying Data as Context

**Resources** are structured pieces of data that a server makes available for the model to use as context ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20are%20a%20core%20primitive,as%20context%20for%20LLM%20interactions)). Think of resources as **read-only information** (text or binary) that the AI can incorporate into its prompt. For example, a server might expose files from your disk, entries from a database, or even images or logs as resources.

Each resource has a unique **URI** (similar to a URL) that identifies it, often by scheme and path (e.g. `file:///home/user/report.pdf` or `postgres://sales_db/April2025`) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,screen%3A%2F%2Flocalhost%2Fdisplay1)). The URI schemes and structure are defined by the server – servers can even define custom schemes if needed for their domain ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=The%20protocol%20and%20path%20structure,their%20own%20custom%20URI%20schemes)). Resources can be either **textual** (UTF-8 text content, such as code, JSON, or plain text) or **binary** (base64-encoded data for images, PDFs, audio, etc.) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Text%20resources)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Binary%20resources)).

**How resources are used:** Typically, the client (or end-user) will decide when to use a resource. For instance, in Claude’s UI, you might see a list of available files and choose which files to “attach” to your query. This is by design – resources are **user- or app-controlled** by default ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20are%20designed%20to%20be,For%20example)). Different MCP clients handle resource selection differently: Claude Desktop requires explicit user selection of resources before the model can see them ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,determine%20which%20resources%20to%20use)), whereas another client might automatically pick relevant resources based on the query or let the AI suggest which ones to fetch. The key idea is that resources provide **transparent, inspectable context** to the model. A server should not send large resource data unprompted; it waits for the client to request it (e.g. “read this file”).

**Discovery and retrieval:** When a client connects, it can ask the server for a list of available resources via `resources/list`. The server will respond with metadata – each resource’s URI, a human-friendly name, optional description, and MIME type ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Direct%20resources)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resource%20templates)). This could be a fixed list (for static resources) or dynamically generated. Servers can also advertise **resource templates** – patterns (following RFC 6570 URI Template syntax) that a client can use to construct resource URIs for data that isn’t enumerated in a fixed list ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resource%20templates)). For example, a weather server might not list every city’s weather as a separate resource, but provide a template like `weather://{city}` so the client knows it can ask for `weather://London` or `weather://NewYork`.

Once the client (or user) decides to use a resource, it sends a `resources/read` request with the URI. The server then responds with the content of that resource, typically packaged as an array of content objects (to allow returning multiple related items, like reading a folder returns a list of files) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=To%20read%20a%20resource%2C%20clients,request%20with%20the%20resource%20URI)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=mimeType%3F%3A%20string%3B%20%20%2F%2F%20Optional,MIME%20type)). For a text resource, the content will include a `text` field; for a binary resource, a `blob` (base64 string) plus a MIME type. After that, the client can insert this content into the prompt given to the LLM.

**Example:** A filesystem MCP server might list files in a project directory. You could then select `file:///project/README.md` to read; the server returns the text of that file. The AI model (say Claude or GPT-4) would get the contents of README.md included in its context window, so it can answer questions about it or use it for reasoning.

**Live updates:** MCP also supports **real-time updates** for resources. Servers can send a `resources/list_changed` notification if the set of available resources changes (e.g. a new file was added) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=List%20changes)). More dynamically, a client can **subscribe** to a particular resource with `resources/subscribe`; the server will then push `resources/updated` notifications whenever that resource’s content changes ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Content%20changes)). This is powerful for keeping the AI up-to-date with, say, a log file or a sensor reading stream – though clients decide if they expose that streaming content to the model immediately or not.

**When to use resources:** Use resources for information that is **passive context** – things the model might read but that won’t execute or change state. They are great for retrieval-augmented generation scenarios (documents, knowledge base entries) and allow the user to maintain control over what the model “knows” at query time. If you need the AI to perform some action or dynamically fetch data without human selection, that’s where Tools (below) are more appropriate ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,determine%20which%20resources%20to%20use)). In summary, resources are the MCP way to do what many have done with prompt stuffing (copy-pasting text into the prompt), but in a cleaner, modular fashion.

### 3.2 Prompts – Reusable Prompt Templates and Workflows

**Prompts** in MCP are a mechanism for servers to offer **predefined prompt templates or multi-step workflows** to the client ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Prompts%20enable%20servers%20to%20define,and%20share%20common%20LLM%20interactions)). A Prompt is basically a reusable conversation snippet or instruction set that can be injected into the model’s context on demand. They allow developers to encapsulate common interactions with the model, possibly with placeholders for dynamic content, so that users or AI agents can easily invoke complex workflows with one command.

Prompts are designed to be **user-triggered**. For example, a server might define a prompt called `"summarize-document"` that, when used, will produce a formatted prompt to have the AI summarize a given document. The user (or UI) might pick this prompt from a menu (like selecting a preset or clicking a button), which then causes the client to fetch the prompt content and send it to the model.

**Defining prompts:** Each prompt has a **name** (an identifier) and can have a description and a list of expected **arguments** ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Each%20prompt%20is%20defined%20with%3A)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=required%3F%3A%20boolean%3B%20%20%20,%5D)). Arguments are parameters that the client or user must provide when invoking the prompt – for instance, a prompt might need an `"analysis_type"` argument (with choices like "performance" vs "security") or the name of a file to act on. Arguments can be marked required or optional. This schema is provided to the client so it can render a form or ensure the user supplies the needed info.

The server advertises available prompts by responding to `prompts/list`. The client will receive an array of prompt definitions (name, description, arguments) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=,required%3A%20true)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=name%3A%20%22analyze,required%3A%20true%20%7D)). Once the client knows what prompts exist, the user can choose one and supply argument values, then the client calls `prompts/get` with the prompt name and those arguments ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=To%20use%20a%20prompt%2C%20clients,request)).

**Using a prompt:** A `prompts/get` request asks the server to generate the actual prompt content for the given name and arguments. The server’s response will typically include: a refined description (maybe incorporating the specific arguments) and an array of **messages** ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%2F%2F%20Response%20%7B%20description%3A%20,n%20%20%20%20for)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%7B%20role%3A%20,)). These messages are in the same format as an LLM conversation (role plus content). For example, a `"code-review"` prompt might return something like:

- **User message:** “Please review the following Python code for potential improvements:” (followed by the code content)
- **Maybe an Assistant message:** “Certainly, I will analyze it step by step...” (if the prompt workflow involves a multi-turn setup)

The idea is the server can craft a structured conversation that the client will then insert into the model’s context. In the simple case, it might just be one user message containing a formatted instruction and data.

**Dynamic prompts:** Prompts can do advanced things:

- They can **embed resources** directly. For instance, a prompt template might fetch a log file and a code file (as in an example from the docs) and include them as message content of type "resource" so that the model sees the content inline ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Prompts%20can%20be%20dynamic%20and,include)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%7B%20,text%2Fplain)). This means prompts and resources often work hand-in-hand: a prompt can pull in whatever context is needed automatically. (The client may still ask for user approval to allow the server to read those resources.)
- They can implement **multi-step workflows**. A prompt isn’t limited to one question – it could simulate a back-and-forth. For example, a debugging prompt might produce a user message describing an error, then an assistant message asking a follow-up question, then another user message answering it, all pre-filled, essentially staging a conversation that leads the model to a solution ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Multi)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%7D%2C%20%7B%20role%3A%20,%7D%20%7D%2C)). This is useful to guide the model through a known sequence (like systematically gathering info from the user).

Because prompts are provided by servers, they can encapsulate expert knowledge or formatting. They also help maintain consistency. For instance, every time you want a Git commit message, using the same `"git-commit"` prompt can ensure the model gets a consistent instruction (maybe including project context or style guidelines).

**Example:** Imagine an MCP server for a coding environment that offers a prompt `"explain-code"`. This prompt might take one argument: the code to explain. When invoked with a block of code, the server returns a set of messages: perhaps a system message setting the AI’s role (“You are a programming assistant.”) and a user message that says “Explain what the following code does:” plus the code in a markdown block. The AI model then sees this formatted request and produces the explanation. Without MCP prompts, a developer might have to manually write such a prompt in each app or rely on the user to format their question; with MCP, it’s a one-click, standardized operation.

**Implementing prompts:** On the server side, prompts are implemented by handling `prompts/list` and `prompts/get` requests. For example, using the MCP TypeScript SDK, a server might have:

```typescript
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts: Object.values(PROMPTS) }; // Return the list of prompt definitions
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments } = request.params;
  // ... generate messages based on prompt name and args ...
  return {
    messages: [
      /* array of message objects */
    ],
  };
});
```

One prompt could be defined such that if `name === "git-commit"`, it creates a user message like “Generate a concise commit message for the following changes: [changes text]” ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%2F%2F%20Get%20specific%20prompt%20server,request.params.name%7D%60%29%3B)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=messages%3A%20%5B%20%7B%20role%3A%20,but%20descriptive%20commit%20message%20for)). The logic will vary per prompt, but the framework makes it straightforward to package the result.

**When to use prompts:** Use prompts to encapsulate common **intents or workflows** that you want to expose to users. They are especially helpful in a UI context (like menu of actions: “Summarize Document”, “Translate Selection”, etc.), or to guide models through complex steps reliably. While one could achieve similar effects by writing a prompt directly to the model each time, MCP prompts ensure those templates are **shareable and consistent** across applications. They also allow richer interaction (multiple turns, integrating fresh data) than a static prompt library.

### 3.3 Tools – Enabling the Model to Take Action

**Tools** are one of the most exciting parts of MCP. A Tool primitive lets an MCP server expose **executable functions or actions** that the AI model can invoke (with the client as an intermediary) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20are%20a%20powerful%20primitive,actions%20in%20the%20real%20world)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Overview)). This is analogous to the “functions” or “plugins” in some AI APIs – it allows the model to go beyond text and actually do something like querying an API, performing a calculation, or changing something in the environment.

Unlike resources and prompts, which are generally curated by the user, tools are intended to be **model-controlled** (with appropriate user permission). This means the model, upon understanding a user’s request, can decide “I should use tool X now” and ask the client to call that tool. The client might require a human to approve the action (for safety), but the initiative comes from the AI’s side. For example, if a user asks “What’s the weather in San Francisco tomorrow?”, the model could choose to call a `get_forecast` tool provided by a weather server to fetch the answer ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=To%20showcase%20what%20developers%20can,and%20get%20the%20weather%20data)).

**Discovering tools:** When a client connects to a server that offers tools, it will call `tools/list` to get all available tools and their specifications ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions)). The server returns a list of tool definitions, each with a **name**, an optional description, and an **input schema** describing what parameters that tool accepts ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tool%20definition%20structure)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,specific%20parameters%20%7D)). The input schema is given in JSON Schema format – basically defining the expected JSON object structure for the tool’s arguments (with property names, types, required vs optional). This schema helps the AI (and the client) understand how to call the tool correctly.

For instance, a server might list a tool:

```json
{
  "name": "get_forecast",
  "description": "Get weather forecast for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "latitude": { "type": "number" },
      "longitude": { "type": "number" }
    },
    "required": ["latitude", "longitude"]
  }
}
```

This tells the model that it can call `"get_forecast"` and needs to supply two numbers. A well-designed client (or model prompt) will ensure the model outputs a JSON invocation matching this format when it wants to use the tool.

**Invoking tools:** To use a tool, the client sends a `tools/call` request with the tool name and an `arguments` object providing the needed inputs ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20in%20MCP%20allow%20servers,Key%20aspects%20of%20tools%20include)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions)). The server then executes the corresponding function and returns the result. The result is typically a payload containing a `content` field which can include text or other data that the model will receive as the tool’s answer. For example, the weather tool might return:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Tomorrow's forecast for San Francisco is cloudy with a high of 65°F."
    }
  ]
}
```

The model then can use that content to formulate its final answer to the user.

MCP’s philosophy is to not hide errors from the model when using tools. If a tool fails (say the API is down or input is invalid), the server should return a result with `isError: true` and perhaps a text message describing the error ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tool%20errors%20should%20be%20reported,a%20tool%20encounters%20an%20error)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%7D%20catch%20%28error%29%20,text%3A%20%60Error%3A%20%24%7Berror.message%7D%60)). This way, the model knows the call didn’t succeed and can respond appropriately (maybe try a different approach or ask the user for clarification) rather than just being blind to the failure.

**Examples of tools:** Tools can wrap almost anything:

- **System operations:** e.g. `execute_command` to run a shell command ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=System%20operations)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=properties%3A%20,)) (with caution!), or `read_file` to open a file (though reading file as a tool might also be done as a resource – tools are more for actions or dynamic data).
- **External APIs:** e.g. `github_create_issue` that takes title/body and creates an issue via GitHub API ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=API%20integrations)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=name%3A%20,%7D%20%7D)).
- **Data processing:** e.g. `analyze_csv` that takes a file path and some operations to perform (sum, average, etc.), then returns results ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Data%20processing)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=filepath%3A%20%7B%20type%3A%20,%7D%20%7D%20%7D)).
- **Domain-specific actions:** For a calendar server, a tool could be `schedule_meeting`; for a database server, a tool might be `run_query`.

**Implementing a tool on the server:** With an MCP SDK, you typically declare your capabilities and then set up handlers. For example, using Python pseudocode:

```python
server = Server(name="example-server", version="1.0", capabilities={"tools": {}})

# When tools/list is called, return our tool definitions
server.on_list_tools = lambda req: {"tools": [
    {
      "name": "calculate_sum",
      "description": "Add two numbers together",
      "inputSchema": {
         "type": "object",
         "properties": { "a": {"type":"number"}, "b": {"type":"number"} },
         "required": ["a","b"]
      }
    }
]}

# When tools/call is called for 'calculate_sum', perform the action
server.on_call_tool = lambda req: {
    "content": [ { "type": "text", "text": str(req.params["a"] + req.params["b"]) } ]
}
```

This simple example adds two numbers ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=tools%3A%20%5B%7B%20name%3A%20,b)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Handle%20tool%20execution%20server,a%20%2B%20b%29)). In a real server, you’d have conditional logic for each tool name, possibly perform asynchronous operations (like API calls), and handle errors as shown earlier.

**Model side control:** When an AI model (Claude, GPT-4, etc.) is connected to an MCP client, how does it know what tools are available? Typically, the client will inject a **manifest of tools** into the model’s context or use a specific prompting technique. For example, it might present a system message listing tool names and their parameters, or in OpenAI’s function calling paradigm it might register these as functions. Indeed, OpenAI’s **Agents SDK** has built-in support for MCP servers – it will automatically call `list_tools()` on connected MCP servers and treat those as functions the model can use ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=Using%20MCP%20servers)) ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=async%20with%20MCPServerStdio%28%20params%3D%7B%20,list_tools)). This means a GPT-4 powered agent can utilize MCP tools just like it would an OpenAI function, seamlessly bridging ecosystems.

**Safety and approval:** Because tools can do things like call external services or modify data, most MCP hosts will keep a human in the loop. For example, Claude Desktop will show the user a prompt like “The assistant wants to use tool `get_forecast` with arguments X – do you allow this?” and require a click to proceed. This ensures the AI doesn’t take unapproved actions. The MCP design encourages this: **tools are model-initiated but human-approved** in practice ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=real%20world)). The client can enforce policies like only allowing certain tools, sanitizing inputs (to prevent prompt injection attacks on an API, for instance), or adding delays/rate-limits on tool usage.

**Tool lifecycle and updates:** Tools can be dynamic. Servers might add or remove tools at runtime (perhaps enabling extra features based on user login or changing mode). If so, they will notify the client via `tools/list_changed` notifications ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=MCP%20supports%20dynamic%20tool%20discovery%3A)). The client can then refresh the list. This dynamic discovery means an AI could even adapt its capabilities during a session (though usually the set of tools is static per session for simplicity).

**When to use tools:** Use a tool whenever the AI needs to **perform an action or fetch fresh data** that is not pre-provided. If the answer to a query can’t be found in the context the model already has (including resources), that’s a hint it might need a tool. Classic examples: math calculation beyond the model’s ability, retrieving today’s information, editing a file, controlling an IoT device, etc. Tools extend the model’s capabilities beyond text generation, turning it into an agent that can act in the world (within the limits you define). Comparatively, what plugins were to ChatGPT, tools are to MCP – but MCP tools are available to _any_ AI client that implements the protocol, not just one product.

### 3.4 Roots – Defining the Scope of a Server’s Context (Client-Side)

Moving to the client-side primitives, **Roots** are a simpler concept but important for clarity and security. A **Root** is basically a **starting context or boundary** that the client communicates to the server, telling it “this is the scope you should focus on.” ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=A%20root%20is%20a%20URI,valid%20URI%20including%20HTTP%20URLs)) ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=Why%20Use%20Roots%3F))

In practice, a root is a URI (just like a resource URI) that the server should treat as the base or relevant location. The classic use case is filesystem access: when connecting to a file server, the client might send a root like `file:///home/user/projects/myapp` – instructing the server that this directory is the project of interest ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=connects%20to%20a%20server%2C%20it,valid%20URI%20including%20HTTP%20URLs)). The server can then limit resource listings or operations to within that path (not wandering into other folders). Roots can also be things like an HTTP URL base (e.g. “only consider the API at https://api.example.com/v1/*”) ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=A%20root%20is%20a%20URI,valid%20URI%20including%20HTTP%20URLs)), or any identifier that narrows the server’s purview.

**How roots work:** When initiating the MCP connection, the client declares the roots as part of its capabilities (there’s a `roots` field in the `initialize` message if used) and possibly sends a `roots` notification or parameter with a list of root URIs ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=How%20Roots%20Work)). The server, upon receiving this, knows the context. If roots change (say the user opens a different project in their IDE), the client can notify the server of the updated roots during the session ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=How%20Roots%20Work)).

Roots are **advisory** – MCP doesn’t forcibly prevent a server from stepping outside, but well-behaved servers will respect them. It’s up to the server to enforce that it only exposes resources within the provided roots and tailors prompts/tools accordingly. From a security perspective, the host can sandbox the server process to those locations if needed, but roots provide a protocol-level way of stating the intended boundaries.

**Use cases:** In multi-project or multi-context applications, roots allow switching context without launching new servers for each context. For example, a code assistant might have one MCP server for Git operations; when you change the repository you’re working on, you could just update the root URI (e.g. `git://repo1` to `git://repo2`) and the server now operates on the new repository.

**Best practices:** Typically, **only suggest necessary roots** – if a server doesn’t need access to your entire file system, don’t give it the root at a very high level. Use descriptive names alongside URIs if possible (clients can send an object with `uri` and a human-readable `name` for each root) ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=%7B%20,https%3A%2F%2Fapi.example.com%2Fv1)) ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=,%7D%20%5D)). This helps users see what they’ve shared. And if roots change or multiple roots are used concurrently, the server should treat them as separate scopes (for example, a search server given two roots might search both, but keep results organized by root).

In summary, Roots provide **contextual focus**. They help **guide servers** (“here’s where to look”) and reassure users that the AI’s access is scoped. Not all MCP integrations will require roots (some have implicit scope, like a weather server might ignore roots), and indeed as of now not all clients support sending roots. But it’s a useful concept for multi-directory or multi-dataset scenarios.

### 3.5 Sampling – Advanced: Letting Servers Invoke the Model (Agentic Loop)

**Sampling** is the most advanced primitive, and it operates on the client side. It allows an MCP server to **request the host to generate a completion from the LLM** ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=Roots%20are%20an%20entry%20point,ability%20to%20deny%20sampling%20requests)). In simpler terms, it flips the usual direction: normally, the model (via the client) asks the server for data (with tools or resources), but with sampling, the server can ask the model to think or respond in the middle of a tool’s operation. This can enable complex multi-step **agentic behaviors**, where a tool might defer to the model for a sub-task.

For example, consider a tool that needs to decide the best course of action (like a meta-tool that orchestrates other tools). The server might not have a hardcoded rule, so it asks the model: “Based on this situation, which tool should I call next?” It uses `sampling/createMessage` to send that question to the model itself, gets the model’s answer, and then uses it to proceed. This effectively lets tools chain or nest model calls.

**How it works:** The server sends a `sampling/createMessage` request containing a **prompt (messages)** for the model, along with parameters like preferences for which model to use, how to handle system prompts, etc ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20sampling%20flow%20follows%20these,steps)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Message%20format)). The client (host) then goes through a controlled process:

1. **Review the request:** The client may log or display what the server is asking the model. (Since this could be hidden from the user otherwise, transparency is important.)
2. **Possibly modify** the prompt or reject it: The client or user might intervene if it’s not appropriate.
3. **Call the LLM** (the actual model, e.g. GPT-4 or Claude, typically the same one that’s conversing with the user, though conceivably could specify a different model).
4. **Get the completion** and again possibly review or filter it.
5. **Return the result** back to the server as the answer to the sampling request ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20sampling%20flow%20follows%20these,steps)).

This design ensures a **human-in-the-loop**. In fact, current MCP clients (Claude Desktop as of early 2025) do **not yet support sampling without user oversight** ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=maintaining%20security%20and%20privacy)), and there is guidance that there “SHOULD always be a human in the loop” for sampling requests ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=Roots%20are%20an%20entry%20point,ability%20to%20deny%20sampling%20requests)) ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=from%20a%20Client,ability%20to%20deny%20sampling%20requests)). Essentially, sampling is like giving the server a limited ability to query the AI itself, but with the **client as gatekeeper**.

**Sampling use cases:** You can think of sampling as enabling **LLM-driven tool behavior**. Some patterns:

- _Plan-and-Act Agents:_ A server might implement an agent loop. When a tool is called (like a high-level “assistant” tool), the server might use sampling to have the model generate a plan or decide which sub-tool to use, then carry out that plan. This way, complex decision-making can still be learned behavior from the model, not fully hardcoded.
- _Long Operations / Refinement:_ Suppose a server is doing a long-running task (e.g. writing code). It might periodically ask the model, via sampling, “Does this code look correct so far? Continue or fix errors?” to leverage the model’s reasoning mid-process.
- _Tool Chaining:_ The server can effectively call the model with context from earlier steps and then use the model’s output to decide the next tool call, creating a chain of actions until a goal is met.

**Message format and options:** The `sampling/createMessage` request contains:

- A `messages` array, which is just like the usual chat history (role + content), that you want to feed into the model ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Messages)). This could include a few turns of conversation or a single question.
- `modelPreferences`: Hints about which model to use or what trade-offs (cost vs speed vs quality) to prefer ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20,specify%20their%20model%20selection%20preferences)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=%2A%20Priority%20values%20%280)). For instance, a server might hint `"claude-2"` or give a high `intelligencePriority` if it needs the best reasoning, or conversely use a cheaper model for a minor sub-task. The client ultimately chooses the model (it might map “claude-2” to GPT-4 if Claude isn’t available, etc., as per its configuration).
- `systemPrompt`: an optional system-level instruction to request. The client may choose to honor or adjust this ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=System%20prompt)) (to maintain a consistent persona or policies).
- `includeContext`: this flag tells the client how much of the current overall context to include along with the provided messages ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Context%20inclusion)). Options are `"none"` (isolate this call with just the provided prompt), `"thisServer"` (include relevant context from this server’s session, perhaps resources that are active), or `"allServers"` (include everything the AI currently knows from all connected servers). The client again has final say for safety; it might trim context if it would overflow token limits or violate privacy.
- Usual generation settings like `temperature`, `maxTokens`, `stopSequences`, etc. to control the LLM sampling process ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Fine)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20client%20returns%20a%20completion,result)).

The client returns a completion with the model’s name and the content (which could be text or even an image data if the model returned an image) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20client%20returns%20a%20completion,result)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=model%3A%20string%2C%20%20%2F%2F%20Name,data%3F%3A%20string%2C%20mimeType%3F%3A%20string)). From the server’s perspective, it made a call and got a result – it doesn’t know whether a human tweaked it or which exact model provided it, just the final answer and model identifier.

**Important: security and user control.** Sampling is powerful but can be risky if abused (a malicious server could try to prompt the model in ways the user didn’t intend). Therefore, **clients should always surface sampling requests to the user** in some form. For example, the client might display: “The plugin X wants the AI to consider the following question: ‘<some prompt>’. Allow it?” The user could then approve or deny. Similarly, after the AI responds, the client might not feed it back to the server until the user reviews it. This is the recommended **human-in-the-loop control** ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Human%20in%20the%20loop%20controls)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=For%20completions)). Additionally, clients will typically enforce that the model **cannot directly call tools or access resources during a sampling call** unless explicitly allowed – otherwise a server could recursively escalate privileges. In short, sampling is kept as a tightly controlled feature.

**Current status:** Not all MCP clients support sampling yet (Claude’s doesn’t as of writing, and many community clients haven’t implemented it). It’s considered an _advanced/experimental_ feature. But it opens the door to very sophisticated AI-agent behaviors, essentially allowing a form of **self-reflection or inner monologue** orchestrated by the server.

### 3.6 Summary of Primitives

For clarity, here’s a quick comparison of these primitives:

| Primitive    | Provided By | Controlled By                          | Purpose                                                     | Example Use Case                                                                                                                                                                                                                                                            |
| ------------ | ----------- | -------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resource** | Server      | Client/User-controlled                 | Provide static data context to the model                    | Expose files, database records, images ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20represent%20any%20kind%20of,This%20can%20include)). User selects a file for the AI to read.                        |
| **Prompt**   | Server      | User-controlled                        | Provide a reusable prompt template or workflow              | “Summarize document” or “Analyze code” preset, which formats the request for the AI ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Prompts%20enable%20servers%20to%20define,and%20share%20common%20LLM%20interactions)). |
| **Tool**     | Server      | Model-initiated (with human approval)  | Perform an action or fetch live data via function call      | `get_weather` API call, `send_email` action. AI calls the tool to act ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20are%20a%20powerful%20primitive,actions%20in%20the%20real%20world)).                             |
| **Root**     | Client      | Client (user indirectly)               | Scope or boundary for server operations                     | Limit a file server to a specific directory path ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=A%20root%20is%20a%20URI,valid%20URI%20including%20HTTP%20URLs)).                                                             |
| **Sampling** | Client      | Model-initiated (with human oversight) | Allow server to request an LLM computation (nested AI call) | During a complex tool execution, ask the AI for a decision or summary ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Let%20your%20servers%20request%20completions,from%20LLMs)).                                       |

Each of these plays a role in enabling **context-aware AI**. Beginners using MCP might start only with resources and tools (the most common needs), while advanced use might incorporate prompts for convenience and sampling for complex agent designs.

## 4. Getting Hands-On: Implementing MCP Step-by-Step

### 4.0 Intro

Now that we’ve covered what MCP is conceptually, let’s walk through how you would **use MCP in practice**. We’ll start with basic setup and then build towards a full example project.

### 4.1 Setting Up an MCP Environment

Because MCP is an open protocol, it comes with multiple SDK implementations. You can choose the language you’re most comfortable with. Common choices are **Python** and **TypeScript**, which have official SDKs maintained by Anthropic ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=tools,According%20to%20Anthropic)), but there are also community SDKs in Java, Kotlin, C#, and more.

**1. Install the SDK:** If you choose Python, for example, you might install the MCP package (e.g. `pip install mcp` or a similarly named package from Anthropic’s GitHub). For TypeScript/Node.js, you’d add the `@modelcontextprotocol/sdk` package via npm. Ensure you have a relatively recent version, as MCP is evolving fast (check the “What’s New” in the docs for breaking changes ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=C,what%20else%20is%20new))).

**2. Understand the SDK structure:** Typically, the SDK will provide classes for **Server**, **Client**, and utilities for each primitive’s request/response schema. In a simple use case, if you’re writing an MCP server, you will:

- Instantiate a `Server` object with some metadata (name, version) and a set of capabilities you want to support (e.g. `capabilities: { resources: {}, tools: {} }` to indicate your server provides resources and tools).
- Register handlers for the various request types relevant to those capabilities (like `resources/list`, `resources/read`, `tools/list`, `tools/call`, etc.). The SDK likely provides typed schemas or constants for these.
- Start listening for connections via a chosen transport.

If you’re writing an MCP client (which is less common unless you are developing an AI app or integrating into one), you would:

- Instantiate a `Client` and connect it to one or more servers (by launching processes or connecting to URLs).
- After connection, call methods like `client.list_resources()` or `client.call_tool()` to interact, and feed those results into your model’s prompts.

**3. Running a server locally:** During development, an easy way to test is using the **Stdio transport** because you can just run the server in a console or as a subprocess. For example, suppose we make a Python MCP server script `weather_server.py` that implements a couple of tools (get forecast, get alerts). We can run `python weather_server.py` in one terminal, and in another, use a client (even a simple one that sends JSON-RPC) to communicate with it. The official quickstart and many examples use Claude Desktop as the client: you can configure Claude Desktop to launch your server program via MCP ([GitHub - hideya/mcp-server-weather-js: Simple Weather MCP Server Example](https://github.com/hideya/weather-mcp-server#:~:text=)) ([GitHub - hideya/mcp-server-weather-js: Simple Weather MCP Server Example](https://github.com/hideya/weather-mcp-server#:~:text=%7B%20,weather%22%20%5D%2C)). If you prefer, you can also use the `mcp-cli` tools or an inspector UI provided by Anthropic to test your server.

**4. Permissions and config:** If using Claude’s app, you often need to register the server in a config file specifying how to launch it (as shown in the weather server README) ([GitHub - hideya/mcp-server-weather-js: Simple Weather MCP Server Example](https://github.com/hideya/weather-mcp-server#:~:text=)) ([GitHub - hideya/mcp-server-weather-js: Simple Weather MCP Server Example](https://github.com/hideya/weather-mcp-server#:~:text=%7B%20,weather%22%20%5D%2C)). Other clients might simply take a command or URL. Always ensure that any firewall or OS permissions (for network or file access) are handled, especially if using the SSE transport – you might need to allow a port or use `localhost` for testing.

With setup out of the way, let’s build a concrete project to cement these concepts.

### 4.2 Example Project: AI Weather Assistant with MCP (End-to-End)

Let’s create a simplified AI assistant that can answer weather-related questions by integrating a real weather API. We’ll use MCP to connect our AI (could be Claude or GPT-4) to a custom **Weather Server** that we implement. This project will demonstrate **resources, tools, and prompts** together:

**Project Overview:** We want the user to ask questions like “What’s the weather in New York tomorrow?” or “Are there any weather alerts in California right now?”. The AI itself doesn’t know the weather, so it will rely on our Weather MCP server to provide the info. We will implement two tools on the server:

- `get_forecast(latitude, longitude)` – returns the forecast for the next day at that location.
- `get_alerts(state)` – returns current weather alerts for a given U.S. state.

We will also implement a prompt on the server for convenience:

- `weather_summary` – a prompt that combines forecast and alerts into a single answer if needed.

**Step 1: Build the Weather MCP Server (Python).**

For brevity, let’s outline a basic Python server using pseudocode/description:

```python
from mcp import Server, StdioServerTransport, schemas  # hypothetical SDK imports

server = Server({"name": "weather-server", "version": "1.0"}, capabilities={"tools": {}, "prompts": {}})

# Define our tools metadata
TOOLS = [
    {
        "name": "get_forecast",
        "description": "Get weather forecast for a location (next day)",
        "inputSchema": {
            "type": "object",
            "properties": {
                "latitude": {"type": "number"},
                "longitude": {"type": "number"}
            },
            "required": ["latitude", "longitude"]
        }
    },
    {
        "name": "get_alerts",
        "description": "Get current weather alerts for a U.S. state",
        "inputSchema": {
            "type": "object",
            "properties": {
                "state": {"type": "string"}  # expecting state code like "CA"
            },
            "required": ["state"]
        }
    }
]

# Handle listing tools
server.set_request_handler(schemas.ListToolsRequest, lambda req: {"tools": TOOLS})

# Handle calling tools
import requests  # to call a public weather API
API_KEY = "YOUR_API_KEY"  # you'd use a real API key for a weather service

def call_tool(req):
    name = req.params["name"]
    args = req.params["arguments"]
    if name == "get_forecast":
        lat, lon = args["latitude"], args["longitude"]
        # Call some weather API for forecast (simplified)
        resp = requests.get(f"https://api.weather.com/forecast?lat={lat}&lon={lon}&apiKey={API_KEY}")
        forecast_text = parse_forecast(resp.json())
        return {"content": [ {"type": "text", "text": forecast_text} ]}
    elif name == "get_alerts":
        state = args["state"]
        resp = requests.get(f"https://api.weather.com/alerts?state={state}&apiKey={API_KEY}")
        alerts_text = parse_alerts(resp.json())
        return {"content": [ {"type": "text", "text": alerts_text} ]}
    else:
        # Unknown tool
        return {"isError": True, "content": [ {"type": "text", "text": f"Tool '{name}' not found"} ] }

server.set_request_handler(schemas.CallToolRequest, call_tool)

# Optionally, define a prompt to demonstrate prompts usage
PROMPTS = [
    {
      "name": "weather_summary",
      "description": "Summarize weather forecast and alerts for a US location",
      "arguments": [
          {"name": "city", "required": true},
          {"name": "state", "required": true}
      ]
    }
]
server.set_request_handler(schemas.ListPromptsRequest, lambda req: {"prompts": PROMPTS})
def get_prompt(req):
    if req.params["name"] == "weather_summary":
        city = req.params["arguments"]["city"]
        state = req.params["arguments"]["state"]
        return {
            "messages": [
                {
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": f"Give me a quick weather report for {city}, {state}: include today's forecast and any active alerts."
                    }
                }
            ]
        }
    else:
        raise Exception("Prompt not found")
server.set_request_handler(schemas.GetPromptRequest, get_prompt)

# Start the server (stdio transport for local testing)
transport = StdioServerTransport()
server.connect(transport)
```

In the above, we assume `parse_forecast` and `parse_alerts` are functions to format the API JSON into a readable text (not shown for brevity). The server declares both tools and prompts capabilities. It provides two tools and one prompt. It uses a fictitious weather API endpoints for demonstration – in reality, you’d use a real API (or a stub in testing).

**Step 2: Run and connect the server to an AI client.**

If you have Claude Desktop, you could configure it to spawn this `weather-server` when needed. Alternatively, for testing, you could make a simple client script or use the `mcp-inspector` tool (a web UI provided by Anthropic to test servers ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=Building%20MCP%20with%20LLMs%20Learn,Video%2C%202hr)) ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=Building%20MCP%20with%20LLMs%20Learn,Video%2C%202hr))). However, let’s assume we use Claude as the front-end:

In Claude’s app config (as per the weather example instructions), you merge something like:

```json
"mcpServers": {
    "weather": {
        "command": "python",
        "args": ["path/to/weather_server.py"]
    }
}
```

Then, launch Claude Desktop and start a conversation. You should see the **Weather server** listed as connected (Claude might show available tools or prompts in its UI if it detects them).

**Step 3: Query the assistant and see MCP in action.**

Now as a user, you ask Claude: _“Any weather alerts in California?”_. Here’s what happens behind the scenes:

- Claude (the model) receives the user question. The Claude app (MCP client) knows the Weather server has a tool `get_alerts` that likely is relevant. It has previously given Claude a description of this tool (via the system prompt or similar mechanism).
- The model’s response might come in the form of a **tool invocation**. For example, Claude might output something like: `{"action": "call_tool", "name": "get_alerts", "arguments": {"state": "CA"}}` (the exact format depends on the client; it could also be a natural language that Claude’s app interprets as a function call). The MCP client intercepts this and sends a `tools/call` request to our server with those params.
- Our Weather server receives `tools/call` for `"get_alerts"` with `state: "CA"`. It calls the weather API for California alerts, gets back (say) “Heat advisory in effect for Northern California”, and returns that as content.
- Claude’s client receives the tool result and gives it to Claude as if the assistant got a reply. The model then continues its answer to the user, possibly just by echoing the alert info or rephrasing it. The final answer might be: _“There is currently a Heat Advisory in effect in California.”_

From the user’s perspective, Claude answered using up-to-date info without the user needing to copy-paste anything – MCP handled the retrieval via the tool call.

If the user asks, _“What’s the weather in 94107 tomorrow?”_ (94107 is a ZIP code in California), the flow would be similar: the model might know 94107 corresponds to lat/long, or perhaps our client is smart enough to call `get_forecast` with that input (if we extended our server to accept ZIP and convert to lat/long, or we provided a prompt). For simplicity, assume the model asks to call `get_forecast` with some coordinates. The server calls the API, gets “Sunny, high of 68°F”, returns it, and the model responds to the user accordingly.

**Using the prompt:** If the user asked something more open, like _“Give me a weather report for San Francisco, CA”_, the model might either call both tools internally, or the user (or UI) could use the custom prompt. For example, Claude’s UI might list a slash command `/weather_summary` that the user can click, entering city and state. When invoked, that would trigger `prompts/get` on our server. Our server would return a user message like “Give me a quick weather report for San Francisco, CA: include today’s forecast and any active alerts.” Claude will then generate an answer, which might internally cause it to call both `get_forecast` and `get_alerts` (since the prompt specifically said to include both). This showcases how prompts can guide multi-tool use.

**Recap of what we achieved:** We built an MCP server that wraps an external API. We used **tools** to let the model fetch info on its own, and a **prompt** to conveniently format a complex request. The AI assistant (Claude/GPT-4) remained implementation-agnostic – it didn’t have hardcoded knowledge of how to call the weather API, it just knew about MCP tools. If tomorrow we swapped out Claude for another MCP-compatible AI (say a GPT-4 agent using OpenAI’s agent SDK), it too could connect to our server and immediately gain weather abilities ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=Using%20MCP%20servers)). That’s the power of the standardization.

### 4.3 Verification and Testing

When building your own MCP integrations, it’s crucial to test thoroughly:

- **Unit test your server’s logic** (e.g. does `get_forecast` handle edge cases? What if API fails?).
- **Use the MCP Inspector** tool or run the server with a test client to simulate calls. Anthropic provides an interactive web app to send manual MCP requests, which is useful for debugging ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=Building%20MCP%20with%20LLMs%20Learn,Video%2C%202hr)) ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20development%20Debugging%20Guide%20Learn,Video%2C%202hr)).
- **Test with a real model in the loop** – e.g. run an example conversation end-to-end as we described. Check that the AI’s response is correct and that errors are handled gracefully (e.g. try an invalid state code and see if the AI apologizes or asks for correction, based on your `isError` message).
- **Security testing:** Ensure that your tool calls can’t be misused. For instance, if you had an `execute_command` tool, you’d want strict validation on the input. The MCP docs advise to validate inputs and implement access control in tools ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Testing%20tools)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,errors%20through%20the%20MCP%20protocol)).

Now that we have a working sense of how to build with MCP, let’s explore some more advanced considerations and how MCP compares to other approaches.

## 5. Advanced Concepts and Best Practices

### 5.1 Complex Workflows and Agentic Behavior

Using combinations of the above primitives, you can create fairly sophisticated AI agent workflows. For example, you might have an AI agent tasked with auditing code for vulnerabilities. Using MCP:

- The agent could list files (resource), read each file’s content.
- It could use a prompt like `"analyze-code"` (server-provided) to systematically review each file.
- If it finds something suspicious, maybe it uses a tool to fetch additional data (like `git_blame` info via a Git server tool).
- It might use **sampling** internally to reason about which files to prioritize first (the server asks the model for a plan).
- All along, the host (client) ensures the user can see what’s happening and approve any external actions.

This kind of _agent orchestration_ is made easier by MCP’s standardized interfaces. In fact, one can imagine higher-level libraries built on top of MCP that automatically do things like tool selection or planning (akin to how LangChain provides an agent loop). A notable community project is **fast-agent** which claims full multimodal MCP support and end-to-end tests for agent behaviors ([Example Clients - Model Context Protocol](https://modelcontextprotocol.io/clients#:~:text=5ire%E2%9D%8C%E2%9D%8C%E2%9C%85%E2%9D%8C%E2%9D%8CSupports%20tools,in%20agentic%20workflows)).

When implementing complex agents:

- **Keep the user informed.** Even if the agent is doing multi-step tool use, the UI should periodically update the user or require confirmation before major steps (especially destructive actions).
- **Modularize server functions.** It’s often better to have several single-purpose tools than one monolithic “do everything” tool, because the model can mix and match tools.
- **Use system prompts to set ground rules.** You might configure the client’s system prompt to remind the AI “You have tools X, Y, Z. Only use them with appropriate inputs. If an action is not allowed, do not attempt it,” etc., to align the model’s behavior with available tools and safety.

### 5.2 Security and Privacy Considerations

With great power (connecting AI to real data and actions) comes great responsibility. Some best practices and considerations:

- **Principle of least privilege:** Only give servers access to what they need. Use **Roots** to narrow file access. If a server only needs read access, don’t implement tools that write or mutate state. The host application should enforce sandboxing where possible (for instance, run file servers as a user with limited permissions).
- **Validate and sanitize inputs:** Both at the model side and server side. A malicious prompt from the model (perhaps induced by a user input) could try to exploit a tool. For example, if you have a `search_database(query)` tool, ensure the `query` is validated to prevent SQL injection or overly broad queries. The server can sanitize by escaping dangerous characters or imposing query format rules.
- **Rate limiting and cost control:** If your tools call paid APIs or could spam actions, build in limits. MCP servers can track how many calls have been made and either slow down or refuse if too many. Similarly, for Sampling, you might not want a rogue server to prompt the model 100 times and rack up API usage – the client or host should impose limits or ask for user confirmation for expensive loops.
- **Human oversight:** As emphasized earlier, features like tool usage and sampling should have user oversight, especially early in deployment. Maybe you start with requiring a button click for each tool use. With more confidence (and less risky tools), you might auto-approve some calls but always have a log visible.
- **Sensitive data handling:** If resources include sensitive info, the client might want to redact certain parts before showing it to the model (though ideally if the model is authorized to see it, it’s fine). Servers should not automatically expose private data without the user explicitly connecting them. For instance, an MCP email server shouldn’t on its own list all emails; it could require the user to specify which folder or search term (maybe as a root or resource template) to constrain results.

### 5.3 Comparing MCP to Other Integration Approaches

It’s useful to understand MCP’s place in the landscape of AI integration technologies:

- **Versus Custom Prompt Engineering:** Before tools like MCP, developers often resorted to stuffing data into prompts (for context) and instructing the model to do things in natural language. For example, to use a calculator, one might prompt: “If you need to calculate something, respond with `CALC(expression)` and I’ll calculate it for you.” This works but is ad-hoc and error-prone. MCP formalizes these patterns (resources instead of copy-pasted text, tools instead of heuristic markup) which leads to more robust and maintainable systems. Prompt templates are still useful (MCP’s Prompts essentially capture that idea), but MCP ensures they are discoverable and standardized, rather than scattered strings in your code.

- **Versus ChatGPT Plugins and similar function calling:** OpenAI’s plugins and function calling introduced a way for models to call developer-defined functions, which is conceptually similar to MCP tools. The difference is **standardization and scope**:

  - ChatGPT plugins are specific to OpenAI and require a manifest, an OAuth sometimes, and a certain deployment process; MCP servers are a general concept – you can run one for yourself or your organization without relying on a specific platform’s infrastructure.
  - Also, plugins often bundle both an API and an AI-facing schema. MCP effectively separates the concerns: an API can be wrapped by an MCP server, which then any AI agent can use. In fact, you could wrap an **existing API** (say a weather REST API) with an MCP server in a few lines of code (as we did conceptually), instantly making it usable to multiple AI systems.
  - Another difference: ChatGPT’s plugin responses are not directly visible to the user until the model includes them in an answer, whereas MCP (especially for resources) tends to make data visible (e.g. user selects which files to include). This can be an advantage for transparency.

- **Versus LangChain or Agent libraries:** LangChain and similar are libraries to help orchestrate LLMs and tools. They are not protocols; in fact, LangChain could be an **MCP client** under the hood – using MCP to interface with tools. The OpenAI Agents SDK we cited is basically OpenAI’s answer to LangChain, and it explicitly supports MCP servers ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=The%20Agents%20SDK%20has%20support,provide%20tools%20to%20your%20Agents)) ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=You%20can%20use%20the%20MCPServerStdio,to%20connect%20to%20these%20servers)). So these are complementary: MCP provides the **connectivity layer**, and agent frameworks provide strategy (how to choose tools, how to manage conversation). If you already use an agent framework, adopting MCP might simplify how you add new tools (since you can plug into the ecosystem of MCP servers). Conversely, if you use MCP raw, you might later incorporate an agent loop library to handle multi-step problems.

- **Versus direct API calls from code:** One might ask, why not just write Python code that calls the weather API and then feed the result to the model, skipping MCP entirely? Certainly, for a single application that’s possible. The benefit of MCP comes when you want a **clean separation and reuse**. If you write a weather integration inside your app for GPT-4, you’d have to rewrite it to use with Claude or another model or app. MCP encourages thinking of these integrations as **services** that can be reused. It also standardizes messaging, error handling, etc. So for a quick hack, MCP might be overkill; but for long-term maintainable systems (especially if you are an enterprise or platform builder), MCP is very attractive.

A useful analogy: before, we had many independent “plugins” or bespoke tool integrations – like early smartphone apps each had their own accessories. MCP is like establishing a **standard port** and communication protocol so that all accessories can work with all devices with an adapter. It might take time to gain universal adoption, but it moves the ecosystem toward interoperability and away from walled gardens.

### 5.4 Troubleshooting and Debugging Tips

Working with a new protocol can be challenging, so here are some tips:

- **Use verbose logging:** Run your server with debug logs on. The MCP SDKs often have an option to log all JSON-RPC messages sent/received. This is invaluable to see if, say, the client requested `tools/list` and what you responded with.
- **MCP Inspector:** We mentioned it but it’s worth emphasizing: the MCP Inspector is a tool that lets you simulate being a client to test your server. You can send a `tools/call` or `resources/read` manually and see the response, ensuring your server logic is correct without an AI in the loop ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=Building%20MCP%20with%20LLMs%20Learn,Video%2C%202hr)) ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20development%20Debugging%20Guide%20Learn,Video%2C%202hr)).
- **Check compatibility and versions:** If your server or client uses a certain MCP spec version, ensure they match. The initial versions of MCP might evolve (capabilities fields, message schemas). During the `initialize` handshake, mismatched versions should be caught – the server and client exchange a protocol version and capabilities ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=1)) ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=1.%20Client%20sends%20,Normal%20message%20exchange%20begins)). If these don’t align, some features might not work as expected.
- **Community examples:** Look at the growing list of reference servers ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=The%20MCP%20is%20intended%20to,According%20to%20Anthropic)) on GitHub or community projects. If you’re implementing a Postgres server, for instance, there might already be one you can study or contribute to. This can save time and also ensure you follow best practices from others.
- **Testing with different clients:** If possible, test your MCP server with multiple clients (Claude, Continue, OpenAI agent, etc.). This can reveal assumptions you made. For example, maybe you assumed the client always calls `list_resources` first – one client might not do that and call `read` directly for a known URI. Your server should handle that gracefully (maybe by generating content on the fly or returning an error “not found”).

## 6. Conclusion and Next Steps

### 6.1 Summary of Key Learning Outcomes

The Model Context Protocol is a significant step towards **standardizing how AI systems interact with the world**. By learning MCP, you’re equipping yourself with a toolset that makes AI integration more modular, scalable, and collaborative. In this guide, we started from basic concepts and built up to a working example and beyond, covering both the “why” and “how” of MCP.

For beginners, the key takeaway is that MCP allows you to **plug in data and tools to AI** as easily as plugging a flash drive into a computer – once the port (protocol) is available, a whole ecosystem of integrations opens up. As you progress, you can leverage MCP to build complex AI agents that combine reasoning with action, all while maintaining a clean separation of concerns.

### 6.2 Recommended Next Steps for Further Learning

**Where to go next?** Here are some suggestions:

- **Explore the official documentation and spec:** The Anthropic MCP documentation site is very detailed, including **tutorials** (like building MCP servers with the help of an LLM itself ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=Building%20MCP%20with%20LLMs%20Learn,Video%2C%202hr))), an **MCP workshop video**, and concept deep-dives. The spec on GitHub provides the formal JSON schemas if you’re interested in the nitty-gritty ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=The%20MCP%20spec%20defines%20a,support%20two%3A%20Roots%20and%20Sampling)).
- **Try building a simple MCP server:** Perhaps start with a file reader or a calculator tool – something simple. Experiment with connecting it to Claude or another client. Even without an AI, you can test the server using cURL or a small Python script (since it’s JSON-RPC).
- **Join the community:** Because MCP is open-source, there are discussion forums and GitHub discussions ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,email%20protected)). You might find others who are integrating the same tool or data source as you, and you can share connectors.
- **Consider MCP in your projects:** If you’re a developer, think about whether your next AI project could benefit from MCP. If you’re a researcher, MCP provides a platform to test ideas about AI tool use or retrieval in a controlled way across different models.

By unifying the way we connect AI to data, MCP is likely to grow in importance. Already, beyond Anthropic’s Claude, we see interest from other platforms (as the OpenAI Agents integration shows ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=The%20Agents%20SDK%20has%20support,provide%20tools%20to%20your%20Agents))). Adopting MCP skills early could give you a head start in building **AI systems that are more flexible and powerful**. Whether you’re enabling a student’s personal GPT-4 to access their notes, or building an enterprise assistant that navigates company databases, MCP provides the blueprint to do it in a standardized, future-proof manner.

Happy hacking with MCP, and may your AI always have the context it needs!

## 7. References and Resources

### 7.1 Sources:

1. Anthropic, _"Introducing the Model Context Protocol (MCP)"_ – Official announcement and overview ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=Today%2C%20we%27re%20open,produce%20better%2C%20more%20relevant%20responses)) ([Introducing the Model Context Protocol \ Anthropic](https://www.anthropic.com/news/model-context-protocol#:~:text=MCP%20addresses%20this%20challenge,to%20the%20data%20they%20need)).
2. InfoQ, _"Anthropic Publishes Model Context Protocol Specification for LLM App Integration"_ – News summary with key features ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=Anthropic%20recently%20released%20their%20Model,of%20reference%20implementations%20of%20MCP)) ([Anthropic Publishes Model Context Protocol Specification for LLM App Integration - InfoQ](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/#:~:text=The%20MCP%20spec%20defines%20a,support%20two%3A%20Roots%20and%20Sampling)).
3. Anthropic MCP Documentation – _Core Concepts and Tutorials_ (modelcontextprotocol.io) ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20is%20an%20open%20protocol,different%20data%20sources%20and%20tools)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20are%20a%20core%20primitive,as%20context%20for%20LLM%20interactions)).
4. Anthropic MCP Documentation – _Resources, Prompts, Tools, Sampling, Roots_ references ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=To%20read%20a%20resource%2C%20clients,request%20with%20the%20resource%20URI)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%2F%2F%20Response%20%7B%20description%3A%20,n%20%20%20%20for)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=tools%3A%20%5B%7B%20name%3A%20,b)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20sampling%20flow%20follows%20these,steps)) ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=A%20root%20is%20a%20URI,valid%20URI%20including%20HTTP%20URLs)).
5. WillowTree Apps, _"Is Anthropic’s Model Context Protocol Right for You?"_ – Illustrated example and discussion of MCP vs without MCP ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=Without%20such%20a%20standard%2C%20the,aims%20to%20solve%20this%20problem)) ([Is Anthropic’s Model Context Protocol Right for You?](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you#:~:text=with%20MCP%20on%20the%20right,com)).
6. OpenAI Agents SDK Documentation – _Using MCP servers with OpenAI Agents_ ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=You%20can%20use%20the%20MCPServerStdio,to%20connect%20to%20these%20servers)) ([Model context protocol (MCP) - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/#:~:text=Using%20MCP%20servers)).
