import { Connection, PublicKey } from '@solana/web3.js';

const TOKEN_PROGRAM_ID: PublicKey = new PublicKey("HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ");

export async function fetchSPLTokenBalances(walletAddress: string | undefined, networkUrl: string) {
    if (!walletAddress) return [];
    const connection = new Connection(networkUrl);
    const walletPublicKey = new PublicKey(walletAddress);

    try {
        // Get all token accounts for the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, { programId: TOKEN_PROGRAM_ID });
        console.log(tokenAccounts);
        const tokens = tokenAccounts.value.map(accountInfo => {
            const accountData = accountInfo.account.data.parsed.info;
            const mintAddress = accountData.mint;
            const balance = accountData.tokenAmount.uiAmount;
            const tokenAddress = accountInfo.pubkey.toString();

            return {
                mintAddress,
                tokenAddress,
                balance,
            };
        });

        return tokens;
    } catch (error) {
        console.error("Error fetching SPL token balances:", error);
        return [];
    }
}

