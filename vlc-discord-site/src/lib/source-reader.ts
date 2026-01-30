import fs from 'fs/promises';
import path from 'path';

export interface SourceData {
    version: string;
    filename: string;
    code: string;
}

export async function getLatestSourceCode(): Promise<SourceData | null> {
    const sourceDir = path.join(process.cwd(), '../windhawk-source');

    try {
        // 1. Get all version directories
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        // Filter for directories starting with 'v' and extract version numbers
        const versions = entries
            .filter(entry => entry.isDirectory() && entry.name.startsWith('v'))
            .map(entry => entry.name)
            .sort((a, b) => {
                // Simple semantic sort: v1.0.3 vs v1.0.0
                // Remove 'v' and split by '.'
                const partsA = a.substring(1).split('.').map(Number);
                const partsB = b.substring(1).split('.').map(Number);

                for (let i = 0; i < 3; i++) {
                    if (partsA[i] > partsB[i]) return -1;
                    if (partsA[i] < partsB[i]) return 1;
                }
                return 0;
            });

        if (versions.length === 0) {
            return null;
        }

        const latestVersion = versions[0];
        const latestVersionPath = path.join(sourceDir, latestVersion);

        // 2. Find the .cpp file in the latest version directory
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
        console.error('Error reading source code:', error);
        return null;
    }
}

export async function getChangelogContent(): Promise<string | null> {
    const changelogPath = path.join(process.cwd(), '../CHANGELOG.md');
    try {
        return await fs.readFile(changelogPath, 'utf-8');
    } catch (error) {
        console.error('Error reading changelog:', error);
        return null;
    }
}
