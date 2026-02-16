using System.ComponentModel.DataAnnotations;

namespace backend.Models.Preferances
{
    public class UserPreference
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        public int PreferenceId { get; set; }

        public ApplicationUser User { get; set; }
        public Preference Preference { get; set; }
    }
}
