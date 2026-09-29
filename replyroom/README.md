# Replyroom — Hinglish project guide

Replyroom ek small **Next.js monolith** hai: frontend aur backend API ek hi project aur Node.js process mein run hote hain. User PDF upload karta hai, situation/message share karta hai, aur app relevant book passages ke basis par reply suggest karta hai.

Mistral aur Pinecone external services hain. Monolith ka matlab yahan application ka UI aur backend saath hain; model aur vector database locally run nahi hote.

## 1. Project start kaise karein

Node.js **22.16+** chahiye; project 22.17.1 par test hua tha. Terminal mein `replyroom` folder open karo:

```sh
npm install
cp .env.example .env.local
```

`.env.local` mein apni keys aur existing Pinecone index ka naam fill karo:

```dotenv
MISTRALAI_API_KEY=your_mistral_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=chill
PINECONE_NAMESPACE=replyroom-v1
MISTRAL_CHAT_MODEL=mistral-small-latest
```

Pinecone dense index mein **1024 dimensions** honi chahiye, kyunki app `mistral-embed` use karta hai. Cosine metric is setup ke liye suitable choice hai. App existing index use karta hai; index khud create nahi karta.

```sh
npm run dev
```

Project folder mein diye gaye `48laws.pdf` aur `artofseduction.pdf` ko browser mein dobara upload karne ki zaroorat nahi. Ek baar terminal se index karo:

```sh
npm run index:pdfs
```

Yeh project folder ke PDFs read karke same ingestion pipeline se index karta hai. Dobara run karne par already-indexed files skip hoti hain. Specific PDF paths bhi de sakte ho: `npm run index:pdfs -- ./book.pdf`.

Uske baad http://127.0.0.1:3000 kholo; bookshelf mein indexed books milengi aur seedha chat kar sakte ho. **Add a PDF** additional documents ke liye optional hai. App start hone par paid ingestion automatically repeat nahi hoti.

Keys change karne ke baad server restart karo. `.env.local` Git se ignored hai. `replyroom-v1` namespace app ke records ko original RAG demo ke records se alag rakhta hai.

## 2. Folder structure

```text
replyroom/
├── app/
│   ├── layout.js               Page ka shared HTML wrapper
│   ├── page.js                 Bookshelf, PDF upload aur chat UI
│   ├── globals.css             Complete responsive styling
│   └── api/
│       ├── documents/route.js  PDF list aur upload endpoints
│       └── chat/route.js       Message validation aur answer endpoint
├── lib/
│   ├── ingest.js               PDF → chunks → vectors → storage
│   ├── rag.js                  Question → retrieval → answer
│   ├── search.js               BM25, rank fusion, excerpt verification
│   ├── providers.js            Mistral aur Pinecone integration
│   ├── store.js                Local library read/write
│   └── http.js                 Origin check aur error responses
├── tests/
│   ├── search.test.js          Search helper tests
│   └── rag.test.js             Pipeline tests with fake providers
├── scripts/
│   └── smoke.mjs               Running server ke HTTP checks
├── .env.example                Required settings ka template
├── .gitignore                  Git exclusions
├── .prettierrc.json            Formatting rules
├── .prettierignore             Formatter exclusions
├── next.config.mjs             Next.js server configuration
├── package.json                Dependencies aur commands
├── package-lock.json           Exact dependency versions
└── README.md                   Yeh guide
```

## 3. App kholne par kya hota hai

1. Next.js `app/layout.js` ka HTML wrapper aur `app/page.js` ki screen render karta hai.
2. Browser mein `page.js` ka `refresh()` function `GET /api/documents` call karta hai.
3. `app/api/documents/route.js` local library se documents aur configuration status leta hai.
4. UI bookshelf dikhata hai. Keys missing hain toh setup message dikhata hai; secret values browser mein nahi bhejta.

## 4. PDF upload ka complete flow

```text
Browser: app/page.js → upload()
              │
              ▼
POST /api/documents → file validation
              │
              ▼
lib/ingest.js → ingest(buffer, name)
              │
              ├── PDF bytes ka SHA-256 hash → stable document ID
              ├── Already uploaded? → existing document return
              ├── PDFParse → har page ka text
              ├── Whitespace cleanup
              ├── Recursive splitting → 1200 characters, 200 overlap
              ├── Filename + page number + chunk ID attach
              ├── 32 chunks ke batches → Mistral embeddings
              ├── Pinecone upsert → vector + metadata
              └── Local library commit → documents + text chunks
              │
              ▼
Browser: bookshelf refresh → PDF ready
```

