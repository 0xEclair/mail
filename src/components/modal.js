// third-party library
import { Button, Input, Modal, Spacer, Textarea, useInput, useModal } from "@geist-ui/react";
import { useState } from "react";
import { send, wallet } from "../services";
import { Mail } from "../models";
import { PublicKey } from "@solana/web3.js";

export const SendMailModal = () => {
  const { visible, setVisible, bindings } = useModal();
  const { state, setState } = useInput("");
  const [tavalue, setTaState] = useState("");
  const [imgvalue, setImgState] = useState("");
  return (
    <>
      <Button auto onClick={() => { setVisible(true); }}>
        send mail
      </Button>
      <Modal {...bindings}>
        <Modal.Title>send mail</Modal.Title>
        <Modal.Content>
          <Input label={"name"} value={state} onChange={(e) => {
            console.log(e.target.value);
            setState(e.target.value);
          }}/>
          <Spacer h={1} />
          <Textarea placeholder={"description"} value={tavalue} onChange={(e) => {
            console.log(e.target.value);
            setTaState(e.target.value);
          }}/>
          <Spacer h={1} />
          <Input label={"img"} value={imgvalue} onChange={(e) => {
            console.log(e.target.value);
            setImgState(e.target.value);
          }}/>
        </Modal.Content>
        <Modal.Action passive onClick={() => { setVisible(false)}}>close</Modal.Action>
        <Modal.Action
          onClick={async () => {
            send(new Mail({
              id: "002",
              fromAddress: (await PublicKey.createWithSeed(
                wallet.publicKey,
                "",
                new PublicKey("4HSimHydcZMv3q9kdWgbursuBYjetks1gp3txctUJnuM")
              )).toString(),
              toAddress: (await PublicKey.createWithSeed(
                new PublicKey("6k65rso6ux2SD5zY96DU5WEvC6u5ie1oD4NWqe1yupgv"),
                "",
                new PublicKey("4HSimHydcZMv3q9kdWgbursuBYjetks1gp3txctUJnuM")
              )).toString(),
              subject: imgvalue,
              body: tavalue,
              sentDate: new Date().toLocaleString()
            }));
            setVisible(false);
          }}
        >ok</Modal.Action>
      </Modal>
    </>
  )
}