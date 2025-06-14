using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Application.Mappings;

public class HabitMapping : Profile
{
    public HabitMapping()
    {
        CreateMap<HabitDto, Habit>().ReverseMap();
    }
}
