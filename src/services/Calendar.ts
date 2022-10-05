export class Calendar {
    public static now(): string {
        return new Date().toISOString();
    }

    public static addDays(days: number): string {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString();
    }
}