import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import Wallet from "@project-serum/sol-wallet-adapter";

const cluster = "https://api.devnet.solana.com";
const connection = new Connection(cluster, "confirmed");
export const wallet = new Wallet("https://www.sollet.io", cluster);

const checkWallet = async () => {
  if(!wallet.connected) {
    await wallet.connect();
  }
}

export const creteOrGetAccount = async (seed, programId) => {
  await checkWallet();

  const derivedAddress = await PublicKey.createWithSeed(
    wallet.publicKey,
    seed,
    programId
  );
  const mailAccount = await connection.getAccountInfo(derivedAddress);
  if(mailAccount === null) {
    const lamports = await connection.getMinimumBalanceForRentExemption(100000);

    const createAccountInstruction = SystemProgram.createAccountWithSeed({
      fromPubkey: wallet.publicKey,
      basePubkey: wallet.publicKey,
      seed,
      newAccountPubkey: derivedAddress,
      lamports,
      space: 100000,
      programId: programId
    });

    const initAccountInstruction = new TransactionInstruction({
      keys: [{
        pubkey: derivedAddress, isSigner: false, isWritable: true
      }],
      programId: programId,
      data: Buffer.from([0])
    });

    const transaction = new Transaction();
    transaction.add(createAccountInstruction).add(initAccountInstruction);

    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize());

    await connection.confirmTransaction(txid);
  }
  return {
    derivedAddress,
    wallet
  }
}