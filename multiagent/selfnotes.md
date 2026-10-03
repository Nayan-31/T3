Major multi-Agent Patterns

1. Sequential
2. Routing
3. Parallel
4. Supervisor / Manager-Worker
5. Handoff
6. Hierarchical
7. Evaluator–Optimizer
8. Debate / Voting
9. Round Robin
10. Swarm
11. Blackboard / Shared Workspace
12. Hybrid

Sequential Pattern : Sequential pattern me agents ek ke baad ek kaam karte hain, matlab pehla agent apna task complete karega aur uska output next agent ka input ban jayega. Example ke liye, agar hume kisi topic par final report banani hai, toh pehle Research Agent information collect karega, phir uski findings Writer Agent ko jayengi jo report draft karega, aur uske baad Reviewer Agent us report ko check karke final output dega. Is pattern me har agent previous agent ke result par depend karta hai, isliye tasks parallel nahi chalte, balki ek fixed sequence follow karte hain. Iska benefit ye hai ki workflow easy to understand hota hai aur har step controlled hota hai, lekin drawback ye hai ki agar pehla agent slow ho ya galat output de, toh uska effect aage ke agents par bhi pad sakta hai


Routing Pattern : Routing Pattern me ek router ya manager agent pehle user ki request ko samajhta hai aur decide karta hai ki ye task kis specialized agent ko bhejna chahiye. Example ke liye, agar user coding ka question poochta hai toh request Coding Agent ko jayegi, agar billing issue hai toh Billing Agent ko, aur agar research related query hai toh Research Agent ko. Yaha saare agents ek saath kaam nahi karte; router sirf relevant agent choose karta hai. Is pattern ka benefit ye hai ki har task us agent ke paas jata hai jo usme specialized hai, isliye system zyada organized aur efficient hota hai. Drawback ye hai ki agar router ne galat agent choose kar liya, toh poora response weak ya irrelevant ho sakta hai.


parallel Pattern : Parallel Pattern me ek task ko multiple independent subtasks me divide karke different agents ko ek hi time par de diya jata hai. Example ke liye, agar AWS, Azure aur GCP compare karna ho, toh ek agent AWS research karega, doosra Azure aur teesra GCP. Teeno agents simultaneously kaam karenge, aur end me ek Aggregator Agent un sabke results ko combine karke final answer dega. Is pattern ka main benefit speed aur wider coverage hai, kyunki multiple agents ek saath kaam karte hain. Drawback ye hai ki multiple agents run hone ki wajah se cost zyada ho sakti hai, aur agar subtasks actually independent na ho toh parallel approach unnecessary ho sakti hai.


Supervisor / Manager-Worker Pattern :

                    User
                      ↓
                 Supervisor
               /      |       \
              ↓       ↓        ↓
         Worker A Worker B Worker C
              \       |       /
               \      |      /
                  Supervisor
                      ↓
                   Answer
                   
 Supervisor / Manager-Worker Pattern me ek main Supervisor Agent hota hai jo poore task ko samajhta hai, usse chhote-chhote subtasks me divide karta hai, aur phir un subtasks ko alag-alag Worker Agents ko assign karta hai. Example ke liye, agar ek complete web app banana ho, toh Supervisor ek worker ko frontend, doosre ko backend aur teesre ko testing ka kaam de sakta hai. Workers apna kaam complete karke result supervisor ko wapas bhejte hain, aur supervisor un sab results ko check, coordinate aur combine karke final output deta hai. Is pattern ka benefit ye hai ki complex tasks ko organized way me handle kiya ja sakta hai aur har worker apni specialization par focus kar sakta hai. Drawback ye hai ki supervisor par coordination ka extra load hota hai, aur agar supervisor galat planning ya task assignment kare toh poora workflow affect ho sakta hai.


