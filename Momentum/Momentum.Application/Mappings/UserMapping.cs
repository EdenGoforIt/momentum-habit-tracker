using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;

namespace Momentum.Application.Mappings;

public class UserMapping : Profile
{
    public UserMapping()
    {
        CreateMap<UserDto, User>().ReverseMap();
    }
}
