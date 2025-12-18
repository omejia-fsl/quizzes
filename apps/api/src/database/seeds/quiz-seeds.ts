export const quizSeeds = [
  {
    title: 'Agent Design Fundamentals',
    description:
      'Test your understanding of AI agent architecture, planning strategies, and memory systems.',
    category: 'Agent Design',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    isActive: true,
    questions: [
      {
        text: 'What is the primary purpose of a planning component in an AI agent?',
        explanation:
          'The planning component breaks down complex tasks into manageable steps, enabling the agent to approach problems systematically rather than reactively.',
        answers: [
          {
            text: 'To break down complex tasks into smaller, actionable steps',
            isCorrect: true,
          },
          {
            text: 'To store conversation history',
            isCorrect: false,
          },
          {
            text: 'To generate responses faster',
            isCorrect: false,
          },
          {
            text: 'To reduce token consumption',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Which memory type is best suited for storing factual information that an agent needs to reference repeatedly?',
        explanation:
          'Long-term memory is designed to store persistent information that needs to be retained across sessions, making it ideal for factual data and knowledge bases.',
        answers: [
          {
            text: 'Short-term memory',
            isCorrect: false,
          },
          {
            text: 'Long-term memory',
            isCorrect: true,
          },
          {
            text: 'Working memory',
            isCorrect: false,
          },
          {
            text: 'Cache memory',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the role of a tool in an AI agent system?',
        explanation:
          'Tools extend agent capabilities by providing interfaces to external systems, APIs, or functions that the agent can invoke to perform actions beyond text generation.',
        answers: [
          {
            text: 'To improve the quality of generated text',
            isCorrect: false,
          },
          {
            text: 'To extend agent capabilities by interacting with external systems',
            isCorrect: true,
          },
          {
            text: 'To optimize model inference speed',
            isCorrect: false,
          },
          {
            text: 'To compress prompts',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'In a ReAct (Reasoning + Acting) agent pattern, what does the agent do after observing the result of an action?',
        explanation:
          'ReAct agents follow a cycle: Reason about the next step, Act by using a tool or providing an answer, then Observe the result to inform the next reasoning step.',
        answers: [
          {
            text: 'Immediately terminates the task',
            isCorrect: false,
          },
          {
            text: 'Reasons about the next step based on the observation',
            isCorrect: true,
          },
          {
            text: 'Resets all memory',
            isCorrect: false,
          },
          {
            text: 'Switches to a different model',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is a key advantage of using vector embeddings in agent memory systems?',
        explanation:
          'Vector embeddings represent semantic meaning in high-dimensional space, enabling similarity-based retrieval that finds conceptually related information rather than just exact keyword matches.',
        answers: [
          {
            text: 'They reduce storage costs',
            isCorrect: false,
          },
          {
            text: 'They enable semantic similarity search',
            isCorrect: true,
          },
          {
            text: 'They eliminate the need for prompts',
            isCorrect: false,
          },
          {
            text: 'They make agents deterministic',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Which component is responsible for deciding which tool an agent should use next?',
        explanation:
          'The orchestration/reasoning layer analyzes the current state, available tools, and task requirements to decide the best next action for the agent to take.',
        answers: [
          {
            text: 'The LLM model itself',
            isCorrect: false,
          },
          {
            text: 'The orchestration/reasoning layer',
            isCorrect: true,
          },
          {
            text: 'The memory system',
            isCorrect: false,
          },
          {
            text: 'The user interface',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the purpose of an agent\'s "reflection" capability?',
        explanation:
          'Reflection allows agents to evaluate their own performance, learn from mistakes, and improve their approach to similar tasks in the future, creating a self-improvement loop.',
        answers: [
          {
            text: 'To mirror user responses',
            isCorrect: false,
          },
          {
            text: 'To evaluate its own performance and learn from mistakes',
            isCorrect: true,
          },
          {
            text: 'To create backup copies of data',
            isCorrect: false,
          },
          {
            text: 'To reduce hallucinations',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'In multi-agent systems, what is the primary benefit of having specialized agents?',
        explanation:
          'Specialized agents can focus on specific domains or tasks, developing deep expertise and optimized workflows for their area, which improves overall system performance and reliability.',
        answers: [
          {
            text: 'Lower computational costs',
            isCorrect: false,
          },
          {
            text: 'Improved expertise and efficiency in specific domains',
            isCorrect: true,
          },
          {
            text: 'Reduced memory requirements',
            isCorrect: false,
          },
          {
            text: 'Faster response times',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the main challenge that agent guardrails are designed to address?',
        explanation:
          'Guardrails enforce boundaries and safety constraints to prevent agents from taking harmful actions, accessing prohibited resources, or operating outside their intended scope.',
        answers: [
          {
            text: 'Improving response quality',
            isCorrect: false,
          },
          {
            text: 'Preventing unsafe or undesired agent behaviors',
            isCorrect: true,
          },
          {
            text: 'Optimizing token usage',
            isCorrect: false,
          },
          {
            text: 'Enhancing speed',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What role does the "environment" play in agent development?',
        explanation:
          'The environment provides the context, state information, and feedback that agents need to understand their situation and make informed decisions about actions.',
        answers: [
          {
            text: "It stores the agent's code",
            isCorrect: false,
          },
          {
            text: 'It provides state and context for agent decision-making',
            isCorrect: true,
          },
          {
            text: 'It hosts the language model',
            isCorrect: false,
          },
          {
            text: 'It manages user authentication',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    title: 'Prompt Engineering Essentials',
    description:
      'Master the techniques for crafting effective prompts, from basic principles to advanced strategies.',
    category: 'Prompt Engineering',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    isActive: true,
    questions: [
      {
        text: 'What is the primary goal of prompt engineering?',
        explanation:
          'Prompt engineering focuses on crafting inputs that guide LLMs to produce the most accurate, relevant, and useful responses for a given task.',
        answers: [
          {
            text: 'To reduce API costs',
            isCorrect: false,
          },
          {
            text: 'To guide LLMs toward desired outputs',
            isCorrect: true,
          },
          {
            text: 'To train new models',
            isCorrect: false,
          },
          {
            text: 'To increase response speed',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Which prompting technique involves providing examples of desired input-output pairs?',
        explanation:
          'Few-shot prompting demonstrates the desired pattern through examples, helping the model understand the task format and expected response style.',
        answers: [
          {
            text: 'Zero-shot prompting',
            isCorrect: false,
          },
          {
            text: 'Few-shot prompting',
            isCorrect: true,
          },
          {
            text: 'Chain-of-thought prompting',
            isCorrect: false,
          },
          {
            text: 'Role prompting',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What does "chain-of-thought" prompting encourage the model to do?',
        explanation:
          'Chain-of-thought prompting asks the model to show its reasoning process step-by-step, which improves accuracy on complex tasks requiring multi-step reasoning.',
        answers: [
          {
            text: 'Generate longer responses',
            isCorrect: false,
          },
          {
            text: 'Show step-by-step reasoning',
            isCorrect: true,
          },
          {
            text: 'Use fewer tokens',
            isCorrect: false,
          },
          {
            text: 'Respond faster',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Why is it important to specify the desired output format in a prompt?',
        explanation:
          "Specifying the output format (JSON, markdown, bullet points, etc.) ensures the model generates responses in a structure that's easy to parse and integrate with your application.",
        answers: [
          {
            text: 'To reduce hallucinations',
            isCorrect: false,
          },
          {
            text: 'To ensure responses are structured and parseable',
            isCorrect: true,
          },
          {
            text: 'To improve model accuracy',
            isCorrect: false,
          },
          {
            text: 'To save tokens',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is "temperature" in the context of LLM generation?',
        explanation:
          'Temperature controls randomness: lower values (0.0-0.3) make outputs more deterministic and focused, while higher values (0.7-1.0+) increase creativity and variation.',
        answers: [
          {
            text: 'The processing speed of the model',
            isCorrect: false,
          },
          {
            text: 'A parameter controlling output randomness',
            isCorrect: true,
          },
          {
            text: "The model's training duration",
            isCorrect: false,
          },
          {
            text: 'The number of tokens generated',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Which technique helps prevent prompt injection attacks?',
        explanation:
          'Input sanitization and validation remove or escape potentially malicious content before it reaches the model, preventing attackers from manipulating the system through crafted inputs.',
        answers: [
          {
            text: 'Using longer prompts',
            isCorrect: false,
          },
          {
            text: 'Input sanitization and validation',
            isCorrect: true,
          },
          {
            text: 'Increasing temperature',
            isCorrect: false,
          },
          {
            text: 'Using smaller models',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the benefit of using system messages in chat-based models?',
        explanation:
          'System messages set persistent context and behavior guidelines that influence all subsequent interactions without needing to repeat instructions in every user message.',
        answers: [
          {
            text: 'They reduce token costs',
            isCorrect: false,
          },
          {
            text: 'They establish persistent context and behavior',
            isCorrect: true,
          },
          {
            text: 'They speed up responses',
            isCorrect: false,
          },
          {
            text: 'They prevent errors',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Why should prompts include clear task boundaries and constraints?',
        explanation:
          'Clear boundaries prevent scope creep, keep responses focused on the specific task, and reduce irrelevant or unhelpful content that wastes tokens and user time.',
        answers: [
          {
            text: 'To train the model',
            isCorrect: false,
          },
          {
            text: 'To keep responses focused and prevent scope creep',
            isCorrect: true,
          },
          {
            text: 'To improve model speed',
            isCorrect: false,
          },
          {
            text: 'To reduce API calls',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    title: 'Model Selection & Optimization',
    description:
      'Learn how to choose the right AI model for your use case and optimize performance.',
    category: 'Model Selection',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    isActive: true,
    questions: [
      {
        text: 'What is the main tradeoff when choosing between large and small language models?',
        explanation:
          'Larger models typically offer better performance and capabilities but require more computational resources and cost more, while smaller models are faster and cheaper but may have reduced capabilities.',
        answers: [
          {
            text: 'Speed vs. accuracy',
            isCorrect: false,
          },
          {
            text: 'Capability/performance vs. cost/speed',
            isCorrect: true,
          },
          {
            text: 'Security vs. functionality',
            isCorrect: false,
          },
          {
            text: 'Reliability vs. creativity',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Which factor is most important when selecting a model for latency-sensitive applications?',
        explanation:
          'For real-time or interactive applications, inference speed (how quickly the model generates responses) is critical to providing a good user experience.',
        answers: [
          {
            text: 'Model size',
            isCorrect: false,
          },
          {
            text: 'Inference speed',
            isCorrect: true,
          },
          {
            text: 'Training data size',
            isCorrect: false,
          },
          {
            text: 'Number of parameters',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the purpose of model quantization?',
        explanation:
          'Quantization reduces the precision of model weights (e.g., from 32-bit to 8-bit), decreasing model size and speeding up inference with minimal accuracy loss.',
        answers: [
          {
            text: 'To improve model accuracy',
            isCorrect: false,
          },
          {
            text: 'To reduce model size and improve inference speed',
            isCorrect: true,
          },
          {
            text: 'To add new capabilities',
            isCorrect: false,
          },
          {
            text: 'To increase context window',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'When should you consider fine-tuning a model instead of using prompt engineering?',
        explanation:
          "Fine-tuning is most valuable when you need consistent behavior on specialized tasks or domains where prompt engineering alone doesn't achieve the required performance.",
        answers: [
          {
            text: 'For one-time tasks',
            isCorrect: false,
          },
          {
            text: 'When consistent domain-specific behavior is needed',
            isCorrect: true,
          },
          {
            text: 'To reduce costs',
            isCorrect: false,
          },
          {
            text: 'For faster responses',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the context window of a language model?',
        explanation:
          'The context window defines how many tokens the model can process at once, including both input and output. Longer windows allow for more comprehensive conversations and document analysis.',
        answers: [
          {
            text: 'The time it takes to generate a response',
            isCorrect: false,
          },
          {
            text: 'The maximum number of tokens it can process at once',
            isCorrect: true,
          },
          {
            text: 'The training dataset size',
            isCorrect: false,
          },
          {
            text: "The model's memory capacity",
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Which approach is best for reducing hallucinations in model outputs?',
        explanation:
          'RAG provides models with relevant, factual information from trusted sources during inference, grounding responses in real data rather than relying solely on parametric knowledge.',
        answers: [
          {
            text: 'Increasing model size',
            isCorrect: false,
          },
          {
            text: 'Using retrieval-augmented generation (RAG)',
            isCorrect: true,
          },
          {
            text: 'Raising temperature',
            isCorrect: false,
          },
          {
            text: 'Shortening prompts',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is model distillation?',
        explanation:
          'Distillation trains a smaller "student" model to mimic a larger "teacher" model, transferring knowledge while creating a more efficient model for deployment.',
        answers: [
          {
            text: 'Removing unused model parameters',
            isCorrect: false,
          },
          {
            text: 'Training a smaller model to mimic a larger one',
            isCorrect: true,
          },
          {
            text: 'Compressing the training dataset',
            isCorrect: false,
          },
          {
            text: 'Converting models to different formats',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'Why might you choose a specialized model over a general-purpose LLM?',
        explanation:
          'Specialized models are optimized for specific tasks or domains, offering better performance, efficiency, and accuracy for those use cases compared to general-purpose models.',
        answers: [
          {
            text: 'They are always cheaper',
            isCorrect: false,
          },
          {
            text: 'Better performance on specific tasks or domains',
            isCorrect: true,
          },
          {
            text: 'They have larger context windows',
            isCorrect: false,
          },
          {
            text: 'They are easier to use',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the main advantage of using locally hosted models vs. API-based models?',
        explanation:
          'Local hosting gives you complete control over data privacy, security, and compliance since sensitive information never leaves your infrastructure.',
        answers: [
          {
            text: 'Always faster inference',
            isCorrect: false,
          },
          {
            text: 'Better data privacy and control',
            isCorrect: true,
          },
          {
            text: 'Lower costs',
            isCorrect: false,
          },
          {
            text: 'Higher accuracy',
            isCorrect: false,
          },
        ],
      },
      {
        text: "What metric best measures a model's efficiency for production deployment?",
        explanation:
          'Tokens per second (throughput) directly impacts user experience and operational costs, measuring how efficiently the model processes requests in production environments.',
        answers: [
          {
            text: 'Training time',
            isCorrect: false,
          },
          {
            text: 'Tokens per second (throughput)',
            isCorrect: true,
          },
          {
            text: 'Model size in GB',
            isCorrect: false,
          },
          {
            text: 'Number of parameters',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'When evaluating models, what does "few-shot performance" refer to?',
        explanation:
          'Few-shot performance measures how well a model can learn and adapt to new tasks given only a few examples, indicating its generalization ability.',
        answers: [
          {
            text: 'Response speed with minimal compute',
            isCorrect: false,
          },
          {
            text: 'Ability to perform tasks with minimal examples',
            isCorrect: true,
          },
          {
            text: 'Performance with small prompts',
            isCorrect: false,
          },
          {
            text: 'Accuracy on short inputs',
            isCorrect: false,
          },
        ],
      },
      {
        text: 'What is the primary benefit of using model caching strategies?',
        explanation:
          'Caching stores results of identical or similar requests, avoiding redundant API calls and computations, which significantly reduces costs and latency for repeated queries.',
        answers: [
          {
            text: 'Improved model accuracy',
            isCorrect: false,
          },
          {
            text: 'Reduced API costs and latency for repeated queries',
            isCorrect: true,
          },
          {
            text: 'Better security',
            isCorrect: false,
          },
          {
            text: 'Larger context windows',
            isCorrect: false,
          },
        ],
      },
    ],
  },
];
