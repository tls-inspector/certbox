/**
 * Class for generating random things
 */
export class Rand {
    private static alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    /**
     * Generate a mathematically random ID string
     */
    public static ID(): string {
        let text = '';
        for (let i = 0; i < 10; i++) {
            text += this.alphabet.charAt(Math.floor(Math.random() * this.alphabet.length));
        }
        return text;
    }
}
