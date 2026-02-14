using System;
using RagnarokOnlineClone.Models;

namespace RagnarokOnlineClone.Systems
{
  public class BaseLevelSystem
  {
    private readonly Character _character;
    private const int MaxLevel = 99; // Maximum Base Level

    // Inject the character this system operates on
    public BaseLevelSystem(Character character)
    {
      _character = character ?? throw new ArgumentNullException(nameof(character));
    }

    // Call this to level up
    public void LevelUp()
    {
      if (!_character.IncreaseBaseLevel(MaxLevel))
      {
        Console.WriteLine("You have reached the maximum level!");
        return;
      }

      AddStatusPoints();

      Console.WriteLine($"Base Level increased to {_character.BaseLevel}");
      Console.WriteLine($"Status Points: {_character.StatusPoints}");
    }

    private void AddStatusPoints()
    {
       //Fixed system: +3 per level
      //_character.AddStatusPoints(3);

      // OR use scaling system:
       _character.AddStatusPoints(3 + (_character.BaseLevel / 10));
    }

    // Optional: Level up multiple times safely
    public void AddLevels(int levels)
    {
      if (levels <= 0)
        return;

      for (int i = 0; i < levels; i++)
      {
        LevelUp();
        if (_character.BaseLevel >= MaxLevel)
          break;
      }
    }
  }
}
