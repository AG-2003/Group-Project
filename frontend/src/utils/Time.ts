export function debounce(
    func: (...args: any[]) => void,
    wait: number
): (...args: any[]) => void {
    let timeout: NodeJS.Timeout | null;

    return function executedFunction(...args: any[]): void {
        const later = () => {
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }
            func(...args);
        };

        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}