Har chunk ke paas yeh information hoti hai:

```js
{
  id: 'documentHash:4:0',
  documentId: 'documentHash',
  name: 'Communication.pdf',
  page: 4,
  text: 'Is page ka ek text passage...'
}
```

Pinecone record mein `id`, `values` (numeric embedding) aur `metadata` (document ID, name, page, text) jaate hain. Local `.data/library.json` mein document list aur chunks save hote hain; raw PDF retain nahi hota.

Pinecone **meaning-based search** ke liye hai. Local text corpus **keyword search** ke liye hai. Dono branches query time par combine hoti hain.

Same PDF bytes se same IDs bante hain. Successfully indexed file dobara upload ho toh existing result milta hai. Upload beech mein fail ho toh retry same vector IDs update kar sakta hai. Local commit saare vector writes ke baad hota hai, taaki incomplete uploads search mein use na hon.

## 5. Question se answer tak ka complete flow

```text
Browser: situation + recent messages + optional document selection
              │
              ▼
POST /api/chat → validation + last 6 messages
              │
              ▼
lib/rag.js → answerQuestion()
              │
              ├── Library aur selected document check
              ├── Mistral → standalone English search query
              ├── Mistral → query embedding
              │
              ├── Pinecone vector search → up to 16 matches
              └── Local BM25 search → up to 16 matches
                              │
                              ▼
                    Rank fusion → up to 12 candidates
                              │
                              ▼
                    Mistral rerank + useful excerpt selection
                              │
                              ▼
                    Verify excerpts → up to 5 sources
                              │
                              ▼
                    Original question + sources + history
                    + language instructions → Mistral answer
                              │
                              ▼
                    Answer + numbered page sources → UI
```

Document picker use karne par Pinecone mein metadata filter lagta hai aur local keyword corpus bhi usi document tak limited hota hai. Vector results ko locally committed chunks ke against bhi check karte hain.

**Query rewriting:** `"usko kya bolu?"` jaisi follow-up query mein history se context mil sakta hai. Model ko missing facts invent na karne ki instruction di hai.

**Hybrid retrieval:** Vector search meaning dekhta hai; BM25 matching words ko score karta hai. Current implementation inhe sequence mein run karti hai, phir results combine karti hai.

**Rank fusion:** Dono result lists ki ranking combine hoti hai. Jo passage dono lists mein aaye, usko combined score milta hai. Different search scores ko directly compare nahi karte.

**Reranking aur compression:** Chat model candidates ko dobara evaluate karta hai aur useful exact excerpts select karta hai. Dedicated cross-encoder model use nahi hua. Prompt excerpt ke liye 20–900 characters maangta hai; code minimum length, source membership aur exact substring check karta hai, maximum length ka separate check nahi hai.

**Citations:** Har verified excerpt ko `[1]`, `[2]` jaisa number milta hai. UI source filename, PDF page number aur excerpt dikhata hai. Model ka unknown numeric citation marker remove hota hai. PDF page index book ke printed page number se different ho sakta hai.

**Evidence missing:** Relevant sources na milein toh prompt model ko clearly batane ko kehta hai. General suggestion de sakta hai, lekin usse PDF-backed answer nahi bolna chahiye. UI bhi general-guidance label dikhata hai. Excerpt verification har generated claim ke correct hone ki guarantee nahi hai.

## 6. Hinglish kaise handle hoti hai

```text
Original message: "Woh space maang rahi hai, kya reply karu?"
                           │
                           ├── Retrieval query English mein rewrite ho sakti hai
                           │
                           └── Final answer ko original message bhi milta hai
                                      │
                                      ▼
                               Roman Hinglish reply
```

`lib/rag.js` ke `ANSWER_INSTRUCTIONS` mein latest user message ki language aur script match karne ka rule hai. English → English, Roman Hinglish → Roman Hinglish, Devanagari Hindi → Devanagari Hindi. User explicitly doosri language maange toh woh preference follow karne ko kaha hai.

Iske liye separate language-detection library nahi lagayi. Yeh model instruction hai; actual language quality live API calls ke saath evaluate karni hogi.

## 7. Ek-ek file mein kya kiya hai

### 01. `app/layout.js`

App ka shared outer wrapper banaya: `<html>`, `<body>`, page title aur description. Yahin `globals.css` import hoti hai. Is file mein retrieval logic nahi hai.

### 02. `app/page.js`

