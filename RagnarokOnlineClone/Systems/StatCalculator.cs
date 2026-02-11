using RagnarokOnlineClone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RagnarokOnlineClone.Systems
{
    public class StatCalculator
    {
        public static int CalculateATK(Character character, int weaponAtk, int refineBonus)
        {
            int str = (character.BaseStats?.STR ?? 0) + (character.BonusStats?.STR ?? 0);
            int dex = (character.BaseStats?.DEX ?? 0) + (character.BonusStats?.DEX ?? 0);
            int luk = (character.BaseStats?.LUK ?? 0) + (character.BonusStats?.LUK ?? 0);

            int statusAtk = str + dex + luk;
            int totalATK = weaponAtk + statusAtk + refineBonus;
            return totalATK;
        }


        public static (int minMatk, int maxMatk) CalculateMATK(Character character)
        {
            int i = (character.BaseStats?.INT ?? 0) + (character.BonusStats?.INT ?? 0);

            int maxBonus = (i / 5);
            int minBonus = (i / 7);

            int maxMatk = i + (maxBonus * maxBonus);
            int minMatk = i + (minBonus * minBonus);
            return (minMatk, maxMatk);
        }

        public static int CalculateHit(Character character)
        {
            return (character.BaseStats?.DEX ?? 0) + (character.BonusStats?.DEX ?? 0) + character.Level;
        }

        public static int CalculateFlee(Character character)
        {
            int agi = (character.BaseStats?.AGI ?? 0) + (character.BonusStats?.AGI ?? 0);
            int luk = (character.BaseStats?.LUK ?? 0) + (character.BonusStats?.LUK ?? 0);
            return agi + character.Level + (luk / 5);
        }

        public static double CalculateCrit(Character character)
        {
            int luk = (character.BaseStats?.LUK ?? 0) + (character.BonusStats?.LUK ?? 0);
            return luk * 0.3;  // base critical rate
        }


        public static double CalculateASPD(Character character)
        {
            int agi = (character.BaseStats?.AGI ?? 0) + (character.BonusStats?.AGI ?? 0);
            int dex = (character.BaseStats?.DEX ?? 0) + (character.BonusStats?.DEX ?? 0);

            double baseASPD = 100 + (agi * 0.5) + (dex * 0.3);
            return Math.Min(baseASPD, 190); // hard cap for classic
        }


        public static int CalculateMaxHP(int baseHP, Character character)
        {
            int vit = (character.BaseStats?.VIT ?? 0) + (character.BonusStats?.VIT ?? 0);
            return (int)(baseHP * (1 + vit * 0.01));
        }

        public static int CalculateMaxSP(int baseSP, Character character)
        {
            int it = (character.BaseStats?.INT ?? 0) + (character.BonusStats?.INT ?? 0);
            return (int)(baseSP * (1 + it * 0.01));
        }

    }
}
