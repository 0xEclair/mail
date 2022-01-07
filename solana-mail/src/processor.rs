use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    msg,
    pubkey::Pubkey,
    borsh::get_instance_packed_len
};
use borsh::{BorshSerialize, BorshDeserialize};

use crate::state::{Mail, MailAccount, DataLength};
use crate::instruction::MailInstruction;
use crate::error::MailError;

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8]
    ) -> ProgramResult {
        let instruction = MailInstruction::unpack(instruction_data)?;

        match instruction {
            MailInstruction::InitAccount => {
                msg!("Instruction: InitAccount");
                Self::process_init_account(&accounts[0], program_id)
            },
            MailInstruction::SendMail { mail } => {
                msg!("Instruction: SendMail");
                Self::process_send_mail(accounts, mail, program_id)
            }
        }
    }

    fn process_init_account(account: &AccountInfo, program_id: &Pubkey) -> ProgramResult {
        if !account.is_writable {
            return Err(MailError::NotWritable.into());
        }

        if account.owner != program_id {
            return Err(ProgramError::IncorrectProgramId);
        }

        let welcome = Mail {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            from_address: program_id.to_string(),
            to_address: account.key.to_string(),
            subject: String::from("Welcome to SolanaMail"),
            body: String::from("This is the start of your private messages on SolanaMail."),
            sent_date: String::from("9/29/2021, 3:58:02 PM"),
        };
        let mail_account = MailAccount {
            inbox: vec![welcome],
            sent: Vec::new()
        };
        let data_length = DataLength {
            length: u32::try_from(get_instance_packed_len(&mail_account)?).unwrap()
        };
        let offset: usize = 4;
        data_length.serialize(&mut &mut account.data.borrow_mut()[..offset])?;
        mail_account.serialize(&mut &mut account.data.borrow_mut()[offset..])?;
        Ok(())
    }

    fn process_send_mail(accounts: &[AccountInfo], mail: Mail, program_id: &Pubkey) -> ProgramResult {
        let sender_account = &accounts[0];
        let receiver_account = &accounts[1];
        if !sender_account.is_writable || !receiver_account.is_writable {
            return Err(MailError::NotWritable.into());
        }

        if sender_account.owner != program_id || receiver_account.owner != program_id {
            return Err(ProgramError::IncorrectProgramId);
        }

        let offset: usize = 4;
        let data_length = DataLength::try_from_slice(&sender_account.data.borrow()[..offset])?;

        let mut sender_data;
        if data_length.length > 0 {
            let length = usize::try_from(data_length.length + u32::try_from(offset).unwrap()).unwrap();
            sender_data = MailAccount::try_from_slice(&sender_account.data.borrow()[offset..length])?;
        }
        else {
            sender_data = MailAccount {
                inbox: Vec::new(),
                sent: Vec::new(),
            };
        }

        sender_data.sent.push(mail.clone());
        let data_length = DataLength {
            length: u32::try_from(get_instance_packed_len(&sender_data)?).unwrap()
        };
        data_length.serialize(&mut &mut sender_account.data.borrow_mut()[..offset])?;
        sender_data.serialize(&mut &mut sender_account.data.borrow_mut()[offset..])?;

        let data_length = DataLength::try_from_slice(&receiver_account.data.borrow()[..offset])?;
        let mut receiver_data;
        if data_length.length > 0 {
            let length = usize::try_from(data_length.length + u32::try_from(offset).unwrap()).unwrap();
            receiver_data = MailAccount::try_from_slice(&receiver_account.data.borrow()[offset..length])?;
        }
        else {
            receiver_data = MailAccount {
                inbox: Vec::new(),
                sent: Vec::new()
            };
        }
        receiver_data.inbox.push(mail.clone());

        let data_Length = DataLength {
            length: u32::try_from(get_instance_packed_len(&receiver_data)?).unwrap()
        };
        data_Length.serialize(&mut &mut receiver_account.data.borrow_mut()[..offset])?;
        receiver_data.serialize(&mut &mut receiver_account.data.borrow_mut()[offset..])?;

        Ok(())
    }
}

#[cfg(test)]
mod test{
    use super::*;
    use solana_program::clock::Epoch;

    #[test]
    fn test_init_account() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = [0; 1000];
        let account = AccountInfo::new(
            &key,true,true,
            &mut lamports,
            &mut data,
            &program_id, false,
            Epoch::default()
        );

        Processor::process_init_account(&account, &program_id).unwrap();
    }
}
