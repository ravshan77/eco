export function areObjectsEqual(objA: Record<string, any>, objB: Record<string, any>): boolean {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
  
    if (keysA.length !== keysB.length) return false; // 🔴 Agar `key` soni teng bo‘lmasa, mos emas
  
    return keysA.every((key) => objA[key] === objB[key]); // ✅ Har bir `key` uchun qiymatlarni tekshiramiz
  }
  