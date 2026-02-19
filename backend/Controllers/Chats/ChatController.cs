using backend.Data;
using backend.Models;
using backend.Models.Chat;
using backend.Models.Chat.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers.Chats
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatController(UserDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public record NewConversationDTO(string Name, string Type, string User_with);

        [Authorize]
        [HttpPost("create/new")]
        public async Task<IActionResult> CreateNewConveration([FromBody] NewConversationDTO body)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var receiver = await _userManager.FindByEmailAsync(body.User_with);

            if (receiver == null)
                return NotFound();

            var newConv = new Conversation
            {
                Id = Guid.NewGuid(),
                Name = body.Name,
                Type = body.Type
            };

            _context.Conversations.Add(newConv);

            var userPart = new ConversationParticipant
            {
                Id = Guid.NewGuid(),
                ConversationId = newConv.Id,
                UserId = userId,
                LastOnlineAt = DateTime.UtcNow
            };

            _context.ConversationParticipants.Add(userPart);


            var receiverPart = new ConversationParticipant
            {
                Id = Guid.NewGuid(),
                ConversationId = newConv.Id,
                UserId = receiver.Id,
                LastOnlineAt = null
            };

            _context.ConversationParticipants.Add(receiverPart);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        public record SendMessageDTO(string Conversation_name, string content);

        [Authorize]
        [HttpPost("send/message")]
        public async Task<IActionResult> SendMessage([FromBody]SendMessageDTO body)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var convos = _context.Conversations.Where(c=> c.Name == body.Conversation_name).Select(c=>c.Id).ToList();

            if (convos == null)
                return NotFound();

            var convo = _context.ConversationParticipants.FirstOrDefault(cp=> cp.UserId == userId && convos.Contains(cp.ConversationId));

            if (convo == null)
                return NotFound();


            var message = new Message {
                Id = Guid.NewGuid(),
                ConversationId = convo.Id,
                Content = body.content,
                SentAt = DateTime.Now
            };

            _context.Messages.Add(message);

            await _context.SaveChangesAsync();


            return NoContent();
        }


        [Authorize]
        [HttpGet("history/conversations")]
        public async Task<IActionResult> ConversationHistory() {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var conversations = _context.Conversations.Include(c => c.ConversationParticipants)
                .Where(c=>c.ConversationParticipants.Any(cp=>cp.UserId == userId))
                .Select(c => new ConversationDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Type = c.Type,
                    Participants = c.ConversationParticipants.Select(cp => new ParticipantDTO
                    {
                        Id = cp.Id,
                        UserId = cp.UserId,
                        LastOnlineAt = cp.LastOnlineAt
                    }).ToList()
                }).ToList();
            
            return Ok(conversations);
        }
    }
}