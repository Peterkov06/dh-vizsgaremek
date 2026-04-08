using System.ComponentModel.DataAnnotations;

namespace backend.Models.Preferances
{
    public class UserPreference
    {
        public string UserId { get; set; }
        public int PreferenceId { get; set; }

        public ApplicationUser User { get; set; }
        public Preference Preference { get; set; }
    }
}
