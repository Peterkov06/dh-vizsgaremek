using System.ComponentModel.DataAnnotations;

namespace backend.Models.Preferances
{
    public class Preference
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int PreferenceGroupId { get; set; }
        public PreferenceGroup? PreferenceGroup { get; set; }
    }
}