Poora interactive frontend banaya. `'use client'` ki wajah se React state aur event handlers browser mein chal sakte hain.

- `docs`, `config`, `selected`: bookshelf, setup readiness aur selected PDF.
- `messages`, `draft`: current chat aur input text.
- `busy`, `uploading`, `error`, `notice`: loading, errors aur success feedback.
- `refresh()`: backend se latest document list laata hai.
- `upload()`: selected PDF ko `FormData` mein backend bhejta hai.
- `send()`: question, previous messages aur selected document ID bhejta hai; answer state mein add karta hai.
- JSX: sidebar, sample questions, chat bubbles, source details aur message composer render karta hai.

Failed chat request par draft restore hota hai. Conversation React memory mein hai; browser refresh par reset ho jaati hai.

### 03. `app/globals.css`

Sidebar, bookshelf, welcome section, chat bubbles, source cards, alerts aur composer ka design likha. Desktop/mobile breakpoints, focus indicators aur reduced-motion rule bhi hain. Ab CSS selectors aur properties expanded format mein hain taaki edit karna easy ho.

### 04. `app/api/documents/route.js`

`/api/documents` ke do handlers hain:

- `GET`: stored documents aur missing configuration keys ke names return karta hai.
- `POST`: origin, file presence, extension, size aur PDF signature check karke `ingest()` call karta hai.

Filename clean hota hai. File limit 25 MB hai. `runtime = 'nodejs'` server-side PDF parsing ke liye hai. `maxDuration = 300` deployment platform ke liye duration setting hai; yeh background job system nahi hai.

### 05. `app/api/chat/route.js`

`POST /api/chat` ke request body ko validate kiya. Message nonempty aur maximum 4,000 characters hona chahiye. Optional document ID hash format mein check hota hai.

History mein sirf user/assistant messages retain hote hain, last 6 entries tak, har entry maximum 4,000 characters. Valid input `answerQuestion()` ko jaata hai aur uska response browser ko return hota hai.

### 06. `lib/ingest.js`

Original `stage1.js` wale kaam ka app-oriented version hai.

- `ingest()`: PDF hash banata hai aur same PDF ke concurrent uploads ko ek pending promise se handle karta hai.
- `ingestDocument()`: existing document check, parsing, cleanup, chunking, embeddings, Pinecone upsert aur local commit karta hai.
- `parser.destroy()`: parsing complete ho ya fail, parser resources release karta hai.

No readable text mile toh OCR ki need batata hai. 12,000 se zyada chunks par PDF split karne ko kehta hai. Chunking recursive character-based hai, semantic chunking nahi.

### 07. `lib/rag.js`

Original `stage2.js` wale kaam ka advanced app version hai.

- `ANSWER_INSTRUCTIONS`: language matching, answer style, source usage, insufficient evidence aur respectful communication ke rules.
- `answerQuestion()`: query rewrite se final response tak complete orchestration.
- Optional `services` argument: tests fake providers inject kar sakein; normal API route real services use karta hai.

Output `{ answer, sources, grounded }` hai. `grounded` ka meaning yahan verified excerpts available hain; yeh model answer ki perfect factual correctness ka certificate nahi hai.

### 08. `lib/search.js`

External API call ke bina chalne wale search helpers likhe:

- `tokens()`: lowercase word tokens banata hai aur common English stop words hataata hai.
- `keywordSearch()`: local chunks ko BM25 se rank karta hai.
- `fuse()`: reciprocal rank fusion se multiple ranked lists combine karta hai.
- `verifiedEvidence()`: unknown IDs, duplicate selections, too-short excerpts aur source mein absent text reject karta hai.

### 09. `lib/providers.js`

Mistral aur Pinecone se baat karne ka code centralize kiya:

- `AppError`: readable message aur HTTP status waala application error.
- `configuration()`: required settings missing hain ya nahi batata hai.
- `requireConfiguration()`: incomplete configuration par provider call rokta hai.
- `vectorIndex()`: configured index aur dedicated namespace ka Pinecone handle deta hai.
- `mistral()`: HTTP request, 90-second per-request timeout aur 429/5xx responses par limited retries.
- `embed()`: embeddings fetch karke count aur 1024-dimension shape check karta hai.
- `chat()`: text ya JSON response maangta hai aur expected response shape parse karta hai.

API keys server-side environment se aati hain, frontend se nahi.

### 10. `lib/store.js`

Local `.data/library.json` ko manage kiya:

- `readLibrary()`: saved JSON read karta hai; file absent ho toh empty library return karta hai.
- `commitDocument()`: document/chunks update karta hai, temporary file likhta hai aur rename karke publish karta hai.
- `tail`: writes ko same process ke andar serial order mein rakhta hai.

Yeh single-process storage design hai. Multiple independent server instances ke liye shared database aur cross-process coordination chahiye hogi.

### 11. `lib/http.js`

API handlers ka common code:

- `checkOrigin()`: agar browser origin header available hai aur request URL ke origin se different hai, request reject hoti hai.
- `errorResponse()`: known application errors readable form mein return karta hai; unexpected failures generic response dete hain.

Origin check authentication nahi hai. App currently local, single-user use ke liye hai.

### 12. `tests/search.test.js`

BM25 relevant result laata hai, fusion duplicate IDs combine karta hai, aur excerpt verification invented text reject karti hai—yeh automated tests cover karte hain.

### 13. `tests/rag.test.js`

Fake Mistral/Pinecone services se test kiya ki original Hinglish message final generation tak pahunchta hai, document filter apply hota hai, verified page sources pass hote hain, unknown citations remove hote hain, empty evidence handle hota hai aur unknown document reject hota hai.

Yeh real model ki Hinglish fluency test nahi karta; uske liye live evaluation chahiye.

### 14. `scripts/smoke.mjs`

Already running app ko HTTP requests bhejta hai. Homepage, library response, empty-message validation, cross-origin rejection aur fake-PDF rejection check karta hai. Real provider calls ya real document upload nahi karta.

### 15. `next.config.mjs`

`pdf-parse` aur Pinecone SDK ko `serverExternalPackages` mein rakha, taaki Next.js inhe server par external Node packages ki tarah load kare.

### 16. `package.json`

App ka naam, ES module setting, dependencies aur run commands define kiye. Formatting maintain karne ke liye Prettier development dependency aur format commands add kiye.

### 17. `package-lock.json`

npm-generated exact dependency tree hai. Isse reproducible installs milte hain. Is file ko manually edit/format nahi karna; dependency changes par npm update karta hai.

### 18. `.env.example`

API keys, index, namespace aur chat model settings ka non-secret template. Iski copy `.env.local` mein actual values ke saath use hoti hai.

### 19. `.gitignore`

Dependencies, build output, local extracted data, actual env files aur logs Git se exclude kiye. `.env.example` track ho sakti hai.

### 20. `.prettierrc.json`

Consistent formatting rules: 2-space indentation, 90-character target line width, single quotes, semicolons aur trailing commas. Long strings automatically break nahi hoti, lekin objects/JSX/CSS readable layout mein format hote hain.

### 21. `.prettierignore`

Generated directories, extracted data, env files aur lockfile ko formatter se exclude kiya.

### 22. `README.md`

Setup, complete request flow, file-by-file explanation, storage decisions aur verification commands isi document mein hain.

### 23. `scripts/index-pdfs.mjs`

Project folder ke PDFs ya command-line se diye gaye paths directly index karta hai. Pehle configured Pinecone index ki dimensions aur Mistral embeddings check karta hai, phir `ingest()` reuse karta hai. API keys `.env.local` se load hoti hain. Secrets log nahi hote.

### 24. `scripts/check-providers.mjs`

Available Pinecone indexes ke names/dimensions aur Mistral embedding access verify karta hai. Troubleshooting ke liye `node --env-file=.env.local scripts/check-providers.mjs` run kar sakte ho.

### 25. `scripts/check-live-chat.mjs`

Running app ko real Hinglish question bhejkar configured providers ke saath answer aur citations check karta hai. Dono PDFs indexed honi chahiye. Run: `node scripts/check-live-chat.mjs`. Yeh live API usage karta hai; automated unit tests ki tarah mocked nahi hai.

### 26. `scripts/check-chat-access.mjs`

Mistral chat access ka tiny diagnostic request bhejta hai. Sirf HTTP status aur provider error code/message print hote hain; API key nahi. Run: `node --env-file=.env.local scripts/check-chat-access.mjs`. Embeddings successful hone ke baad bhi chat endpoint ka rate limit alag hit ho sakta hai.

## 8. Generated/local files

| Path                 | Kaise banta hai          | Purpose                                 |
| -------------------- | ------------------------ | --------------------------------------- |
| `node_modules/`      | `npm install`            | Third-party dependencies                |
| `.next/`             | Next.js dev/build        | Generated build output                  |
| `.env.local`         | Template se local copy   | Actual API configuration                |
| `.data/library.json` | Successful PDF ingestion | Document list aur keyword-search corpus |