Hands-Off Pattern : Handoff Pattern me ek agent apna kaam complete karne ke baad task ko next suitable agent ko transfer karta hai, usually apne result aur important context ke saath. Example ke liye, Research Agent pehle information collect karega, phir wahi findings Writing Agent ko handoff karega, aur Writing Agent draft complete karke Reviewer Agent ko dega. Is pattern me main idea ye hai ki responsibility ek agent se doosre agent ko move hoti rehti hai as the task progresses. Iska benefit ye hai ki har stage specialized agent handle kar sakta hai aur workflow naturally forward move karta hai. Drawback ye hai ki agar handoff ke time important context miss ho gaya ya task galat agent ko transfer ho gaya, toh next agent incomplete ya wrong information par kaam kar sakta hai.


Hierarchical Pattern : 

                CEO Agent
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
Engineering Manager       Research Manager
        ↓                       ↓
   ┌────┴────┐              ┌───┴────┐
Backend   Frontend       Web      Data
Agent      Agent         Agent     Agent

Hierarchical Pattern me agents ek hierarchy ya levels me organized hote hain, bilkul company structure ki tarah. Top level par ek main agent hota hai jo high-level task samajhta hai aur usse neeche ke manager agents ko divide karta hai; phir manager agents apne tasks ko aur chhote subtasks me todkar worker agents ko assign kar sakte hain. Example ke liye, ek software project me top agent poore project ko manage karega, ek manager frontend team ko, doosra backend team ko, aur unke neeche individual worker agents specific coding tasks karenge. Is pattern ka benefit ye hai ki bahut large aur complex tasks ko structured way me manage kiya ja sakta hai. Drawback ye hai ki hierarchy zyada deep ho jaaye toh communication slow ho sakti hai, extra coordination cost badh sakti hai, aur upper-level agent ki galti neeche ke multiple agents ko affect kar sakti hai


Evaluator–Optimizer Pattern : 

Generator
 ↓
Output
 ↓
Evaluator
 ↓
Pass?
 ↙    ↘
No     Yes
↓       ↓
Feedback Final
↓
Generator

Evaluator–Optimizer Pattern me ek agent pehle solution ya output banata hai, aur doosra Evaluator Agent us output ko check karta hai ki usme kya problems, mistakes ya improvement areas hain. Phir feedback wapas Optimizer ya Generator Agent ko diya jata hai, jo output ko improve karta hai. Ye cycle tab tak repeat ho sakti hai jab tak result required quality tak na pahunch jaye. Example ke liye, ek Coding Agent code likhta hai, Evaluator Agent bugs aur performance issues identify karta hai, aur Coding Agent feedback ke basis par code improve karta hai. Is pattern ka benefit ye hai ki output ki quality continuously improve hoti hai. Drawback ye hai ki multiple review-improvement cycles ki wajah se time aur token/API cost badh sakti hai.


Debate Pattern : Debate Pattern me multiple agents same problem ko independently analyze karte hain aur apne-apne reasoning ya viewpoints dete hain. Example ke liye, agar question ho ki monolith better hai ya microservices, toh ek agent monolith ke favour me reason kar sakta hai, doosra microservices ke favour me, aur teesra dono ke trade-offs analyze kar sakta hai. Uske baad ek Judge ya Reviewer Agent sabke arguments, evidence aur assumptions compare karke final answer banata hai. Is pattern ka benefit ye hai ki ek hi problem ko multiple angles se dekha ja sakta hai aur hidden issues pakadne ke chances badhte hain. Drawback ye hai ki multiple agents run hone se cost badh sakti hai, aur sirf majority agents ka same answer dena correctness ki guarantee nahi hoti, isliye final decision reasoning aur evidence dekhkar karna chahiye.


Voting Pattern : Voting Pattern me multiple agents same problem ka answer independently dete hain, aur phir unke answers me se majority vote ke basis par final result choose kiya jata hai. Example ke liye, agar 5 agents kisi classification task par kaam kar rahe hain aur 3 agents “Spam” bolte hain while 2 agents “Not Spam”, toh final output “Spam” select kiya ja sakta hai. Is pattern ka benefit ye hai ki ek single agent ki mistake ka impact kam ho sakta hai aur simple decision tasks me robustness improve ho sakti hai. Drawback ye hai ki majority hamesha correct ho ye zaroori nahi, kyunki multiple agents same wrong assumption ya same bias follow kar sakte hain, aur extra agents ki wajah se cost bhi badh sakti hai.


