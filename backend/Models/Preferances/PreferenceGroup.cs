using System.ComponentModel.DataAnnotations;

namespace backend.Models.Preferances
{
    public class PreferenceGroup
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<Preference>? Preferences { get; set; }
    }
}
