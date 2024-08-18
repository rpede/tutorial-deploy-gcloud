namespace Service;

public static class Role
{
    public const string Admin = "Admin";
    public const string Editor = "Editor";
    public const string Reader = "Reader";

    public static string[] All => [Admin, Editor, Reader];
}