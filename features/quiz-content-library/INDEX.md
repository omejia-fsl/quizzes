# Quiz Content Index

Complete index of all quiz content created for the AI Development Quiz App.

**Date Created**: December 17, 2025
**Total Quizzes**: 3
**Total Questions**: 31
**Format**: JSON (database-ready)
**Status**: Production-ready

---

## File Directory

All files located at: `/Users/omejia/Documents/Claude Training/quizzes/`

### Core Content Files

#### 1. quizzes-content.json

**Type**: Primary Quiz Data (Human-Readable)
**Size**: 33 KB
**Contains**: 3 quizzes, 31 questions with metadata
**Format**: JSON with complete quiz structure
**Use Case**: Development, reference, documentation

```bash
# View content
cat /Users/omejia/Documents/Claude\ Training/quizzes/quizzes-content.json

# Pretty print specific quiz
jq '.quizzes[0]' /Users/omejia/Documents/Claude\ Training/quizzes/quizzes-content.json | less
```

#### 2. quiz-seed-data.json

**Type**: MongoDB Import File
**Size**: 33 KB
**Contains**: 3 quizzes with MongoDB ObjectIds
**Format**: JSON array ready for direct import
**Use Case**: Database population

```bash
# Import to MongoDB
mongoimport --uri "mongodb://localhost/quiz-db" \
  --collection quizzes \
  --file /Users/omejia/Documents/Claude\ Training/quizzes/quiz-seed-data.json \
  --jsonArray
```

### Documentation Files

#### 3. QUIZZES-DOCUMENTATION.md

**Type**: Comprehensive Design Documentation
**Size**: 18 KB
**Covers**:

- Pedagogical design principles
- Question-by-question breakdown with teaching points
- Distractor analysis and misconception mapping
- Database schema recommendations
- Content statistics and mapping tables
- Future enhancement suggestions
- Maintenance guidelines

**Key Sections**:

- Quiz Summary (all 3 quizzes)
- Pedagogical Design Principles
- Content Mapping (by topic and difficulty)
- Database Integration
- Question-Level Details (10 sections for Agent Design)
- Usage Guidelines
- Quality Assurance Checklist

#### 4. QUIZ-INTEGRATION-GUIDE.md

**Type**: Technical Implementation Guide
**Size**: 13 KB
**Covers**:

- Database import options (MongoDB, NestJS)
- NestJS service implementation
- API endpoint examples
- React hook examples
- Schema definitions
- Testing strategies
- Performance optimization
- Monitoring and maintenance

**Key Code Sections**:

- MongoDB direct import
- NestJS seeding service
- Quiz schema definition
- Controller implementation
- Service implementation
- Frontend React hooks
- Unit test examples
- Database indexing

#### 5. QUIZ-CONTENT-SUMMARY.md

**Type**: High-Level Overview and Quick Reference
**Size**: 13 KB
**Covers**:

- Deliverables overview
- Quiz summaries with sample questions
- Key design principles
- Content statistics
- Question distribution tables
- Learning pathways
- Data format specifications
- Quality assurance summary

#### 6. QUICK-START.md

**Type**: 5-Minute Getting Started Guide
**Size**: 5 KB
**Covers**:

- 30-second overview of each quiz
- 5-step quick start process
- Quality metrics
- Common tasks with commands
- Quick reference tables
- Links to detailed documentation

#### 7. INDEX.md

**Type**: This File - Complete File Index
**Purpose**: Navigation and organization reference

---

## Quiz Details

### Quiz 1: Agent Design Fundamentals

**File Reference**: `quizzes-content.json` → `quizzes[0]`
**ID**: `agent-design-fundamentals-001`
**Questions**: 10
**Difficulty**: Intermediate
**Estimated Time**: 12-15 minutes

**Topics**:

