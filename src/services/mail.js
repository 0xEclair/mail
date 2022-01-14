import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { MailAccount } from "../models";

const cluster = "https://api.devnet.solana.com";
const connection = new Connection(cluster, "confirmed");

export const fetchData = async (accountId) => {
  const accountInfo = await connection.getAccountInfo(accountId);
  return MailAccount.decode(accountInfo.data);
}

export const send = async (mail, programId, wallet) => {
  const encodedMail = mail.encode();
  const instruction = new TransactionInstruction({
    keys:[
      {pubkey: new PublicKey(mail.fromAddress), isSigner: false, isWritable: true},
      {pubkey: new PublicKey(mail.toAddress), isSigner: false, isWritable: true}
    ],
    programId,
    data: Buffer.from(Uint8Array.of(1, ...encodedMail))
  });

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signed = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction(txid);
}