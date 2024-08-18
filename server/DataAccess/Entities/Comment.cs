using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Entities;

[Index("AuthorId", Name = "IX_Comments_AuthorId")]
[Index("PostId", Name = "IX_Comments_PostId")]
public partial class Comment
{
    [Key]
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Content { get; set; } = null!;

    public string AuthorId { get; set; } = null!;
    public User? Author { get; set; }

    public long PostId { get; set; }

    [ForeignKey("PostId")]
    [InverseProperty("Comments")]
    public virtual Post Post { get; set; } = null!;
}
