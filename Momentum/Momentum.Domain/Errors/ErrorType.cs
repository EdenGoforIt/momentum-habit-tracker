using Ardalis.SmartEnum;

namespace Momentum.Domain.Errors;

public abstract class ErrorType(string name, int value) : SmartEnum<ErrorType>(name, value)
{
    public static readonly ErrorType Conflict = new ConflictEnum();
    public static readonly ErrorType NotFound = new NotFoundEnum();
    public static readonly ErrorType BadRequest = new BadRequestEnum();
    public static readonly ErrorType Validation = new ValidationEnum();
    public static readonly ErrorType Unexpected = new UnexpectedEnum();

    // Define each specific ErrorType as a nested class that extends SmartEnum
    private class ConflictEnum() : ErrorType("Conflict", 0);

    private class NotFoundEnum() : ErrorType("NotFound", 1);

    private class BadRequestEnum() : ErrorType("BadRequest", 2);

    private class ValidationEnum() : ErrorType("Validation", 3);

    private class UnexpectedEnum() : ErrorType("Unexpected", 4);
}
