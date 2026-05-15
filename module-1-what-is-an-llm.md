# Module 1 — What is an LLM? (The view from outside)

*The question this module answers: when I type to ChatGPT or Claude, what's actually happening?*

This module is the entry point to the whole curriculum. We're starting at the top of the stack — the user-facing surface of large language models — and across the seven lessons below, we'll work out what the surface is actually telling us, what it's hiding, and what vocabulary you need to think clearly about this technology.

By the end you should be able to hold a fifteen-minute conversation with a sceptical academic without saying anything cringeworthy or wrong.

---

## Lesson 1.1 — What you see and what's happening

The user experience of an LLM is deceptively simple. You type something. After a brief pause, words appear on the screen, usually quickly, often one chunk at a time as if the system is typing. The reply is in plain language. It addresses what you said. It might ask you a question back, make a joke, refuse a request, or hallucinate a citation.

Almost nothing about this surface experience tells you what's actually happening underneath. That's both the magic and the problem.

Consider what you might assume is going on, based on how the system feels:

- That there's a "Claude" or a "ChatGPT" — an entity with persistent identity that remembers things between conversations
- That the system is "thinking" while you wait for the reply
- That when it pauses, it's choosing its words carefully
- That when it gets something wrong, it's because it didn't try hard enough or wasn't told properly
- That when it says "I" it means something by it
- That when it apologises, it feels something

Every one of those assumptions is wrong, or at best a useful metaphor that breaks down under inspection. The model has no persistent memory across conversations (unless you explicitly give it tools that simulate one). It isn't "thinking" in any sense a human would recognise. It isn't choosing its words; it's sampling from a probability distribution. When it apologises, it's predicting that "I apologise" is the most likely text in context — not having a feeling.

This isn't to deflate the technology. It's enormously impressive. But to understand it, you need to start by being suspicious of the surface metaphor. The interface is designed to be welcoming, and welcoming interfaces lie about what's underneath.

### A better starting frame

An LLM is a piece of software that, given some text, produces more text. That's it. Everything else — the helpfulness, the chattiness, the apparent reasoning — comes from how it produces that text and from a layer of conventions wrapped around the core. We'll peel those layers in this module.

### What the model does NOT do (despite appearances)

- **It does not look anything up.** It is not Googling in the background. When it tells you facts, it's reproducing patterns from its training, which may or may not be accurate. (Some products *do* search the web on the model's behalf, but that's a separate system bolted on; the model itself doesn't browse.)
- **It does not reason in the way a calculator does.** It produces text that looks like reasoning, which sometimes is reasoning and sometimes isn't. You cannot tell which from the output alone.
- **It does not "know" things in the way a database does.** There is no fact table. Everything it "knows" is encoded as patterns in its weights.
- **It does not have intentions, preferences, beliefs, or feelings.** It has weights that, when run with your text, produce text that often *describes* intentions, preferences, beliefs, and feelings. The word "describes" is doing a lot of work in that sentence.

### The uncomfortable bit

Even the people who built these systems can't fully explain why they work as well as they do. The architecture is well-understood. The training method is well-understood. But why a particular output emerges from a particular input — at the level of individual decisions inside the network — is currently beyond our ability to inspect. That's an active research area called *interpretability*, and it's full of brilliant people who would tell you cheerfully that they don't really know what's going on inside.

Hold this thought, because it matters more than it sounds: a technology that is changing knowledge work, education, medicine, and law is one that nobody — not the CEO, not the lead researcher, not the safety team — can fully explain mechanistically. That's a strange situation in engineering. We're more used to it in pharmacology, where drugs work and we have hypotheses about why. Treat AI a bit more like that.

### Why this matters for how you talk about LLMs

If you're going to defend your understanding to a random person in the street, or to a senior academic, the first test isn't transformers or backpropagation. It's the framing. People come to LLMs with expectations imported from sci-fi (HAL, the Terminator, Data from Star Trek), search engines (it must be looking things up), or calculators (it must be computing answers). The first move is to gently dismantle those frames.

