namespace RagnarokOnlineClone.Models
{
  public class Character
  {
    public BaseStats? BaseStats;
    public BaseStats? BonusStats;
    public int BaseLevel { get; private set; } = 1;      // Start at level 1
    public int StatusPoints { get; private set; } = 0;   // Start with 0 points

    // Increment base level if below the provided max. Returns true when level was increased.
    public bool IncreaseBaseLevel(int maxLevel)
    {
      if (BaseLevel >= maxLevel)
        return false;

      BaseLevel++;
      return true;
    }

    // Safely add status points (no-op for non-positive values).
    public void AddStatusPoints(int points)
    {
      if (points <= 0)
        return;

      StatusPoints += points;
    }
  }
}