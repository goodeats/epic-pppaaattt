# Zod with TypeScript Interfaces

## Problem

The problem is laid out from the discussion in this [Issues post](https://github.com/colinhacks/zod/issues/2807). Zod schemas often require restating the desired definition from the TypeScript interfaces, leading to potential mismatches and redundancy.

As I refactor and continue to build out this application, it is crucial to diligently validate my schemas against the matching TypeScript interfaces to maintain type safety and consistency.

It is important to note that I am leaning more heavily towards extending interfaces and merging schemas to achieve this goal.

It is also important to note that the `Asset` and `Design` models have an `attributes` column that is stringified JSON as a result of using SQLite as the database. SQLite does not support JSON columns so the use of Zod for parsing and validating this column will continue to be very important as more attributes are added to each `Asset` and `Model` type.

## Strategy

### When to Use Type Assertion

- **Schemas intended to be inherited**:
  - This allows for flexibility in extending schemas without enforcing strict type constraints immediately.
- **Form validation that may include other fields**:
  - Forms may include additional fields such as `intent` that are not part of the core data model but need to be validated.

```typescript
export const DesignFillDataSchema = z
  .object({
    type: z.literal(DesignTypeEnum.FILL),
    attributes: DesignAttributesFillSchema,
  })
  .merge(DesignDataSchema) satisfies ZodType<IDesignFillCreateData>

export const ArtworkVersionParentSchema = z.object({
  artworkVersionId: z.string(),
}) satisfies ZodType<IArtworkVersionParentData>
```

### When to Use Type Annotation

- **Schemas intended to be the final form**:
  - Use type annotations for schemas that represent the final structure of the data.
- **Before/after database operations**:
  - Ensures strict type checking and consistency when interacting with the database.

```typescript
export const ArtworkVersionDesignFillSchema: ZodType<IArtworkVersionDesignFillCreateData> =
  DesignFillDataSchema.merge(ArtworkVersionParentSchema)
```

## Benefits

- **Maintainability**: Clearly separating when to use type assertions and annotations helps maintain the codebase and reduces the risk of type mismatches.
- **Clarity**: This approach makes the intention behind each schema definition explicit, aiding in code readability and understanding.
- **Type Safety**: Ensures that the data structures are consistently validated, preventing runtime errors and ensuring reliability.

## Conclusion

By documenting and adhering to this strategy, we can ensure that our Zod schemas and TypeScript interfaces remain consistent and maintainable. This approach helps explain mismatches in applied types and provides a clear guideline for future development.

## Further Reading

- [I've been writing TypeScript without understanding it](https://dev.to/wasp/ive-been-writing-typescript-without-understanding-it-5ef4) touches on this towards the end