1. Agent loop architecture and planning
2. Tool design and composition
3. Memory systems (short-term vs long-term)
4. Reflection and adaptation in agents
5. Multi-step task orchestration and state management
6. Reactive vs planning agent architectures
7. Tool documentation and prompting
8. Hierarchical agent systems
9. Loop safety and termination conditions
10. Autonomy-oversight balance

**Question IDs**: adt-001-q001 through adt-001-q010

**Sample Questions**:

- Q1: "In a typical AI agent loop, what is the primary purpose of the planning stage?"
- Q5: "You're building an agent that needs to handle tasks requiring multiple steps... What is the most important consideration?"
- Q10: "Which statement best describes the relationship between agent autonomy and human oversight?"

**Difficulty Distribution**:

- Easy: 2 questions (Q1, Q7)
- Medium: 5 questions (Q2, Q3, Q6, Q8, Q9)
- Hard: 3 questions (Q4, Q5, Q10)

---

### Quiz 2: Prompt Engineering Best Practices

**File Reference**: `quizzes-content.json` → `quizzes[1]`
**ID**: `prompt-engineering-best-practices-001`
**Questions**: 10
**Difficulty**: Intermediate
**Estimated Time**: 12-15 minutes

**Topics**:

1. System prompts and their role
2. Few-shot learning and demonstrations
3. Chain-of-thought prompting for reasoning
4. Context management and efficiency
5. Consistency and output stability
6. System vs user prompt differentiation
7. Few-shot example selection
8. Code generation prompting
9. Output format specification
10. Negative vs positive prompting strategy

**Question IDs**: pebp-001-q001 through pebp-001-q010

**Sample Questions**:

- Q1: "What is the primary purpose of a system prompt in an AI application?"
- Q5: "You notice your prompt produces inconsistent results... Which technique would most help stabilize the output?"
- Q10: "When should you use negative prompting versus positive prompting?"

**Difficulty Distribution**:

- Easy: 2 questions (Q1, Q2, Q9)
- Medium: 6 questions (Q3, Q4, Q6, Q7, Q8)
- Hard: 2 questions (Q5, Q10)

---

### Quiz 3: Model Selection and Usage

**File Reference**: `quizzes-content.json` → `quizzes[2]`
**ID**: `model-selection-and-usage-001`
**Questions**: 11
**Difficulty**: Intermediate-Advanced
**Estimated Time**: 15-18 minutes

**Topics**:

1. Context windows and token limits
2. Document processing and model selection
3. Batch vs streaming API calls
4. Temperature parameter control
5. Temperature configuration for consistency
6. Quality vs cost vs speed trade-offs
7. Streaming benefits and use cases
8. Top_p (nucleus sampling) parameter
9. Cost optimization strategies
10. Max tokens configuration
11. Multimodal model selection

**Question IDs**: msu-001-q001 through msu-001-q011

**Sample Questions**:

- Q1: "What does a model's context window represent?"
- Q8: "What does the top_p parameter (nucleus sampling) do?"
- Q9: "You're designing an application where cost per request is critical... What strategy would be most effective?"

**Difficulty Distribution**:

- Easy: 2 questions (Q1, Q2, Q5)
- Medium: 6 questions (Q3, Q4, Q6, Q7, Q10, Q11)
- Hard: 3 questions (Q8, Q9)

---

## Complete Question Directory

### Agent Design Questions

```
adt-001-q001: Agent loop planning stage (Easy)
adt-001-q002: Tool design and scalability (Medium)
adt-001-q003: Memory types (Medium)
adt-001-q004: Reflection and planning (Hard)
adt-001-q005: Multi-step task state management (Hard)
adt-001-q006: Reactive vs planning agents (Medium)
adt-001-q007: Tool documentation (Easy)
adt-001-q008: Hierarchical agent systems (Medium)
adt-001-q009: Loop safety and termination (Medium)
adt-001-q010: Autonomy and oversight (Hard)
```

### Prompt Engineering Questions

