using System.Reflection;

namespace Momentum.Api.Extensions;

internal static class MethodInfoExtensions
{
    internal static bool IsAnonymous(this MethodInfo method)
    {
        char[] invalidChars = ['<', '>'];
        return method.Name.Any(invalidChars.Contains);
    }

    internal static void AnonymousMethod(this IGuardClause _, Delegate input)
    {
        if (input.Method.IsAnonymous())
        {
            throw new ArgumentException("The endpoint name must be specified when using anonymous handlers.");
        }
    }
}
