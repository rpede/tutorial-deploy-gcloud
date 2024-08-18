using System.ComponentModel.DataAnnotations;

namespace Service;

public sealed class AppOptions
{
    [Required]
    public required string JwtSecret { get; set; }
    public required string Address { get; set; }
    [Required]
    public required string SmtpServer { get; set; }
    [Required]
    public int? SmtpPort { get; set; }
    public string? SmtpUsername { get; set; }
    public string? SmtpPassword { get; set; }
    [Required]
    public required string SmtpSenderEmail { get; set; }
    [Required]
    public bool? SmtpEnableSsl { get; set; }
}