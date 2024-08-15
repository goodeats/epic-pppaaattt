# Model file structure

This document outlines the file structure for the /app/models directory, focusing on clarity, scalability, maintainability, consistency, and modularity. The structure is designed to clearly differentiate between entity-level files, type-specific files, and child entity files while organizing them by action type.

## File Structure Overview

```
/app/models

// entity-level files

├── entity._._definitions.ts
├── entity._._hooks.ts
├── entity._._schema.ts
├── entity._._utils.ts
├── entity._._validation.ts

// entity action files

├── entity._.clone.definitions.ts
├── entity._.clone.schema.ts
├── entity._.create.db.server.ts
├── entity._.create.definitions.ts
├── entity._.create.schema.ts
├── entity._.delete.db.server.ts
├── entity._.delete.definitions.ts
├── entity._.delete.schema.ts
├── entity._.delete.submission.ts
├── entity._.get.db.server.ts
├── entity._.update.db.server.ts
├── entity._.update.definitions.ts
├── entity._.update.schema.ts
├── entity._.update.submission.ts

// entity type enum specific

├── entity._type._definitions.ts
├── entity._type._hooks.ts
├── entity._type._schema.ts
├── entity._type._utils.ts
├── entity._type.create.definitions.ts
├── entity._type.update.attribute.form.tsx
├── entity._type.update.attribute.service.ts
├── entity._type.update.attribute.submission.ts
├── entity._type.update.definitions.ts
├── entity._type.update.schema.ts

// child entity files

├── entity.child._hooks.ts
├── entity.child._schema.ts
├── entity.child._utils.ts
├── entity.child._validation.ts
├── entity.child.clone.definitions.ts
├── entity.child.clone.form.tsx
├── entity.child.clone.schema.ts
├── entity.child.clone.service.ts
├── entity.child.clone.submission.ts
├── entity.child.create.definitions.ts
├── entity.child.create.form.tsx
├── entity.child.create.schema.ts
├── entity.child.create.service.ts
├── entity.child.create.submission.ts
├── entity.child.delete.definitions.ts
├── entity.child.delete.form.tsx
├── entity.child.delete.schema.ts
├── entity.child.delete.service.ts
├── entity.child.delete.submission.ts
├── entity.child.get.db.server.ts
├── entity.child.update.attribute.form.tsx
├── entity.child.update.attribute.service.ts
├── entity.child.update.attribute.submission.ts
├── entity.child.update.db.server.ts
├── entity.child.update.definitions.ts
├── entity.child.update.schema.ts
├── entity.children.clone.definitions.ts
├── entity.children.clone.service.ts
...
└── end

```

## Key Notes and Explanations

### Entity-Level Files

- **Purpose**: These files define foundational elements and actions for the entity itself.
- **Files**:
  - `entity._._definitions.ts`: Contains constants, types, and interfaces used across various modules.
  - `entity._._hooks.ts`: Includes hooks for state management and side effects.
  - `entity._._schema.ts`: Defines schemas for data validation and modeling.
  - `entity._._utils.ts`: Utility functions for performing reusable operations.
  - `entity._._validation.ts`: Functions to ensure data integrity.

### Entity Action Files
- **Structure**: Grouped by actions such as create, delete, update, and clone.
- **Clarity**: Clearly indicates when each action is typically triggered or used in the application flow.
- **Cascading Services**: Some services cascade from submitted actions to the parent (e.g., clone). This involves cascading logic where services interact with one another.

### Type-Specific Files
- **Context**: `entity._type.*` files are for entities with a type enum (e.g., design), often represented in a JSON column.
- **Files**:
  - **`entity._type.update.attribute.*`**: These files manage attributes for the type, handling specific operations within the JSON column context.

### Child Entity Files
- **Purpose**: Represents entities where the parent has many children of a particular model type.
- **Structure**: Uses the `entity.child.*` pattern to indicate hierarchy.
- **Clarification**:
  - **`entity.child.update.attribute.*`** files manage attribute updates for child entities, distinct from type attribute files which are related to a JSON column.

### Children Entity Files

- **Purpose**: Same as Child Entity Files where parent may wish to perform a batch change of a particular model type.

### Submissions vs. Services
- **Submission Files (`*.submission.ts`)**:
  - Perform validation and then call the corresponding service.
- **Service Files (`*.service.ts`)**:
  - May be called by another service, separated to maintain modularity and reusability.

### Modularity and Consistency
- **Modularity**: The structure supports modular development, allowing developers to isolate and work on specific parts of the application without affecting others.
- **Consistency**: Consistent naming conventions and file organization facilitate maintainability and ease of understanding for both new and existing team members.

### Best Practices
- **Interaction**: Document the interaction between files and potential pitfalls or best practices.
- **Examples**: Include examples of common patterns, anti-patterns, and troubleshooting tips to assist developers.


### Using the File Structure for Prompt Engineering

This README serves as a valuable resource for prompt engineering, particularly when using tools like Cursor IDE. Here's how it can assist in building new models, features, and relationships:

- **Consistency in Naming Conventions**: The file structure's consistent naming conventions help both developers and language models understand the project's organization. This consistency aids in generating accurate and contextually relevant prompts when developing new features or models.
- **Hierarchical Organization**: The clear hierarchy of entity, type, and child files provides a structured framework that enhances understanding of the relationships within the codebase. This organization helps language models generate prompts that reflect the logical flow of the application's architecture.
- **Modular Approach**: The modular design allows developers and language models to focus on specific parts of the application. This makes it easier to generate targeted prompts for individual components or services without affecting other parts of the codebase.
- **Scalability and Extensibility**: As new models and features are added, the scalable file structure ensures that prompts can be easily adapted to accommodate these changes. This adaptability helps maintain clarity and relevance in prompt generation.
- **Reference for Best Practices**: This README serves as a reference for aligning prompt engineering with the best practices outlined in the document. By adhering to these practices, generated prompts can remain consistent with the overall design and coding standards of the project.

Overall, this README not only provides guidance for developers but also acts as a foundational tool for prompt engineering, enabling the creation of precise, context-aware prompts that enhance the development process using Cursor IDE.