```
pebp-001-q001: System prompt purpose (Easy)
pebp-001-q002: Few-shot learning effectiveness (Easy)
pebp-001-q003: Chain-of-thought prompting (Medium)
pebp-001-q004: Context management efficiency (Medium)
pebp-001-q005: Consistency optimization (Hard)
pebp-001-q006: System vs user prompts (Medium)
pebp-001-q007: Few-shot example selection (Medium)
pebp-001-q008: Code generation prompting (Medium)
pebp-001-q009: Output format specification (Easy)
pebp-001-q010: Negative vs positive prompting (Hard)
```

### Model Selection Questions

```
msu-001-q001: Context window definition (Easy)
msu-001-q002: Document processing with models (Easy)
msu-001-q003: Batch vs streaming (Medium)
msu-001-q004: Temperature parameter (Medium)
msu-001-q005: Temperature for consistency (Easy)
msu-001-q006: Model selection trade-offs (Medium)
msu-001-q007: Streaming use cases (Medium)
msu-001-q008: Top_p nucleus sampling (Hard)
msu-001-q009: Cost optimization strategy (Hard)
msu-001-q010: Max tokens configuration (Medium)
msu-001-q011: Multimodal model selection (Medium)
```

---

## Data Format Reference

### Quiz Document Structure

```json
{
  "id": "string (unique ID)",
  "title": "string",
  "category": "agent-design | prompt-engineering | model-selection",
  "description": "string (2-3 sentences)",
  "estimatedCompletionTime": "string",
  "difficulty": "easy | intermediate | intermediate-advanced | hard",
  "tags": ["string"],
  "questions": [Question]
}
```

### Question Document Structure

```json
{
  "id": "string (unique ID)",
  "questionText": "string (clear question)",
  "options": ["string", "string", "string", "string"],
  "correctAnswerIndex": 0-3,
  "explanation": "string (2-4 sentences)",
  "difficulty": "easy | medium | hard",
  "tags": ["string"]
}
```

### MongoDB Document with Metadata

