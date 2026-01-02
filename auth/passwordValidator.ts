
import { AccountType } from './accountTypes';

// Credentials are obfuscated to prevent casual source code snooping.
// In a production environment, these would be salted hashes validated by a backend.
const ADMIN_HASH = "eU91SGF2ZUhBY2tlZE0zLkVuSk9Z"; // Decodes to: yOuHaveHAckedM3.EnJOY
const RECRUITER_HASH = "V2VsY29tZTIwMjY=";         // Decodes to: Welcome2026

export const validateLogin = (username: string, password: string): AccountType | null => {
    if (username === 'guest') return AccountType.GUEST;
    
    // Simple Base64 comparison for simulation purposes
    const inputHash = btoa(password);

    if (username === 'recruiter') {
        return inputHash === RECRUITER_HASH ? AccountType.RECRUITER : null;
    }
    
    if (username === 'keamo') {
        return inputHash === ADMIN_HASH ? AccountType.ADMINISTRATOR : null;
    }
    
    return null;
};
