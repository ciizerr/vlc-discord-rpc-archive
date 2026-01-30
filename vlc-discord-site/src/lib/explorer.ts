import fs from 'fs/promises';
import path from 'path';

// The root of the actual repository (parent of website folder)
const REPO_ROOT = path.resolve(process.cwd(), '..');
export const GITHUB_OWNER = 'ciizerr';
export const GITHUB_REPO = 'vlc-discord-rpc-archive';
export const GITHUB_BRANCH = 'main'; // or main, check which one

export type FileNode = {
    name: string;
    type: 'file' | 'dir';
    size?: number;
    path: string[]; // Relative path segments
};

// GitHub API Types
type GitHubContent = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: 'file' | 'dir';
    _links: {
        self: string;
        git: string;
        html: string;
    };
};

export async function getRepoContent(segments: string[] = []): Promise<FileNode[] | string> {
    const isVercel = !!process.env.VERCEL;

    if (isVercel) {
        return fetchFromGitHub(segments);
    } else {
        return fetchFromLocal(segments);
    }
}

async function fetchFromGitHub(segments: string[]): Promise<FileNode[] | string> {
    const pathString = segments.join('/');
    // Cache for 60 seconds to avoid hitting rate limits too fast
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${pathString}?ref=${GITHUB_BRANCH}`;

    try {
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                // Add token here if needed: 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            },
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            console.error(`GitHub API error: ${res.status} ${res.statusText}`);
            return [];
        }

        const data = await res.json();

        if (Array.isArray(data)) {
            // It's a directory
            const nodes: FileNode[] = data
                .filter((e: GitHubContent) => {
                    // Hide .git, website itself (to avoid confusion?), and hidden files
                    if (e.name.startsWith('.')) return false;
                    // In the repo root, 'vlc-discord-site' is the website itself, maybe hide it? 
                    // The user might want to see it though. Let's keep consistent with local logic.
                    if (e.name === 'vlc-discord-site') return false;
                    return true;
                })
                .map((e: GitHubContent) => ({
                    name: e.name,
                    type: e.type,
                    size: e.size,
                    path: [...segments, e.name]
                }));

            // Sort: Directories first
            return nodes.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'dir' ? -1 : 1;
            });
        } else if (data.type === 'file') {
            // It's a file metadata, but 'contents' endpoint usually returns the content in 'content' field (base64)
            // IF the file is small (<= 1MB).
            // However, if we requested a *file path* in the URL, the response is a single object.
            // We generally need the raw content. API provides 'download_url'.

            if (data.download_url) {
                const contentRes = await fetch(data.download_url);
                if (!contentRes.ok) throw new Error('Failed to fetch file content');
                const text = await contentRes.text();

                // Check for binary by extension slightly like local
                const ext = path.extname(data.name).toLowerCase();
                const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.wof', '.ttf', '.eot', '.zip', '.exe', '.dll', '.obj'];
                if (binaryExts.includes(ext)) {
                    return `[Binary File: ${data.name}]`;
                }

                return text;
            }
            return "";
        }

        return [];

    } catch (error) {
        console.error("Error fetching from GitHub:", error);
        return [];
    }
}

async function fetchFromLocal(segments: string[] = []): Promise<FileNode[] | string> {
    // 1. Construct safe path
    const relativePath = path.join(...segments);
    const fullPath = path.join(REPO_ROOT, relativePath);

    // 2. Security Check (Sandbox)
    // resolve to verify it's inside repo root
    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(REPO_ROOT)) {
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
