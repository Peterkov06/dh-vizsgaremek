using MailKit.Net.Smtp;
using Mailtrap;
using MimeKit;


namespace backend.Services.SendEmail
{
    public class EmailSender
    {
        //e0d5c9117dbc825080f12906793a4854
        public async Task SendEmail(string toEmail, string resetLink)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("MyApp", "no-reply@dh.com"));
            emailMessage.To.Add(MailboxAddress.Parse(toEmail));
            emailMessage.Subject = "Reset Your Password";
            emailMessage.Body = new TextPart("plain") { Text = $"Click here to reset your password: {resetLink}" };

            using var client = new SmtpClient();
            await client.ConnectAsync("sandbox.smtp.mailtrap.io", 587, MailKit.Security.SecureSocketOptions.StartTls);

            await client.AuthenticateAsync("b0f33ed3dcae69", "19d98746d55034");

            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }


    }
}
