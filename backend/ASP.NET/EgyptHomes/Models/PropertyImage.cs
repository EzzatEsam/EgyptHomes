using System.ComponentModel.DataAnnotations.Schema;

namespace EgyptHomes.Models;
public class PropertyImage : BaseModel
{
    public new required Guid Id { get; set; }
    public required long PropertyId { get; set; }
    [ForeignKey(nameof(PropertyId))]
    public PropertyPost? Property { get; set; }

}