Round Robin Pattern : Round Robin Pattern me task ya requests ko agents ke beech ek fixed turn-by-turn order me distribute kiya jata hai. Example ke liye, agar 3 agents hain toh pehli request Agent 1 ko, doosri Agent 2 ko, teesri Agent 3 ko, aur fourth request fir se Agent 1 ko jayegi. Is pattern ka main purpose workload ko evenly distribute karna hota hai, especially jab agents similar capability rakhte hain. Iska benefit ye hai ki load balance simple aur predictable rehta hai. Drawback ye hai ki system usually ye consider nahi karta ki kaunsa agent currently busy hai ya kaunsa agent particular task ke liye best suited hai, isliye kabhi-kabhi inefficient assignment ho sakta hai.


Swarm Pattern : Swarm Pattern me multiple agents ek team ki tarah kaam karte hain aur control dynamically ek agent se doosre agent ko transfer ho sakta hai. Matlab pehle se fixed sequence zaroori nahi hota. Jo agent current situation ke hisaab se decide kare ki next task kisi aur specialized agent ko dena chahiye, wo control us agent ko handoff kar sakta hai. Example ke liye, Support Agent user ki query handle kar raha hai, beech me usse lage ki issue billing ka hai toh wo Billing Agent ko control de dega; Billing Agent agar technical issue detect kare toh Technical Agent ko transfer kar sakta hai. Is pattern ka benefit flexibility hai, kyunki routing runtime par dynamically hoti hai. Drawback ye hai ki agar handoff rules clear na ho toh agents baar-baar ek doosre ko control de sakte hain, loop ban sakta hai, ya workflow unpredictable ho sakta hai.


Blackboard / Shared Workspace Pattern : Blackboard / Shared Workspace Pattern me multiple agents ek common shared place par information read aur write karte hain, bilkul ek common board ki tarah. Example ke liye, Research Agent important findings shared workspace me likhega, Coding Agent wahi findings read karke implementation karega, aur Reviewer Agent usi workspace me bugs ya feedback add karega. Is pattern me agents ko har baar directly ek doosre ko message bhejna zaroori nahi hota, kyunki sab ek common state ya shared memory ke through coordinate kar sakte hain. Iska benefit ye hai ki collaboration easy ho jata hai aur sab agents updated information dekh sakte hain. Drawback ye hai ki agar shared workspace properly manage na ho toh conflicting updates, stale data, duplicate information ya overwriting ki problem ho sakti hai.


Hybrid Pattern : Hybrid Pattern me ek hi multi-agent system ke andar do ya usse zyada orchestration patterns combine kiye jate hain, taaki different parts of task ko unke liye suitable pattern se handle kiya ja sake. Example ke liye, pehle Router Agent decide kare ki request research wali hai, phir Supervisor task ko AWS, Azure aur GCP research me divide kare, ye three research agents parallel me kaam karein, aur end me Reviewer Agent final answer evaluate kare. Yaha Routing + Supervisor-Worker + Parallel + Evaluator patterns ek saath use ho rahe hain. Is pattern ka benefit flexibility aur better task handling hai, kyunki har stage ke liye best approach use kar sakte ho. Drawback ye hai ki system complex ho jata hai, debugging mushkil ho sakti hai, aur multiple agents/patterns ki wajah se token cost aur coordination overhead badh sakta hai.

Memory vs Context : Context wo information hoti hai jo agent ko current run me abhi visible hai, jaise current user message, recent conversation, tool result, ya current state. Memory wo information hoti hai jo save ki ja sakti hai aur future me zarurat padne par retrieve karke context me laayi ja sakti hai. Simple words me: Context = abhi kya dikh raha hai, aur Memory = kya saved hai jo baad me kaam aa sakta hai.

