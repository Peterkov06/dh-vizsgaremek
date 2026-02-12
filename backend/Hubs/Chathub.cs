using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace backend.Hubs
{
    [Authorize]
    public class Chathub: Hub
    {
        public async Task SendPrivateMessage(string receiverId, string message) {

            var senderUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(senderUserId))
            {
                throw new HubException("User not authenticated");
            }

            await Clients.User(receiverId).SendAsync("ReceiveMessage",
                senderUserId,
                message,
                DateTime.UtcNow);
        }
    }
}
