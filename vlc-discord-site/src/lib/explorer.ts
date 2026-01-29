import fs from 'fs/promises';
import path from 'path';

// The root of the actual repository (parent of website folder)
// In production (Vercel/Netlify), this won't work for checking "outside" files unless we copy them during build.
// But for "Archive" static export, Next.js can read them at build time.
const REPO_ROOT = path.resolve(process.cwd(), '..');

export type FileNode = {
    name: string;
    type: 'file' | 'dir';
    size?: number;
    path: string[]; // Relative path segments
};

export async function getRepoContent(segments: string[] = []): Promise<FileNode[] | string> {
    // 1. Construct safe path
    const relativePath = path.join(...segments);
    const fullPath = path.join(REPO_ROOT, relativePath);

    // 2. Security Check (Sandbox)
    if (!fullPath.startsWith(REPO_ROOT)) {
        throw new Error('Access Denied');
    }

    // 3. Stat
    try {
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
            const entries = await fs.readdir(fullPath, { withFileTypes: true });
            const nodes: FileNode[] = entries
                .filter(e => {
                    // Hide .git, website itself (to avoid confusion?), and hidden files
                    if (e.name.startsWith('.')) return false;
                    if (e.name === 'vlc-discord-site') return false;
                    if (e.name === 'node_modules') return false;
                    if (e.name === 'package-lock.json') return false;
                    return true;
                })
                .map(e => ({
                    name: e.name,
                    type: e.isDirectory() ? 'dir' : 'file',
                    path: [...segments, e.name]
                }));

            // Sort: Directories first, then alphabetical
            return nodes.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'dir' ? -1 : 1;
            });
        }

        if (stat.isFile()) {
            const ext = path.extname(fullPath).toLowerCase();
            const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.wof', '.ttf', '.eot', '.zip', '.exe', '.dll', '.obj'];

            if (binaryExts.includes(ext)) {
                return `[Binary File: ${path.basename(fullPath)}]`;
            }

            const content = await fs.readFile(fullPath, 'utf-8');
            return content;
        }

        return [];
    } catch (error) {
        console.error("Error reading repo:", error);
        return [];
    }
}