In generated directories ki individual files manually edit nahi karni. Local corpus aur configured Pinecone namespace ko saath maintain karo; app ki hybrid search dono use karti hai.

## 9. Commands aur verification

```sh
# Development server
npm run dev

# Project files ki consistent formatting
npm run format

# Formatting check; files change nahi hoti
npm run format:check

# Automated tests; provider keys ki zaroorat nahi
npm test

# Production build
npm run build

# Production server; build ke baad
npm run start

# Doosre terminal mein, server running ho tab
node scripts/smoke.mjs
```

Live test ke liye English aur Hinglish mein same question, follow-up question, unrelated question aur selected-document question try karo. Reply language, citations aur missing-evidence behaviour inspect karo. Same PDF twice upload karke duplicate handling bhi check kar sakte ho.

## 10. Current scope aur limits

- Text PDFs supported hain. OCR, image understanding, automatic heading detection aur table-aware parsing implement nahi hue.
- Large PDF indexing minutes le sakti hai aur provider charges ho sakte hain. Background queue/durable job recovery nahi hai; failed upload retry karo.
- Pinecone vectors newly uploaded hone ke baad visible hone mein thoda delay aa sakta hai. Local keyword corpus commit ke baad ready hai.
- Single process aur persistent local disk chahiye. Ephemeral serverless storage/multiple replicas ke liye storage design change karna hoga.
- App `127.0.0.1` par bind hota hai. Login aur per-user authorization abhi nahi hain.
- PDF text Mistral ko embeddings ke liye, Pinecone ko storage ke liye, aur selected passages Mistral ko answers ke liye jaate hain.
- Book ke statements author perspectives hain; kisi particular person ke thoughts ya sabhi women ke behaviour ka proof nahi.

## 11. Code padhne ka suggested order

`app/page.js` → `app/api/documents/route.js` → `lib/ingest.js` → `lib/providers.js` → `lib/store.js` → `app/api/chat/route.js` → `lib/rag.js` → `lib/search.js` → remaining helpers, config aur tests.

Is order mein pehle user action samajh aata hai, phir upload pipeline, phir answer pipeline.

## References

- [Next.js route handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Pinecone vectors SDK](https://sdk.pinecone.io/typescript/documents/data-operations_working-with-vectors.html)
- [Mistral embeddings](https://docs.mistral.ai/api/endpoint/embeddings)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)

## Mistral chat par zero request limit

Agar provider header `x-ratelimit-limit-req-minute: 0` return kare, configured model ke liye currently allowed request capacity zero hai. App is case mein retries rokta hai aur account limits check karne ka message deta hai. Limit zero rehne tak cooldown akela issue solve nahi karega. Embedding access aur chat access alag ho sakte hain; stored books dobara index nahi karni.

[Mistral Admin → API Limits](https://admin.mistral.ai/plateforme/limits) mein configured chat model ka access/limit inspect karo. Exact account restriction dashboard ya Mistral support se confirm hogi; app billing ya account access automatically change nahi karta.

`tests/providers.test.js` mocked zero-capacity response se verify karta hai ki sirf ek request hoti hai aur account-action message return hota hai.

## Gemini chat configuration

Current `.env.local` setup mein `CHAT_PROVIDER=gemini` aur `GEMINI_CHAT_MODEL=gemini-2.5-flash` use hote hain. `GEMINI_API_KEY` Google AI Studio ki key hai. Query rewriting, reranking/compression aur final answer ab Gemini `generateContent` se aate hain. Existing diagrams mein chat steps ke Mistral labels ko selected chat provider samjho.

Document aur query embeddings ab bhi **Mistral `mistral-embed`** se bante hain, isliye stored Pinecone vectors compatible hain aur PDF re-indexing nahi chahiye. Mistral/Pinecone keys retain karo. Gemini ko recent conversation aur selected document passages processing ke liye bheje jaate hain.

`lib/providers.js` common `chat()` interface se provider select karta hai. Gemini adapter system instructions, user/model role mapping aur JSON responses handle karta hai. `scripts/check-gemini.mjs` model access aur actual JSON generation verify karta hai: `node --env-file=.env.local scripts/check-gemini.mjs`. Is check mein live provider usage hota hai. Model listing successful hone ka matlab generation quota available hona guaranteed nahi hai.
