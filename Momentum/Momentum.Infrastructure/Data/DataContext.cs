using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Momentum.Infrastructure.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext(options);