Useful sentences to have ready:

- "An LLM is a text-prediction system that's been trained on so much text that its predictions look like understanding."
- "It doesn't look things up; it pattern-matches from training."
- "When it sounds confident, that's a style learned from confident text. It's not a measure of accuracy."
- "It doesn't 'know' anything. It has weights that produce text-shaped outputs."

These sentences are deflating, which is the point. The technology is genuinely remarkable *and* genuinely simpler than its surface suggests. Both things at once.

---

## Lesson 1.2 — Anatomy of a conversation

Let's trace what happens when you press send.

1. You type a message into a chat interface — a website, a mobile app, or a desktop application. The interface is a piece of software running on your device.
2. When you hit send, your text gets packaged up and sent over the internet to a server. This is an HTTP request — the same kind your browser uses for every webpage you visit. We'll go deep on HTTP in Module 8; for now, just know it's the standard way computers send messages to each other.
3. The server receives your message and adds context. It bundles together:
   - A "system prompt" (the operator's standing instructions: "You are Claude, made by Anthropic, you are helpful, here are some rules…")
   - Any earlier messages in this conversation
   - Your new message
   - Sometimes additional data like the date, your location, or tool descriptions
4. This whole bundle gets passed to the actual model — the neural network. The model is running on specialised hardware (GPUs, which we'll cover in Module 5), probably in a data centre, probably one of several different physical locations depending on load.
5. The model processes the input and starts producing tokens — one at a time, in sequence. Each token is generated based on everything that came before it. (Tokens are the next lesson.)
6. As tokens come out, they're streamed back over the internet to your interface. That's why you see the response appearing word-by-word: not because the model is "typing," but because the chunks are being sent as soon as they're generated.
7. The interface renders the tokens as text on your screen.

Two things to note here.

### There is no "Claude" running between your messages

When you hit send, a copy of the model is run with your input. When it finishes, that's it. The model doesn't sit around waiting. It doesn't think about your conversation. It doesn't remember you. The next time you send a message, the entire conversation history is shipped to the model again — because the model has no memory of its own. Every reply is a from-scratch computation that happens to receive the previous turns as input.

This is one of the most counter-intuitive facts about LLMs. The "continuity" you experience in a chat is an illusion maintained by the server, which keeps your conversation history and re-sends it on each turn. The model is functionally stateless.

There are products that simulate memory — Claude has a memory feature, ChatGPT has one — but these work by storing notes about you in a database and re-injecting them into the system prompt on later turns. They're external scaffolding, not model memory.

### The model itself is just one part of a larger system

The product you use — Claude on claude.ai, ChatGPT on chatgpt.com — is a *product wrapper* around a model. The wrapper does things the model doesn't:

- Maintains conversation state
- Routes requests to the right model size
- Applies safety filters (sometimes before the model sees your input, sometimes after)
- Runs tools on the model's behalf (web search, code execution, image generation)
- Tracks usage and billing
- Renders the UI

When people compare "Claude vs ChatGPT" they're often really comparing products, not models. The underlying model is one component. Two products using the same underlying model can feel very different because of the wrapper. (This becomes important when you use models via the API in Module 6.)

A useful mental model: think of the model as an engine and the product as a car. The engine matters enormously — a bad engine makes a bad car. But the steering, the interior, the brakes, the dashboard come from the product, not the engine. A great engine in a poor car still gives you a poor driving experience.

### Where does your text go physically?

This is worth pausing on because the physical reality gets glossed over in tech discourse.

When you send a message to Claude, depending on routing, it might be processed in a data centre in Northern Virginia, Oregon, Dublin, or several other locations. Those data centres are buildings the size of warehouses, filled with rows of servers, cooled by industrial air conditioning, drawing megawatts of power, with thousands of specialised chips (GPUs) doing trillions of arithmetic operations per second to produce your reply.

Each message you send has a physical cost. Energy gets consumed. Water gets used for cooling. Heat gets dumped. The carbon footprint of a single LLM query is small compared to, say, a Netflix stream, but it isn't zero, and the aggregate footprint of AI compute is growing fast enough that it's becoming a meaningful slice of global electricity demand. We'll come back to this in Module 5 and Module 12.

For now, just hold the picture: you typed a sentence, and a building full of machines whirred briefly to produce the reply.

---

## Lesson 1.3 — Tokens: how the model sees your text

When you type "strawberry" into an LLM, the model does NOT see "strawberry." It sees a sequence of numbers.

This isn't a metaphor or an oversimplification. It's literally what happens.

Before any neural network can process text, the text has to be turned into numbers, because neural networks only do arithmetic. The conversion process is called *tokenisation*. The pieces of text that get converted are called *tokens*.

A token is roughly a chunk of language. Sometimes a whole word. Sometimes part of a word. Sometimes punctuation. Sometimes a sequence of letters that doesn't even make a real word.

For example, GPT-4's tokeniser breaks "strawberry" into something like:

- `straw` (one token)
- `berry` (one token)

So the word "strawberry" is two tokens. Whereas "the" is one token. And "antidisestablishmentarianism" might be five or six tokens.

Each token has an ID — an integer — that points to it in a giant lookup table called the *vocabulary*. GPT-4's vocabulary has about 100,000 tokens. So `straw` might be token 12,345 and `berry` might be token 67,890.

When you send "strawberry" to the model, what actually arrives is `[12345, 67890]`. That's what the neural network processes.

### Why does this matter?

**It explains a famous failure mode.** People love to ask LLMs "how many r's are in 'strawberry'?" and laugh when the model says two. The reason the model is bad at this isn't that it's stupid. It's that the model doesn't see `s-t-r-a-w-b-e-r-r-y` as a sequence of letters. It sees `[12345, 67890]`. To count letters, it would need to somehow recover the spelling from the token IDs, which it learns to do unreliably from training data.

This is the kind of thing where a beginner's mental model ("the model reads my words") leads to confusion, and the actual model ("the model receives numerical token IDs") explains the behaviour.

**It explains why models charge by tokens, not words.** Every commercial LLM bills you per token, both in and out. A short word like "cat" is one token. A long word like "extracurricular" might be three or four. Code is often less efficient than English — symbols, indentation, and unusual identifiers can each be tokens. Other languages can be much less efficient: a sentence in Mandarin or Hindi often uses more tokens than the equivalent English sentence, because the tokenisers were trained predominantly on English text.

That last point has cost and access implications: non-English users effectively pay more per equivalent content. It's an example of a bias that's not in the model's "opinions" — it's baked into the engineering itself. The same word in two languages can cost different amounts of money to send. Worth remembering when people talk about AI as a globally accessible technology.

**It explains context window limits.** When you hear "Claude has a 200,000-token context window," that means the model can hold 200,000 tokens of conversation in its input at once. Roughly 150,000 English words, or 500 pages of a paperback. Past that, earlier content has to be dropped or summarised. The context window is measured in tokens because that's what the model actually processes.

### A quick demonstration you can do yourself

OpenAI publishes a tokeniser at platform.openai.com/tokenizer. You can paste any text in and see how it gets split. Try:

- Your name
- A sentence in another language
- Some code
- "supercalifragilisticexpialidocious"
- A single emoji

You'll see that tokenisation is messier than you'd expect. Spaces matter (`cat` and ` cat` — with leading space — are different tokens). Capitalisation matters. The same letter sequence can tokenise differently depending on what's around it.

### Where do these tokens come from?

The vocabulary isn't designed by hand. It's *learned* from a large corpus of text using an algorithm called Byte Pair Encoding (BPE) or variants. The algorithm starts with individual characters and progressively merges the most common pairs into single tokens. Common words like "the" end up as one token. Uncommon words get split into pieces. Rare characters (some emoji, some non-Latin scripts) might be multiple tokens each.

This is a pragmatic engineering choice — it lets the model handle any text, including words it has never seen, by breaking them into known sub-pieces. But it has consequences: the vocabulary reflects whatever was in the corpus used to build it, which has biases toward common languages and writing systems.

### The takeaway

When you talk to an LLM, your text gets converted into a sequence of integers before the model ever sees it. The model's "experience" of your message is fundamentally different from yours. Many of the model's apparent strengths (handling typos gracefully, working across languages) and weaknesses (counting letters, exact spelling) trace back to this tokenisation step.

If someone asks "but doesn't the model see the same text I do?" the honest answer is: no, it sees a coded version of the text, and most of the time the coding is good enough that you can pretend otherwise — but the cases where it isn't good enough are revealing.

---

## Lesson 1.4 — Training vs inference: the two completely different things

If you take only one technical distinction away from this module, make it this one.

There are two completely separate phases in the life of an LLM:

1. **Training.** Building the model. This is a massive, one-off (or occasionally repeated) computational process where the model's weights are adjusted by feeding it huge amounts of text and gradually making it better at predicting what comes next. It costs millions of dollars, takes weeks or months, and is done on enormous clusters of specialised hardware. The output of training is a file — sometimes hundreds of gigabytes — containing the model's weights.

2. **Inference.** Using the model. This is what happens every time you send a message. The pre-trained weights are loaded onto a GPU, your input is fed in, and the model produces output. Inference is fast (seconds), comparatively cheap (fractions of a penny per query, often), and happens billions of times per day across the world.

These are different in almost every way that matters: cost, time, hardware, who does it, when it happens, what it produces.

A cooking analogy: training is developing the recipe and writing the cookbook. Inference is using the cookbook to make a meal. The recipe-writing takes years and involves dozens of chefs experimenting. The meal-making takes thirty minutes and anyone can do it once they have the book.

### Why this distinction matters constantly

*"Why can't ChatGPT remember our conversation from last week?"* Because the model isn't being retrained on your conversations. Your chats don't change the weights. Unless the company explicitly trains a new version using your data (and the terms vary by company and product), your conversations leave no trace inside the model. They might be stored in a database for product purposes, but the model itself doesn't update from them.

*"Why does the model know about the 2022 World Cup but not yesterday's news?"* Because the model was trained on text up to a certain date — the *training cutoff* — and hasn't been retrained since. Anything that happened after the cutoff is genuinely outside the model's knowledge. Products may bolt on web search to compensate, but the underlying model itself is frozen.

*"Why is training so expensive but using the model is so cheap?"* Because training involves running the model through every example in a massive dataset, repeatedly, while adjusting billions of weights. Inference just runs the model forward once. The asymmetry is huge — training a frontier model might cost $100 million; running it for a query costs cents.

*"Can the model 'learn' during our conversation?"* In a meaningful sense, no. The weights don't change. What can happen is that the model uses information you give it within the context window — so if you tell it your name at the start of a chat, it can refer to it later. But that's working memory, not learning. Close the chat and the "learning" evaporates.

### The hidden third phase: fine-tuning

I lied slightly. There are actually two-and-a-half phases.

After the initial massive training (called *pre-training*) — which produces a model that can predict next tokens really well but isn't yet a helpful chatbot — there's a smaller training phase called *fine-tuning*. This is where the model is taught to be helpful, follow instructions, refuse harmful requests, adopt a particular conversational style, and so on.

Fine-tuning is much cheaper than pre-training (hours to days, not weeks) and uses much smaller, carefully curated datasets. It's where the "personality" of a chatbot gets installed. The same base model, fine-tuned differently, can become Claude or ChatGPT-flavoured or a customer service bot or a coding assistant.

We'll go deep on this in Module 4. For now, just know that "training" in popular discourse usually means the whole training pipeline — pre-training plus fine-tuning — even though they're technically distinct.

### Why journalists keep getting this wrong

You'll often read headlines like "ChatGPT learned to lie" or "the AI is teaching itself." Almost always, this is sloppy. The model isn't learning anything in real time. What's actually happened is one of:

- Researchers fine-tuned a new version with different behaviour
- The model's existing behaviour (which was always there) was discovered or measured for the first time
- A scaffolding system around the model (which CAN learn from interactions, in the sense of updating a database) did something new

The model itself — the weights — doesn't change after deployment. When you read "the AI learned X," translate to "researchers trained a new model that does X" and you'll almost always be more accurate.

### The takeaway

Training and inference are separate phases. The model is frozen between training rounds. Your conversations don't update it. The model's knowledge is fixed at its training cutoff. The cost asymmetry between training and inference shapes everything about how AI products are built and priced. And almost every headline that says "AI learned" actually means "researchers trained a new model."

Get this distinction clear and a lot of confused AI discourse suddenly resolves.

---

## Lesson 1.5 — The LLM family tree

Lots of LLMs exist. They differ in size, training data, fine-tuning, openness, cost, and capability. Knowing roughly who's who saves you from talking about "AI" as if it's one thing.

### The major players (as of mid-2026)

- **OpenAI** (US) — makes ChatGPT and the GPT model family. The original mass-market AI lab. Backed heavily by Microsoft. Models are closed-weight (you can't download them; you access them via API or product).
- **Anthropic** (US) — makes Claude. Founded by ex-OpenAI researchers. Heavy emphasis on safety research. Closed-weight. Backed by Amazon and Google.
- **Google DeepMind** (US/UK) — makes Gemini. Combination of two research labs Google merged. Massive resources. Closed-weight.
- **Meta** (US) — makes Llama. Notable for releasing the model weights publicly ("open-weight"), which has had enormous effects on the research ecosystem.
- **Mistral** (France) — open-weight models, European positioning, smaller but punchy.
- **DeepSeek, Qwen, others** (China) — Chinese labs producing increasingly competitive models, some open-weight.
- **xAI** (US) — Elon Musk's lab, makes Grok.

These labs broadly all use the same recipe: train a transformer on a huge text corpus, fine-tune for helpfulness, deploy via API and product. They differ in:

- **Scale.** Bigger models (more parameters, more training data, more compute) generally perform better.
- **Training data.** What text did they feed it? This affects what it knows and what biases it carries.
- **Fine-tuning approach.** How was it taught to behave? This affects personality, refusals, helpfulness.
- **Openness.** Closed-weight (OpenAI, Anthropic, Google) versus open-weight (Meta, Mistral). Open-weight means you can download and run them yourself; closed means you can only access them through the provider.
- **Safety posture.** How cautious is it? What does it refuse? How was it shaped?
- **Product wrapping.** What's around the model? Web search, code execution, memory, voice, image generation, agents.

### Closed vs open weights — why it matters

Closed-weight models live on the provider's servers. You send text, you get text back. You can't see inside. The provider controls updates, pricing, availability. If they shut down, your access goes.

Open-weight models can be downloaded and run on your own hardware (if it's powerful enough — for the biggest models, that means serious gear). You can fine-tune them for your own purposes. You don't depend on the provider continuing to exist. But the original training costs were still borne by whoever made them — open-weight doesn't mean "free to train," it means "the trained weights are released after training."

There's a parallel debate to open-source software here, but with extra complications. Even with the weights, you don't get the training data (mostly), you don't easily get the training code, and you can't really audit how the model came to be. "Open" in AI is a spectrum, and people argue fiercely about where each lab actually sits on it.

### What this means for you

When you're discussing "AI" in a university context, knowing that there are roughly five frontier labs (with several more close behind) and that they make subtly different choices is more useful than knowing which one is "the best." Performance leadership rotates every few months. What's stable is the structure: a small number of well-resourced labs making models, a larger number of companies using those models in products, an ecosystem of researchers studying their behaviour.

A useful sentence: "When we say 'AI,' which AI? Claude, Gemini, ChatGPT, Llama, and Mistral are all different products from different organisations with different choices. They share a family resemblance but the differences matter."

---

## Lesson 1.6 — Hallucination, lying, and the limits of metaphor

"Hallucination" is the most overused word in AI discourse. It also doesn't quite mean what most people think.

In the technical literature, hallucination refers to a model producing content that isn't supported by its inputs or by reality — confidently stating something that simply isn't true. A made-up citation. A non-existent court case. A fictional historical event presented as fact. A summary of a document that includes things the document doesn't say.

The word borrows from psychiatry, where a hallucination is a perception without a real external cause. The analogy is strained. Models don't perceive anything. The phenomenon is closer to *confabulation* — producing plausible-sounding output that fills in for missing information — but "hallucinate" stuck because it sounds more dramatic and is easier to say.

### What's actually going on, mechanically

The model is trained to predict the most likely next token. When it produces text on a topic it has good training data for, the predictions tend to align with reality, because reality was well-represented in the training set. When it produces text on a topic it has thin or contradictory data for, the predictions still feel confident — because the model has no native concept of "I'm not sure" — but they're effectively guesses. Sometimes the guesses are right. Sometimes they're plausible-sounding nonsense.

There is no internal "uncertainty meter" the model checks before speaking. It produces tokens that are likely given the context. Confidence in the output reflects the model's training, not the truth of the claim. A confident-sounding paragraph about a real topic and a confident-sounding paragraph about a fabricated topic come out of the same machinery.

### Why "lying" is the wrong word too

When a model produces false information, it isn't lying. Lying requires knowing the truth and choosing to misrepresent it. The model doesn't know the truth in any meaningful sense. It's producing text that pattern-matches to "answer to this question," and the answer happens to be wrong. There's no deception, because there's no intent.

This matters legally and ethically. Calling LLM output "lying" assigns agency that isn't there, and it lets the humans who deployed the system off the hook. The more accurate framing is: the system produced incorrect output, and the responsibility for that output sits with whoever deployed and represented the system.

### What models are reliably good and bad at

**Good at:** paraphrasing, summarising, translation (between major languages), writing in a given style, generating ideas, drafting structured content, explaining well-known concepts, working through well-known reasoning patterns.

**Bad at:** specific facts (especially numbers, dates, names of less-famous things), counting and arithmetic involving more than a few items, reasoning about things outside their training distribution, anything requiring up-to-date information, anything requiring genuine understanding of physical or social context the model can't observe.

The pattern: models are reliable where their training data was rich and the task is generative or transformative. Models are unreliable where they're effectively asked to retrieve specific facts from memory, especially obscure or recent ones.

### The honest way to talk about LLM errors

Instead of "the AI hallucinated," try: "the model produced unsupported content." Instead of "the AI lied," try: "the output was incorrect and the system gave no signal that it might be." Instead of "the AI doesn't know," try: "the model's training didn't include enough on this topic for reliable output."

These phrasings are less catchy but more accurate. They keep the agency where it belongs (with the people deploying and using the system) and they describe the phenomenon without anthropomorphising.

For a university audience, this precision will distinguish you from people who've read three Wired articles about AI. Saying "the model lacks reliable retrieval of specific facts and tends to produce plausible-sounding completions when its training is thin" is more useful than "AI hallucinates."

---

## Lesson 1.7 — The vocabulary: AI vs ML vs LLM vs generative AI

The terms get muddled constantly. Here they are, sorted out.

**Artificial Intelligence (AI).** The broadest term. The aspiration of building machines that do things requiring intelligence — language, perception, reasoning, planning, action. Coined in 1956. Has gone through multiple "AI winters" — periods of disillusionment after over-hyped advances. Today, "AI" usually means the current generation of statistical methods, but historically it has included rule-based systems, search algorithms, expert systems, and lots more. When a journalist says "AI," they almost always mean the LLM-and-friends generation, but the term technically covers much more.

**Machine Learning (ML).** A subset of AI. The approach where instead of programming a computer to do a task directly, you give it data and an algorithm that adjusts itself to perform the task. ML has been the dominant approach in AI for decades and includes everything from spam filters (1990s) to recommendation systems (2000s) to image recognition (2010s) to LLMs (2020s). Most contemporary "AI" is ML.

**Deep Learning.** A subset of ML. The approach where the algorithm is a neural network with many layers (hence "deep"). Took off in the 2010s when it turned out that bigger networks plus more data plus more compute solved a lot of problems that had been stuck for decades. Powers image recognition, speech recognition, translation, and the whole generative AI wave.

**Generative AI.** A category of AI systems that produce content — text, images, audio, video, code — rather than just classifying or predicting. LLMs are generative. Image generators (DALL-E, Midjourney, Stable Diffusion) are generative. Voice cloning tools are generative. The category is defined by what the system outputs, not how it works.

**Large Language Model (LLM).** A specific kind of generative AI: a deep neural network trained on a huge amount of text to predict tokens, which produces models capable of generating fluent text. "Large" historically meant billions of parameters; today the biggest are over a trillion. The architecture is almost always a transformer (Module 3).

**Foundation Model.** An umbrella term for large pre-trained models that can be adapted to many tasks. LLMs are foundation models. So are large vision models. The point of the term is to emphasise that these models serve as *foundations* on which many downstream applications are built.

**Frontier Model.** A loose term for the most capable models at any given time. There's no formal definition. Frontier today means models like GPT-4-class, Claude Opus-class, Gemini Ultra-class. Frontier moves.

**Agent.** A system built around an LLM that can take actions in the world — call tools, browse the web, write and run code, send emails, control browsers. The model still just predicts tokens, but the surrounding software interprets those tokens as commands to take actions. Agents are early and unreliable, but they're where a lot of current development is focused.

**RAG (Retrieval-Augmented Generation).** A technique where, before the model answers a question, relevant documents are looked up and inserted into the context. Lets the model "know" things outside its training. Common in enterprise deployments and any chatbot that's supposed to be grounded in specific documentation.

**Multimodal.** A model that handles more than one type of input or output — text plus images, or text plus audio, or all of the above. Most frontier models are multimodal now.

### The mapping you need

If someone says "AI is taking over knowledge work," they almost certainly mean LLMs and generative AI. If someone says "we use AI in our recommendation engine," they probably mean a non-generative ML system, which has been around for decades. If someone says "ML model," they could mean almost anything. If someone says "we're using a foundation model," they mean an LLM or equivalent.

Knowing where in the hierarchy any given system sits — and not letting "AI" function as a catch-all that obscures what's actually being used — is the kind of vocabulary precision that signals you've actually engaged with the field rather than the discourse about the field.

---

## End of Module 1 — what you should be able to do

By the end of this module you should be able to:

- Explain to a stranger what an LLM does without using metaphors that mislead
- Trace what happens when someone sends a message to a chatbot, from the interface to the data centre and back
- Define a token and explain why it matters
- Distinguish training from inference and explain why the distinction shapes everything
- Name the major LLM labs and what closed-weight vs open-weight means
- Talk about hallucination in technically accurate terms
- Use AI / ML / LLM / generative AI correctly

If you can hold a fifteen-minute conversation with a sceptical academic using these concepts, Module 1 has done its job.

### Cross-cutting threads touched in this module

- **Abstraction** — we've already met it: the chat interface hides the server, the server hides the model, the model hides the maths. Every layer of computing works this way.
- **Representation/encoding** — tokenisation is the first time we see text turned into numbers. This same trick (encode meaning as numbers) recurs at every layer below.
- **State and memory** — the model is stateless; the product fakes continuity. The distinction between "the system remembers" and "the system has memory" matters constantly.
- **Protocols and contracts** — HTTP, the chat format, system prompts — every layer has its own agreement about how messages are structured.

### Where Module 2 picks up

Module 2 — *How LLMs actually predict (mechanics without maths)* — takes the "it predicts the next token" claim from this module and unpacks it. What does "predict" mean here? What's a probability distribution over a vocabulary? Why do you get different answers when you ask the same question twice? Why are models bad at counting and good at writing? We get one layer closer to the machinery, but we still don't touch the linear algebra.
