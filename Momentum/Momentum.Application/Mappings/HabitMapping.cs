using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Application.Mappings;

public class HabitMapping : Profile
{
    public HabitMapping()
    {
        CreateMap<HabitDto, Habit>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()).ReverseMap();
        CreateMap<HabitEntryDto, HabitEntry>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()).ReverseMap();
        CreateMap<ReminderDto, Reminder>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()).ReverseMap();
    }
}