// Memory Types 


1. Short-Term Memory
Short-Term Memory current conversation ki temporary yaad hoti hai. Example ke liye, user bolta hai, “My name is Rahul,” aur kuch messages baad poochta hai, “Mera naam kya hai?” Agent current conversation dekhkar “Rahul” bol deta hai. Ye information usually current session ya recent conversation tak useful hoti hai; ye zaroori nahi ki bahut future tak permanently save rahe.

2. Working Memory
Working Memory wo temporary information hoti hai jo agent current task complete karne ke liye beech me maintain karta hai. Example ke liye, agent report bana raha hai aur uske paas plan hai, kuch research notes hain, aur pending tasks ki list hai. Ye sab final answer nahi hain, lekin current task ko organize karne aur next step decide karne me help karte hain. Simple analogy me, ye agent ka rough work / scratchpad samjho.

3. Long-Term Memory
Long-Term Memory wo information hoti hai jo current conversation ke baad bhi persist reh sakti hai aur future tasks me retrieve ki ja sakti hai. Example: user prefers TypeScript, project ka tech stack MERN hai, ya kisi project ka important configuration. Ye information database, vector database, document store, ya key-value store me save ho sakti hai. Simple words me, Long-Term Memory = future ke liye permanently ya long duration tak saved information.


4. Episodic Memory
Episodic Memory past me kya hua tha, yani previous experiences ki memory hoti hai. Example: “Last deployment fail hua tha kyunki Dockerfile missing tha.” Future deployment ke time agent is past experience ko yaad karke Dockerfile pehle check kar sakta hai. Simple way me, Episodic Memory = past events aur experiences ki yaad.


5. Semantic Memory
Semantic Memory facts, concepts aur general knowledge ki memory hoti hai, na ki kisi specific past event ki. Example: company policies, API documentation, product knowledge, ya internal knowledge base. Agar agent ko pata hai ki “Company refunds 30 days ke andar allowed hain,” toh ye semantic memory ka example hai. Simple words me, Semantic Memory = facts aur knowledge jo agent jaanta ya retrieve kar sakta hai.

\\Shared Memory vs Private Memory 

Shared Memory :  wo memory hoti hai jise multiple agents access kar sakte hain. Example ke liye, ek common company knowledge base jisme product docs, policies, ya project information saved ho. Research Agent, Support Agent aur Writer Agent sab zarurat ke hisaab se same shared memory se information le sakte hain. Simple words me, Shared Memory = common notebook jo sab agents dekh sakte hain.

Private Memory : sirf kisi specific agent ke liye hoti hai. Example ke liye, Research Agent ke apne notes, Billing Agent ke payment-related details, ya HR Agent ke sensitive conversations. Doosre agents ko ye memory automatically access nahi karni chahiye. Simple words me, Private Memory = personal notebook jo sirf ek specific agent ke paas hai.

\\ Agent Communication 

Agent Communication : Agent Communication ka matlab hai ki multiple agents ek dusre ke saath information, task, result ya control share karte hain taaki poora workflow coordinate ho sake. Jaise Research Agent ne information collect ki aur Writer Agent ko deni hai, toh dono ke beech communication zaroori hai. Ye communication direct message, shared state, event, queue, tool call, handoff, API, protocol ya database ke through ho sakti hai. Simple words me, agent communication = ek agent dusre agent ko useful information ya instruction bhej raha hai.

Possible Ways : 

Direct messages
Shared state
Events
Queues
Tool calls
Handoffs
APIs
Protocol
Database

Alag communication methods ko simple way me samjho: 

 Direct message me ek agent directly dusre agent ko message bhejta hai;
 shared state me agents common state read/write karte hain;
 events me ek agent event fire karta hai aur interested agents react karte hain;
 queues me tasks line me "store hote" hain aur workers unhe pick karte hain; 
 tool calls ke through agent kisi external capability ko invoke karta hai; 
 handoff me responsibility aur control next agent ko transfer hota hai; 
 APIs ke through agents/services network par communicate karte hain; 
 protocol communication ka fixed rule/format hota hai; 
 aur database common persistent information store karne ke liye use ho sakta hai.

