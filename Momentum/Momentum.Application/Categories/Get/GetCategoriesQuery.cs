using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;

namespace Momentum.Application.Categories.Queries;

public class GetCategoriesQuery : IQuery<IEnumerable<CategoryDto>>
{
}

public class GetCategoriesQueryHandler(ICategoryRepository repository, IMapper mapper)
    : IQueryHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    public async Task<Result<IEnumerable<CategoryDto>, IDomainError>> Handle(GetCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(GetCategoriesQuery));
        
        var categories = await repository.GetAllAsync(cancellationToken).ConfigureAwait(false);
        var dtos = mapper.Map<IEnumerable<CategoryDto>>(categories);
        
        return Result.Success<IEnumerable<CategoryDto>, IDomainError>(dtos);
    }
}