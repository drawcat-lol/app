export function formatDate(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleString();
}
