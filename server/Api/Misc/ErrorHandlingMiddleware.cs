using Service;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private readonly RequestDelegate next = next;
    private readonly ILogger<ErrorHandlingMiddleware> logger = logger;

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await next(ctx);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.ToString(), ex);
            if (ex is FluentValidation.ValidationException error)
            {
                var propertyErrors = error.Errors.ToDictionary(
                    (key) => key.PropertyName.ToLower(),
                    (value) => value.ErrorMessage
                );
                ctx.Response.StatusCode = 400;
                await ctx.Response.WriteAsJsonAsync(
                    new { message = error.Message, errors = propertyErrors }
                );
            }
            else if (ex is AppError apiError)
            {
                ctx.Response.StatusCode = apiError switch
                {
                    NotFoundError => 404,
                    UnauthorizedError => 401,
                    ForbiddenError => 403,
                    ValidationError => 400,
                    _ => 500,
                };
                if (apiError is ValidationError)
                {
                    await ctx.Response.WriteAsJsonAsync(
                        new
                        {
                            message = apiError.Message,
                            errors = (apiError as ValidationError)?.Errors
                        }
                    );
                }
                else
                {
                    await ctx.Response.WriteAsJsonAsync(new { error = apiError.Message });
                }
            }
            else
            {
                ctx.Response.StatusCode = 500;
                await ctx.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred" });
            }
        }
    }
}
