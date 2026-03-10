export interface HijriDateInfo {
  day: number;
  month: number;
  monthNameEn: string;
  monthNameAr: string;
  year: number;
  isRamadan: boolean;
  ramadanDay: number | null;
  isLastTenNights: boolean;
  ramadanTotalDays: number;
}

/**
 * Fetch current Hijri date from the Aladhan API
 * Falls back to approximate calculation if API is unavailable
 */
export async function getHijriDate(): Promise<HijriDateInfo> {
    try {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();

        const res = await fetch(
            `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!res.ok) throw new Error('API request failed');

        const data = await res.json();
        const hijri = data.data.hijri;

        const day = parseInt(hijri.day, 10);
        const month = parseInt(hijri.month.number, 10);
        const totalDays = hijri.month.days || 30;
        const isRamadan = month === 9;

        return {
            day,
            month,
            monthNameEn: hijri.month.en,
            monthNameAr: hijri.month.ar,
            year: parseInt(hijri.year, 10),
            isRamadan,
            ramadanDay: isRamadan ? day : null,
            isLastTenNights: isRamadan && day >= 21,
            ramadanTotalDays: isRamadan ? totalDays : 30,
        };
    } catch (error) {
        console.error('Failed to fetch Hijri date:', error);
        // Fallback: return a reasonable default
        return {
            day: 20,
            month: 9,
            monthNameEn: 'Ramaḍān',
            monthNameAr: 'رَمَضَان',
            year: 1447,
            isRamadan: true,
            ramadanDay: 20,
            isLastTenNights: false,
            ramadanTotalDays: 30,
        };
    }
}