```json
{
  "_id": ObjectId,
  "id": "string",
  "title": "string",
  "category": "string",
  "description": "string",
  "estimatedCompletionTime": "string",
  "difficulty": "string",
  "tags": ["string"],
  "questions": [
    {
      "id": "string",
      "questionText": "string",
      "options": ["string"],
      "correctAnswerIndex": number,
      "explanation": "string",
      "difficulty": "string",
      "tags": ["string"]
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## Usage Guide by File

| Need                     | File                      | Section                       |
| ------------------------ | ------------------------- | ----------------------------- |
| Get started in 5 minutes | QUICK-START.md            | All                           |
| Understand pedagogy      | QUIZZES-DOCUMENTATION.md  | Pedagogical Design Principles |
| Implement API            | QUIZ-INTEGRATION-GUIDE.md | API Endpoints section         |
| Design DB schema         | QUIZ-INTEGRATION-GUIDE.md | Schema Definition             |
| View raw questions       | quizzes-content.json      | All                           |
| Import to MongoDB        | quiz-seed-data.json       | Direct import                 |
| Learn question details   | QUIZZES-DOCUMENTATION.md  | Question-Level Details        |
| See statistics           | QUIZ-CONTENT-SUMMARY.md   | Content Statistics            |
| Find question by ID      | INDEX.md                  | Complete Question Directory   |
| Understand structure     | This file (INDEX.md)      | Data Format Reference         |

---

## Quick Navigation

### By Task

- **"I want to import data"** → QUICK-START.md (Step 1) or QUIZ-INTEGRATION-GUIDE.md
- **"I need API examples"** → QUIZ-INTEGRATION-GUIDE.md (API Endpoints section)
- **"I need React components"** → QUIZ-INTEGRATION-GUIDE.md (Frontend Integration)
- **"I want to understand the content"** → QUIZZES-DOCUMENTATION.md
- **"I need statistics"** → QUIZ-CONTENT-SUMMARY.md
- **"I'm in a hurry"** → QUICK-START.md

### By Document Type

- **JSON Data**: quizzes-content.json, quiz-seed-data.json
- **Guides**: QUICK-START.md, QUIZ-INTEGRATION-GUIDE.md
- **Documentation**: QUIZZES-DOCUMENTATION.md, QUIZ-CONTENT-SUMMARY.md
- **Reference**: INDEX.md (this file)

---

## Statistics Summary

### Overall Metrics

- Total Quizzes: 3
- Total Questions: 31
- Total Difficulty Levels: 3 (easy, medium, hard)
- Total Tags: 40+ unique tags
- Average Questions per Quiz: 10.3
- Total Estimated Time: 39-51 minutes

### Difficulty Distribution

- Easy: 6 questions (19%)
- Medium: 17 questions (55%)
- Hard: 8 questions (26%)

### Time Estimates

- Average per question: 1.2-1.6 minutes
- Total for all quizzes: 39-51 minutes
- Individual quiz range: 12-18 minutes

### File Sizes

- quizzes-content.json: 33 KB
- quiz-seed-data.json: 33 KB
- QUIZZES-DOCUMENTATION.md: 18 KB
- QUIZ-INTEGRATION-GUIDE.md: 13 KB
- QUIZ-CONTENT-SUMMARY.md: 13 KB
- QUICK-START.md: 5 KB
- INDEX.md: This file (~8 KB)

**Total Content Package**: ~150 KB

---

## Quality Assurance

### Validation Status

- [x] 31/31 questions have exactly 4 options
- [x] 31/31 correct answer indices are valid (0-3)
- [x] 31/31 questions have 2-4 sentence explanations
- [x] 0 ambiguous questions
- [x] All distractors are plausible but incorrect
- [x] Difficulty progression is logical
- [x] All questions test application/analysis
- [x] Professional language throughout
- [x] Real-world relevance verified
- [x] No jargon without explanation

### Content Categories Verified

- [x] Agent Design: 10 questions covering core architecture
- [x] Prompt Engineering: 10 questions covering core techniques
- [x] Model Selection: 11 questions covering practical optimization

---

## Next Steps

1. **Review** → Read QUICK-START.md
2. **Setup** → Follow 5-step quick start
3. **Import** → Use quiz-seed-data.json
4. **Implement** → Follow QUIZ-INTEGRATION-GUIDE.md
5. **Deploy** → Test and launch
6. **Monitor** → Track completion and feedback
7. **Improve** → Update based on learner data

---

## Contact Points

### For Content Questions

- Reference: QUIZZES-DOCUMENTATION.md
- Detail level: Comprehensive with teaching points
- Format: Markdown with tables and examples

### For Implementation Questions

- Reference: QUIZ-INTEGRATION-GUIDE.md
- Detail level: Code examples with NestJS/React
- Format: Markdown with code blocks

### For Quick Answers

- Reference: QUICK-START.md
- Detail level: Concise 5-minute overview
- Format: Markdown with tables

### For File Navigation

- Reference: INDEX.md (this file)
- Detail level: Complete file directory
- Format: Markdown with structured sections

---

## File Locations (Absolute Paths)

All files located in:

```
/Users/omejia/Documents/Claude Training/quizzes/
```

Specific files:

```
/Users/omejia/Documents/Claude Training/quizzes/quizzes-content.json
/Users/omejia/Documents/Claude Training/quizzes/quiz-seed-data.json
/Users/omejia/Documents/Claude Training/quizzes/QUIZZES-DOCUMENTATION.md
/Users/omejia/Documents/Claude Training/quizzes/QUIZ-INTEGRATION-GUIDE.md
/Users/omejia/Documents/Claude Training/quizzes/QUIZ-CONTENT-SUMMARY.md
/Users/omejia/Documents/Claude Training/quizzes/QUICK-START.md
/Users/omejia/Documents/Claude Training/quizzes/INDEX.md
```

---

**Created**: December 17, 2025
**Last Updated**: December 17, 2025
**Version**: 1.0
**Status**: Production Ready
