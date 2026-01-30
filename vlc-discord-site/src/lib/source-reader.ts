import fs from 'fs/promises';
import path from 'path';
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } from './explorer';

export interface SourceData {
    version: string;
    filename: string;
    code: string;
}

// --- GitHub API Helpers ---

type GitHubEntry = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null;
    _links: {
        self: string;
        git: string;
        html: string;
    };
};

async function fetchGitHubFileContent(filePath: string): Promise<string | null> {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    try {
        const res = await fetch(url, {
            headers: { 'Accept': 'application/vnd.github.v3.raw' },
            next: { revalidate: 60 }
        });
        if (!res.ok) {
            console.error(`GitHub API error for ${filePath}: ${res.status}`);
            return null;
        }
        return await res.text();
    } catch (error) {
        console.error(`Error fetching ${filePath} from GitHub:`, error);
        return null;
    }
}

async function listGitHubDirectory(dirPath: string): Promise<GitHubEntry[] | null> {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dirPath}?ref=${GITHUB_BRANCH}`;
    try {
        const res = await fetch(url, {
            headers: { 'Accept': 'application/vnd.github+json' },
            next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        return await res.json() as Promise<GitHubEntry[]>;
    } catch (error) {
        console.error(`Error listing ${dirPath} from GitHub:`, error);
        return null;
    }
}

// --- Main Functions ---

export async function getLatestSourceCode(): Promise<SourceData | null> {
    const isVercel = !!process.env.VERCEL;

    if (isVercel) {
        return getLatestSourceCodeGitHub();
    } else {
        return getLatestSourceCodeLocal();
    }
}

export async function getChangelogContent(): Promise<string | null> {
    const isVercel = !!process.env.VERCEL;

    if (isVercel) {
        return await fetchGitHubFileContent('CHANGELOG.md');
    }

    const changelogPath = path.join(process.cwd(), '../CHANGELOG.md');
    try {
        return await fs.readFile(changelogPath, 'utf-8');
    } catch (error) {
        console.error('Error reading changelog:', error);
        return null;
    }
}

// --- Local Implementations ---

async function getLatestSourceCodeLocal(): Promise<SourceData | null> {
    const sourceDir = path.join(process.cwd(), '../windhawk-source');

    try {
        // 1. Get all version directories
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        // Filter for directories starting with 'v' and extract version numbers
        const versions = entries
            .filter(entry => entry.isDirectory() && entry.name.startsWith('v'))
            .map(entry => entry.name)
            .sort((a, b) => compareVersions(a, b));

        if (versions.length === 0) return null;

        const latestVersion = versions[0];
        const latestVersionPath = path.join(sourceDir, latestVersion);

        // 2. Find the .cpp file
        const files = await fs.readdir(latestVersionPath);
        const sourceFile = files.find(file => file.endsWith('.cpp'));

        if (!sourceFile) {
            return {
                version: latestVersion,
                filename: 'No source file found',
                code: '// Source code not found in directory'
            };
        }

        // 3. Read file content
        const code = await fs.readFile(path.join(latestVersionPath, sourceFile), 'utf-8');

        return {
            version: latestVersion,
            filename: sourceFile,
            code
        };

    } catch (error) {
        console.error('Error reading source code locally:', error);
        return null;
    }
}

// --- GitHub Implementation ---

async function getLatestSourceCodeGitHub(): Promise<SourceData | null> {
    const sourceDir = 'windhawk-source';

    try {
        const entries = await listGitHubDirectory(sourceDir);
        if (!entries || !Array.isArray(entries)) return null;

        const versions = entries
            .filter((e: GitHubEntry) => e.type === 'dir' && e.name.startsWith('v'))
            .map((e: GitHubEntry) => e.name)
            .sort((a: string, b: string) => compareVersions(a, b));

        if (versions.length === 0) return null;

        const latestVersion = versions[0];
        const latestVersionPath = `${sourceDir}/${latestVersion}`;

        const files = await listGitHubDirectory(latestVersionPath);
        if (!files || !Array.isArray(files)) return null;

        const sourceFileEntry = files.find((f: GitHubEntry) => f.name.endsWith('.cpp'));

        if (!sourceFileEntry) {
            return {
                version: latestVersion,
                filename: 'No source file found',
                code: '// Source code not found in directory'
            };
        }

        // We can fetch the raw content using the git_url or just fetch the file path with raw header
        // Using the same helper for consistency
        const code = await fetchGitHubFileContent(sourceFileEntry.path);

        return {
            version: latestVersion,
            filename: sourceFileEntry.name,
            code: code || '// Failed to fetch code'
        };

    } catch (error) {
        console.error('Error getting source code from GitHub:', error);
        return null;
    }
}

// --- Utilities ---

function compareVersions(a: string, b: string): number {
    // Remove 'v' and split by '.'
    const partsA = a.substring(1).split('.').map(Number);
    const partsB = b.substring(1).split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (partsA[i] > partsB[i]) return -1;
        if (partsA[i] < partsB[i]) return 1;
    }
    return 0;
}
