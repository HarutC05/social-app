export function hiResPicsum(
    width = 1200,
    height = 720,
    seed?: string | number
) {
    const s = seed ?? Math.floor(Math.random() * 10000);
    return `https://picsum.photos/seed/${s}/${width}/${height}`;
}