\\ Structured Communication 

Structured Communication ka matlab hai agents ke beech messages ko fixed format/schema me bhejna, instead of random free text. Free text jaise "Bro maine research kar liya..." human ko samajh aa sakta hai, lekin production system me parser confuse ho sakta hai, field missing ho sakti hai, ya next agent ko exact information extract karna mushkil ho sakta hai. Isliye better hai ki agents predictable JSON structure use karein, jaise:

{
  "status": "completed",
  "findings": [
    {
      "claim": "Example finding",
      "source": "Example source"
    }
  ],
  "missing_information": []
}

Benifits :

Is structure me next agent ko clearly pata hai status kaha milega, 
findings kis field me hain, aur koi information missing hai ya nahi. 
Isse validation easy hoti hai kyunki check kar sakte ho ki required fields present hain; 
parsing easy hoti hai kyunki code directly response.findings access kar sakta hai; 
testing easy hoti hai kyunki expected structure fixed hai; 
predictability badhti hai kyunki har agent same format follow karta hai; 
aur logging easy hoti hai kyunki structured data ko database ya monitoring system me cleanly store kiya ja sakta hai.


\\Contracts between agents 


Contracts Between Agents ka matlab hai ki agents ke beech data exchange ka format pehle se fixed hota hai, bilkul API contract ki tarah. Example ke liye, agar Research Agent ka output hamesha summary, sources, confidence aur missingInfo ke form me aayega, toh Writer Agent ko already pata hoga ki usse kaunsi information kahan milegi. Isse next agent ko random text samajhne ya guess karne ki zarurat nahi padti. Agar contract na ho, toh Research Agent kabhi paragraph de sakta hai, kabhi alag JSON structure, aur kabhi required field miss kar sakta hai, jisse workflow messy ho sakta hai. Isliye contracts system ko predictable, testable aur reliable banate hain. Short me, "contract = ek fixed agreement ki ek agent dusre agent ko exactly kis structure me data dega."

interface ResearchResult {
  summary: string;
  sources: Source[];
  confidence: number;
  missingInfo: string[];
}



\\ Tool selection 

Tool Selection ka matlab hai ki har agent ko sirf wahi tools diye jaye jo uske kaam ke liye actually useful hain. Agar ek hi agent ke paas 100 tools hon, jaise search_web, search_email, search_database, create_ticket, delete_ticket etc., toh LLM ke liye sahi tool choose karna difficult ho sakta hai aur galat tool call hone ke chances badh jaate hain. Isliye better approach ye hai ki agents ko specialize karo: Research Agent ko sirf web_search aur file_search, Email Agent ko gmail_search aur gmail_send, aur Database Agent ko read_db do. Isse har agent ka tool set chhota aur clear rehta hai, decision simple hota hai, errors kam hote hain aur system zyada predictable banta hai. Short me, specialized agent ko specialized tools do, sab tools sab agents ko mat do. ye hum Tools field me dete hai

ResearchAgent:
  web_search
  file_search

EmailAgent:
  gmail_search
  gmail_send

DatabaseAgent:
  read_db


\\ Least Privilege

Least Privilege ka matlab hai ki kisi agent ko sirf utni hi permission do jitni uske kaam ke liye zaroori hai, usse zyada nahi. Example ke liye, agar Research Agent ka kaam sirf web aur documents se information collect karna hai, toh usko read web aur read docs permission enough hai. Usko database admin access, users delete karne ki permission, payment send karne ka access, ya production shell dena unnecessary aur risky hoga. Agar agent se mistake ho jaye, prompt injection ho, ya wrong tool choose ho, toh extra permissions ki wajah se damage zyada ho sakta hai. Isliye least privilege system ko secure banata hai by limiting what each agent is allowed to do.